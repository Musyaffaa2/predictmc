// authUtils.js - Enhanced dengan Guest Token Generation

/**
 * Token configuration dan management
 */
export const TOKEN_CONFIG = {
  MAX_ATTEMPTS: 3,
  LOCKOUT_DURATION: 30, // seconds
  SESSION_WARNING_TIME: 5 * 60 * 1000, // 5 menit dalam milliseconds
  GUEST_COOLDOWN: 24 * 60 * 60 * 1000, // 24 jam dalam milliseconds
  GUEST_SESSION_DURATION: 30, // 30 menit untuk guest
  
  // Token definitions
  TOKENS: {
    'RUIIGACOR': {
      user: { 
        id: 'admin_001',
        name: 'Administrator', 
        level: 'admin', 
        permissions: ['all'],
        avatar: '👑'
      },
      duration: null, // No time limit
      description: 'Full admin access - unlimited session'
    },
    'USER-GACOR': {
      user: { 
        id: 'user_001',
        name: 'Regular User', 
        level: 'user', 
        permissions: ['basic', 'advanced'],
        avatar: '👤'
      },
      duration: null, // No time limit
      description: 'Regular user access - unlimited session'
    }
  }
};

/**
 * Generate unique device fingerprint
 */
const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
};

/**
 * Generate random string
 */
const generateRandomString = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Check if guest can generate token (cooldown check)
 */
export const canGenerateGuestToken = () => {
  try {
    const deviceId = generateDeviceFingerprint();
    const lastGenerated = localStorage.getItem(`mcgogo_guest_cooldown_${deviceId}`);
    
    if (!lastGenerated) return { canGenerate: true, timeLeft: 0 };
    
    const lastTime = parseInt(lastGenerated);
    const timePassed = Date.now() - lastTime;
    const timeLeft = TOKEN_CONFIG.GUEST_COOLDOWN - timePassed;
    
    return {
      canGenerate: timeLeft <= 0,
      timeLeft: Math.max(0, timeLeft),
      deviceId
    };
  } catch (error) {
    console.error('Error checking guest cooldown:', error);
    return { canGenerate: true, timeLeft: 0 };
  }
};

/**
 * Generate guest token
 */
export const generateGuestToken = () => {
  const cooldownCheck = canGenerateGuestToken();
  
  if (!cooldownCheck.canGenerate) {
    throw new Error(`Anda sudah menggunakan guest token hari ini. Coba lagi dalam ${formatCooldownTime(cooldownCheck.timeLeft)}`);
  }
  
  try {
    const timestamp = Date.now();
    const deviceId = cooldownCheck.deviceId || generateDeviceFingerprint();
    const randomString = generateRandomString();
    
    const guestToken = `GUEST-${timestamp}-${deviceId}-${randomString}`;
    
    // Save cooldown to localStorage
    localStorage.setItem(`mcgogo_guest_cooldown_${deviceId}`, timestamp.toString());
    
    // Log generation
    logSecurityEvent('GUEST_TOKEN_GENERATED', {
      deviceId,
      timestamp,
      token: guestToken.substring(0, 10) + '***'
    });
    
    return {
      token: guestToken,
      deviceId,
      generatedAt: timestamp
    };
  } catch (error) {
    console.error('Error generating guest token:', error);
    throw new Error('Gagal generate guest token. Silakan coba lagi.');
  }
};

/**
 * Get guest cooldown info
 */
export const getGuestCooldownInfo = () => {
  const cooldownCheck = canGenerateGuestToken();
  return {
    canGenerate: cooldownCheck.canGenerate,
    timeLeft: cooldownCheck.timeLeft,
    deviceId: cooldownCheck.deviceId || generateDeviceFingerprint()
  };
};

/**
 * Validate token format
 */
export const validateTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  if (token.length < 3 || token.length > 50) return false; // Increased max length for guest tokens
  // Only allow alphanumeric, dash, and underscore
  return /^[A-Z0-9\-_]+$/i.test(token);
};

/**
 * Get token data - dengan support untuk dynamic guest tokens
 */
export const getTokenData = (token) => {
  if (!validateTokenFormat(token)) return null;
  
  const upperToken = token.toUpperCase();
  
  // Check static tokens
  if (TOKEN_CONFIG.TOKENS[upperToken]) {
    return TOKEN_CONFIG.TOKENS[upperToken];
  }
  
  // Check dynamic guest tokens
  if (upperToken.startsWith('GUEST-')) {
    // Validate guest token format: GUEST-timestamp-deviceId-random
    const parts = upperToken.split('-');
    if (parts.length === 4 && parts[0] === 'GUEST') {
      const timestamp = parseInt(parts[1]);
      const deviceId = parts[2];
      
      // Validate timestamp (not older than 24 hours + session duration)
      const maxAge = TOKEN_CONFIG.GUEST_COOLDOWN + (TOKEN_CONFIG.GUEST_SESSION_DURATION * 60 * 1000);
      if (Date.now() - timestamp > maxAge) {
        return null; // Token too old
      }
      
      return {
        user: {
          id: `guest_${timestamp}`,
          name: 'Guest User',
          level: 'guest',
          permissions: ['basic'],
          avatar: '🔍'
        },
        duration: TOKEN_CONFIG.GUEST_SESSION_DURATION,
        description: `Generated guest access - ${TOKEN_CONFIG.GUEST_SESSION_DURATION} minutes session limit`,
        isGenerated: true,
        generatedAt: timestamp,
        deviceId
      };
    }
  }
  
  return null;
};

/**
 * Check if token is valid
 */
export const isValidToken = (token) => {
  return getTokenData(token) !== null;
};

/**
 * Generate session data
 */
export const generateSessionData = (token) => {
  const tokenData = getTokenData(token);
  if (!tokenData) return null;

  const now = Date.now();
  const expiry = tokenData.duration ? now + (tokenData.duration * 60 * 1000) : null;

  return {
    token: token.toUpperCase(),
    user: tokenData.user,
    loginTime: now,
    expiry,
    duration: tokenData.duration,
    description: tokenData.description,
    hasTimeLimit: tokenData.duration !== null,
    isGenerated: tokenData.isGenerated || false
  };
};

/**
 * Check session validity
 */
export const isSessionValid = (sessionData) => {
  if (!sessionData) return false;
  
  // Jika tidak ada expiry (admin/user), selalu valid
  if (!sessionData.expiry) return true;
  
  // Jika ada expiry (guest), cek waktu
  return Date.now() < sessionData.expiry;
};

/**
 * Get remaining session time
 */
export const getSessionTimeLeft = (sessionData) => {
  if (!sessionData) return 0;
  
  // Jika tidak ada expiry (admin/user), return -1 sebagai indikator unlimited
  if (!sessionData.expiry) return -1;
  
  // Jika ada expiry (guest), hitung sisa waktu
  return Math.max(0, sessionData.expiry - Date.now());
};

/**
 * Format time untuk display (termasuk cooldown)
 */
export const formatSessionTime = (milliseconds) => {
  // Jika -1, berarti unlimited
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

/**
 * Format cooldown time untuk display
 */
export const formatCooldownTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} jam ${minutes} menit`;
  }
  if (minutes > 0) {
    return `${minutes} menit`;
  }
  return `${totalSeconds} detik`;
};

/**
 * Permission checker
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission) || user.permissions.includes('all');
};

/**
 * Get user level color
 */
export const getUserLevelColor = (level) => {
  const colors = {
    'admin': 'text-red-400',
    'user': 'text-blue-400',
    'guest': 'text-gray-400'
  };
  return colors[level] || 'text-white';
};

/**
 * Get permission badge color
 */
export const getPermissionColor = (permission) => {
  const colors = {
    'all': 'bg-red-500/20 text-red-400 border-red-400/30',
    'advanced': 'bg-blue-500/20 text-blue-400 border-blue-400/30',
    'basic': 'bg-green-500/20 text-green-400 border-green-400/30'
  };
  return colors[permission] || 'bg-gray-500/20 text-gray-400 border-gray-400/30';
};

/**
 * Check if user needs session warning (hanya untuk guest)
 */
export const needsSessionWarning = (sessionData) => {
  if (!sessionData || !sessionData.hasTimeLimit) return false;
  
  const timeLeft = getSessionTimeLeft(sessionData);
  return timeLeft > 0 && timeLeft <= TOKEN_CONFIG.SESSION_WARNING_TIME;
};

/**
 * Security log (untuk development/debug)
 */
export const logSecurityEvent = (event, data = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SECURITY] ${event}:`, {
      timestamp: new Date().toISOString(),
      ...data
    });
  }
};

/**
 * Clean expired sessions dari storage
 */
export const cleanExpiredSessions = () => {
  try {
    const stored = sessionStorage.getItem('mcgogo_auth');
    if (stored) {
      const sessionData = JSON.parse(stored);
      if (!isSessionValid(sessionData)) {
        sessionStorage.removeItem('mcgogo_auth');
        logSecurityEvent('SESSION_EXPIRED_CLEANED');
      }
    }
  } catch (error) {
    console.error('Error cleaning expired sessions:', error);
    sessionStorage.removeItem('mcgogo_auth');
  }
};

/**
 * Clean expired guest cooldowns (cleanup function)
 */
export const cleanExpiredGuestCooldowns = () => {
  try {
    const keys = Object.keys(localStorage);
    const guestKeys = keys.filter(key => key.startsWith('mcgogo_guest_cooldown_'));
    
    guestKeys.forEach(key => {
      const timestamp = localStorage.getItem(key);
      if (timestamp) {
        const timePassed = Date.now() - parseInt(timestamp);
        if (timePassed > TOKEN_CONFIG.GUEST_COOLDOWN) {
          localStorage.removeItem(key);
          logSecurityEvent('GUEST_COOLDOWN_CLEANED', { key });
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning guest cooldowns:', error);
  }
};

/**
 * Encrypt/Decrypt token (basic obfuscation)
 */
export const obfuscateToken = (token) => {
  return btoa(token).split('').reverse().join('');
};

export const deobfuscateToken = (obfuscated) => {
  try {
    return atob(obfuscated.split('').reverse().join(''));
  } catch {
    return null;
  }
};

/**
 * Rate limiting untuk login attempts
 */
export const getRateLimitInfo = () => {
  const stored = sessionStorage.getItem('mcgogo_rate_limit');
  if (!stored) return { attempts: 0, lastAttempt: 0, isLocked: false };
  
  try {
    return JSON.parse(stored);
  } catch {
    return { attempts: 0, lastAttempt: 0, isLocked: false };
  }
};

export const updateRateLimit = (success = false) => {
  const current = getRateLimitInfo();
  const now = Date.now();
  
  if (success) {
    // Reset pada login berhasil
    sessionStorage.removeItem('mcgogo_rate_limit');
    return { attempts: 0, lastAttempt: now, isLocked: false };
  }
  
  const newData = {
    attempts: current.attempts + 1,
    lastAttempt: now,
    isLocked: current.attempts + 1 >= TOKEN_CONFIG.MAX_ATTEMPTS
  };
  
  sessionStorage.setItem('mcgogo_rate_limit', JSON.stringify(newData));
  return newData;
};