import React from 'react';

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

export default HudElements;