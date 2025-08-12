import React from 'react';
import CyberButton from './CyberButton';

const ActionButtons = ({ 
  showInstructions, 
  showAdvanced, 
  onToggleInstructions, 
  onToggleAdvanced, 
  onReset 
}) => {
  return (
    <div className="flex justify-center items-center mb-6 md:mb-8 gap-2 md:gap-4 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      <CyberButton
        onClick={onToggleInstructions}
        variant="cyan"
      >
        <i className="fas fa-info-circle mr-1 md:mr-2"></i>
        {showInstructions ? 'TUTUP MANUAL' : 'MANUAL SISTEM'}
      </CyberButton>
      <CyberButton
        onClick={onToggleAdvanced}
        variant="purple"
      >
        <i className="fas fa-rocket mr-1 md:mr-2"></i>
        {showAdvanced ? 'MODE BASIC' : 'MODE ADVANCED'}
      </CyberButton>
      <CyberButton
        onClick={onReset}
        variant="pink"
      >
        <i className="fas fa-power-off mr-1 md:mr-2"></i>
        RESET SYSTEM
      </CyberButton>
    </div>
  );
};

export default ActionButtons;