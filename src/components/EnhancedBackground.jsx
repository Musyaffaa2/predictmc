import React from 'react';

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

export default EnhancedBackground;