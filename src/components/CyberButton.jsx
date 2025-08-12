import React from 'react';

const CyberButton = ({ onClick, children, variant = "cyan", className = "", disabled = false }) => {
  const variants = {
    cyan: "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-cyan-400/30",
    pink: "border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black shadow-pink-500/30",
    purple: "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-black shadow-purple-500/30",
    green: "border-green-400 text-green-400 hover:bg-green-400 hover:text-black shadow-green-400/30"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-mono border-2 px-4 py-2 md:px-6 md:py-3 font-bold uppercase tracking-wider relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:scale-105 backdrop-blur-sm text-sm md:text-base w-full md:w-auto transform active:scale-95 ${variants[variant]} shadow-lg hover:shadow-xl ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default CyberButton;