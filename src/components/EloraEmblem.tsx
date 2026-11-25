import React from 'react';

interface EloraEmblemProps {
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EloraEmblem: React.FC<EloraEmblemProps> = ({
  showWordmark = true,
  size = 'md',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 40 : 28;
  const textClass =
    size === 'sm'
      ? 'text-lg tracking-[0.26em]'
      : size === 'lg'
        ? 'text-3xl tracking-[0.32em]'
        : 'text-xl tracking-[0.28em]';

  return (
    <span className={`inline-flex items-center gap-3 select-none whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Outer octagonal architectural diamond frame */}
        <path
          d="M20 2L34 12.5L28.5 34.5L20 38L11.5 34.5L6 12.5L20 2Z"
          stroke="#D8A384"
          strokeWidth="1.25"
        />
        {/* Inner crown facets */}
        <path
          d="M6 12.5H34M13.5 12.5L20 38L26.5 12.5M20 2L13.5 12.5L20 21L26.5 12.5L20 2Z"
          stroke="#E8C5B0"
          strokeWidth="0.85"
          strokeOpacity="0.78"
        />
        {/* Central floating lozenge */}
        <path d="M20 15.5L23.5 21L20 26.5L16.5 21L20 15.5Z" fill="#D8A384" fillOpacity="0.9" />
      </svg>
      {showWordmark && (
        <span className={`font-serif font-medium text-[#F7F1EB] leading-none ${textClass}`}>
          ÉLORA
        </span>
      )}
    </span>
  );
};
