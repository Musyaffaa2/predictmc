import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  generateSessionData, 
  isSessionValid, 
  hasPermission as checkPermission,
  cleanExpiredSessions,
  cleanExpiredGuestCooldowns,
  logSecurityEvent,
  getTokenData
} from '../utils/authUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [currentToken, setCurrentToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        cleanExpiredSessions();
        cleanExpiredGuestCooldowns(); // Clean up expired guest cooldowns
        const stored = sessionStorage.getItem('mcgogo_auth');
        
        if (stored) {
          const session = JSON.parse(stored);
          
          if (isSessionValid(session)) {
            setSessionData(session);
            setUser(session.user);
            setCurrentToken(session.token);
            setIsAuthenticated(true);
            logSecurityEvent('SESSION_RESTORED', { 
              userId: session.user.id,
              level: session.user.level,
              isGenerated: session.isGenerated || false
            });
          } else {
            // Session expired
            sessionStorage.removeItem('mcgogo_auth');
            logSecurityEvent('SESSION_EXPIRED_ON_LOAD');
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        sessionStorage.removeItem('mcgogo_auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Session expiry checker (hanya untuk guest)
  useEffect(() => {
    if (!isAuthenticated || !sessionData || !sessionData.hasTimeLimit) return;

    const checkSession = () => {
      if (!isSessionValid(sessionData)) {
        logout();
        logSecurityEvent('SESSION_EXPIRED_AUTO_LOGOUT', {
          isGenerated: sessionData.isGenerated || false
        });
      }
    };

    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, sessionData]);

  const login = async (token, providedTokenData = null) => {
    try {
      setIsLoading(true);
      
      // Validate token format first
      if (!token || typeof token !== 'string') {
        throw new Error('Token tidak valid');
      }

      let tokenData;
      
      if (providedTokenData) {
        // Use provided token data (untuk dynamic guest tokens)
        tokenData = providedTokenData;
      } else {
        // Get token data from configuration
        tokenData = getTokenData(token);
        if (!tokenData) {
          throw new Error('Token tidak dikenali');
        }
      }

      // Generate session
      const session = {
        token: token.toUpperCase(),
        user: tokenData.user,
        loginTime: Date.now(),
        expiry: tokenData.duration ? Date.now() + (tokenData.duration * 60 * 1000) : null,
        duration: tokenData.duration,
        description: tokenData.description,
        hasTimeLimit: tokenData.duration !== null,
        isGenerated: tokenData.isGenerated || false
      };

      // Save session
      sessionStorage.setItem('mcgogo_auth', JSON.stringify(session));
      
      // Update state
      setSessionData(session);
      setUser(session.user);
      setCurrentToken(session.token);
      setIsAuthenticated(true);

      logSecurityEvent('LOGIN_SUCCESS', {
        userId: session.user.id,
        level: session.user.level,
        hasTimeLimit: session.hasTimeLimit,
        duration: session.duration,
        isGenerated: session.isGenerated
      });

      return { success: true };
    } catch (error) {
      logSecurityEvent('LOGIN_FAILED', { 
        error: error.message,
        token: token?.substring(0, 4) + '***'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      const wasGenerated = sessionData?.isGenerated || false;
      
      sessionStorage.removeItem('mcgogo_auth');
      setIsAuthenticated(false);
      setUser(null);
      setSessionData(null);
      setCurrentToken('');
      
      logSecurityEvent('LOGOUT', {
        userId: user?.id,
        level: user?.level,
        wasGenerated
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const hasPermission = (permission) => {
    return checkPermission(user, permission);
  };

  const getSessionTimeLeft = () => {
    if (!sessionData) return 0;
    if (!sessionData.expiry) return -1; // Unlimited
    return Math.max(0, sessionData.expiry - Date.now());
  };

  const extendGuestSession = () => {
    // Feature untuk extend guest session (future implementation)
    if (!sessionData || sessionData.user.level !== 'guest') {
      return { success: false, message: 'Hanya guest session yang bisa diperpanjang' };
    }
    
    // For now, just show message
    return { 
      success: false, 
      message: 'Fitur extend session akan segera tersedia! Silakan generate token baru setelah cooldown.' 
    };
  };

  const value = {
    isAuthenticated,
    user,
    currentToken,
    sessionData,
    isLoading,
    login,
    logout,
    hasPermission,
    getSessionTimeLeft,
    extendGuestSession
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mb-4 mx-auto"></div>
          <div className="text-cyan-400 font-bold">LOADING SYSTEM...</div>
          <div className="text-cyan-300/60 text-sm mt-2">Initializing secure session...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};