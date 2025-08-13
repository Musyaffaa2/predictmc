import React from 'react'
import PredictMusuhMcgogo from './components/PredictMusuhMcgogo'
import { AuthProvider } from './components/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        {/* Langsung render PredictMusuhMcgogo tanpa ProtectedRoute */}
        <PredictMusuhMcgogo />
      </div>
    </AuthProvider>
  )
}

export default App