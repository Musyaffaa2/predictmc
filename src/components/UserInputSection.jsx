import React from 'react';
import CyberInput from './CyberInput';

const UserInputSection = ({ 
  userName, 
  p8Name, 
  onUserNameChange, 
  onP8NameChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
      <div className="transform transition-all duration-300 hover:scale-105">
        <label className="block text-white font-bold mb-2 text-sm md:text-base">
          <i className="fas fa-user mr-1 md:mr-2 text-cyan-400"></i>
          INPUT NICKNAME USER:
        </label>
        <CyberInput
          value={userName}
          onChange={onUserNameChange}
          placeholder="MASUKKAN NICKNAME ANDA..."
          className="text-sm md:text-base"
        />
      </div>
      <div className="transform transition-all duration-300 hover:scale-105">
        <label className="block text-white font-bold mb-2 text-sm md:text-base">
          <i className="fas fa-crosshairs mr-1 md:mr-2 text-pink-500"></i>
          INPUT MUSUH PERTAMA ANDA:
        </label>
        <CyberInput
          value={p8Name}
          onChange={onP8NameChange}
          placeholder="NAMA MUSUH PERTAMA ANDA..."
          className="text-sm md:text-base"
        />
      </div>
    </div>
  );
};

export default UserInputSection;