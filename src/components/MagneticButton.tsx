import React, { useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  onMouseMove,
  onMouseLeave,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(e);
    if (reducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    setOffset({ x: dx, y: dy });
  };

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e);
    setOffset({ x: 0, y: 0 });
  };

  const variantStyles =
    variant === 'primary'
      ? 'bg-[#D8A384] text-[#12060A] border border-[#D8A384] hover:bg-[#E8C5B0] hover:border-[#E8C5B0]'
      : variant === 'secondary'
        ? 'bg-transparent text-[#F7F1EB] border border-[#E8C5B0]/40 hover:border-[#D8A384] hover:text-[#E8C5B0]'
        : 'bg-transparent text-[#E8C5B0] border border-transparent hover:text-[#F7F1EB]';

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        reducedMotion
          ? undefined
          : {
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
              transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1), background-color 180ms ease, border-color 180ms ease, color 180ms ease',
            }
      }
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 text-xs sm:text-sm font-medium tracking-[0.12em] uppercase whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D8A384] disabled:opacity-45 disabled:cursor-not-allowed ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
