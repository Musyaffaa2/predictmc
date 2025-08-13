import React from 'react';
import { formatCooldownTime } from '../utils/authUtils';

const LockedFeatureOverlay = ({ 
  isVisible, 
  featureName, 
  requiredPermission, 
  onTokenInputClick,
  onGuestTokenClick,
  guestStatus,
  hideInputOverlay = false // Parameter baru untuk menyembunyikan overlay di input
}) => {
  if (!isVisible) return null;

  // Jika hideInputOverlay true dan ini untuk input, tidak tampilkan overlay
  if (hideInputOverlay && (featureName === "Input Prediksi" || featureName.includes("Input"))) {
    return null;
  }

  const canUseGuest = guestStatus && !guestStatus.hasUsed && !guestStatus.cooldown.isOnCooldown;
  const showGuestOption = requiredPermission === 'basic' && guestStatus;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-30">
      <div className="text-center p-6 max-w-sm">
        {/* Lock Icon */}
        <div className="text-6xl mb-4 animate-bounce">
          🔒
        </div>
        
        {/* Feature Name */}
        <h3 className="text-white font-bold text-xl mb-2">
          {featureName} Terkunci
        </h3>
        
        {/* Required Permission */}
        <p className="text-gray-300 text-sm mb-6">
          Butuh token level: <span className="text-yellow-400 font-bold">{requiredPermission.toUpperCase()}</span>
        </p>
        
        {/* Action Buttons - Clean and Simple */}
        <div className="space-y-4">
          {/* Primary Action Button */}
          <button
            onClick={onTokenInputClick}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-cyan-400/50"
          >
            <i className="fas fa-key mr-2"></i>
            Input Token
          </button>
          
          {/* Guest Token Option - hanya untuk basic permission */}
          {showGuestOption && canUseGuest && (
            <button
              onClick={onGuestTokenClick}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-3 px-4 rounded-lg hover:scale-105 transition-all shadow-lg"
            >
              <i className="fas fa-magic mr-2"></i>
              Coba Gratis (30 Menit)
            </button>
          )}
          
          {/* Cooldown Info - jika ada */}
          {showGuestOption && !canUseGuest && (
            <div className="text-center text-red-400 text-sm">
              <i className="fas fa-clock mr-1"></i>
              {guestStatus.hasUsed ? 'Guest token sudah digunakan' : `Cooldown: ${formatCooldownTime(guestStatus.cooldown.timeLeft)}`}
            </div>
          )}
        </div>
        
        {/* Info - Simplified */}
        <div className="mt-6 text-gray-400 text-xs">
          <i className="fas fa-info-circle mr-1"></i>
          Masukkan token untuk mengakses fitur prediksi
        </div>
      </div>
    </div>
  );
};

export default LockedFeatureOverlay;