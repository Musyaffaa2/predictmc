import React from 'react';

const Footer = () => (
  <footer className="text-center p-6 mt-8 border-t-2 border-cyan-400 text-cyan-400 font-mono relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-shimmer"></div>
    <div className="transform transition-all duration-300 hover:scale-105">
      <i className="fas fa-code mr-2"></i>
      DEVELOPED WITH PASSION FOR MCGOGO COMMUNITY
    </div>
    <div className="mt-2 text-sm opacity-80 transition-all duration-300 hover:opacity-100">
      © 2025 RUII DEWA MC SYSTEMS - VERSION 3.0 ADVANCED - ALL RIGHTS RESERVED
    </div>
    <div className="mt-2 text-xs opacity-60">
      <i className="fas fa-rocket mr-1"></i>
      FEATURING ADVANCED ROUND 8+ PREDICTION ALGORITHMS
    </div>
  </footer>
);

export default Footer;