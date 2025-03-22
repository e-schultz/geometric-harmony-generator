
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-4 w-full flex justify-center items-center z-20 pointer-events-none">
      <div className="text-xs text-white/50 tracking-wider animate-fade-in" style={{ animationDelay: '1s' }}>
        geometric.harmony
      </div>
    </footer>
  );
};

export default Footer;
