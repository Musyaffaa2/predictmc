import React from 'react';

const CyberInput = ({ 
  value, 
  onChange, 
  placeholder, 
  isAuto = false, 
  className = "",
  disabled = false 
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={isAuto}
    disabled={disabled}
    className={`
      w-full bg-black/70 border-2 border-gray-600 px-3 py-2 md:px-4 md:py-3 text-white font-bold backdrop-blur-sm
      focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/30 focus:outline-none focus:scale-105
      transition-all duration-300 placeholder-gray-400 text-sm md:text-base transform
      ${isAuto ? 'bg-green-500/15 border-green-400 text-green-100 shadow-green-400/20 animate-glow' : 'hover:border-gray-400'}
      ${className}
    `}
    title={isAuto ? "AUTO-GENERATED FIELD" : ""}
  />
);

export default CyberInput;