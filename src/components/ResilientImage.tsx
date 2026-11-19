import { useState } from 'react';
import { resolveAssetUrl } from '../utils/assetUrl';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Seema Sena Party',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#FEF3C7] border border-[#E6D58E] text-[#181510] p-6 text-center ${className}`}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
          className="mb-2 text-[#92400E]"
        >
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M20 8V14M10 24L20 15L30 24M14 28H26"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-semibold">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={resolveAssetUrl(src)}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
