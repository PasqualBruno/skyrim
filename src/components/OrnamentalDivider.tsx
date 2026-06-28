import React from 'react';

interface OrnamentalDividerProps {
  className?: string;
  light?: boolean;
}

export const OrnamentalDivider: React.FC<OrnamentalDividerProps> = ({ className = '', light = false }) => {
  const strokeColor = light ? 'rgba(74, 63, 49, 0.4)' : 'rgba(197, 155, 39, 0.5)';
  const fillColor = light ? '#4a3f31' : '#c59b27';

  return (
    <div className={`flex items-center justify-center w-full my-3 select-none ${className}`}>
      <svg width="100%" height="16" viewBox="0 0 400 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-md w-full">
        {/* Left tapering line */}
        <path d="M 10 8 Q 100 8 185 8" stroke={strokeColor} strokeWidth="1" />
        {/* Left detail circle */}
        <circle cx="185" cy="8" r="2" fill={fillColor} />
        
        {/* Center Diamond Ornament */}
        <rect x="195" y="3" width="10" height="10" transform="rotate(45 200 8)" fill={fillColor} />
        
        {/* Right detail circle */}
        <circle cx="215" cy="8" r="2" fill={fillColor} />
        {/* Right tapering line */}
        <path d="M 215 8 Q 300 8 390 8" stroke={strokeColor} strokeWidth="1" />
      </svg>
    </div>
  );
};
