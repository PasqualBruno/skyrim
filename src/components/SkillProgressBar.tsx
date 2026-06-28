import React from 'react';

interface SkillProgressBarProps {
  value: number; // Current value (0 - 9)
  max: number;   // Normally 10
  className?: string;
}

export const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ value, max, className = '' }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {/* Outer framing container */}
      <div className="relative h-4 bg-skyrim-ink/20 rounded border border-skyrim-ink/40 shadow-inner overflow-hidden flex items-center p-[2px]">
        {/* Glow Line (Progress) */}
        <div 
          className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-sky-300 rounded-sm transition-all duration-700 ease-out skyrim-glow-bar"
          style={{ width: `${percent}%` }}
        />
        
        {/* Glow Star Marker at progress tip */}
        {percent > 0 && (
          <div 
            className="absolute h-4 w-1 bg-white shadow-[0_0_12px_#00f0ff,0_0_4px_#ffffff] transition-all duration-700 ease-out"
            style={{ left: `calc(${percent}% - 2px)` }}
          />
        )}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between items-center text-[11px] font-bold tracking-widest text-skyrim-ink/75 mt-1.5 select-none font-cinzel">
        <span>PROGRESSO DO PERK</span>
        <span>{value} / {max} MÉRITOS</span>
      </div>
    </div>
  );
};
