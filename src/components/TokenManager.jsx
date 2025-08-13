import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  validateTokenFormat,
  TOKEN_CONFIG,
  logSecurityEvent 
} from '../utils/authUtils';

const TokenManager = ({ onClose }) => {
  const { user, hasPermission } = useAuth();
  const [tokens, setTokens] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingToken, setEditingToken] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form state untuk create/edit token
  const [formData, setFormData] = useState({
    token: '',
    userName: '',
    userLevel: 'guest',
    permissions: ['basic'],
    duration: 60,
    description: '',
    isActive: true
  });

  // Load tokens saat component mount
  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = () => {
    try {
      const storedTokens = JSON.parse(localStorage.getItem('mcgogo_custom_tokens') || '[]');
      setTokens(storedTokens);
    } catch (error) {
      console.error('Error loading tokens:', error);
      setTokens([]);
    }
  };

  const saveTokens = (newTokens) => {
    try {
      localStorage.setItem('mcgogo_custom_tokens', JSON.stringify(newTokens));
      setTokens(newTokens);
      logSecurityEvent('TOKENS_UPDATED', { count: newTokens.length });
    } catch (error) {
      console.error('Error saving tokens:', error);
      showNotification('Gagal menyimpan token!', 'error');
    }
  };

  const generateRandomToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const prefix = formData.userLevel.toUpperCase().slice(0, 3);
    const random = Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${prefix}-${random}`;
  };

  const handleCreateToken = () => {
    if (!hasPermission('all')) {
      showNotification('Hanya admin yang dapat membuat token!', 'error');
      return;
    }

    // Auto-generate token if empty
    if (!formData.token.trim()) {
      formData.token = generateRandomToken();
    }

    // Validate token format
    if (!validateTokenFormat(formData.token)) {
      showNotification('Format token tidak valid! Hanya huruf, angka, dash (-), dan underscore (_)', 'error');
      return;
    }

    if (!formData.userName.trim()) {
      showNotification('Nama user harus diisi!', 'error');
      return;
    }

    // Check if token already exists (excluding current editing token)
    const existingToken = tokens.find(t => 
      t.token.toUpperCase() === formData.token.toUpperCase() && 
      (!editingToken || t.id !== editingToken.id)
    );
    
    if (existingToken) {
      showNotification('Token sudah ada! Gunakan token lain.', 'error');
      return;
    }

    // Check against static tokens from TOKEN_CONFIG
    const staticTokens = Object.keys(TOKEN_CONFIG.TOKENS);
    if (staticTokens.includes(formData.token.toUpperCase())) {
      showNotification('Token konflik dengan token sistem! Gunakan token lain.', 'error');
      return;
    }

    const newToken = {
      id: editingToken?.id || Date.now().toString(),
      token: formData.token.toUpperCase(),
      user: {
        id: `custom_${Date.now()}`,
        name: formData.userName,
        level: formData.userLevel,
        permissions: formData.permissions,
        avatar: getLevelAvatar(formData.userLevel)
      },
      duration: formData.userLevel === 'guest' ? parseInt(formData.duration) : null,
      description: formData.description,
      isActive: formData.isActive,
      createdAt: editingToken?.createdAt || Date.now(),
      updatedAt: Date.now(),
      createdBy: user.name,
      usageCount: editingToken?.usageCount || 0
    };

    let updatedTokens;
    if (editingToken) {
      updatedTokens = tokens.map(t => t.id === editingToken.id ? newToken : t);
      showNotification('Token berhasil diupdate!', 'success');
      logSecurityEvent('TOKEN_UPDATED', { tokenId: editingToken.id });
    } else {
      updatedTokens = [...tokens, newToken];
      showNotification('Token berhasil dibuat!', 'success');
      logSecurityEvent('TOKEN_CREATED', { token: newToken.token });
    }

    saveTokens(updatedTokens);
    resetForm();
  };

  const handleEditToken = (token) => {
    setEditingToken(token);
    setFormData({
      token: token.token,
      userName: token.user.name,
      userLevel: token.user.level,
      permissions: token.user.permissions,
      duration: token.duration || 60,
      description: token.description,
      isActive: token.isActive
    });
    setShowCreateForm(true);
  };

  const handleDeleteToken = (tokenId) => {
    if (confirm('Yakin ingin menghapus token ini?')) {
      const updatedTokens = tokens.filter(t => t.id !== tokenId);
      saveTokens(updatedTokens);
      showNotification('Token berhasil dihapus!', 'warning');
      logSecurityEvent('TOKEN_DELETED', { tokenId });
    }
  };

  const handleToggleStatus = (tokenId) => {
    const updatedTokens = tokens.map(t => 
      t.id === tokenId ? { ...t, isActive: !t.isActive, updatedAt: Date.now() } : t
    );
    saveTokens(updatedTokens);
    showNotification('Status token diupdate!', 'info');
    logSecurityEvent('TOKEN_STATUS_CHANGED', { tokenId });
  };

  const resetForm = () => {
    setFormData({
      token: '',
      userName: '',
      userLevel: 'guest',
      permissions: ['basic'],
      duration: 60,
      description: '',
      isActive: true
    });
    setShowCreateForm(false);
    setEditingToken(null);
  };

  const getLevelAvatar = (level) => {
    const avatars = {
      'admin': '👑',
      'user': '👤', 
      'guest': '🔍'
    };
    return avatars[level] || '🔍';
  };

  const getLevelColor = (level) => {
    const colors = {
      'admin': 'text-red-400',
      'user': 'text-blue-400',
      'guest': 'text-gray-400'
    };
    return colors[level] || 'text-gray-400';
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePermissionChange = (permission) => {
    const updatedPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  // Auto-set permissions based on level
  useEffect(() => {
    const levelPermissions = {
      'admin': ['all'],
      'user': ['basic', 'advanced'], 
      'guest': ['basic']
    };
    
    if (levelPermissions[formData.userLevel]) {
      setFormData(prev => ({ 
        ...prev, 
        permissions: levelPermissions[formData.userLevel],
        // Reset duration jika bukan guest
        duration: formData.userLevel === 'guest' ? prev.duration : 60
      }));
    }
  }, [formData.userLevel]);

  if (!hasPermission('all')) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-black/80 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
          <div className="text-red-400 text-4xl mb-4">🚫</div>
          <h3 className="text-xl font-bold text-red-400 mb-2">AKSES DITOLAK</h3>
          <p className="text-red-300/80 mb-4">Hanya admin yang dapat mengakses Token Manager</p>
          <button
            onClick={onClose}
            className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-400/30 hover:bg-red-500/30 transition-all cursor-pointer hover:scale-105 transform"
          >
            TUTUP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-cyan-400/30 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-cyan-400">🔧 TOKEN MANAGER</h2>
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-300 text-xl transition-colors bg-red-500/20 hover:bg-red-500/30 rounded-lg w-10 h-10 flex items-center justify-center border border-red-400/30 cursor-pointer hover:scale-105 transform"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Notification */}
          {notification && (
            <div className={`mb-4 p-3 rounded-lg border ${
              notification.type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
              notification.type === 'error' ? 'bg-red-500/20 border-red-400/30 text-red-300' :
              notification.type === 'warning' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' :
              'bg-blue-500/20 border-blue-400/30 text-blue-300'
            }`}>
              {notification.message}
            </div>
          )}

          {/* System Tokens Info */}
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
            <h3 className="text-blue-400 font-bold mb-3">🏛️ SYSTEM TOKENS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(TOKEN_CONFIG.TOKENS).map(([tokenKey, tokenData]) => (
                <div key={tokenKey} className="bg-black/40 rounded-lg p-3 border border-blue-400/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{tokenData.user.avatar}</span>
                    <div>
                      <code className="text-blue-400 text-sm font-bold">{tokenKey}</code>
                      <div className={`text-xs ${getLevelColor(tokenData.user.level)}`}>
                        {tokenData.user.level.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-300 text-xs">{tokenData.description}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    Permissions: {tokenData.user.permissions.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105"
            >
              {showCreateForm ? '❌ BATAL' : '➕ BUAT CUSTOM TOKEN'}
            </button>
            
            <button
              onClick={loadTokens}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105"
            >
              🔄 REFRESH
            </button>

            <div className="text-cyan-300 text-sm flex items-center">
              📊 Custom Tokens: <span className="font-bold ml-1">{tokens.length}</span>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-purple-400 mb-4">
                {editingToken ? '✏️ EDIT CUSTOM TOKEN' : '➕ BUAT CUSTOM TOKEN'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Token Input */}
                <div>
                  <label className="block text-cyan-300 text-sm font-bold mb-2">Token</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.token}
                      onChange={(e) => setFormData({ ...formData, token: e.target.value.toUpperCase() })}
                      className="flex-1 px-3 py-2 bg-black/40 border border-cyan-400/30 rounded text-white text-sm"
                      placeholder="AUTO-GENERATE jika kosong"
                      maxLength={50}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, token: generateRandomToken() })}
                      className="bg-cyan-500/20 text-cyan-400 px-3 py-2 rounded border border-cyan-400/30 hover:bg-cyan-500/30 transition-all text-sm"
                    >
                      🎲
                    </button>
                  </div>
                </div>

                {/* User Name */}
                <div>
                  <label className="block text-cyan-300 text-sm font-bold mb-2">Nama User</label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-cyan-400/30 rounded text-white text-sm"
                    placeholder="Nama user..."
                    required
                  />
                </div>

                {/* User Level - FIXED: Hanya 3 level yang konsisten */}
                <div>
                  <label className="block text-cyan-300 text-sm font-bold mb-2">Level User</label>
                  <select
                    value={formData.userLevel}
                    onChange={(e) => setFormData({ ...formData, userLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-cyan-400/30 rounded text-white text-sm"
                  >
                    <option value="guest">🔍 Guest - Akses terbatas (30 menit)</option>
                    <option value="user">👤 User - Akses unlimited</option>
                    <option value="admin">👑 Admin - Akses penuh unlimited</option>
                  </select>
                </div>

                {/* Duration - Hanya untuk guest */}
                {formData.userLevel === 'guest' && (
                  <div>
                    <label className="block text-cyan-300 text-sm font-bold mb-2">Durasi (menit)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                      className="w-full px-3 py-2 bg-black/40 border border-cyan-400/30 rounded text-white text-sm"
                      min="5"
                      max="1440"
                    />
                  </div>
                )}
              </div>

              {/* Permissions - Auto-set berdasarkan level */}
              <div className="mt-4">
                <label className="block text-cyan-300 text-sm font-bold mb-2">Permissions (Auto-set)</label>
                <div className="flex flex-wrap gap-2">
                  {formData.permissions.map(permission => (
                    <span
                      key={permission}
                      className="px-3 py-1 bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 rounded-lg text-xs font-bold"
                    >
                      {permission.toUpperCase()}
                    </span>
                  ))}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  * Admin & User: Unlimited session | Guest: Session terbatas
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-cyan-300 text-sm font-bold mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-cyan-400/30 rounded text-white text-sm h-20 resize-none"
                  placeholder="Deskripsi token..."
                />
              </div>

              {/* Active Status */}
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-cyan-300 text-sm">Token Aktif</label>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCreateToken}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold py-2 px-6 rounded-lg transform transition-all duration-300 hover:scale-105"
                >
                  {editingToken ? '💾 UPDATE' : '✅ BUAT'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-2 px-6 rounded-lg transform transition-all duration-300 hover:scale-105"
                >
                  🚫 BATAL
                </button>
              </div>
            </div>
          )}

          {/* Custom Token List */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">📋 CUSTOM TOKENS</h3>
            
            {tokens.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">📝</div>
                <p>Belum ada custom token. Buat token pertama Anda!</p>
              </div>
            ) : (
              tokens.map((token) => (
                <div key={token.id} className={`bg-gradient-to-r ${
                  token.isActive ? 'from-green-500/10 to-cyan-500/10 border-green-400/30' : 'from-gray-500/10 to-gray-600/10 border-gray-400/30'
                } border rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    {/* Token Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{token.user.avatar}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <code className="bg-black/40 text-cyan-400 px-2 py-1 rounded text-sm font-bold">
                              {token.token}
                            </code>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              token.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {token.isActive ? 'AKTIF' : 'NONAKTIF'}
                            </span>
                          </div>
                          <div className="text-white font-bold">{token.user.name}</div>
                          <div className={`text-sm ${getLevelColor(token.user.level)}`}>
                            Level: {token.user.level.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {token.user.permissions.map(permission => (
                          <span
                            key={permission}
                            className={`px-2 py-1 rounded text-xs font-bold border ${
                              permission === 'all' ? 'bg-red-500/20 text-red-400 border-red-400/30' :
                              permission === 'advanced' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
                              'bg-green-500/20 text-green-400 border-green-400/30'
                            }`}
                          >
                            {permission}
                          </span>
                        ))}
                      </div>

                      {/* Description & Meta */}
                      {token.description && (
                        <p className="text-gray-300 text-sm mb-2">{token.description}</p>
                      )}
                      
                      <div className="text-gray-400 text-xs">
                        <div>Durasi: {token.duration ? `${token.duration} menit` : 'Unlimited'}</div>
                        <div>Dibuat: {new Date(token.createdAt).toLocaleString('id-ID')}</div>
                        <div>Digunakan: {token.usageCount} kali</div>
                        <div>Pembuat: {token.createdBy}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 mt-3 md:mt-0">
                      <button
                        onClick={() => handleEditToken(token)}
                        className="bg-blue-500/20 text-blue-400 px-3 py-2 rounded border border-blue-400/30 hover:bg-blue-500/30 transition-all text-sm"
                        title="Edit Token"
                      >
                        ✏️
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus(token.id)}
                        className={`px-3 py-2 rounded border transition-all text-sm ${
                          token.isActive 
                            ? 'bg-red-500/20 text-red-400 border-red-400/30 hover:bg-red-500/30' 
                            : 'bg-green-500/20 text-green-400 border-green-400/30 hover:bg-green-500/30'
                        }`}
                        title={token.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {token.isActive ? '🔒' : '🔓'}
                      </button>

                      <button
                        onClick={() => navigator.clipboard.writeText(token.token)}
                        className="bg-purple-500/20 text-purple-400 px-3 py-2 rounded border border-purple-400/30 hover:bg-purple-500/30 transition-all text-sm"
                        title="Copy Token"
                      >
                        📋
                      </button>
                      
                      <button
                        onClick={() => handleDeleteToken(token.id)}
                        className="bg-red-500/20 text-red-400 px-3 py-2 rounded border border-red-400/30 hover:bg-red-500/30 transition-all text-sm"
                        title="Hapus Token"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Export/Import */}
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => {
                const dataStr = JSON.stringify(tokens, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `mcgogo_custom_tokens_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
                showNotification('Custom tokens berhasil di-export!', 'success');
              }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 text-sm"
            >
              📥 EXPORT
            </button>
            
            <label className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 cursor-pointer text-sm">
              📤 IMPORT
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedTokens = JSON.parse(event.target.result);
                        if (Array.isArray(importedTokens)) {
                          // Validate imported tokens
                          const validTokens = importedTokens.filter(t => 
                            t.token && t.user && ['admin', 'user', 'guest'].includes(t.user.level)
                          );
                          saveTokens([...tokens, ...validTokens]);
                          showNotification(`${validTokens.length} token berhasil di-import!`, 'success');
                        }
                      } catch (error) {
                        showNotification('File JSON tidak valid!', 'error');
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>

            <button
              onClick={() => {
                if (confirm('Yakin ingin menghapus SEMUA custom tokens?')) {
                  saveTokens([]);
                  showNotification('Semua custom tokens berhasil dihapus!', 'warning');
                }
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-105 text-sm"
            >
              🗑️ HAPUS SEMUA
            </button>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3 text-center">
              <div className="text-blue-400 text-xs font-bold">SYSTEM</div>
              <div className="text-blue-300 text-lg font-mono">{Object.keys(TOKEN_CONFIG.TOKENS).length}</div>
            </div>
            <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-3 text-center">
              <div className="text-green-400 text-xs font-bold">CUSTOM</div>
              <div className="text-green-300 text-lg font-mono">{tokens.length}</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg p-3 text-center">
              <div className="text-purple-400 text-xs font-bold">AKTIF</div>
              <div className="text-purple-300 text-lg font-mono">{tokens.filter(t => t.isActive).length}</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-400/20 rounded-lg p-3 text-center">
              <div className="text-orange-400 text-xs font-bold">USAGE</div>
              <div className="text-orange-300 text-lg font-mono">{tokens.reduce((sum, t) => sum + (t.usageCount || 0), 0)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenManager;