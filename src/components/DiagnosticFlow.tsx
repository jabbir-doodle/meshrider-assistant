import React, { useState, useEffect } from 'react';
import { DiagnosticType } from '../App';

interface DiagnosticFlowProps {
  diagnosticType: DiagnosticType;
  onBack: () => void;
}

type DiagnosticState = 'running' | 'analyzing' | 'complete' | 'applying-fix';

interface DiagnosticStep {
  name: string;
  status: 'pending' | 'running' | 'complete';
  result?: string;
}

const DiagnosticFlow: React.FC<DiagnosticFlowProps> = ({ diagnosticType, onBack }) => {
  const [state, setState] = useState<DiagnosticState>('running');
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<DiagnosticStep[]>([]);
  const [liveData, setLiveData] = useState({
    rssi: -67,
    noise: -89,
    retries: 15,
    channel: 149
  });

  const diagnosticSteps = {
    signal: [
      { name: 'Scanning wireless interfaces...', status: 'pending' as const },
      { name: 'Analyzing signal strength...', status: 'pending' as const },
      { name: 'Measuring noise floor...', status: 'pending' as const },
      { name: 'Checking channel utilization...', status: 'pending' as const },
      { name: 'Testing TX retry rates...', status: 'pending' as const },
      { name: 'Evaluating interference patterns...', status: 'pending' as const }
    ],
    performance: [
      { name: 'Running throughput tests...', status: 'pending' as const },
      { name: 'Analyzing latency patterns...', status: 'pending' as const },
      { name: 'Checking CPU utilization...', status: 'pending' as const },
      { name: 'Testing mesh connectivity...', status: 'pending' as const },
      { name: 'Evaluating QoS settings...', status: 'pending' as const }
    ],
    mesh: [
      { name: 'Scanning mesh topology...', status: 'pending' as const },
      { name: 'Testing node connectivity...', status: 'pending' as const },
      { name: 'Analyzing routing tables...', status: 'pending' as const },
      { name: 'Checking link quality...', status: 'pending' as const },
      { name: 'Evaluating load balancing...', status: 'pending' as const }
    ],
    system: [
      { name: 'System health scan...', status: 'pending' as const },
      { name: 'Hardware diagnostics...', status: 'pending' as const },
      { name: 'Memory analysis...', status: 'pending' as const },
      { name: 'Temperature monitoring...', status: 'pending' as const },
      { name: 'Log analysis...', status: 'pending' as const }
    ]
  };

  useEffect(() => {
    if (diagnosticType) {
      setSteps(diagnosticSteps[diagnosticType] || []);
      runDiagnostic();
    }
  }, [diagnosticType]);

  const runDiagnostic = async () => {
    const currentSteps = diagnosticSteps[diagnosticType!] || [];
    
    for (let i = 0; i < currentSteps.length; i++) {
      // Update current step to running
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'running' } : step
      ));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update current step to complete
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'complete' } : step
      ));
      
      // Update progress
      setProgress(((i + 1) / currentSteps.length) * 100);
      
      // Simulate live data changes
      if (diagnosticType === 'signal') {
        setLiveData(prev => ({
          ...prev,
          rssi: prev.rssi + Math.floor(Math.random() * 6) - 3,
          retries: Math.max(0, prev.retries + Math.floor(Math.random() * 10) - 5)
        }));
      }
    }
    
    setState('analyzing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setState('complete');
  };

  const applyFix = async () => {
    setState('applying-fix');
    setProgress(0);
    
    const fixSteps = [
      'Saving current configuration...',
      'Updating channel settings...',
      'Restarting wireless interface...',
      'Waiting for interface to come up...',
      'Verifying connectivity...',
      'Running post-fix diagnostics...'
    ];
    
    for (let i = 0; i < fixSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / fixSteps.length) * 100);
    }
    
    // Simulate improvement
    setLiveData({
      rssi: -65,
      noise: -91,
      retries: 3,
      channel: 36
    });
    
    setState('complete');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return '✅';
      case 'running': return '🔄';
      default: return '⏳';
    }
  };

  const getDiagnosticTitle = () => {
    switch (diagnosticType) {
      case 'signal': return '📡 Signal Quality Analysis';
      case 'performance': return '🚀 Performance Analysis';
      case 'mesh': return '🔗 Mesh Network Analysis';
      case 'system': return '⚙️ System Health Analysis';
      default: return '🔍 Analysis';
    }
  };

  if (state === 'running' || state === 'analyzing') {
    return (
      <div className="dashboard">
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <img src="/logo.png" alt="MeshRider" className="logo" />
              <div>
                <div className="header-title">
                  <span className="glowing-text">MeshRider</span> Assistant &gt; {getDiagnosticTitle()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="theme-card">
          <div className="panel-title">
            {state === 'running' ? '🔍 ANALYZING RF ENVIRONMENT' : '🧠 AI ANALYSIS IN PROGRESS'}
          </div>
          
          <div className="diagnostic-progress">
            <div className="progress-container">
              <h3>🌊 Running Advanced Diagnostics...</h3>
              
              <div className="steps-list">
                {steps.map((step, index) => (
                  <div key={index} className={`step-item ${step.status}`}>
                    <span className="step-icon">{getStatusIcon(step.status)}</span>
                    <span className="step-text">{step.name}</span>
                    <span className="step-status">
                      {step.status === 'complete' ? 'Complete' : 
                       step.status === 'running' ? 'Running' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="progress-bar" style={{ marginTop: '20px' }}>
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-info">
                Progress: {Math.round(progress)}% | 
                {state === 'running' 
                  ? ` ${Math.max(0, 15 - Math.round(progress * 0.15))} seconds remaining`
                  : ' Analyzing results...'
                }
              </div>
            </div>
          </div>
        </div>

        {diagnosticType === 'signal' && (
          <div className="theme-card">
            <div className="panel-title">📊 REAL-TIME DATA STREAM</div>
            <div className="live-data">
              <div className="data-row">
                📡 RSSI: {liveData.rssi} dBm → {liveData.rssi - 2} dBm → {liveData.rssi} dBm (Fluctuating)
              </div>
              <div className="data-row">
                📶 Noise: {liveData.noise} dBm (Baseline)
              </div>
              <div className="data-row">
                🔄 TX Retries: {liveData.retries}% → {liveData.retries + 3}% → {liveData.retries + 7}% (Increasing ⚠️)
              </div>
              <div className="data-row">
                📊 Channel {liveData.channel}: 45% utilization
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (state === 'complete') {
    return (
      <div className="dashboard">
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <img src="/logo.png" alt="MeshRider" className="logo" />
              <div>
                <div className="header-title">
                  <span className="glowing-text">MeshRider</span> Assistant &gt; {getDiagnosticTitle()} Results
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="theme-card">
          <div className="panel-title">
            🎉 SUCCESS! PROBLEM RESOLVED
          </div>
          
          <div className="results-content">
            <div className="diagnosis-result">
              <h3>✅ Channel switch completed successfully</h3>
              <h3>📊 Performance improvement verified</h3>
              <h3>🎯 Fix effectiveness: 96% (Exceeded expectations)</h3>
              
              <div className="comparison-table">
                <h4>📈 BEFORE vs AFTER COMPARISON:</h4>
                <div className="comparison-grid">
                  <div className="comparison-header">BEFORE FIX</div>
                  <div className="comparison-header">AFTER FIX</div>
                  
                  <div>🔄 TX Retry Rate: 22%</div>
                  <div className="success-text">🔄 TX Retry Rate: 3% ⬇️ 86%</div>
                  
                  <div>📊 Channel Util: 45%</div>
                  <div className="success-text">📊 Channel Util: 8% ⬇️ 82%</div>
                  
                  <div>📡 Signal: -69 dBm</div>
                  <div className="success-text">📡 Signal: -67 dBm ⬆️ 3%</div>
                  
                  <div>🌊 Noise: -89 dBm</div>
                  <div className="success-text">🌊 Noise: -91 dBm ⬆️ 2%</div>
                  
                  <div>⚡ Throughput: 15 Mbps</div>
                  <div className="success-text">⚡ Throughput: 47 Mbps ⬆️ 213%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="theme-card">
          <div className="panel-title">💡 SMART RECOMMENDATIONS</div>
          <div className="recommendations">
            <div>🎯 Monitor for 30 minutes to ensure stability</div>
            <div>📊 Consider this channel for future deployments</div>
            <div>🔄 Set up automated monitoring to prevent future issues</div>
            <div>📁 Configuration has been automatically backed up</div>
          </div>
        </div>

        <div className="theme-card">
          <div className="panel-title">📋 NEXT ACTIONS</div>
          <div className="quick-actions">
            <div className="quick-action-btn" onClick={onBack}>
              <div className="icon">🏠</div>
              <div>Return Home</div>
            </div>
            <div className="quick-action-btn">
              <div className="icon">📊</div>
              <div>Monitor Live</div>
            </div>
            <div className="quick-action-btn">
              <div className="icon">📁</div>
              <div>Download Report</div>
            </div>
            <div className="quick-action-btn">
              <div className="icon">🔄</div>
              <div>Run More Tests</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'applying-fix') {
    return (
      <div className="dashboard">
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <img src="/logo.png" alt="MeshRider" className="logo" />
              <div>
                <div className="header-title">
                  <span className="glowing-text">MeshRider</span> Assistant &gt; 📡 Applying Channel Switch Fix
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="theme-card">
          <div className="panel-title">
            🔧 EXECUTING AUTOMATED FIX
          </div>
          
          <div className="fix-progress">
            <h3>⚡ Switching to Channel 36 (5.18 GHz)</h3>
            
            <div className="progress-bar" style={{ margin: '20px 0' }}>
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="progress-info">
              Progress: {Math.round(progress)}% | Current Step: Interface restart in progress
              <br />
              ⚠️ WARNING: Connection will drop briefly
            </div>
            
            <div className="live-monitoring">
              <h4>📊 LIVE MONITORING</h4>
              <div>🔄 Connection Status: Reconnecting...</div>
              <div>📡 New Channel: 36 (5.18 GHz)</div>
              <div>⏱️ Downtime: 3.2 seconds</div>
              <div>🎯 ETA: 15 seconds remaining</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DiagnosticFlow;