import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import DiagnosticFlow from './components/DiagnosticFlow';

export type DiagnosticType = 'signal' | 'performance' | 'mesh' | 'system' | null;

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'diagnostic'>('dashboard');
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticType>(null);

  const handleDiagnosticStart = (type: DiagnosticType) => {
    setSelectedDiagnostic(type);
    setCurrentView('diagnostic');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedDiagnostic(null);
  };

  return (
    <div className="app">
      {currentView === 'dashboard' ? (
        <Dashboard onDiagnosticStart={handleDiagnosticStart} />
      ) : (
        <DiagnosticFlow 
          diagnosticType={selectedDiagnostic} 
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;