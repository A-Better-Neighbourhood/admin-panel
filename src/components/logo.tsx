import React from 'react';

interface LogoProps {
  width?: string | number;
}

const Logo: React.FC<LogoProps> = ({ width = '100px' }) => {
  return (
    <div
      style={{ width }}
      className="flex items-center select-none animate-bounce-slow"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="header-logo-gradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563eb" />
            <stop offset="0.5" stopColor="#facc15" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#facc15" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="30" cy="30" r="28" fill="url(#glow)" />
        <circle cx="30" cy="30" r="26" fill="url(#header-logo-gradient)" stroke="#fff" strokeWidth="4" />
        <path d="M18 38L30 18L42 38" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="30" cy="38" r="5" fill="#fff" stroke="#facc15" strokeWidth="2" />
      </svg>
      <span className="ml-3 text-2xl font-extrabold text-white drop-shadow tracking-tight bg-gradient-to-r from-yellow-300 via-blue-400 to-blue-900 bg-clip-text text-transparent animate-gradient-x" style={{textShadow:'0 2px 12px #2563eb'}}>Neighbourhood</span>
    </div>
  );
};

export default Logo;
