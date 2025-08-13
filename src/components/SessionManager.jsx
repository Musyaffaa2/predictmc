import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { formatCooldownTime, canGenerateGuestToken } from '../utils/authUtils';

const SessionManager = () => {
  const { user, logout, getSessionTimeLeft, sessionData, extendGuestSession } = useAuth();
  const [timeLeft, setTimeLeft] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [guestCooldownInfo, setGuestCooldownInfo] = useState({ canGenerate: true, timeLeft: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getSessionTimeLeft();
      setTimeLeft(remaining);

      // Show warning saat 5 menit tersisa (hanya untuk guest)
      if (remaining <= 5 * 60 * 1000 && remaining > 0 && sessionData?.hasTimeLimit) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }

      // Auto logout saat expired
      if (remaining === 0 && sessionData?.hasTimeLimit) {
        logout();
      }
      
      // Update guest cooldown info jika user adalah guest
      if (user?.level === 'guest') {
        const cooldownInfo = canGenerateGuestToken();
        setGuestCooldownInfo(cooldownInfo);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [getSessionTimeLeft, logout, sessionData, user]);

  const formatTime = (milliseconds) => {
    if (milliseconds === -1) return 'Unlimited';
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    const isGuest = user?.level === 'guest';
    const message = isGuest 
      ? 'Yakin ingin logout? Anda perlu menunggu cooldown untuk generate token guest lagi.'
      : 'Yakin ingin logout dari sistem?';
      
    if (confirm(message)) {
      logout();
    }
  };

  const handleExtendSession = () => {
    const result = extendGuestSession();
    alert(result.message);
  };

  const getSessionStatusColor = () => {
    if (timeLeft === -1) return 'text-green-400'; // Unlimited
    if (showWarning) return 'text-red-400'; // Warning
    if (timeLeft > 10 * 60 * 1000) return 'text-green-400'; // > 10 minutes
    if (timeLeft > 5 * 60 * 1000) return 'text-yellow-400'; // > 5 minutes
    return 'text-red-400'; // < 5 minutes
  };

  return (
    <>
      {/* Session Info - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-black/60 backdrop-blur-md border border-cyan-400/30 rounded-lg p-3 text-xs">
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="text-cyan-300">
              <div className="font-bold flex items-center space-x-1">
                <span>{user?.avatar}</span>
                <span>{user?.name}</span>
                {sessionData?.isGenerated && (
                  <span className="text-purple-400" title="Generated Token">
                    <i className="fas fa-magic text-xs"></i>
                  </span>
                )}
              </div>
              <div className={`text-xs ${user?.level === 'admin' ? 'text-red-400' : user?.level === 'user' ? 'text-blue-400' : 'text-gray-400'}`}>
                {user?.level?.toUpperCase()}
              </div>
            </div>
            
            {/* Session Timer */}
            <div className={`font-mono ${getSessionStatusColor()} ${showWarning ? 'animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-500/20"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
          
          {/* Guest Cooldown Info */}
          {user?.level === 'guest' && !guestCooldownInfo.canGenerate && (
            <div className="mt-2 pt-2 border-t border-gray-400/20">
              <div className="text-gray-400 text-xs">
                <i className="fas fa-clock mr-1"></i>
                Next guest token: {formatCooldownTime(guestCooldownInfo.timeLeft)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="text-yellow-400 text-4xl mb-4 animate-bounce">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                SESSION AKAN BERAKHIR
              </h3>
              <p className="text-yellow-300/80 mb-4">
                Session Anda akan berakhir dalam {formatTime(timeLeft)}
              </p>
              
              {/* Guest-specific messaging */}
              {user?.level === 'guest' && (
                <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3 mb-4">
                  <div className="text-purple-300 text-sm">
                    <i className="fas fa-info-circle mr-2"></i>
                    Sebagai guest, Anda perlu menunggu cooldown untuk generate token baru
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                {user?.level === 'guest' ? (
                  <>
                    <button
                      onClick={handleExtendSession}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <i className="fas fa-magic mr-2"></i>
                      INFO
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleExtendSession}
                      className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <i className="fas fa-clock mr-2"></i>
                      PERPANJANG
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      LOGOUT
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionManager;