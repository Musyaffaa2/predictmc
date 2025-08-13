import React from 'react';

const CyberButton = ({ 
  children, 
  onClick, 
  variant = 'cyan', 
  disabled = false, 
  title = '',
  className = '' 
}) => {
  
  const getVariantClasses = () => {
    const baseClasses = "font-bold py-2 md:py-3 px-3 md:px-6 rounded-lg md:rounded-xl text-xs md:text-sm transform transition-all duration-300 border backdrop-blur-md relative overflow-hidden group";
    
    const variants = {
      cyan: `${baseClasses} bg-cyan-500/20 text-cyan-400 border-cyan-400/30 hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-400/30`,
      purple: `${baseClasses} bg-purple-500/20 text-purple-400 border-purple-400/30 hover:bg-purple-500/30 hover:shadow-lg hover:shadow-purple-400/30`,
      yellow: `${baseClasses} bg-yellow-500/20 text-yellow-400 border-yellow-400/30 hover:bg-yellow-500/30 hover:shadow-lg hover:shadow-yellow-400/30`,
      pink: `${baseClasses} bg-pink-500/20 text-pink-400 border-pink-400/30 hover:bg-pink-500/30 hover:shadow-lg hover:shadow-pink-400/30`,
      green: `${baseClasses} bg-green-500/20 text-green-400 border-green-400/30 hover:bg-green-500/30 hover:shadow-lg hover:shadow-green-400/30`,
      red: `${baseClasses} bg-red-500/20 text-red-400 border-red-400/30 hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-400/30`
    };

    return variants[variant] || variants.cyan;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${getVariantClasses()} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none' : 'hover:scale-105'} ${className}`}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Button Content */}
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );
};

export default CyberButton;