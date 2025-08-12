import React from 'react'
import PredictMusuhMcgogo from './components/PredictMusuhMcgogo'
import './App.css'
import EnhancedBackground from './components/EnhancedBackground';
import { computeBasicPredictions } from './utils/predictionLogic';
import { advancedScenarios } from './data/advancedScenarios';

function App() {
  return (
    <div className="App">
      <PredictMusuhMcgogo />
    </div>
  )
}

export default App