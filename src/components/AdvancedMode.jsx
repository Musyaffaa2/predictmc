import React from 'react';
import CyberAlert from './CyberAlert';
import CyberButton from './CyberButton';
import { advancedScenarios } from '../data/advancedScenarios';

const AdvancedMode = ({ 
  showAdvanced, 
  selectedScenario, 
  onScenarioChange 
}) => {
  if (!showAdvanced) return null;

  return (
    <div className="mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
      <CyberAlert type="success" title="MODE ADVANCED AKTIF - PILIH SKENARIO:" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(advancedScenarios).map(([key, scenario]) => (
            <CyberButton
              key={key}
              onClick={() => onScenarioChange(key)}
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
  );
};

export default AdvancedMode;