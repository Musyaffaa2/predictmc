import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TokenInputModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 30000; // 30 seconds

  // Check rate limit saat mount
  useEffect(() => {
    if (isOpen) {
      checkRateLimit();
    }
  }, [isOpen]);

  // Timer untuk countdown lockout
  useEffect(() => {
    let timer;
    if (isLocked && lockTimeLeft > 0) {
      timer = setInterval(() => {
        setLockTimeLeft(prev => {
          if (prev <= 1000) {
            setIsLocked(false);
            setAttempts(0);
            setError('');
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTimeLeft]);

  const checkRateLimit = () => {
    try {
      const rateLimitData = sessionStorage.getItem('mcgogo_rate_limit');
      if (rateLimitData) {
        const { attempts: storedAttempts, lockUntil } = JSON.parse(rateLimitData);
        const now = Date.now();
        
        if (lockUntil && now < lockUntil) {
          setIsLocked(true);
          setLockTimeLeft(lockUntil - now);
          setAttempts(storedAttempts);
          setError(`Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil((lockUntil - now) / 1000)} detik.`);
        } else if (lockUntil && now >= lockUntil) {
          // Reset jika lockout sudah berakhir
          sessionStorage.removeItem('mcgogo_rate_limit');
          setAttempts(0);
        } else {
          setAttempts(storedAttempts);
        }
      }
    } catch (error) {
      console.error('Error checking rate limit:', error);
    }
  };

  const updateRateLimit = (newAttempts) => {
    const rateLimitData = {
      attempts: newAttempts,
      lastAttempt: Date.now(),
      lockUntil: newAttempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_DURATION : null
    };
    
    sessionStorage.setItem('mcgogo_rate_limit', JSON.stringify(rateLimitData));
    
    if (newAttempts >= MAX_ATTEMPTS) {
      setIsLocked(true);
      setLockTimeLeft(LOCKOUT_DURATION);
      setError(`Terlalu banyak percobaan yang salah. Sistem dikunci selama 30 detik.`);
    }
  };

  const handleSubmit = async () => {
    if (isLocked) {
      setError(`Sistem dikunci. Coba lagi dalam ${Math.ceil(lockTimeLeft / 1000)} detik.`);
      return;
    }

    if (!token.trim()) {
      setError('Token tidak boleh kosong!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate validation delay untuk cyber effect
      await new Promise(resolve => setTimeout(resolve, 1000));

      await login(token.trim());
      
      // Reset rate limit on successful login
      sessionStorage.removeItem('mcgogo_rate_limit');
      setAttempts(0);
      setToken('');
      onClose();
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      updateRateLimit(newAttempts);
      
      if (newAttempts < MAX_ATTEMPTS) {
        setError(`Token tidak valid! Sisa percobaan: ${MAX_ATTEMPTS - newAttempts}`);
      }
      
      setToken('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value.toUpperCase());
    if (error && !isLocked) {
      setError('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setToken('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl max-w-md w-full relative overflow-hidden">
        
        {/* Animated Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-shimmer"></div>
        
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-cyan-400 text-2xl animate-pulse">
                <i className="fas fa-key"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-cyan-400">TOKEN ACCESS</h2>
                <p className="text-cyan-300/70 text-sm">Masukkan access token Anda</p>
              </div>
            </div>
            
            {!isLoading && (
              <button
                onClick={handleClose}
                className="text-red-400 hover:text-red-300 transition-colors bg-red-500/20 hover:bg-red-500/30 rounded-lg w-8 h-8 flex items-center justify-center border border-red-400/30"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {/* Rate limit warning */}
          {attempts > 0 && !isLocked && (
            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                <span className="text-yellow-300 text-sm">
                  Peringatan: {attempts}/{MAX_ATTEMPTS} percobaan. Sistem akan dikunci setelah {MAX_ATTEMPTS - attempts} percobaan lagi.
                </span>
              </div>
            </div>
          )}

          {/* Lockout Warning */}
          {isLocked && (
            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-lock text-red-400"></i>
                <span className="text-red-300 text-sm">
                  Sistem dikunci: {Math.ceil(lockTimeLeft / 1000)} detik tersisa
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {/* Token Input */}
            <div>
              <label className="block text-cyan-300 text-sm font-bold mb-2">
                <i className="fas fa-shield-alt mr-2"></i>
                ACCESS TOKEN
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={token}
                  onChange={handleTokenChange}
                  onKeyPress={handleKeyPress}
                  placeholder="MASUKKAN TOKEN AKSES"
                  disabled={isLoading || isLocked}
                  className="w-full bg-black/50 border border-cyan-400/30 rounded-lg px-4 py-3 text-cyan-100 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all font-mono text-center tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  maxLength={50}
                  autoComplete="off"
                  spellCheck="false"
                />
                
                {/* Input Icon */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isLoading ? (
                    <i className="fas fa-spinner animate-spin text-cyan-400"></i>
                  ) : (
                    <i className="fas fa-lock text-cyan-400/50"></i>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !token.trim() || isLocked}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-cyan-400/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <i className="fas fa-spinner animate-spin"></i>
                  <span>MEMVERIFIKASI TOKEN...</span>
                </span>
              ) : isLocked ? (
                <span className="flex items-center justify-center space-x-2">
                  <i className="fas fa-lock"></i>
                  <span>SISTEM DIKUNCI</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <i className="fas fa-sign-in-alt"></i>
                  <span>AKSES SISTEM</span>
                </span>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-exclamation-circle text-red-400"></i>
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Token Hints */}
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-bold text-sm mb-2">
                <i className="fas fa-info-circle mr-2"></i>
                TOKEN INFORMATION
              </h4>
              <div className="text-blue-300/80 text-xs space-y-1">
                <div>• Token bersifat case-insensitive</div>
                <div>• Setiap token memiliki durasi berbeda</div>
                <div>• Session auto-logout saat expired</div>
                <div>• Hubungi admin untuk token premium</div>
              </div>
            </div>

            {/* Demo Tokens */}
            <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-3">
              <details className="cursor-pointer">
                <summary className="text-gray-400 text-xs font-bold">Demo Tokens (Development)</summary>
                <div className="mt-2 text-gray-400/80 text-xs space-y-1">
                  <div>• ADMIN-TOKEN - Admin Access</div>
                  <div>• USER-TOKEN - User Access</div>
                  <div>• Gunakan "Generate Guest" di menu utama untuk akses terbatas</div>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Cyber Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TokenInputModal;