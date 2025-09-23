import React from 'react';

interface LogoProps {
  width?: string | number;
}

const Logo: React.FC<LogoProps> = ({ width = '110px' }) => {
  return (
    <div
      style={{ width }}
      className="flex items-center select-none"
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="pry-gradient" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A259FF" /> {/* Purple */}
            <stop offset="0.5" stopColor="#FF2E63" /> {/* Red */}
            <stop offset="1" stopColor="#FFD600" /> {/* Yellow */}
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFD600" floodOpacity="0.5" />
          </filter>
        </defs>
        {/* Vibrant monogram: stylized N in a circle with purple-red-yellow gradient and glow */}
        <circle cx="28" cy="28" r="26" fill="#fff" stroke="url(#pry-gradient)" strokeWidth="3" filter="url(#glow)" />
        <path d="M18 38L18 18L38 38L38 18" stroke="url(#pry-gradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
      </svg>
  <span className="ml-4 text-2xl font-serif font-semibold tracking-wide bg-gradient-to-r from-[#A259FF] via-[#FF2E63] to-[#FFD600] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,214,0,0.4)]" style={{letterSpacing: '0.04em'}}>Neighbourhood</span>
    </div>
  );
};

export default Logo;
