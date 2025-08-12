import React from 'react';
import CyberAlert from './CyberAlert';

const InstructionsSection = ({ showInstructions }) => {
  if (!showInstructions) return null;

  return (
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
  );
};

export default InstructionsSection;