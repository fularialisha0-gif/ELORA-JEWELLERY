import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {
  DiamondShape,
  GemstoneOption,
  MetalFinish,
  RingDesignStyle,
} from '../types/jewellery';
import { buildRingAssembly, RingAssembly } from '../three/proceduralDiamond';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export type CameraPreset = 'front' | 'crown' | 'profile' | 'detail';

interface JewelleryCanvas3DProps {
  mode: 'hero' | 'studio';
  design: RingDesignStyle;
  shape: DiamondShape;
  metal: MetalFinish;
  gemstone: GemstoneOption;
  carat?: number;
  autoRotate?: boolean;
  explode?: number; // 0 to 1
  cameraPreset?: CameraPreset;
  className?: string;
  fallbackImage?: string;
}

const CAMERA_PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  front: { pos: [0.35, 1.35, 3.85], target: [0, 0.25, 0] },
  crown: { pos: [0.05, 3.35, 1.25], target: [0, 0.72, 0] },
  profile: { pos: [3.65, 0.85, 0.55], target: [0, 0.25, 0] },
  detail: { pos: [1.55, 1.55, 2.05], target: [0, 0.68, 0] },
};

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createSoftParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(247, 224, 198, 1)');
    grad.addColorStop(0.35, 'rgba(216, 163, 132, 0.6)');
    grad.addColorStop(1, 'rgba(216, 163, 132, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
    grad.addColorStop(0.45, 'rgba(10, 3, 6, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(canvas);
}

export const JewelleryCanvas3D: React.FC<JewelleryCanvas3DProps> = ({
  mode,
  design,
  shape,
  metal,
  gemstone,
  carat = 2.0,
  autoRotate = true,
  explode = 0,
  cameraPreset = 'front',
  className = '',
  fallbackImage,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const propsRef = useRef({
    mode,
    design,
    shape,
    metal,
    gemstone,
    carat,
    autoRotate,
    explode,
    cameraPreset,
    prefersReducedMotion,
  });

  propsRef.current = {
    mode,
    design,
    shape,
    metal,
    gemstone,
    carat,
    autoRotate,
    explode,
    cameraPreset,
    prefersReducedMotion,
  };

  const ringRef = useRef<RingAssembly | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const isSoftwareGlRef = useRef<boolean>(false);
  const cameraTransitionRef = useRef<{
    active: boolean;
    targetPos: THREE.Vector3;
    targetLook: THREE.Vector3;
  }>({
    active: false,
    targetPos: new THREE.Vector3(...CAMERA_PRESETS.front.pos),
    targetLook: new THREE.Vector3(...CAMERA_PRESETS.front.target),
  });

  // Update camera preset cleanly without tearing down renderer
  useEffect(() => {
    if (mode !== 'studio') return;
    const preset = CAMERA_PRESETS[cameraPreset];
    cameraTransitionRef.current.targetPos.set(...preset.pos);
    cameraTransitionRef.current.targetLook.set(...preset.target);
    cameraTransitionRef.current.active = true;
  }, [cameraPreset, mode]);

  // Rebuild 3D ring model cleanly when customisation props change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (ringRef.current) {
      scene.remove(ringRef.current.root);
      ringRef.current.dispose();
    }

    const nextRing = buildRingAssembly({
      design,
      shape,
      metal,
      gemstone,
      carat,
      isSoftwareGl: isSoftwareGlRef.current,
    });

    // Subtle luxury poise angle
    if (mode === 'hero') {
      nextRing.root.rotation.set(0.24, -0.45, -0.14);
    } else {
      nextRing.root.rotation.set(0.12, -0.35, 0);
    }

    scene.add(nextRing.root);
    ringRef.current = nextRing;
  }, [design, shape, metal, gemstone, carat, mode]);

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    isSoftwareGlRef.current = isSoftwareGl;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    const handleContextRestored = () => setWebglFailed(false);
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Mandatory studio environment reflection across all devices
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      mode === 'hero' ? 36 : 38,
      width / height,
      0.1,
      50
    );
    if (mode === 'hero') {
      camera.position.set(0.25, 0.95, 4.15);
    } else {
      camera.position.set(...CAMERA_PRESETS.front.pos);
    }

    // Studio 3-point lighting with warm rose-gold & cool champagne contrast
    const hemi = new THREE.HemisphereLight(0xfff1e6, 0x260c14, 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffe6d4, 2.2);
    keyLight.position.set(4, 6, 4.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe5c1a9, 1.85);
    rimLight.position.set(-4.5, 3.2, -3.5);
    scene.add(rimLight);

    const roseAccentLight = new THREE.PointLight(0xd8a384, 3.2, 12, 2);
    roseAccentLight.position.set(2.2, 1.6, 2.4);
    scene.add(roseAccentLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softboxTop = new THREE.RectAreaLight(0xfff4ea, 4.0, 4.5, 2.0);
      softboxTop.position.set(0, 4.8, 1.5);
      softboxTop.lookAt(0, 0.3, 0);
      scene.add(softboxTop);
    }

    // Contact shadow disk grounding the ring
    const shadowTex = createContactShadowTexture();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 3.4),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.55,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.45;
    scene.add(shadowPlane);

    // Subtle floating champagne motes (capped at 55 particles for mobile smoothness)
    const particleCount = 55;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 6.5;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 4.2;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 4.0 - 0.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleTex = createSoftParticleTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      map: particleTex,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Build initial ring
    const initialRing = buildRingAssembly({
      design: propsRef.current.design,
      shape: propsRef.current.shape,
      metal: propsRef.current.metal,
      gemstone: propsRef.current.gemstone,
      carat: propsRef.current.carat,
      isSoftwareGl,
    });
    if (mode === 'hero') {
      initialRing.root.rotation.set(0.24, -0.45, -0.14);
    } else {
      initialRing.root.rotation.set(0.12, -0.35, 0);
    }
    scene.add(initialRing.root);
    ringRef.current = initialRing;

    // OrbitControls only in studio interactive mode
    let controls: OrbitControls | null = null;
    if (mode === 'studio') {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.minDistance = 2.1;
      controls.maxDistance = 6.2;
      controls.minPolarAngle = 0.25;
      controls.maxPolarAngle = Math.PI * 0.72;
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.06;
      controls.target.set(0, 0.25, 0);
      controls.addEventListener('start', () => {
        cameraTransitionRef.current.active = false;
      });
    }

    // Pointer tracking for subtle hero mouse reaction
    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      if (propsRef.current.mode !== 'hero') return;
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
    };
    if (mode === 'hero') {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();
    let currentExplode = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const current = propsRef.current;
      const ring = ringRef.current;

      if (ring) {
        if (current.mode === 'hero') {
          if (!current.prefersReducedMotion) {
            ring.root.rotation.y += delta * 0.24;
            ring.root.position.y = -0.25 + Math.sin(elapsed * 1.1) * 0.045;
          }
          // Subtle mouse reaction via exponential damping
          const targetRotX = 0.24 - pointer.y * 0.16;
          const targetRotZ = -0.14 - pointer.x * 0.14;
          ring.root.rotation.x = THREE.MathUtils.damp(ring.root.rotation.x, targetRotX, 4.5, delta);
          ring.root.rotation.z = THREE.MathUtils.damp(ring.root.rotation.z, targetRotZ, 4.5, delta);
        } else {
          // Studio mode
          if (current.autoRotate && !current.prefersReducedMotion && !isSoftwareGl) {
            ring.root.rotation.y += delta * 0.28;
          }
          // Exploded view interpolation
          currentExplode = THREE.MathUtils.damp(currentExplode, current.explode, 6.5, delta);
          ring.shankGroup.position.y = -currentExplode * 0.42;
          ring.galleryGroup.position.y = currentExplode * 0.08;
          ring.prongsGroup.position.y = currentExplode * 0.28;
          ring.haloGroup.position.y = currentExplode * 0.44;
          ring.centerStone.position.y =
            (1.08 + 0.29 + (0.78 + (current.carat - 1.0) * 0.24 - 0.8) * 0.08) +
            currentExplode * 0.72;
        }
      }

      if (!current.prefersReducedMotion) {
        particles.rotation.y = elapsed * 0.03;
      }

      if (controls) {
        if (cameraTransitionRef.current.active) {
          camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            cameraTransitionRef.current.targetPos.x,
            5.5,
            delta
          );
          camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            cameraTransitionRef.current.targetPos.y,
            5.5,
            delta
          );
          camera.position.z = THREE.MathUtils.damp(
            camera.position.z,
            cameraTransitionRef.current.targetPos.z,
            5.5,
            delta
          );
          controls.target.x = THREE.MathUtils.damp(
            controls.target.x,
            cameraTransitionRef.current.targetLook.x,
            5.5,
            delta
          );
          controls.target.y = THREE.MathUtils.damp(
            controls.target.y,
            cameraTransitionRef.current.targetLook.y,
            5.5,
            delta
          );
          controls.target.z = THREE.MathUtils.damp(
            controls.target.z,
            cameraTransitionRef.current.targetLook.z,
            5.5,
            delta
          );
          if (camera.position.distanceTo(cameraTransitionRef.current.targetPos) < 0.02) {
            cameraTransitionRef.current.active = false;
          }
        }
        controls.update();
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      renderer.render(scene, camera);
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      if (mode === 'hero') {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      if (controls) controls.dispose();
      if (ringRef.current) ringRef.current.dispose();
      shadowPlane.geometry.dispose();
      (shadowPlane.material as THREE.Material).dispose();
      shadowTex.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTex.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode]);

  if (webglFailed) {
    return (
      <div
        className={`relative flex items-center justify-center bg-[#1C090F] border border-[#D8A384]/20 ${className}`}
      >
        {fallbackImage ? (
          <img
            src={fallbackImage}
            alt={`${metal} ${shape} ${gemstone} ring preview`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="text-center p-6">
            <p className="font-serif text-2xl text-[#E8C5B0]">ÉLORA Interactive Atelier</p>
            <p className="text-sm text-[#C7B6AE] mt-2">
              {design} · {shape} {gemstone} · {metal}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full select-none ${
        mode === 'studio' ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      } ${className}`}
      aria-label={`Interactive 3D view of ${metal} ${design} ring with ${shape} ${gemstone}`}
    />
  );
};
