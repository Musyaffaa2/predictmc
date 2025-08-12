import React, { useState, useEffect } from 'react';

// Import semua komponen (sesuaikan path berdasarkan lokasi file)
import EnhancedBackground from './EnhancedBackground';
import Animations from '../styles/Animations';
import HudElements from './HudElements';
import Header from './Header';
import ActionButtons from './ActionButtons';
import InstructionsSection from './InstructionSection';
import UserInputSection from './UserInputSection';
import AdvancedMode from './AdvancedMode';
import RoundsTable from './RoundsTable';
import InfoAlerts from './InfoAlerts';
import Footer from './Footer';
import CyberNotification from './CybeNotification';

// Import logic dan data
import { 
  computeBasicPredictions, 
  computeAdvancedPredictions 
} from '../utils/predictionLogic';
import { advancedScenarios } from '../data/advancedScenarios';

const PredictMusuhMcgogo = () => {
  // State management
  const [userName, setUserName] = useState('');
  const [p8Name, setP8Name] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [rounds, setRounds] = useState([
    { round: 1, userVs: '', p8Vs: '' },
    { round: 2, userVs: '', p8Vs: '' },
    { round: 3, userVs: '', p8Vs: '' },
    { round: 4, userVs: '', p8Vs: '' },
    { round: 5, userVs: '', p8Vs: '' },
    { round: 6, userVs: '', p8Vs: '' },
    { round: 7, userVs: '', p8Vs: '' }
  ]);

  // Load animasi saat komponen mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Update rounds setiap kali ada perubahan
  useEffect(() => {
    const basicRounds = computeBasicPredictions(rounds, userName, p8Name);
    setRounds(basicRounds);
  }, [userName, p8Name]);

  // Notification handler
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Event handlers
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    if (e.target.value.trim()) {
      showNotification('USER NICKNAME LOCKED', 'info');
    }
  };

  const handleP8NameChange = (e) => {
    setP8Name(e.target.value);
    if (e.target.value.trim()) {
      showNotification('MUSUH PERTAMA LOCKED', 'success');
    }
  };

  const handleRoundChange = (index, field, value) => {
    const newRounds = [...rounds];
    newRounds[index][field] = value;
    setRounds(newRounds);
    
    // Recompute predictions
    setTimeout(() => {
      const basicRounds = computeBasicPredictions(newRounds, userName, p8Name);
      setRounds(basicRounds);
    }, 50);
    
    showNotification(`ROUND ${index + 1} UPDATED`, 'info');
  };

  const handleReset = () => {
    if (confirm('⚠️ KONFIRMASI RESET SISTEM ⚠️\n\nSemua data akan dihapus. Lanjutkan operasi reset?')) {
      setUserName('');
      setP8Name('');
      setShowInstructions(false);
      setShowAdvanced(false);
      setSelectedScenario('');
      setRounds([
        { round: 1, userVs: '', p8Vs: '' },
        { round: 2, userVs: '', p8Vs: '' },
        { round: 3, userVs: '', p8Vs: '' },
        { round: 4, userVs: '', p8Vs: '' },
        { round: 5, userVs: '', p8Vs: '' },
        { round: 6, userVs: '', p8Vs: '' },
        { round: 7, userVs: '', p8Vs: '' }
      ]);
      showNotification('SISTEM BERHASIL DIRESET', 'warning');
    }
  };

  const handleAdvancedMode = () => {
    if (!showAdvanced && (!userName.trim() || !p8Name.trim())) {
      showNotification('LENGKAPI DATA DASAR TERLEBIH DAHULU', 'warning');
      return;
    }
    setShowAdvanced(!showAdvanced);
    if (!showAdvanced) {
      showNotification('MODE ADVANCED DIAKTIFKAN', 'success');
    }
  };

  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    showNotification(`SKENARIO ${advancedScenarios[scenario].name.toUpperCase()} DIPILIH`, 'info');
  };

  // Gabungkan rounds dasar dengan advanced
  const allRounds = showAdvanced && selectedScenario ? 
    [...rounds, ...computeAdvancedPredictions(rounds, selectedScenario)] : rounds;

  return (
    <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
      {/* Import CSS Animations */}
      <Animations />
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-cyan-900/20 to-pink-900/25 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-transparent animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 via-transparent to-pink-500/10 animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>
      
      {/* Enhanced Background with all effects */}
      <EnhancedBackground />
      
      {/* Multiple scan lines for matrix effect */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none z-10" 
           style={{ animation: 'shimmer 3s ease-in-out infinite' }}></div>
      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none z-10" 
           style={{ animation: 'shimmer 4s ease-in-out infinite', animationDelay: '1s' }}></div>
      
      {/* Vertical scan lines */}
      <div className="fixed top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-pink-500 to-transparent pointer-events-none z-10 opacity-30" 
           style={{ animation: 'shimmer 5s ease-in-out infinite', animationDelay: '2s', transform: 'rotate(90deg)', transformOrigin: 'top left' }}></div>
      
      {/* HUD Elements */}
      <HudElements />
      
      {/* Notification */}
      {notification && (
        <CyberNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className={`container mx-auto px-2 md:px-4 py-4 md:py-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 relative shadow-2xl shadow-cyan-400/10 transform transition-all duration-500 hover:shadow-cyan-400/20 hover:shadow-3xl">
          {/* Rainbow Border dengan animasi */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-t-2xl md:rounded-t-3xl animate-shimmer"></div>
          
          {/* Header */}
          <Header />

          {/* Action Buttons */}
          <ActionButtons
            showInstructions={showInstructions}
            showAdvanced={showAdvanced}
            onToggleInstructions={() => setShowInstructions(!showInstructions)}
            onToggleAdvanced={handleAdvancedMode}
            onReset={handleReset}
          />

          {/* Instructions */}
          <InstructionsSection showInstructions={showInstructions} />

          {/* User Input Section */}
          <UserInputSection
            userName={userName}
            p8Name={p8Name}
            onUserNameChange={handleUserNameChange}
            onP8NameChange={handleP8NameChange}
          />

          {/* Advanced Mode Controls */}
          <AdvancedMode
            showAdvanced={showAdvanced}
            selectedScenario={selectedScenario}
            onScenarioChange={handleScenarioChange}
          />

          {/* Rounds Table */}
          <RoundsTable
            allRounds={allRounds}
            userName={userName}
            p8Name={p8Name}
            showAdvanced={showAdvanced}
            onRoundChange={handleRoundChange}
          />

          {/* Info Alerts */}
          <InfoAlerts
            showAdvanced={showAdvanced}
            selectedScenario={selectedScenario}
          />

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PredictMusuhMcgogo;