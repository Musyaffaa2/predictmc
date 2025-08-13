import React from 'react';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import PredictMusuhMcgogo from './PredictMusuhMcgogo';

const MainAppWrapper = () => {
  const { isAuthenticated } = useAuth();

  // Render berdasarkan status authentication
  return isAuthenticated ? <PredictMusuhMcgogo /> : <LoginPage />;
};

export default MainAppWrapper;