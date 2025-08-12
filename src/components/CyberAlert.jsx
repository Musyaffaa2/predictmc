import React from 'react';

const CyberAlert = ({ 
  type = "info", 
  title, 
  children, 
  className = "", 
  delay = 0 
}) => {
  const types = {
    info: "border-cyan-400 shadow-cyan-400/20",
    success: "border-green-400 shadow-green-400/20",
    warning: "border-orange-400 shadow-orange-400/20",
    danger: "border-red-400 shadow-red-400/20"
  };

  return (
    <div 
      className={`bg-white/5 backdrop-blur-md border-2 p-6 my-6 relative overflow-hidden transform transition-all duration-500 hover:scale-102 animate-fade-in-up ${types[type]} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-shimmer"></div>
      <h5 className="font-mono text-lg font-bold mb-3 text-white">
        <i className="fas fa-microchip mr-2 animate-pulse"></i>
        {title}
      </h5>
      <div className="text-white">{children}</div>
    </div>
  );
};

export default CyberAlert;