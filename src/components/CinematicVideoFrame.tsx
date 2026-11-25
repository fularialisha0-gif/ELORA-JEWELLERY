import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface CinematicVideoFrameProps {
  videoSrc: string;
  posterSrc: string;
  posterAlt: string;
  captionTitle?: string;
  captionSubtitle?: string;
  className?: string;
  showControls?: boolean;
  allowSound?: boolean;
  scrimClassName?: string;
  aspectClassName?: string;
  videoClassName?: string;
  priority?: boolean;
}

/**
 * Video-ready editorial cinema frame.
 * Plays local MP4 from /public/videos/ when available; seamlessly falls back to a
 * hardware-accelerated Ken Burns motion plate over the 16:9 poster without broken-player errors.
 * Sound is strictly off by default and only plays when explicitly toggled by the visitor.
 */
export const CinematicVideoFrame: React.FC<CinematicVideoFrameProps> = ({
  videoSrc,
  posterSrc,
  posterAlt,
  captionTitle,
  captionSubtitle,
  className = '',
  showControls = true,
  allowSound = true,
  scrimClassName = 'bg-gradient-to-t from-[#12060A]/90 via-[#12060A]/35 to-transparent',
  aspectClassName = 'aspect-[16/9]',
  videoClassName = '',
  priority = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [hasVideoStream, setHasVideoStream] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Ensure HTML muted attribute is synchronously set for browser autoplay compliance
    vid.defaultMuted = true;
    vid.muted = !soundOn;

    if (prefersReducedMotion) {
      vid.pause();
      setIsPlaying(false);
      return;
    }

    if (isPlaying) {
      vid.play().catch(() => {});
    }
  }, [prefersReducedMotion, soundOn, isPlaying]);

  // Clean up Web Audio atelier chord on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (hasVideoStream && videoRef.current) {
      if (next) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleAmbientSound = () => {
    if (!allowSound) return;
    if (!soundOn) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          const ctx = new AudioCtx();
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.055, ctx.currentTime + 1.2);
          masterGain.connect(ctx.destination);

          // Warm D-major 9th crystalline harmonic drone
          [146.83, 220.0, 293.66, 369.99, 440.0].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const voiceGain = ctx.createGain();
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.value = freq;
            voiceGain.gain.value = 0.22 / (idx + 1);
            osc.connect(voiceGain);
            voiceGain.connect(masterGain);
            osc.start();
          });

          audioCtxRef.current = ctx;
          gainRef.current = masterGain;
        } else {
          if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume().catch(() => {});
          }
          if (gainRef.current) {
            gainRef.current.gain.setTargetAtTime(0.055, audioCtxRef.current.currentTime, 0.4);
          }
        }
        if (hasVideoStream && videoRef.current) {
          videoRef.current.muted = false;
        }
        setSoundOn(true);
      } catch {
        setSoundOn(false);
      }
    } else {
      if (audioCtxRef.current && gainRef.current) {
        gainRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.25);
      }
      if (hasVideoStream && videoRef.current) {
        videoRef.current.muted = true;
      }
      setSoundOn(false);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#0B0507] ${aspectClassName} ${className}`}>
      {/* Fallback / Poster Visual Layer with smooth Ken Burns cinema motion */}
      <img
        src={posterSrc}
        alt={posterAlt}
        loading={priority ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          hasVideoStream ? 'opacity-0' : 'opacity-100'
        } ${
          prefersReducedMotion
            ? ''
            : isPlaying
              ? 'animate-ken-burns'
              : 'animate-ken-burns-paused'
        }`}
      />

      {/* Real HTML5 Video Layer (activates automatically if MP4 exists in public/videos/) */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        autoPlay={!prefersReducedMotion}
        loop
        muted
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        onPlaying={() => setHasVideoStream(true)}
        onLoadedData={() => {
          setHasVideoStream(true);
          if (isPlaying && !prefersReducedMotion) {
            videoRef.current?.play().catch(() => {});
          }
        }}
        onCanPlay={() => {
          setHasVideoStream(true);
          if (isPlaying && !prefersReducedMotion) {
            videoRef.current?.play().catch(() => {});
          }
        }}
        onError={() => {
          console.warn('[ÉLORA Video] Failed to load video stream:', videoSrc);
          setHasVideoStream(false);
        }}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          hasVideoStream ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${videoClassName}`}
      />

      {/* Contrast scrim for legible typography */}
      <div className={`absolute inset-0 pointer-events-none ${scrimClassName}`} />

      {/* Caption & Controls Bar */}
      {(captionTitle || showControls) && (
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 flex items-end justify-between gap-4">
          {captionTitle ? (
            <div className="max-w-xl">
              {captionSubtitle && (
                <p className="text-xs tracking-[0.22em] uppercase text-[#E8C5B0] mb-1.5">
                  {captionSubtitle}
                </p>
              )}
              <h3 className="font-serif text-xl sm:text-3xl text-[#F7F1EB] font-normal leading-snug">
                {captionTitle}
              </h3>
            </div>
          ) : (
            <div />
          )}

          {showControls && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause film' : 'Play film'}
                className="h-10 px-3.5 inline-flex items-center gap-2 border border-[#E8C5B0]/30 bg-[#12060A]/80 text-[#F7F1EB] hover:border-[#D8A384] hover:text-[#E8C5B0] transition-colors text-xs whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384]"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              {allowSound && (
                <button
                  type="button"
                  onClick={toggleAmbientSound}
                  aria-label={soundOn ? 'Mute ambient score' : 'Play ambient score'}
                  className="h-10 w-10 inline-flex items-center justify-center border border-[#E8C5B0]/30 bg-[#12060A]/80 text-[#F7F1EB] hover:border-[#D8A384] hover:text-[#E8C5B0] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384]"
                >
                  {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
