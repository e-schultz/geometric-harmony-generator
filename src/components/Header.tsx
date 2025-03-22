
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 p-4 md:p-8 z-30">
      <div className="flex flex-col items-center">
        <h1 className="text-xs md:text-sm tracking-widest text-white/70 mb-1 animate-slide-down" style={{ animationDelay: '0.2s' }}>
          GEOMETRIC HARMONY GENERATOR
        </h1>
        <h2 className="text-sm md:text-base font-light tracking-[0.2em] animate-slide-down" style={{ animationDelay: '0.4s' }}>
          MINIMAL VISUALIZATION
        </h2>
      </div>
    </header>
  );
};

export default Header;
