import React, { useState, useEffect } from 'react';

// Komponen untuk efek background yang lebih kompleks dan menarik
const EnhancedBackground = () => {
  const particles = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className="fixed rounded-full pointer-events-none z-0"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        background: `rgba(${Math.random() > 0.5 ? '6, 182, 212' : Math.random() > 0.5 ? '168, 85, 247' : '236, 72, 153'}, ${Math.random() * 0.8 + 0.2})`,
        animation: `float ${Math.random() * 12 + 15}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 10}s`,
      }}
    />
  ));

  // Floating geometric shapes
  const geometricShapes = Array.from({ length: 8 }, (_, i) => (
    <div
      key={`geo-${i}`}
      className="fixed pointer-events-none z-0 opacity-10"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 100 + 50}px`,
        height: `${Math.random() * 100 + 50}px`,
        border: `2px solid rgba(${Math.random() > 0.5 ? '6, 182, 212' : '168, 85, 247'}, 0.3)`,
        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
        animation: `geometricFloat ${Math.random() * 20 + 25}s linear infinite`,
        animationDelay: `${Math.random() * 15}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  ));

  // Digital rain effect
  const digitalRain = Array.from({ length: 15 }, (_, i) => (
    <div
      key={`rain-${i}`}
      className="fixed pointer-events-none z-0 font-mono text-green-400 opacity-20 text-xs"
      style={{
        left: `${Math.random() * 100}%`,
        top: '-50px',
        animation: `digitalRain ${Math.random() * 8 + 12}s linear infinite`,
        animationDelay: `${Math.random() * 10}s`,
      }}
    >
      {Array.from({ length: Math.floor(Math.random() * 10 + 5) }, (_, j) => (
        <div key={j} style={{ marginBottom: '10px' }}>
          {Math.random().toString(36).substring(2, 4)}
        </div>
      ))}
    </div>
  ));

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.3; 
          }
          25% { 
            transform: translateY(-30px) translateX(15px) rotate(90deg); 
            opacity: 0.8; 
          }
          50% { 
            transform: translateY(-15px) translateX(-20px) rotate(180deg); 
            opacity: 0.6; 
          }
          75% { 
            transform: translateY(-35px) translateX(10px) rotate(270deg); 
            opacity: 0.9; 
          }
        }

        @keyframes geometricFloat {
          0% { 
            transform: translateY(100vh) translateX(0px) rotate(0deg) scale(0.5); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.1; 
          }
          90% { 
            opacity: 0.1; 
          }
          100% { 
            transform: translateY(-100px) translateX(100px) rotate(360deg) scale(1.2); 
            opacity: 0; 
          }
        }

        @keyframes digitalRain {
          0% { 
            transform: translateY(-50px); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.3; 
          }
          90% { 
            opacity: 0.3; 
          }
          100% { 
            transform: translateY(100vh); 
            opacity: 0; 
          }
        }

        @keyframes slideInFromTop {
          from { transform: translateY(-100px); opacity: 0; }
          to { transform: translateY(0px); opacity: 1; }
        }

        @keyframes slideInFromRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0px); opacity: 1; }
        }

        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0px); opacity: 1; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(6, 182, 212, 0.5); }
          50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.8); }
        }

        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }

        @keyframes matrixScan {
          0% { transform: translateY(-100vh); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.3), 
                        0 0 20px rgba(168, 85, 247, 0.2),
                        0 0 30px rgba(236, 72, 153, 0.1); 
          }
          50% { 
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.6), 
                        0 0 40px rgba(168, 85, 247, 0.4),
                        0 0 60px rgba(236, 72, 153, 0.3); 
          }
        }

        .animate-slide-in-top { animation: slideInFromTop 0.8s ease-out; }
        .animate-slide-in-right { animation: slideInFromRight 0.6s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }

        /* Gradient overlay animations */
        .bg-animated-gradient {
          background: linear-gradient(45deg, #0f0f23, #1a0a2e, #16213e, #0f0f23);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Cyber grid effect */
        .cyber-grid {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>

      {/* Matrix scanning line */}
      <div 
        className="fixed left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none z-10 opacity-70"
        style={{ animation: 'matrixScan 8s ease-in-out infinite' }}
      />

      {/* Animated particles */}
      {particles}
      
      {/* Geometric shapes */}
      {geometricShapes}
      
      {/* Digital rain */}
      {digitalRain}

      {/* Cyber grid overlay */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />

      {/* Additional glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none z-0" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/2 right-1/3 w-24 h-24 bg-pink-500/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none z-0" style={{ animationDelay: '4s' }} />
    </>
  );
};

// Komponen HUD Elements dengan animasi masuk
const HudElements = () => (
  <>
    <div className="fixed top-5 left-5 font-mono text-cyan-400 text-sm opacity-70 hidden md:block animate-slide-in-top" style={{ animationDelay: '0.2s' }}>
      SYSTEM: ONLINE
    </div>
    <div className="fixed top-5 right-5 font-mono text-cyan-400 text-sm opacity-70 hidden md:block animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
      STATUS: ACTIVE
    </div>
    <div className="fixed bottom-5 left-5 font-mono text-cyan-400 text-sm opacity-70 hidden md:block animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      MODE: PREDICT
    </div>
    <div className="fixed bottom-5 right-5 font-mono text-cyan-400 text-sm opacity-70 hidden md:block animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
      VER: 3.0
    </div>
  </>
);

// Komponen Header dengan animasi yang lebih halus
const Header = () => (
  <div className="text-center mb-6 md:mb-10 animate-fade-in-up">
    <h1 className="font-mono text-2xl md:text-4xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 md:mb-4 leading-tight transform transition-all duration-700 hover:scale-105">
      <i className="fas fa-crosshairs mr-2 md:mr-3 animate-pulse"></i>
      PREDICT MUSUH MCGOGO
    </h1>
    <div className="font-mono text-green-400 text-sm md:text-lg lg:text-xl font-bold animate-slide-in-top" style={{ animationDelay: '0.3s' }}>
      <i className="fas fa-terminal mr-1 md:mr-2"></i>
      [ DEVELOPED BY RUII DEWA MC ]
    </div>
  </div>
);

// Komponen Button Cyber dengan animasi hover yang lebih smooth
const CyberButton = ({ onClick, children, variant = "cyan", className = "", disabled = false }) => {
  const variants = {
    cyan: "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-cyan-400/30",
    pink: "border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black shadow-pink-500/30",
    purple: "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-black shadow-purple-500/30",
    green: "border-green-400 text-green-400 hover:bg-green-400 hover:text-black shadow-green-400/30"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-mono border-2 px-4 py-2 md:px-6 md:py-3 font-bold uppercase tracking-wider relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:scale-105 backdrop-blur-sm text-sm md:text-base w-full md:w-auto transform active:scale-95 ${variants[variant]} shadow-lg hover:shadow-xl ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Komponen Input Cyber dengan fokus yang lebih smooth
const CyberInput = ({ value, onChange, placeholder, isAuto = false, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={isAuto}
    className={`
      w-full bg-black/70 border-2 border-gray-600 px-3 py-2 md:px-4 md:py-3 text-white font-bold backdrop-blur-sm
      focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/30 focus:outline-none focus:scale-105
      transition-all duration-300 placeholder-gray-400 text-sm md:text-base transform
      ${isAuto ? 'bg-green-500/15 border-green-400 text-green-100 shadow-green-400/20 animate-glow' : 'hover:border-gray-400'}
      ${className}
    `}
    title={isAuto ? "AUTO-GENERATED FIELD" : ""}
  />
);

// Komponen Alert Cyber dengan animasi masuk
const CyberAlert = ({ type = "info", title, children, className = "", delay = 0 }) => {
  const types = {
    info: "border-cyan-400 shadow-cyan-400/20",
    success: "border-green-400 shadow-green-400/20",
    warning: "border-orange-400 shadow-orange-400/20",
    danger: "border-red-400 shadow-red-400/20"
  };

  return (
    <div 
      className={`bg-white/5 backdrop-blur-md border-2 p-6 my-6 relative overflow-hidden transform transition-all duration-500 hover:scale-102 animate-fade-in-up ${types[type]} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-shimmer"></div>
      <h5 className="font-mono text-lg font-bold mb-3 text-white">
        <i className="fas fa-microchip mr-2 animate-pulse"></i>
        {title}
      </h5>
      <div className="text-white">{children}</div>
    </div>
  );
};

// Komponen Notification dengan animasi masuk yang lebih smooth
const CyberNotification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const types = {
    info: { color: "cyan-400", icon: "fas fa-info-circle" },
    success: { color: "green-400", icon: "fas fa-check-circle" },
    warning: { color: "orange-400", icon: "fas fa-exclamation-triangle" }
  };

  const config = types[type] || types.info;

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 2700);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-2 md:right-5 z-50 bg-white/5 backdrop-blur-md border-2 border-${config.color} p-3 md:p-4 min-w-64 md:min-w-72 shadow-lg shadow-${config.color}/20 transform transition-all duration-500 text-sm md:text-base ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <i className={`${config.icon} mr-2 text-${config.color} animate-pulse`}></i>
      <span className="font-mono font-semibold text-white">{message}</span>
    </div>
  );
};

// Komponen Utama
const PredictMusuhMcgogo = () => {
  const [userName, setUserName] = useState('');
  const [p8Name, setP8Name] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [round8Opponent, setRound8Opponent] = useState('');
  const [rounds, setRounds] = useState([
    { round: 1, userVs: '', p8Vs: '' },
    { round: 2, userVs: '', p8Vs: '' },
    { round: 3, userVs: '', p8Vs: '' },
    { round: 4, userVs: '', p8Vs: '' },
    { round: 5, userVs: '', p8Vs: '' },
    { round: 6, userVs: '', p8Vs: '' },
    { round: 7, userVs: '', p8Vs: '' }
  ]);

  // Data skenario advanced untuk Round 8+
  const advancedScenarios = {
    'round1': {
      name: 'Lawan Round 1',
      rounds: [
        { round: 8, pattern: 'r1' },
        { round: 9, pattern: 'r2' },
        { round: 10, pattern: 'r3' },
        { round: 11, pattern: 'r4' },
        { round: 12, pattern: 'r5' },
        { round: 13, pattern: 'r6' }
      ]
    },
    'round2': {
      name: 'Lawan Round 2',
      rounds: [
        { round: 8, pattern: 'r2' },
        { round: 9, pattern: 'r4' },
        { round: 10, pattern: 'r3' },
        { round: 11, pattern: 'r7' },
        { round: 12, pattern: 'r5' },
        { round: 13, pattern: 'r1' }
      ]
    },
    'round5_s1': {
      name: 'Lawan Round 5 (Skenario 1)',
      rounds: [
        { round: 8, pattern: 'r5' },
        { round: 9, pattern: 'r4' },
        { round: 10, pattern: 'r3' },
        { round: 11, pattern: null }, // Unknown
        { round: 12, pattern: null }  // Unknown
      ]
    },
    'round5_s2': {
      name: 'Lawan Round 5 (Skenario 2)',
      rounds: [
        { round: 8, pattern: 'r5' },
        { round: 9, pattern: 'r2' },
        { round: 10, pattern: 'r3' },
        { round: 11, pattern: 'r7' },
        { round: 12, pattern: null },
        { round: 13, pattern: null }
      ]
    },
    'round6_s1': {
      name: 'Lawan Round 6 (Skenario 1)',
      rounds: [
        { round: 8, pattern: 'r6' },
        { round: 9, pattern: 'r2' },
        { round: 10, pattern: 'r5' },
        { round: 11, pattern: 'r4' },
        { round: 12, pattern: 'r7' },
        { round: 13, pattern: 'r1' }
      ]
    },
    'round6_s2': {
      name: 'Lawan Round 6 (Skenario 2 - Mati 1)',
      rounds: [
        { round: 8, pattern: 'r6' },
        { round: 9, pattern: 'r2' },
        { round: 10, pattern: 'r5' },
        { round: 11, pattern: 'r4' },
        { round: 12, pattern: 'r5' }, // Mati 1 effect
        { round: 13, pattern: 'r1' },
        { round: 14, pattern: 'r3' }
      ]
    }
  };

  // Load animasi saat komponen mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Fungsi untuk menghitung prediksi dasar (Round 1-7)
  const computeBasicPredictions = () => {
    const newRounds = [...rounds];

    // Round 1: automatic
    newRounds[0].userVs = p8Name;
    newRounds[0].p8Vs = userName || 'user';

    // Round 3: automatic, based on round 2 input
    if (newRounds[1].userVs !== '' || newRounds[1].p8Vs !== '') {
      newRounds[2].userVs = newRounds[1].p8Vs;
      newRounds[2].p8Vs = newRounds[1].userVs;
    }

    // Round 5: automatic, userVs from round 4 (p8Vs column)
    if (newRounds[3].p8Vs !== '') {
      newRounds[4].userVs = newRounds[3].p8Vs;
    }

    // Round 6: automatic, userVs from round 5 (p8Vs column)
    if (newRounds[4].p8Vs !== '') {
      newRounds[5].userVs = newRounds[4].p8Vs;
    }

    // Round 7: automatic
    if (newRounds[5].userVs !== '' && newRounds[5].p8Vs !== '') {
      newRounds[6].userVs = newRounds[5].p8Vs;
      newRounds[6].p8Vs = newRounds[5].userVs;
    }

    return newRounds;
  };

  // Fungsi untuk mendapatkan opponent dari pattern
  const getOpponentFromPattern = (pattern, basicRounds) => {
    if (!pattern) return '';
    
    const roundIndex = parseInt(pattern.replace('r', '')) - 1;
    if (roundIndex >= 0 && roundIndex < basicRounds.length) {
      // Ambil dari kolom userVs jika ada, kalau tidak dari p8Vs
      return basicRounds[roundIndex].userVs || basicRounds[roundIndex].p8Vs || '';
    }
    return '';
  };

  // Fungsi untuk menghitung prediksi advanced (Round 8+)
  const computeAdvancedPredictions = (basicRounds) => {
    if (!selectedScenario || !advancedScenarios[selectedScenario]) {
      return [];
    }

    const scenario = advancedScenarios[selectedScenario];
    const advancedRounds = [];

    scenario.rounds.forEach(roundData => {
      const opponent = roundData.pattern ? getOpponentFromPattern(roundData.pattern, basicRounds) : '';
      advancedRounds.push({
        round: roundData.round,
        userVs: opponent,
        p8Vs: '', // P8 column tetap kosong untuk advanced rounds
        isAdvanced: true,
        pattern: roundData.pattern
      });
    });

    return advancedRounds;
  };

  // Update rounds setiap kali ada perubahan
  useEffect(() => {
    const basicRounds = computeBasicPredictions();
    setRounds(basicRounds);
  }, [userName, p8Name]);

  // Fungsi untuk mengecek apakah field auto-generated
  const isAuto = (round, field) => {
    if (round === 1) return true;
    if (round === 3) return true;
    if (round === 5 && field === 'userVs') return true;
    if (round === 6 && field === 'userVs') return true;
    if (round === 7) return true;
    if (round >= 8) return true; // Advanced rounds are auto-generated
    return false;
  };

  // Fungsi untuk mendapatkan placeholder yang dinamis
  const getPlaceholder = (roundIndex, field) => {
    const round = roundIndex + 1;
    
    if (field === 'p8Vs') {
      if (p8Name.trim()) {
        if (round === 5) {
          const round2P8Vs = rounds[1]?.p8Vs;
          return round2P8Vs ? `lawan dari ${round2P8Vs}` : `${p8Name} vs`;
        }
        return `${p8Name} vs`;
      }
      return 'p8 vs';
    }
    
    // Untuk userVs, gunakan nickname user jika sudah diisi
    if (field === 'userVs') {
      return userName.trim() ? `${userName} vs` : 'User vs';
    }
    
    return 'p8 vs';
  };

  // Handle perubahan input round
  const handleRoundChange = (index, field, value) => {
    const newRounds = [...rounds];
    newRounds[index][field] = value;
    setRounds(newRounds);
    
    // Recompute predictions
    setTimeout(() => {
      const basicRounds = computeBasicPredictions();
      setRounds(basicRounds);
    }, 50);
    
    showNotification(`ROUND ${index + 1} UPDATED`, 'info');
  };

  // Handle reset
  const handleReset = () => {
    if (confirm('⚠️ KONFIRMASI RESET SISTEM ⚠️\n\nSemua data akan dihapus. Lanjutkan operasi reset?')) {
      setUserName('');
      setP8Name('');
      setShowInstructions(false);
      setShowAdvanced(false);
      setSelectedScenario('');
      setRound8Opponent('');
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

  // Handle aktivasi mode advanced
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

  // Handle perubahan skenario
  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    showNotification(`SKENARIO ${advancedScenarios[scenario].name.toUpperCase()} DIPILIH`, 'info');
  };

  // Gabungkan rounds dasar dengan advanced
  const allRounds = showAdvanced && selectedScenario ? 
    [...rounds, ...computeAdvancedPredictions(rounds)] : rounds;

  return (
    <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
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
          <div className="flex justify-center items-center mb-6 md:mb-8 gap-2 md:gap-4 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <CyberButton
              onClick={() => setShowInstructions(!showInstructions)}
              variant="cyan"
            >
              <i className="fas fa-info-circle mr-1 md:mr-2"></i>
              {showInstructions ? 'TUTUP MANUAL' : 'MANUAL SISTEM'}
            </CyberButton>
            <CyberButton
              onClick={handleAdvancedMode}
              variant="purple"
            >
              <i className="fas fa-rocket mr-1 md:mr-2"></i>
              {showAdvanced ? 'MODE BASIC' : 'MODE ADVANCED'}
            </CyberButton>
            <CyberButton
              onClick={handleReset}
              variant="pink"
            >
              <i className="fas fa-power-off mr-1 md:mr-2"></i>
              RESET SYSTEM
            </CyberButton>
          </div>

          {/* Instructions dengan animasi slide */}
          {showInstructions && (
            <div className="transform transition-all duration-500 animate-fade-in-up">
              <CyberAlert type="info" title="PANDUAN OPERASI SISTEM:" delay={0.1}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="transform transition-all duration-300 hover:translate-x-2">
                    <p className="mb-4"><strong>TARGET P8</strong> adalah musuh utama/mantan pertama yang akan diprediksi sistemnya.</p>
                    <h6 className="font-mono font-bold mb-2">
                      <i className="fas fa-cogs mr-2"></i>PROTOKOL OTOMATIS BASIC:
                    </h6>
                    <ul className="text-sm space-y-1">
                      <li>• ROUND 1: User vs P8 → P8 vs User</li>
                      <li>• ROUND 3: Prediksi dari Round 2</li>
                      <li>• ROUND 5: User = P8Vs Round 4, P8Vs = dari Round 2</li>
                      <li>• ROUND 6: User = P8Vs Round 5</li>
                      <li>• ROUND 7: Kalkulasi dari Round 6</li>
                    </ul>
                  </div>
                  <div className="transform transition-all duration-300 hover:translate-x-2">
                    <h6 className="font-mono font-bold mb-2">
                      <i className="fas fa-rocket mr-2"></i>MODE ADVANCED (ROUND 8+):
                    </h6>
                    <ul className="text-sm space-y-1">
                      <li>• Prediksi berdasarkan lawan Round 8</li>
                      <li>• 6 Skenario berbeda tersedia</li>
                      <li>• Algoritma pattern matching</li>
                      <li>• Support untuk kondisi "Mati 1"</li>
                    </ul>
                    <h6 className="font-mono font-bold mb-2 mt-4">
                      <i className="fas fa-exclamation-triangle mr-2"></i>PERINGATAN:
                    </h6>
                    <ul className="text-sm space-y-1">
                      <li>• Input Manual: Round 2, 4, 5(P8Vs), 6(P8Vs)</li>
                      <li>• Field hijau = Auto-Generated</li>
                      <li>• Advanced membutuhkan data basic lengkap</li>
                    </ul>
                  </div>
                </div>
              </CyberAlert>
            </div>
          )}

          {/* User Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <div className="transform transition-all duration-300 hover:scale-105">
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                <i className="fas fa-user mr-1 md:mr-2 text-cyan-400"></i>
                INPUT NICKNAME USER:
              </label>
              <CyberInput
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (e.target.value.trim()) {
                    showNotification('USER NICKNAME LOCKED', 'info');
                  }
                }}
                placeholder="MASUKKAN NICKNAME ANDA..."
                className="text-sm md:text-base"
              />
            </div>
            <div className="transform transition-all duration-300 hover:scale-105">
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                <i className="fas fa-crosshairs mr-1 md:mr-2 text-pink-500"></i>
                INPUT MUSUH PERTAMA ANDA:
              </label>
              <CyberInput
                value={p8Name}
                onChange={(e) => {
                  setP8Name(e.target.value);
                  if (e.target.value.trim()) {
                    showNotification('MUSUH PERTAMA LOCKED', 'success');
                  }
                }}
                placeholder="NAMA MUSUH PERTAMA ANDA..."
                className="text-sm md:text-base"
              />
            </div>
          </div>

          {/* Advanced Mode Controls */}
          {showAdvanced && (
            <div className="mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <CyberAlert type="success" title="MODE ADVANCED AKTIF - PILIH SKENARIO:" delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(advancedScenarios).map(([key, scenario]) => (
                    <CyberButton
                      key={key}
                      onClick={() => handleScenarioChange(key)}
                      variant={selectedScenario === key ? "green" : "cyan"}
                      className={`text-xs ${selectedScenario === key ? 'animate-glow' : ''}`}
                    >
                      <i className="fas fa-chart-line mr-1"></i>
                      {scenario.name}
                    </CyberButton>
                  ))}
                </div>
                {selectedScenario && (
                  <div className="mt-4 p-4 bg-black/30 rounded-lg border border-green-400/30">
                    <p className="text-green-400 font-mono">
                      <i className="fas fa-info-circle mr-2"></i>
                      SKENARIO AKTIF: <strong>{advancedScenarios[selectedScenario].name}</strong>
                    </p>
                    <p className="text-sm text-gray-300 mt-2">
                      Prediksi Round 8+ akan dihitung berdasarkan pola skenario yang dipilih.
                    </p>
                  </div>
                )}
              </CyberAlert>
            </div>
          )}

          {/* Rounds Table dengan animasi staggered */}
          <div className="overflow-x-auto animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <table className="w-full border-2 border-cyan-400 shadow-lg shadow-cyan-400/20 transform transition-all duration-500 hover:shadow-cyan-400/30">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-400/30 to-purple-500/30">
                  <th className="border-b-2 border-cyan-400 p-2 md:p-4 text-white font-mono font-bold text-center text-sm md:text-base transition-all duration-300 hover:bg-cyan-400/20">
                    RONDE
                  </th>
                  <th className="border-b-2 border-cyan-400 p-2 md:p-4 text-white font-mono font-bold text-center text-sm md:text-base transition-all duration-300 hover:bg-cyan-400/20">
                    <i className="fas fa-user mr-1 hidden md:inline"></i>
                    {userName.trim() ? userName : 'User'} vs
                  </th>
                  <th className="border-b-2 border-cyan-400 p-2 md:p-4 text-white font-mono font-bold text-center text-sm md:text-base transition-all duration-300 hover:bg-cyan-400/20">
                    <i className="fas fa-robot mr-1 hidden md:inline"></i>
                    {p8Name.trim() ? p8Name : 'p8'} vs
                  </th>
                  {showAdvanced && (
                    <th className="border-b-2 border-cyan-400 p-2 md:p-4 text-white font-mono font-bold text-center text-sm md:text-base transition-all duration-300 hover:bg-cyan-400/20">
                      <i className="fas fa-cogs mr-1 hidden md:inline"></i>
                      PATTERN
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {allRounds.map((round, index) => (
                  <tr 
                    key={`${round.round}-${round.isAdvanced || 'basic'}`}
                    className={`hover:bg-cyan-400/5 transition-all duration-500 transform hover:scale-102 ${
                      round.isAdvanced ? 'bg-purple-500/10 border-l-4 border-purple-500' : ''
                    }`}
                    style={{ 
                      animation: `fadeInUp 0.6s ease-out ${0.05 * index + 1}s both`
                    }}
                  >
                    <td className="border-b border-cyan-400/30 p-2 md:p-3 text-center bg-black/20">
                      <div className={`w-6 h-6 md:w-8 md:h-8 ${
                        round.isAdvanced 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                          : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                      } text-white rounded-full flex items-center justify-center font-mono font-bold shadow-lg text-xs md:text-sm mx-auto transform transition-all duration-300 hover:scale-110`}>
                        {round.round}
                      </div>
                      {round.isAdvanced && (
                        <div className="text-xs text-purple-400 font-mono mt-1">ADV</div>
                      )}
                    </td>
                    <td className="border-b border-cyan-400/30 p-1 md:p-3 bg-black/20">
                      <CyberInput
                        value={round.userVs}
                        onChange={(e) => !round.isAdvanced && handleRoundChange(index, 'userVs', e.target.value)}
                        placeholder={round.isAdvanced ? "AUTO-PREDICTED" : getPlaceholder(index, 'userVs')}
                        isAuto={isAuto(round.round, 'userVs')}
                        className={`text-xs md:text-sm py-1 md:py-2 px-2 md:px-3 ${
                          round.isAdvanced ? 'border-purple-400 bg-purple-500/10' : ''
                        }`}
                      />
                    </td>
                    <td className="border-b border-cyan-400/30 p-1 md:p-3 bg-black/20">
                      <CyberInput
                        value={round.p8Vs}
                        onChange={(e) => !round.isAdvanced && handleRoundChange(index, 'p8Vs', e.target.value)}
                        placeholder={round.isAdvanced ? "N/A" : getPlaceholder(index, 'p8Vs')}
                        isAuto={round.isAdvanced ? true : isAuto(round.round, 'p8Vs')}
                        className={`text-xs md:text-sm py-1 md:py-2 px-2 md:px-3 ${
                          round.isAdvanced ? 'border-gray-600 bg-gray-800/50 opacity-50' : ''
                        }`}
                        disabled={round.isAdvanced}
                      />
                    </td>
                    {showAdvanced && (
                      <td className="border-b border-cyan-400/30 p-1 md:p-3 bg-black/20 text-center">
                        {round.pattern ? (
                          <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                            {round.pattern.toUpperCase()}
                          </span>
                        ) : round.isAdvanced ? (
                          <span className="text-xs font-mono text-red-300 bg-red-500/20 px-2 py-1 rounded">
                            UNKNOWN
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-gray-500">-</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advanced Mode Info */}
          {showAdvanced && selectedScenario && (
            <CyberAlert type="info" title="INFORMASI SKENARIO ADVANCED:" delay={1.1}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h6 className="font-bold mb-2">
                    <i className="fas fa-chart-bar mr-2"></i>
                    SKENARIO: {advancedScenarios[selectedScenario].name}
                  </h6>
                  <p className="text-sm">
                    Prediksi untuk Round 8+ berdasarkan pola yang telah dianalisis dari data historis permainan.
                  </p>
                </div>
                <div>
                  <h6 className="font-bold mb-2">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    CATATAN PENTING:
                  </h6>
                  <ul className="text-sm space-y-1">
                    <li>• Pattern "UNKNOWN" membutuhkan data tambahan</li>
                    <li>• Skenario "Mati 1" mempengaruhi prediksi Round 12+</li>
                    <li>• Akurasi bergantung pada kelengkapan data Round 1-7</li>
                  </ul>
                </div>
              </div>
            </CyberAlert>
          )}

          {/* Pattern Detection */}
          <CyberAlert type="success" title="DETEKSI POLA SISTEM:" delay={1.2}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p>
                  <i className="fas fa-chart-line mr-2"></i>
                  Algoritma mendeteksi <strong>POLA BERULANG</strong> dalam sistem permainan McGogo.
                </p>
                <p className="mt-2">
                  Mode Advanced menggunakan <strong>6 SKENARIO</strong> prediksi berdasarkan lawan Round 8.
                </p>
              </div>
              <div>
                <p>
                  <i className="fas fa-brain mr-2"></i>
                  Sistem dikembangkan oleh <strong>RUII DEWA MC</strong> dengan analisis mendalam terhadap pattern matching.
                </p>
              </div>
            </div>
          </CyberAlert>

          {/* Validity Warning */}
          <CyberAlert type="warning" title="PERINGATAN SISTEM:" delay={1.4}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p>
                  <i className="fas fa-clock mr-2"></i>
                  Sistem prediksi basic valid untuk <strong>ROUND 1-7</strong>. 
                  Mode Advanced memperluas prediksi hingga <strong>ROUND 8+</strong>.
                </p>
              </div>
              <div>
                <p>
                  <i className="fas fa-shield-alt mr-2"></i>
                  Akurasi prediksi Advanced bergantung pada:
                </p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Kelengkapan data Round 1-7</li>
                  <li>• Pemilihan skenario yang tepat</li>
                  <li>• Kondisi "Mati 1" atau faktor eksternal</li>
                </ul>
              </div>
            </div>
          </CyberAlert>

          {/* Footer dengan animasi masuk terakhir */}
          <footer className="text-center p-6 mt-8 border-t-2 border-cyan-400 text-cyan-400 font-mono relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-shimmer"></div>
            <div className="transform transition-all duration-300 hover:scale-105">
              <i className="fas fa-code mr-2"></i>
              DEVELOPED WITH PASSION FOR MCGOGO COMMUNITY
            </div>
            <div className="mt-2 text-sm opacity-80 transition-all duration-300 hover:opacity-100">
              © 2025 RUII DEWA MC SYSTEMS - VERSION 3.0 ADVANCED - ALL RIGHTS RESERVED
            </div>
            <div className="mt-2 text-xs opacity-60">
              <i className="fas fa-rocket mr-1"></i>
              FEATURING ADVANCED ROUND 8+ PREDICTION ALGORITHMS
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PredictMusuhMcgogo;