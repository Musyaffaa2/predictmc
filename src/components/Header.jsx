import React from 'react';

const Header = () => (
  <div className="text-center mb-6 md:mb-10 animate-fade-in-up">
    <h1 className="font-mono text-2xl md:text-4xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 md:mb-4 leading-tight transform transition-all duration-700 hover:scale-105">
      <i className="fas fa-crosshairs mr-2 md:mr-3 animate-pulse"></i>
      PREDICT MUSUH MCGOGO
    </h1>
    <div className="font-mono text-green-400 text-sm md:text-lg lg:text-xl font-bold animate-slide-in-top" style={{ animationDelay: '0.3s' }}>
      <i className="fas fa-terminal mr-1 md:mr-2"></i>
      [ DEVELOPED BY RUII DEWA MC ]
    </div>
  </div>
);

export default Header;