import React, { useState, useEffect } from 'react';
import { 
  validateTokenFormat, 
  getTokenData, 
  generateGuestToken, 
  canGenerateGuestToken,
  getGuestCooldownInfo,
  formatCooldownTime,
  getRateLimitInfo,
  updateRateLimit,
  TOKEN_CONFIG
} from '../utils/authUtils';

const TokenAuth = ({ onAuthSuccess, onAuthFailure }) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTokenList, setShowTokenList] = useState(false);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [guestCooldownInfo, setGuestCooldownInfo] = useState(null);
  
  // Rate limiting dari authUtils
  const [rateLimitInfo, setRateLimitInfo] = useState({ attempts: 0, isLocked: false });
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Update rate limit info on mount
  useEffect(() => {
    const updateRateLimitState = () => {
      const rateInfo = getRateLimitInfo();
      const now = Date.now();
      
      if (rateInfo.isLocked) {
        const timeSinceLocked = now - rateInfo.lastAttempt;
        const lockoutRemaining = Math.max(0, (TOKEN_CONFIG.LOCKOUT_DURATION * 1000) - timeSinceLocked);
        
        if (lockoutRemaining > 0) {
          setLockoutTimeLeft(Math.ceil(lockoutRemaining / 1000));
          setRateLimitInfo({ ...rateInfo, isLocked: true });
        } else {
          // Lockout expired, reset
          sessionStorage.removeItem('mcgogo_rate_limit');
          setRateLimitInfo({ attempts: 0, isLocked: false });
          setLockoutTimeLeft(0);
        }
      } else {
        setRateLimitInfo(rateInfo);
      }
    };

    updateRateLimitState();
    
    // Update guest cooldown info
    setGuestCooldownInfo(getGuestCooldownInfo());
  }, []);

  // Lockout timer
  useEffect(() => {
    let timer;
    if (rateLimitInfo.isLocked && lockoutTimeLeft > 0) {
      timer = setInterval(() => {
        setLockoutTimeLeft(prev => {
          if (prev <= 1) {
            setRateLimitInfo({ attempts: 0, isLocked: false });
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitInfo.isLocked, lockoutTimeLeft]);

  // Update guest cooldown secara berkala
  useEffect(() => {
    const interval = setInterval(() => {
      setGuestCooldownInfo(getGuestCooldownInfo());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    
    if (rateLimitInfo.isLocked) {
      setError(`SISTEM TERKUNCI! Tunggu ${lockoutTimeLeft} detik`);
      return;
    }

    if (!token.trim()) {
      setError('TOKEN TIDAK BOLEH KOSONG!');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulasi delay validasi
    setTimeout(() => {
      try {
        // Validate token format first
        if (!validateTokenFormat(token)) {
          throw new Error('FORMAT TOKEN TIDAK VALID!');
        }

        // Get token data
        const tokenData = getTokenData(token);
        
        if (!tokenData) {
          throw new Error('TOKEN TIDAK DIKENALI!');
        }

        // Token valid - reset rate limit dan success
        updateRateLimit(true);
        setError('');
        setRateLimitInfo({ attempts: 0, isLocked: false });
        onAuthSuccess(token.toUpperCase(), tokenData);
        
      } catch (error) {
        // Token invalid - update rate limit
        const newRateInfo = updateRateLimit(false);
        setRateLimitInfo(newRateInfo);
        
        if (newRateInfo.isLocked) {
          setLockoutTimeLeft(TOKEN_CONFIG.LOCKOUT_DURATION);
          setError(`TERLALU BANYAK PERCOBAAN! SISTEM TERKUNCI ${TOKEN_CONFIG.LOCKOUT_DURATION} DETIK`);
        } else {
          setError(`${error.message} Percobaan ${newRateInfo.attempts}/${TOKEN_CONFIG.MAX_ATTEMPTS}`);
        }
        
        onAuthFailure();
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleGenerateGuestToken = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = generateGuestToken();
      setToken(result.token);
      setError('');
      
      // Show success message
      setError(`✅ GUEST TOKEN BERHASIL DIBUAT! Token akan expired dalam ${TOKEN_CONFIG.GUEST_SESSION_DURATION} menit.`);
      
      // Update cooldown info
      setGuestCooldownInfo(getGuestCooldownInfo());
      
    } catch (error) {
      setError(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSelect = (selectedToken) => {
    setToken(selectedToken);
    setShowTokenList(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level) => {
    const colors = {
      'admin': 'text-red-400',
      'user': 'text-blue-400',
      'guest': 'text-gray-400',
      'developer': 'text-purple-400',
      'premium': 'text-yellow-400'
    };
    return colors[level] || 'text-white';
  };

  // Get available tokens untuk display
  const getAvailableTokens = () => {
    const tokens = [];
    
    // Add static tokens
    Object.entries(TOKEN_CONFIG.TOKENS).forEach(([tokenKey, tokenData]) => {
      tokens.push({
        token: tokenKey,
        level: tokenData.user.level,
        description: tokenData.description
      });
    });
    
    return tokens;
  };

  const availableTokens = getAvailableTokens();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-cyan-900/20 to-pink-900/25 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-transparent animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      
      {/* Matrix-like scan lines */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none z-10" 
           style={{ animation: 'shimmer 3s ease-in-out infinite' }}></div>
      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none z-10" 
           style={{ animation: 'shimmer 4s ease-in-out infinite', animationDelay: '1s' }}></div>

      {/* Main Auth Container */}
      <div className="bg-black/40 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-8 max-w-md w-full relative shadow-2xl shadow-cyan-400/20 transform transition-all duration-500 hover:shadow-cyan-400/30">
        {/* Rainbow Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-t-2xl animate-shimmer"></div>
        
        {/* Lock Icon */}
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full mb-4">
            {rateLimitInfo.isLocked ? (
              <svg className="w-8 h-8 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-cyan-400 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1-3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            SISTEM KEAMANAN
          </h2>
          <p className="text-cyan-300/80 text-sm mt-2">
            Masukkan token akses untuk melanjutkan
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleTokenSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-cyan-300 text-sm font-bold">
                🔐 ACCESS TOKEN
              </label>
              <button
                type="button"
                onClick={() => setShowTokenList(!showTokenList)}
                className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors"
              >
                {showTokenList ? '👁️ SEMBUNYIKAN' : '👁️ LIHAT TOKEN'}
              </button>
            </div>
            
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={rateLimitInfo.isLocked || isLoading}
              className="w-full px-4 py-3 bg-black/40 border border-cyan-400/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/30 transition-all duration-300 disabled:opacity-50"
              placeholder="Masukkan token akses..."
              maxLength={50}
            />
          </div>

          {/* Available Tokens List */}
          {showTokenList && (
            <div className="bg-black/60 border border-cyan-400/20 rounded-lg p-4 max-h-48 overflow-y-auto">
              <h4 className="text-cyan-300 text-sm font-bold mb-3">📋 Token Tersedia:</h4>
              <div className="space-y-2">
                {availableTokens.map((tokenInfo, index) => (
                  <div 
                    key={index}
                    onClick={() => handleTokenSelect(tokenInfo.token)}
                    className="flex justify-between items-center p-2 bg-gray-500/10 hover:bg-cyan-500/10 rounded cursor-pointer transition-all group"
                  >
                    <div>
                      <code className="text-cyan-400 text-xs font-mono group-hover:text-cyan-300">
                        {tokenInfo.token}
                      </code>
                      <div className={`text-xs ${getLevelColor(tokenInfo.level)}`}>
                        {tokenInfo.level.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs max-w-32 truncate">
                      {tokenInfo.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guest Token Section */}
          <div className="bg-black/60 border border-cyan-400/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-cyan-300 text-sm font-bold">🔍 GUEST ACCESS</h4>
              <button
                type="button"
                onClick={() => setShowGuestOptions(!showGuestOptions)}
                className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors"
              >
                {showGuestOptions ? '▲' : '▼'}
              </button>
            </div>
            
            {showGuestOptions && (
              <div className="space-y-3 mt-3">
                <p className="text-cyan-300/70 text-xs">
                  Generate token guest untuk akses terbatas (30 menit)
                </p>
                
                {guestCooldownInfo && !guestCooldownInfo.canGenerate ? (
                  <div className="bg-orange-500/20 border border-orange-400/30 rounded p-2">
                    <div className="text-orange-400 text-xs font-bold">⏳ COOLDOWN AKTIF</div>
                    <div className="text-orange-300 text-xs mt-1">
                      Sisa waktu: {formatCooldownTime(guestCooldownInfo.timeLeft)}
                    </div>
                    <div className="text-orange-300/70 text-xs mt-1">
                      Device ID: {guestCooldownInfo.deviceId}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateGuestToken}
                    disabled={isLoading || rateLimitInfo.isLocked}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-sm py-2 px-4 rounded transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? '⏳ GENERATING...' : '🎫 GENERATE GUEST TOKEN'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className={`border rounded-lg p-3 text-sm animate-pulse ${
              error.includes('✅') 
                ? 'bg-green-500/20 border-green-400/30 text-green-300' 
                : 'bg-red-500/20 border-red-400/30 text-red-300'
            }`}>
              {error}
              {rateLimitInfo.isLocked && (
                <div className="mt-2 text-red-400 font-mono">
                  WAKTU TERSISA: {formatTime(lockoutTimeLeft)}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={rateLimitInfo.isLocked || isLoading || !token.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/30 focus:outline-none focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                MEMVERIFIKASI...
              </div>
            ) : rateLimitInfo.isLocked ? (
              `TERKUNCI - ${formatTime(lockoutTimeLeft)}`
            ) : (
              'AKSES SISTEM'
            )}
          </button>
        </form>

        {/* Security Info */}
        <div className="mt-6 text-center">
          <div className="text-cyan-300/60 text-xs">
            🛡️ SISTEM KEAMANAN AKTIF
          </div>
          <div className="text-cyan-300/40 text-xs mt-1">
            Percobaan: {rateLimitInfo.attempts}/{TOKEN_CONFIG.MAX_ATTEMPTS} | Status: {rateLimitInfo.isLocked ? 'TERKUNCI' : 'AKTIF'}
          </div>
          <div className="text-cyan-300/40 text-xs mt-1">
            Token Tersedia: {availableTokens.length} | Guest Cooldown: {guestCooldownInfo?.canGenerate ? 'READY' : 'ACTIVE'}
          </div>
        </div>

        {/* Quick Access untuk Development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
            <p className="text-yellow-300 text-xs text-center mb-2">
              💡 DEV MODE - TOKEN DEMO:
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {availableTokens.slice(0, 2).map((tokenInfo, index) => (
                <button
                  key={index}
                  onClick={() => setToken(tokenInfo.token)}
                  className="text-yellow-400 hover:text-yellow-300 text-xs underline transition-colors"
                >
                  {tokenInfo.token}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Token Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-500/10 border border-blue-400/20 rounded p-2">
            <div className="text-blue-400 text-xs font-bold">STATIC</div>
            <div className="text-blue-300 text-lg font-mono">{Object.keys(TOKEN_CONFIG.TOKENS).length}</div>
          </div>
          <div className="bg-green-500/10 border border-green-400/20 rounded p-2">
            <div className="text-green-400 text-xs font-bold">GUEST</div>
            <div className="text-green-300 text-lg font-mono">∞</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-400/20 rounded p-2">
            <div className="text-purple-400 text-xs font-bold">RATE</div>
            <div className="text-purple-300 text-lg font-mono">{rateLimitInfo.attempts}/3</div>
          </div>
        </div>
      </div>

      {/* CSS untuk animasi */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(100vw); opacity: 1; }
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );

  // Helper function untuk generate guest token
  async function handleGenerateGuestToken() {
    try {
      setIsLoading(true);
      setError('');
      
      const result = generateGuestToken();
      setToken(result.token);
      setError('');
      
      // Show success message
      setError(`✅ GUEST TOKEN BERHASIL DIBUAT! Token akan expired dalam ${TOKEN_CONFIG.GUEST_SESSION_DURATION} menit.`);
      
      // Update cooldown info
      setGuestCooldownInfo(getGuestCooldownInfo());
      
    } catch (error) {
      setError(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }
};

export default TokenAuth;