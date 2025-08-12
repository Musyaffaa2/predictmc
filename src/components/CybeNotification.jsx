import React, { useState, useEffect } from 'react';

const CyberNotification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const types = {
    info: { color: "cyan-400", icon: "fas fa-info-circle" },
    success: { color: "green-400", icon: "fas fa-check-circle" },
    warning: { color: "orange-400", icon: "fas fa-exclamation-triangle" }
  };

  const config = types[type] || types.info;

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 2700);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-2 md:right-5 z-50 bg-white/5 backdrop-blur-md border-2 border-${config.color} p-3 md:p-4 min-w-64 md:min-w-72 shadow-lg shadow-${config.color}/20 transform transition-all duration-500 text-sm md:text-base ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <i className={`${config.icon} mr-2 text-${config.color} animate-pulse`}></i>
      <span className="font-mono font-semibold text-white">{message}</span>
    </div>
  );
};

export default CyberNotification;