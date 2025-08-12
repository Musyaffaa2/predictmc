import React from 'react';
import CyberAlert from './CyberAlert';
import { advancedScenarios } from '../data/advancedScenarios';

const InfoAlerts = ({ showAdvanced, selectedScenario }) => {
  return (
    <>
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
    </>
  );
};

export default InfoAlerts;