import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import TokenManager from './TokenManager';

const AdminPanel = ({ onClose }) => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('tokens');
  const [showTokenManager, setShowTokenManager] = useState(false);
  const [stats, setStats] = useState({
    totalTokens: 0,
    activeTokens: 0,
    totalUsers: 0,
    activeSessions: 0
  });

  // Load statistics
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    try {
      // Custom tokens stats
      const customTokens = JSON.parse(localStorage.getItem('mcgogo_custom_tokens') || '[]');
      const activeCustomTokens = customTokens.filter(t => t.isActive);
      
      // Session stats
      const activeSession = sessionStorage.getItem('mcgogo_auth') ? 1 : 0;
      
      setStats({
        totalTokens: customTokens.length + 3, // 3 default tokens
        activeTokens: activeCustomTokens.length + 3,
        totalUsers: customTokens.length + 3,
        activeSessions: activeSession
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const tabs = [
    { id: 'tokens', name: 'Token Manager', icon: '🔑', permission: 'all' },
    { id: 'sessions', name: 'Active Sessions', icon: '👥', permission: 'all' },
    { id: 'logs', name: 'Security Logs', icon: '📊', permission: 'all' },
    { id: 'settings', name: 'Settings', icon: '⚙️', permission: 'all' }
  ];

  const handleTokenManagerOpen = () => {
    setShowTokenManager(true);
  };

  const handleTokenManagerClose = () => {
    setShowTokenManager(false);
    loadStats(); // Refresh stats when token manager closes
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tokens':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">🔑 TOKEN MANAGEMENT</h3>
            
            {/* Token Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4 text-center">
                <div className="text-cyan-400 text-2xl font-bold">{stats.totalTokens}</div>
                <div className="text-cyan-300/70 text-sm">Total Tokens</div>
              </div>
              <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 text-center">
                <div className="text-green-400 text-2xl font-bold">{stats.activeTokens}</div>
                <div className="text-green-300/70 text-sm">Active Tokens</div>
              </div>
            </div>

            {/* Token Manager Button */}
            <div className="text-center">
              <button
                onClick={handleTokenManagerOpen}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <i className="fas fa-cog mr-2"></i>
                BUKA TOKEN MANAGER
              </button>
            </div>

            {/* Quick Token Info */}
            <div className="bg-black/40 border border-cyan-400/30 rounded-xl p-4">
              <h4 className="text-cyan-400 font-bold mb-3">Quick Token Overview</h4>
              <div className="text-gray-300 text-sm space-y-2">
                <div>• Default tokens: DEVELOPER, CYBER, GUEST</div>
                <div>• Custom tokens: {stats.totalTokens - 3}</div>
                <div>• Manage tokens untuk create, edit, delete custom tokens</div>
              </div>
            </div>
          </div>
        );
        
      case 'sessions':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">👥 ACTIVE SESSIONS</h3>
            <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🟢</div>
              <div className="text-green-400 font-bold text-xl">{stats.activeSessions}</div>
              <div className="text-green-300 text-sm">Active Sessions</div>
            </div>
            
            {/* Session details */}
            <div className="bg-black/40 border border-cyan-400/30 rounded-xl p-4">
              <h4 className="text-cyan-400 font-bold mb-2">Current Session</h4>
              <div className="text-gray-300 text-sm space-y-1">
                <div>User: {user?.name}</div>
                <div>Level: {user?.level}</div>
                <div>Login Time: {new Date().toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>
        );
        
      case 'logs':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">📊 SECURITY LOGS</h3>
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">📋</div>
              <div className="text-blue-400">Security logging akan tersedia di versi berikutnya</div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">⚙️ SYSTEM SETTINGS</h3>
            
            {/* Security Settings */}
            <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
              <h4 className="text-purple-400 font-bold mb-3">Security Configuration</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Max Login Attempts</span>
                  <span className="text-cyan-400 font-mono">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Lockout Duration</span>
                  <span className="text-cyan-400 font-mono">30 seconds</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Session Warning</span>
                  <span className="text-cyan-400 font-mono">5 minutes</span>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4">
              <h4 className="text-yellow-400 font-bold mb-3">System Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">App Version</span>
                  <span className="text-cyan-400">v2.0.0-auth</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Auth System</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Storage</span>
                  <span className="text-cyan-400">localStorage + sessionStorage</span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
              <h4 className="text-red-400 font-bold mb-3">⚠️ DANGER ZONE</h4>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (confirm('PERINGATAN!\n\nIni akan menghapus SEMUA token custom dan session aktif!\n\nLanjutkan?')) {
                      localStorage.removeItem('mcgogo_custom_tokens');
                      sessionStorage.removeItem('mcgogo_auth');
                      sessionStorage.removeItem('mcgogo_rate_limit');
                      alert('Semua data authentication telah dihapus!');
                      window.location.reload();
                    }
                  }}
                  className="bg-red-500/20 text-red-400 px-4 py-2 rounded border border-red-400/30 hover:bg-red-500/30 transition-all text-sm"
                >
                  🗑️ RESET ALL AUTH DATA
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!hasPermission('all')) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-black/80 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
          <div className="text-red-400 text-4xl mb-4">
            <i className="fas fa-ban"></i>
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-2">AKSES DITOLAK</h3>
          <p className="text-red-300/80 mb-4">Hanya admin yang dapat mengakses Admin Panel</p>
          <button
            onClick={() => {
              console.log('Admin panel access denied close clicked');
              onClose?.();
            }}
            className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-400/30 hover:bg-red-500/30 transition-all"
          >
            TUTUP
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-black/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-cyan-400/30 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400">ADMIN CONTROL PANEL</h2>
                  <p className="text-cyan-300/70 text-sm">Welcome, {user?.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  console.log('Admin panel close clicked');
                  onClose?.();
                }}
                className="text-red-400 hover:text-red-300 text-xl transition-colors bg-red-500/20 hover:bg-red-500/30 rounded-lg w-10 h-10 flex items-center justify-center border border-red-400/30 cursor-pointer hover:scale-105 transform"
                type="button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="bg-black/30 border-b border-gray-400/20 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-cyan-400 font-bold text-xl">{stats.totalTokens}</div>
                <div className="text-cyan-300/70 text-xs">Total Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold text-xl">{stats.activeTokens}</div>
                <div className="text-green-300/70 text-xs">Active Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold text-xl">{stats.totalUsers}</div>
                <div className="text-purple-300/70 text-xs">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-xl">{stats.activeSessions}</div>
                <div className="text-yellow-300/70 text-xs">Active Sessions</div>
              </div>
            </div>
          </div>

          <div className="flex h-[calc(95vh-200px)]">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-black/40 border-r border-gray-400/20 p-4">
              <nav className="space-y-2">
                {tabs.map(tab => {
                  if (!hasPermission(tab.permission)) return null;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'tokens') {
                          setShowTokenManager(true);
                        } else {
                          setActiveTab(tab.id);
                          setShowTokenManager(false);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeTab === tab.id && !showTokenManager
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/10'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 space-y-2">
                <h4 className="text-gray-400 text-sm font-bold mb-3">QUICK ACTIONS</h4>
                <button
                  onClick={() => {
                    loadStats();
                    alert('Statistics refreshed!');
                  }}
                  className="w-full bg-blue-500/20 text-blue-400 px-3 py-2 rounded border border-blue-400/30 hover:bg-blue-500/30 transition-all text-sm"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  Refresh Stats
                </button>
                
                <button
                  onClick={() => {
                    const data = {
                      tokens: JSON.parse(localStorage.getItem('mcgogo_custom_tokens') || '[]'),
                      exportDate: new Date().toISOString(),
                      exportedBy: user.name
                    };
                    const dataStr = JSON.stringify(data, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `mcgogo_backup_${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full bg-green-500/20 text-green-400 px-3 py-2 rounded border border-green-400/30 hover:bg-green-500/30 transition-all text-sm"
                >
                  <i className="fas fa-save mr-2"></i>
                  Backup Data
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              {!showTokenManager ? (
                <div className="p-6">
                  {renderTabContent()}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Token Manager Modal - Rendered separately */}
      {showTokenManager && (
        <TokenManager onClose={handleTokenManagerClose} />
      )}
    </>
  );
};

export default AdminPanel;