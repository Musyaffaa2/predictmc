import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import AdminPanel from './AdminPanel';
import CyberButton from './CyberButton';
import { 
  canGenerateGuestToken, 
  generateGuestToken, 
  formatCooldownTime,
  cleanExpiredGuestCooldowns 
} from '../utils/authUtils';

const ActionButtons = ({ 
  showInstructions, 
  showAdvanced, 
  onToggleInstructions, 
  onToggleAdvanced, 
  onReset,
  onTokenInput,
  hasAdvancedPermission,
  isAuthenticated
}) => {
  const { hasPermission, user, logout, login } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Guest token generation states
  const [isGeneratingGuest, setIsGeneratingGuest] = useState(false);
  const [guestCooldownInfo, setGuestCooldownInfo] = useState({ canGenerate: true, timeLeft: 0 });

  // Check guest cooldown saat mount
  useEffect(() => {
    checkGuestCooldown();
    cleanExpiredGuestCooldowns(); // Cleanup expired cooldowns
  }, []);

  // Timer untuk guest cooldown countdown
  useEffect(() => {
    let timer;
    if (!guestCooldownInfo.canGenerate && guestCooldownInfo.timeLeft > 0) {
      timer = setInterval(() => {
        checkGuestCooldown();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [guestCooldownInfo]);

  const checkGuestCooldown = () => {
    const cooldownInfo = canGenerateGuestToken();
    setGuestCooldownInfo(cooldownInfo);
  };

  const handleLogout = () => {
    if (confirm('🔓 KONFIRMASI LOGOUT\n\nAnda yakin ingin keluar dari sistem?')) {
      logout();
    }
  };

  const handleActionWithAuthCheck = (action, actionName) => {
    if (!isAuthenticated) {
      onTokenInput();
      return;
    }
    action();
  };

  const handleGenerateGuestToken = async () => {
    setIsGeneratingGuest(true);

    try {
      // Check cooldown first
      const cooldownInfo = canGenerateGuestToken();
      if (!cooldownInfo.canGenerate) {
        throw new Error(`Anda sudah menggunakan guest token hari ini. Coba lagi dalam ${formatCooldownTime(cooldownInfo.timeLeft)}`);
      }

      // Generate token dengan loading effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      const guestTokenData = generateGuestToken();
      
      // Auto-login dengan generated token
      const tokenData = {
        user: {
          id: `guest_${guestTokenData.generatedAt}`,
          name: 'Guest User',
          level: 'guest',
          permissions: ['basic'],
          avatar: '🔍'
        },
        duration: 30,
        description: 'Generated guest access - 30 minutes session limit',
        isGenerated: true
      };

      await login(guestTokenData.token, tokenData);
      
    } catch (error) {
      // Handle error silently or show notification
      console.error('Guest token generation error:', error.message);
      checkGuestCooldown(); // Refresh cooldown info
    } finally {
      setIsGeneratingGuest(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center mb-6 md:mb-8 gap-2 md:gap-4 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        
        {/* Token Input Button - Prominence berbeda untuk guest vs authenticated */}
        <CyberButton
          onClick={onTokenInput}
          variant={isAuthenticated ? "green" : "cyan"}
          className={!isAuthenticated ? "animate-pulse ring-2 ring-cyan-400/50" : ""}
        >
          <i className="fas fa-key mr-1 md:mr-2"></i>
          {isAuthenticated ? 'GANTI TOKEN' : 'INPUT TOKEN'}
        </CyberButton>

        {/* Generate Guest Token Button - hanya muncul jika belum authenticated */}
        {!isAuthenticated && (
          <CyberButton
            onClick={handleGenerateGuestToken}
            variant="purple"
            disabled={isGeneratingGuest || !guestCooldownInfo.canGenerate}
            title={
              !guestCooldownInfo.canGenerate 
                ? `Cooldown: ${formatCooldownTime(guestCooldownInfo.timeLeft)} tersisa`
                : 'Generate guest token untuk akses 30 menit'
            }
            className={guestCooldownInfo.canGenerate ? "animate-pulse ring-2 ring-purple-400/30" : ""}
          >
            {isGeneratingGuest ? (
              <>
                <i className="fas fa-cog animate-spin mr-1 md:mr-2"></i>
                GENERATING...
              </>
            ) : !guestCooldownInfo.canGenerate ? (
              <>
                <i className="fas fa-clock mr-1 md:mr-2"></i>
                COOLDOWN
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-1 md:mr-2"></i>
                GUEST ACCESS
              </>
            )}
          </CyberButton>
        )}

        {/* Manual System Button */}
        <CyberButton
          onClick={onToggleInstructions}
          variant="cyan"
        >
          <i className="fas fa-info-circle mr-1 md:mr-2"></i>
          {showInstructions ? 'TUTUP MANUAL' : 'MANUAL SISTEM'}
        </CyberButton>

        {/* Advanced Mode Button - dengan auth dan permission check */}
        <CyberButton
          onClick={() => handleActionWithAuthCheck(onToggleAdvanced, 'Advanced Mode')}
          variant="purple"
          disabled={isAuthenticated && !hasAdvancedPermission}
          title={
            !isAuthenticated ? 'Butuh token untuk mengakses fitur ini' :
            !hasAdvancedPermission ? 'Butuh permission advanced untuk mengakses fitur ini' : ''
          }
        >
          <i className="fas fa-rocket mr-1 md:mr-2"></i>
          {showAdvanced ? 'MODE BASIC' : 'MODE ADVANCED'}
          {!isAuthenticated && <i className="fas fa-lock ml-1"></i>}
          {isAuthenticated && !hasAdvancedPermission && <i className="fas fa-lock ml-1"></i>}
        </CyberButton>

        {/* Admin Panel Button - hanya untuk admin yang authenticated */}
        {isAuthenticated && hasPermission('all') && (
          <CyberButton
            onClick={() => setShowAdminPanel(true)}
            variant="yellow"
          >
            <i className="fas fa-cog mr-1 md:mr-2"></i>
            ADMIN PANEL
          </CyberButton>
        )}

        {/* Reset Button - dengan auth check */}
        <CyberButton
          onClick={() => handleActionWithAuthCheck(onReset, 'Reset')}
          variant="pink"
        >
          <i className="fas fa-power-off mr-1 md:mr-2"></i>
          RESET SISTEM
          {!isAuthenticated && <i className="fas fa-lock ml-1"></i>}
        </CyberButton>

        {/* Logout Button - hanya muncul jika authenticated */}
        {isAuthenticated && (
          <CyberButton
            onClick={handleLogout}
            variant="red"
          >
            <i className="fas fa-sign-out-alt mr-1 md:mr-2"></i>
            LOGOUT
          </CyberButton>
        )}
      </div>

      {/* User Status Info - Enhanced */}
      <div className="flex justify-center mb-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <div className="bg-black/60 backdrop-blur-md border border-cyan-400/30 rounded-lg px-4 py-2 text-sm">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{user.avatar}</span>
              <div>
                <div className="text-cyan-300 font-bold">{user.name}</div>
                <div className="text-cyan-400/70 text-xs">{user.level?.toUpperCase()} ACCESS</div>
              </div>
              <div className="flex space-x-1">
                {user.permissions?.map((perm, idx) => (
                  <span 
                    key={idx}
                    className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs border border-cyan-400/30"
                  >
                    {perm.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👤</span>
              <div>
                <div className="text-gray-300 font-bold">Guest User</div>
                <div className="text-gray-400/70 text-xs">LIMITED ACCESS</div>
              </div>
              <div className="flex space-x-1">
                <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs border border-gray-400/30">
                  VIEW-ONLY
                </span>
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </>
  );
};

export default ActionButtons;