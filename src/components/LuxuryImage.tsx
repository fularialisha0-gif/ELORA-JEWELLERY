import React, { useState } from 'react';
import { EloraEmblem } from './EloraEmblem';

interface LuxuryImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const LuxuryImage: React.FC<LuxuryImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#280E16] via-[#17090E] to-[#0B0507] text-center p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        <EloraEmblem showWordmark={false} size="md" className="opacity-70" />
        <span className="mt-2 text-xs text-[#C7B6AE] line-clamp-2 max-w-[18ch]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
