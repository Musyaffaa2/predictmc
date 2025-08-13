import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import TokenInputModal from './TokenInputModal';
import EnhancedBackground from './EnhancedBackground';
import Animations from '../styles/Animations';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Jika sudah authenticated, jangan render login page
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
      {/* Import CSS Animations */}
      <Animations />
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-cyan-900/20 to-pink-900/25 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-transparent animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 via-transparent to-pink-500/10 animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>
      
      {/* Enhanced Background */}
      <EnhancedBackground />
      
      {/* Matrix Scan Lines */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none z-10" 
           style={{ animation: 'shimmer 3s ease-in-out infinite' }}></div>
      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none z-10" 
           style={{ animation: 'shimmer 4s ease-in-out infinite', animationDelay: '1s' }}></div>
      
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative shadow-2xl shadow-cyan-400/10 max-w-lg w-full">
            
            {/* Rainbow Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-t-3xl animate-shimmer"></div>
            
            {/* Security Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 rounded-lg px-3 py-1 text-xs">
              <span className="text-green-400">🔒 SECURED ACCESS</span>
            </div>

            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-pulse">🎮</div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 animate-fade-in-up">
                PREDICT MUSUH
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                MCGOGO
              </h2>
              <p className="text-cyan-300/70 text-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                [ DEVELOPED BY RUII DEWA MC ]
              </p>
            </div>

            {/* Access Description */}
            <div className="bg-black/40 border border-cyan-400/30 rounded-xl p-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-cyan-400 font-bold mb-2 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                SISTEM AKSES TOKEN
              </h3>
              <div className="text-cyan-300/80 text-sm space-y-1">
                <div>• Masukkan token untuk mengakses semua fitur</div>
                <div>• Berbagai level akses: Basic, Premium, Admin</div>
                <div>• Session otomatis dengan durasi sesuai token</div>
                <div>• Keamanan terjamin dengan rate limiting</div>
              </div>
            </div>

            {/* Access Button */}
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <button
                onClick={() => setShowTokenInput(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-400/30 relative overflow-hidden group"
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative flex items-center justify-center space-x-3">
                  <i className="fas fa-key text-xl"></i>
                  <span className="text-xl">INPUT TOKEN ACCESS</span>
                </span>
              </button>
            </div>

            {/* Features Preview */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3 text-center">
                <div className="text-purple-400 text-2xl mb-2">🎯</div>
                <div className="text-purple-300 text-sm font-bold">Prediksi Akurat</div>
                <div className="text-purple-300/70 text-xs">AI-powered predictions</div>
              </div>
              
              <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 text-center">
                <div className="text-cyan-400 text-2xl mb-2">🚀</div>
                <div className="text-cyan-300 text-sm font-bold">Mode Advanced</div>
                <div className="text-cyan-300/70 text-xs">Premium features</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
              <p className="text-gray-400 text-xs">
                Butuh token akses? Hubungi administrator
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Token Input Modal */}
      <TokenInputModal
        isOpen={showTokenInput}
        onClose={() => setShowTokenInput(false)}
      />
    </div>
  );
};

export default LoginPage;