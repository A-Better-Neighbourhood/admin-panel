import React from 'react';

interface LogoProps {
  width?: string | number;
}

const Logo: React.FC<LogoProps> = ({ width = '100px' }) => {
  return (
    <div style={{ width }}>
      Logo
    </div>
  );
};

export default Logo;
