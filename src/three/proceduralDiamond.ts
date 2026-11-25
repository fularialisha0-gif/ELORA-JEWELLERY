import * as THREE from 'three';
import {
  DiamondShape,
  GemstoneOption,
  MetalFinish,
  RingDesignStyle,
} from '../types/jewellery';

/**
 * Generates a faceted brilliant/step-cut diamond BufferGeometry with crisp flat faces.
 */
export function createDiamondGeometry(shape: DiamondShape, radius = 0.52): THREE.BufferGeometry {
  if (shape === 'Princess') {
    return createSquareFacetedGeometry(radius * 0.95);
  }
  if (shape === 'Emerald') {
    return createEmeraldCutGeometry(radius * 0.88, radius * 1.18);
  }

  // Round or Oval multi-tier faceted brilliant geometry
  const segments = 16;
  const scaleX = shape === 'Oval' ? 0.82 : 1.0;
  const scaleZ = shape === 'Oval' ? 1.24 : 1.0;

  const tableR = radius * 0.56;
  const upperR = radius * 0.84;
  const girdleR = radius;
  const lowerR = radius * 0.56;

  const yTable = radius * 0.38;
  const yUpper = radius * 0.21;
  const yGirdleTop = radius * 0.04;
  const yGirdleBot = -radius * 0.04;
  const yLower = -radius * 0.42;
  const yCulet = -radius * 0.78;

  const positions: number[] = [];

  const pt = (r: number, angle: number, y: number): [number, number, number] => [
    Math.cos(angle) * r * scaleX,
    y,
    Math.sin(angle) * r * scaleZ,
  ];

  const pushTri = (
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number]
  ) => {
    positions.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  };

  const centerTop: [number, number, number] = [0, yTable, 0];
  const culet: [number, number, number] = [0, yCulet, 0];

  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    const aMid = ((i + 0.5) / segments) * Math.PI * 2;

    const t0 = pt(tableR, a0, yTable);
    const t1 = pt(tableR, a1, yTable);
    const uMid = pt(upperR, aMid, yUpper);
    const uPrev = pt(upperR, ((i - 0.5) / segments) * Math.PI * 2, yUpper);
    const g0T = pt(girdleR, a0, yGirdleTop);
    const g1T = pt(girdleR, a1, yGirdleTop);
    const gMidT = pt(girdleR, aMid, yGirdleTop);
    const g0B = pt(girdleR, a0, yGirdleBot);
    const g1B = pt(girdleR, a1, yGirdleBot);
    const gMidB = pt(girdleR, aMid, yGirdleBot);
    const l0 = pt(lowerR, a0, yLower);
    const l1 = pt(lowerR, a1, yLower);

    // Table
    pushTri(centerTop, t1, t0);
    // Star facets
    pushTri(t0, t1, uMid);
    pushTri(t0, uMid, g0T);
    pushTri(t0, g0T, uPrev);
    // Bezel / upper girdle facets
    pushTri(uMid, gMidT, g0T);
    pushTri(uMid, g1T, gMidT);
    // Girdle band
    pushTri(g0T, gMidT, g0B);
    pushTri(gMidT, gMidB, g0B);
    pushTri(gMidT, g1T, gMidB);
    pushTri(g1T, g1B, gMidB);
    // Upper pavilion
    pushTri(g0B, gMidB, l0);
    pushTri(gMidB, l1, l0);
    pushTri(gMidB, g1B, l1);
    // Lower pavilion to culet
    pushTri(l0, l1, culet);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

function createSquareFacetedGeometry(half: number): THREE.BufferGeometry {
  const positions: number[] = [];
  const pushQuad = (
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number],
    d: [number, number, number]
  ) => {
    positions.push(...a, ...b, ...c, ...a, ...c, ...d);
  };

  const corners = (r: number, y: number): [number, number, number][] => [
    [-r, y, -r],
    [r, y, -r],
    [r, y, r],
    [-r, y, r],
  ];

  const t = corners(half * 0.56, half * 0.34);
  const m = corners(half * 0.82, half * 0.19);
  const gT = corners(half, half * 0.04);
  const gB = corners(half, -half * 0.04);
  const p1 = corners(half * 0.58, -half * 0.42);
  const culet: [number, number, number] = [0, -half * 0.86, 0];

  // Table
  pushQuad(t[0], t[3], t[2], t[1]);

  for (let i = 0; i < 4; i++) {
    const n = (i + 1) % 4;
    pushQuad(t[i], t[n], m[n], m[i]);
    pushQuad(m[i], m[n], gT[n], gT[i]);
    pushQuad(gT[i], gT[n], gB[n], gB[i]);
    pushQuad(gB[i], gB[n], p1[n], p1[i]);
    positions.push(...p1[i], ...p1[n], ...culet);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

function createEmeraldCutGeometry(halfW: number, halfL: number): THREE.BufferGeometry {
  const positions: number[] = [];
  const pushQuad = (
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number],
    d: [number, number, number]
  ) => {
    positions.push(...a, ...b, ...c, ...a, ...c, ...d);
  };

  const octRing = (w: number, l: number, cham: number, y: number): [number, number, number][] => [
    [-w + cham, y, -l],
    [w - cham, y, -l],
    [w, y, -l + cham],
    [w, y, l - cham],
    [w - cham, y, l],
    [-w + cham, y, l],
    [-w, y, l - cham],
    [-w, y, -l + cham],
  ];

  const t = octRing(halfW * 0.58, halfL * 0.62, halfW * 0.16, halfW * 0.34);
  const s1 = octRing(halfW * 0.8, halfL * 0.82, halfW * 0.22, halfW * 0.18);
  const gT = octRing(halfW, halfL, halfW * 0.26, halfW * 0.04);
  const gB = octRing(halfW, halfL, halfW * 0.26, -halfW * 0.04);
  const p1 = octRing(halfW * 0.66, halfL * 0.7, halfW * 0.18, -halfW * 0.36);
  const p2 = octRing(halfW * 0.32, halfL * 0.38, halfW * 0.08, -halfW * 0.64);

  // Table center fan
  const centerTop: [number, number, number] = [0, halfW * 0.34, 0];
  const centerKeel: [number, number, number] = [0, -halfW * 0.78, 0];

  for (let i = 0; i < 8; i++) {
    const n = (i + 1) % 8;
    positions.push(...centerTop, ...t[n], ...t[i]);
    pushQuad(t[i], t[n], s1[n], s1[i]);
    pushQuad(s1[i], s1[n], gT[n], gT[i]);
    pushQuad(gT[i], gT[n], gB[n], gB[i]);
    pushQuad(gB[i], gB[n], p1[n], p1[i]);
    pushQuad(p1[i], p1[n], p2[n], p2[i]);
    positions.push(...p2[i], ...p2[n], ...centerKeel);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

export function createMetalMaterial(metal: MetalFinish): THREE.MeshPhysicalMaterial {
  if (metal === '18k Yellow Gold') {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E8C268'),
      metalness: 0.96,
      roughness: 0.14,
      clearcoat: 0.3,
      clearcoatRoughness: 0.12,
      anisotropy: 0.65,
      envMapIntensity: 1.5,
    });
  }
  if (metal === '18k White Gold') {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E5E8EE'),
      metalness: 0.98,
      roughness: 0.11,
      clearcoat: 0.35,
      clearcoatRoughness: 0.08,
      anisotropy: 0.55,
      envMapIntensity: 1.55,
    });
  }
  // Signature 18k Rose Gold
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#E3A688'),
    metalness: 0.96,
    roughness: 0.13,
    clearcoat: 0.35,
    clearcoatRoughness: 0.1,
    anisotropy: 0.72,
    envMapIntensity: 1.55,
  });
}

export function createGemstoneMaterial(
  gemstone: GemstoneOption,
  isSoftwareGl: boolean
): THREE.MeshPhysicalMaterial {
  const baseConfig = {
    metalness: 0.02,
    roughness: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    flatShading: true,
    envMapIntensity: 2.8,
    reflectivity: 1.0,
    specularIntensity: 1.0,
    transparent: true,
    opacity: isSoftwareGl ? 0.88 : 1.0,
    transmission: isSoftwareGl ? 0 : 0.88,
    thickness: 0.9,
  };

  switch (gemstone) {
    case 'Champagne Diamond':
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        color: new THREE.Color('#F7DEC0'),
        attenuationColor: new THREE.Color('#D59B6F'),
        attenuationDistance: 1.4,
        ior: 2.417,
        iridescence: 0.4,
        iridescenceIOR: 1.35,
      });
    case 'Burgundy Ruby':
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        color: new THREE.Color('#C4193E'),
        attenuationColor: new THREE.Color('#6F071E'),
        attenuationDistance: 0.8,
        ior: 1.77,
        transmission: isSoftwareGl ? 0 : 0.72,
        opacity: isSoftwareGl ? 0.92 : 1.0,
      });
    case 'Ceylon Sapphire':
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        color: new THREE.Color('#2753BE'),
        attenuationColor: new THREE.Color('#0E235C'),
        attenuationDistance: 0.9,
        ior: 1.77,
        transmission: isSoftwareGl ? 0 : 0.74,
        opacity: isSoftwareGl ? 0.92 : 1.0,
      });
    case 'White Diamond':
    default:
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        color: new THREE.Color('#F9FAFC'),
        attenuationColor: new THREE.Color('#EEF4FF'),
        attenuationDistance: 2.2,
        ior: 2.417,
        iridescence: 0.55,
        iridescenceIOR: 1.4,
      });
  }
}

export interface RingModelOptions {
  design: RingDesignStyle;
  shape: DiamondShape;
  metal: MetalFinish;
  gemstone: GemstoneOption;
  carat: number;
  isSoftwareGl: boolean;
}

export interface RingAssembly {
  root: THREE.Group;
  shankGroup: THREE.Group;
  galleryGroup: THREE.Group;
  prongsGroup: THREE.Group;
  haloGroup: THREE.Group;
  centerStone: THREE.Mesh;
  dispose: () => void;
}

/**
 * Builds a multi-part procedural luxury ring assembly (shank, gallery, prongs/bezel, halo/pave instanced stones, center gemstone).
 */
export function buildRingAssembly(options: RingModelOptions): RingAssembly {
  const { design, shape, metal, gemstone, carat, isSoftwareGl } = options;

  const root = new THREE.Group();
  const shankGroup = new THREE.Group();
  const galleryGroup = new THREE.Group();
  const prongsGroup = new THREE.Group();
  const haloGroup = new THREE.Group();

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const metalMat = createMetalMaterial(metal);
  const accentMetalMat = metalMat.clone();
  accentMetalMat.roughness = Math.min(1, metalMat.roughness + 0.16);
  const gemMat = createGemstoneMaterial(gemstone, isSoftwareGl);
  const paveMat = createGemstoneMaterial('White Diamond', isSoftwareGl);
  materials.push(metalMat, accentMetalMat, gemMat, paveMat);

  const ringRadius = 1.08;
  const stoneScale = 0.78 + (carat - 1.0) * 0.24; // 1ct..3ct
  const stoneRadius = 0.44 * stoneScale;
  const stoneCenterY = ringRadius + 0.29 + (stoneScale - 0.8) * 0.08;

  // 1. Primary Shank (Lathe/Extruded comfort-fit torus band)
  if (design === 'Split-Shank Ribbon') {
    const makeHalfShank = (zOffset: number, tilt: number) => {
      const geo = new THREE.TorusGeometry(ringRadius, 0.068, 24, 96);
      geometries.push(geo);
      const mesh = new THREE.Mesh(geo, metalMat);
      mesh.position.z = zOffset;
      mesh.rotation.x = tilt;
      mesh.castShadow = !isSoftwareGl;
      mesh.receiveShadow = !isSoftwareGl;
      return mesh;
    };
    shankGroup.add(makeHalfShank(0.085, 0.075));
    shankGroup.add(makeHalfShank(-0.085, -0.075));
  } else {
    // Comfort-fit sculpted band using LatheGeometry rotated on Z
    const profilePts = [
      new THREE.Vector2(ringRadius - 0.085, -0.105),
      new THREE.Vector2(ringRadius + 0.055, -0.115),
      new THREE.Vector2(ringRadius + 0.09, -0.06),
      new THREE.Vector2(ringRadius + 0.095, 0.0),
      new THREE.Vector2(ringRadius + 0.09, 0.06),
      new THREE.Vector2(ringRadius + 0.055, 0.115),
      new THREE.Vector2(ringRadius - 0.085, 0.105),
      new THREE.Vector2(ringRadius - 0.102, 0.0),
      new THREE.Vector2(ringRadius - 0.085, -0.105),
    ];
    const shankGeo = new THREE.LatheGeometry(profilePts, 72);
    shankGeo.rotateX(Math.PI / 2);
    geometries.push(shankGeo);
    const shankMesh = new THREE.Mesh(shankGeo, metalMat);
    shankMesh.castShadow = !isSoftwareGl;
    shankMesh.receiveShadow = !isSoftwareGl;
    shankGroup.add(shankMesh);

    // Subtle inner bevel collar detail
    const innerTrimGeo = new THREE.TorusGeometry(ringRadius - 0.095, 0.015, 12, 72);
    geometries.push(innerTrimGeo);
    const innerTrim = new THREE.Mesh(innerTrimGeo, accentMetalMat);
    shankGroup.add(innerTrim);
  }

  // Cathedral shoulders for Solitaire Cathedral
  if (design === 'Solitaire Cathedral') {
    const shoulderCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.55, ringRadius - 0.04, 0),
      new THREE.Vector3(0.38, ringRadius + 0.14, 0),
      new THREE.Vector3(0.22, stoneCenterY - 0.09, 0),
    ]);
    const shoulderCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.55, ringRadius - 0.04, 0),
      new THREE.Vector3(-0.38, ringRadius + 0.14, 0),
      new THREE.Vector3(-0.22, stoneCenterY - 0.09, 0),
    ]);
    const sGeoR = new THREE.TubeGeometry(shoulderCurveR, 20, 0.042, 12, false);
    const sGeoL = new THREE.TubeGeometry(shoulderCurveL, 20, 0.042, 12, false);
    geometries.push(sGeoR, sGeoL);
    const sR = new THREE.Mesh(sGeoR, metalMat);
    const sL = new THREE.Mesh(sGeoL, metalMat);
    sR.castShadow = !isSoftwareGl;
    sL.castShadow = !isSoftwareGl;
    shankGroup.add(sR, sL);
  }

  // 2. Sculpted Gallery / Basket
  const ovalFactor = shape === 'Oval' || shape === 'Emerald' ? 1.2 : 1.0;
  const widthFactor = shape === 'Oval' ? 0.84 : shape === 'Emerald' ? 0.88 : 1.0;

  const basketGeo = new THREE.TorusGeometry(stoneRadius * 0.78, 0.032, 16, 48);
  basketGeo.rotateX(Math.PI / 2);
  basketGeo.scale(widthFactor, 1, ovalFactor);
  geometries.push(basketGeo);
  const basketMesh = new THREE.Mesh(basketGeo, accentMetalMat);
  basketMesh.position.y = stoneCenterY - stoneRadius * 0.16;
  galleryGroup.add(basketMesh);

  const colletGeo = new THREE.TorusGeometry(stoneRadius * 0.48, 0.025, 14, 36);
  colletGeo.rotateX(Math.PI / 2);
  colletGeo.scale(widthFactor, 1, ovalFactor);
  geometries.push(colletGeo);
  const colletMesh = new THREE.Mesh(colletGeo, metalMat);
  colletMesh.position.y = ringRadius + 0.08;
  galleryGroup.add(colletMesh);

  // 3. Prongs or Architectural Bezel Collar
  if (design === 'Architectural Bezel') {
    const bezelH = stoneRadius * 0.24;
    const bezelGeo =
      shape === 'Princess' || shape === 'Emerald'
        ? new THREE.CylinderGeometry(
            stoneRadius * 1.08,
            stoneRadius * 0.94,
            bezelH,
            4,
            1,
            true
          )
        : new THREE.TorusGeometry(stoneRadius * 0.96, 0.052, 16, 48);

    if (shape === 'Round' || shape === 'Oval') {
      bezelGeo.rotateX(Math.PI / 2);
      bezelGeo.scale(widthFactor, 1, ovalFactor);
    } else {
      bezelGeo.rotateY(Math.PI / 4);
      bezelGeo.scale(widthFactor * 1.28, 1, ovalFactor * 1.28);
    }
    geometries.push(bezelGeo);
    const bezelMesh = new THREE.Mesh(bezelGeo, metalMat);
    bezelMesh.position.y = stoneCenterY + 0.01;
    if (shape === 'Princess' || shape === 'Emerald') {
      const bezelMatDouble = metalMat.clone();
      bezelMatDouble.side = THREE.DoubleSide;
      materials.push(bezelMatDouble);
      bezelMesh.material = bezelMatDouble;
    }
    prongsGroup.add(bezelMesh);
  } else {
    const prongAngles =
      shape === 'Round'
        ? [
            Math.PI / 6,
            (5 * Math.PI) / 6,
            Math.PI / 2 + Math.PI,
            (7 * Math.PI) / 6,
            (11 * Math.PI) / 6,
            Math.PI / 2,
          ]
        : [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

    const prongShaftGeo = new THREE.CylinderGeometry(0.022, 0.036, stoneRadius * 0.85, 12);
    const prongTipGeo = new THREE.SphereGeometry(0.026, 12, 12);
    geometries.push(prongShaftGeo, prongTipGeo);

    prongAngles.forEach((angle) => {
      const px = Math.cos(angle) * stoneRadius * 0.94 * widthFactor;
      const pz = Math.sin(angle) * stoneRadius * 0.94 * ovalFactor;

      const prong = new THREE.Mesh(prongShaftGeo, metalMat);
      prong.position.set(px * 0.82, stoneCenterY - stoneRadius * 0.18, pz * 0.82);
      prong.lookAt(px * 1.4, stoneCenterY + stoneRadius * 0.5, pz * 1.4);
      prong.rotateX(Math.PI / 2);
      prong.castShadow = !isSoftwareGl;
      prongsGroup.add(prong);

      const tip = new THREE.Mesh(prongTipGeo, metalMat);
      tip.position.set(px * 0.92, stoneCenterY + stoneRadius * 0.14, pz * 0.92);
      prongsGroup.add(tip);
    });
  }

  // 4. Pavé / Halo Accent Stones via InstancedMesh
  const paveGeo = createDiamondGeometry('Round', 0.052);
  geometries.push(paveGeo);

  const paveMatrices: THREE.Matrix4[] = [];
  const dummy = new THREE.Object3D();

  if (design === 'Halo Pavé') {
    const haloCount = 20;
    for (let i = 0; i < haloCount; i++) {
      const a = (i / haloCount) * Math.PI * 2;
      const hr = stoneRadius * 1.18;
      dummy.position.set(
        Math.cos(a) * hr * widthFactor,
        stoneCenterY - 0.02,
        Math.sin(a) * hr * ovalFactor
      );
      dummy.rotation.set(0, -a, 0);
      dummy.scale.setScalar(1.05);
      dummy.updateMatrix();
      paveMatrices.push(dummy.matrix.clone());
    }
  }

  if (design === 'Halo Pavé' || design === 'Split-Shank Ribbon') {
    // Shoulder pave stones along top arc of shank
    const shoulderSteps = [-0.85, -0.7, -0.55, -0.42, 0.42, 0.55, 0.7, 0.85];
    shoulderSteps.forEach((ang) => {
      const x = Math.sin(ang) * (ringRadius + 0.095);
      const y = Math.cos(ang) * (ringRadius + 0.095);
      if (design === 'Split-Shank Ribbon') {
        [-0.085, 0.085].forEach((zOff) => {
          dummy.position.set(x, y, zOff);
          dummy.rotation.set(0, 0, -ang);
          dummy.scale.setScalar(0.95);
          dummy.updateMatrix();
          paveMatrices.push(dummy.matrix.clone());
        });
      } else {
        dummy.position.set(x, y, 0);
        dummy.rotation.set(0, 0, -ang);
        dummy.scale.setScalar(1.1);
        dummy.updateMatrix();
        paveMatrices.push(dummy.matrix.clone());
      }
    });
  }

  if (paveMatrices.length > 0) {
    const instanced = new THREE.InstancedMesh(paveGeo, paveMat, paveMatrices.length);
    paveMatrices.forEach((mat, idx) => instanced.setMatrixAt(idx, mat));
    instanced.instanceMatrix.needsUpdate = true;
    instanced.computeBoundingSphere();
    haloGroup.add(instanced);
  }

  // 5. Center Gemstone
  const centerGeo = createDiamondGeometry(shape, stoneRadius);
  geometries.push(centerGeo);
  const centerStone = new THREE.Mesh(centerGeo, gemMat);
  centerStone.position.y = stoneCenterY;
  centerStone.castShadow = !isSoftwareGl;

  root.add(shankGroup, galleryGroup, prongsGroup, haloGroup, centerStone);

  // Subtle upward poise so ring sits gracefully
  root.position.y = -0.25;

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
  };

  return {
    root,
    shankGroup,
    galleryGroup,
    prongsGroup,
    haloGroup,
    centerStone,
    dispose,
  };
}
