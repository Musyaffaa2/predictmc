import React from 'react';

const Animations = () => (
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

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
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

    /* Cyber grid effect */
    .cyber-grid {
      background-image: 
        linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridMove 20s linear infinite;
    }
  `}</style>
);

export default Animations;