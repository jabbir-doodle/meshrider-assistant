import React from 'react';
import { DiagnosticType } from '../App';
import Tooltip from './Tooltip';

interface DashboardProps {
  onDiagnosticStart: (type: DiagnosticType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onDiagnosticStart }) => {
  const healthData = {
    rf: { percentage: 82, status: 'fair', rssi: '-67 dBm', channel: 'Ch 149 (5GHz)' },
    mesh: { percentage: 95, status: 'excellent', nodes: '12 Active Nodes', hops: '3-Hop Max' },
    hardware: { percentage: 78, status: 'fair', temp: '74°C', current: '2.1A Draw' }
  };

  // Command mappings for each diagnostic type
  const diagnosticCommands = {
    signalQuality: {
      title: "Signal Quality Diagnostics",
      commands: [
        "iw dev wlan0 info",
        "iw dev wlan0 survey dump",
        "iwinfo wlan0 assoclist",
        "iwinfo wlan0 info",
        "/usr/sbin/get_noise_stats.sh 100",
        "iw dev wlan0 station dump"
      ]
    },
    interference: {
      title: "Interference Detection",
      commands: [
        "iw dev wlan0 survey dump",
        "/usr/share/simpleconfig/spectral_scan.sh",
        "/usr/sbin/spectral_scan.sh",
        "iwinfo wlan0 freqlist",
        "iw reg get"
      ]
    },
    rangeLimitation: {
      title: "Range Analysis",
      commands: [
        "iw dev wlan0 info",
        "iwinfo wlan0 txpowerlist",
        "/usr/sbin/get_noise_stats.sh 100",
        "ping -c 10 $(batctl o | head -2 | tail -1 | awk '{print $1}')",
        "batctl o"
      ]
    },
    powerProblems: {
      title: "Power System Check",
      commands: [
        "cat /sys/class/thermal/thermal_zone*/temp",
        "uptime",
        "cat /proc/loadavg",
        "free -m",
        "dmesg | grep -i power"
      ]
    },
    slowTransfer: {
      title: "Performance Analysis",
      commands: [
        "iperf3 -c $(batctl o | head -2 | tail -1 | awk '{print $1}') -t 10",
        "ping -c 20 $(ip route | grep default | awk '{print $3}')",
        "tc -s qdisc show",
        "iwinfo wlan0 assoclist",
        "cat /proc/loadavg"
      ]
    },
    highLatency: {
      title: "Latency Diagnostics",
      commands: [
        "ping -c 50 $(ip route | grep default | awk '{print $3}')",
        "traceroute $(ip route | grep default | awk '{print $3}')",
        "batctl ping $(batctl o | head -2 | tail -1 | awk '{print $1}')",
        "tc -s qdisc show"
      ]
    },
    packetLoss: {
      title: "Packet Loss Analysis",
      commands: [
        "ping -c 100 $(ip route | grep default | awk '{print $3}')",
        "iwinfo wlan0 assoclist",
        "ethtool -S eth0",
        "dmesg | grep -i 'packet\\|drop\\|error'"
      ]
    },
    thermalThrottling: {
      title: "Thermal Management",
      commands: [
        "cat /sys/class/thermal/thermal_zone*/temp",
        "cat /sys/class/thermal/thermal_zone*/type",
        "dmesg | grep -i thermal",
        "iwinfo wlan0 info",
        "/usr/sbin/max_throughput.sh"
      ]
    },
    nodeConnectivity: {
      title: "Mesh Node Analysis",
      commands: [
        "batctl o",
        "batctl oj",
        "batctl n",
        "batctl if",
        "dynamic_mesh json"
      ]
    },
    topologyProblems: {
      title: "Network Topology Check",
      commands: [
        "batctl o",
        "batctl t",
        "ip route show",
        "batctl s",
        "iwinfo wlan0 assoclist"
      ]
    },
    routingIssues: {
      title: "Routing Diagnostics",
      commands: [
        "ip route show",
        "ip rule show",
        "batctl o",
        "batctl t",
        "traceroute $(batctl o | head -2 | tail -1 | awk '{print $1}')"
      ]
    },
    loadBalancing: {
      title: "Load Balancing Analysis",
      commands: [
        "tc -s qdisc show",
        "tc class show",
        "batctl s",
        "cat /proc/loadavg",
        "iwinfo wlan0 assoclist"
      ]
    },
    fullHealthScan: {
      title: "Complete System Scan",
      commands: [
        "/usr/sbin/info.sh",
        "/usr/sbin/info.sh wireless",
        "batctl o",
        "iwinfo wlan0 info",
        "cat /sys/class/thermal/thermal_zone*/temp",
        "free -m",
        "dmesg | tail -50",
        "logread | tail -100"
      ]
    },
    generateReport: {
      title: "Diagnostic Report Generation",
      commands: [
        "/usr/sbin/info.sh > /tmp/system_report.txt",
        "batctl o >> /tmp/system_report.txt",
        "iwinfo >> /tmp/system_report.txt",
        "dmesg >> /tmp/system_report.txt",
        "tar -czf /tmp/diagnostic_report.tar.gz /tmp/system_report.txt"
      ]
    },
    expertMode: {
      title: "Expert Diagnostics",
      commands: [
        "iw dev",
        "iw phy",
        "cat /sys/kernel/debug/ieee80211/phy*/ath9k/recv",
        "cat /sys/kernel/debug/ieee80211/phy*/ath9k/xmit",
        "/usr/sbin/spectral_scan.sh",
        "sr_personality"
      ]
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'excellent': return 'status-excellent';
      case 'good': return 'status-good';
      case 'fair': return 'status-fair';
      case 'poor': return 'status-poor';
      default: return 'status-fair';
    }
  };

  const getHealthColor = (percentage: number) => {
    if (percentage >= 90) return '#00ff88';
    if (percentage >= 70) return '#ffaa00';
    return '#ff4444';
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <img src="/logo.png" alt="MeshRider" className="logo" />
            <div>
              <div className="header-title">
                <span className="glowing-text">MeshRider</span> Assistant
              </div>
              <div className="header-subtitle">
                Advanced RF Diagnostics & Network Intelligence
              </div>
            </div>
          </div>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span className="status-text">Online • 192.168.1.1</span>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="theme-card">
        <div className="panel-title">
          ✨ SYSTEM HEALTH OVERVIEW ✨
        </div>
        
        <div className="health-grid">
          <div className="health-card">
            <div className="health-card-header">
              <div className="health-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                🌐
              </div>
              <div className="health-card-title">RF LINK</div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${healthData.rf.percentage}%`,
                  background: getHealthColor(healthData.rf.percentage)
                }}
              ></div>
            </div>
            <div 
              className="health-percentage" 
              style={{ color: getHealthColor(healthData.rf.percentage) }}
            >
              {healthData.rf.percentage}%
            </div>
            <div className={`health-status ${getStatusClass(healthData.rf.status)}`}>
              🟡 FAIR
            </div>
            <div className="health-details">
              {healthData.rf.rssi} RSSI<br />
              {healthData.rf.channel}
            </div>
          </div>

          <div className="health-card">
            <div className="health-card-header">
              <div className="health-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                🔗
              </div>
              <div className="health-card-title">MESH NET</div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${healthData.mesh.percentage}%`,
                  background: getHealthColor(healthData.mesh.percentage)
                }}
              ></div>
            </div>
            <div 
              className="health-percentage" 
              style={{ color: getHealthColor(healthData.mesh.percentage) }}
            >
              {healthData.mesh.percentage}%
            </div>
            <div className={`health-status ${getStatusClass(healthData.mesh.status)}`}>
              🟢 EXCELLENT
            </div>
            <div className="health-details">
              {healthData.mesh.nodes}<br />
              {healthData.mesh.hops}
            </div>
          </div>

          <div className="health-card">
            <div className="health-card-header">
              <div className="health-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                ⚡
              </div>
              <div className="health-card-title">HARDWARE</div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${healthData.hardware.percentage}%`,
                  background: getHealthColor(healthData.hardware.percentage)
                }}
              ></div>
            </div>
            <div 
              className="health-percentage" 
              style={{ color: getHealthColor(healthData.hardware.percentage) }}
            >
              {healthData.hardware.percentage}%
            </div>
            <div className={`health-status ${getStatusClass(healthData.hardware.status)}`}>
              🟡 WARM
            </div>
            <div className="health-details">
              {healthData.hardware.temp} Temp<br />
              {healthData.hardware.current}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Diagnostics */}
      <div className="theme-card">
        <div className="panel-title">
          🎯 SMART DIAGNOSTICS
        </div>
        
        <div className="diagnostic-grid">
          <div className="diagnostic-section">
            <h3>📡 LINK QUALITY ISSUES</h3>
            <div className="diagnostic-buttons">
              <Tooltip 
                commands={diagnosticCommands.signalQuality.commands}
                title={diagnosticCommands.signalQuality.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip" 
                  onClick={() => onDiagnosticStart('signal')}
                >
                  🔴 Poor Signal Quality
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.interference.commands}
                title={diagnosticCommands.interference.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('signal')}
                >
                  🟡 Interference Issues
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.rangeLimitation.commands}
                title={diagnosticCommands.rangeLimitation.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('signal')}
                >
                  🟠 Range Limitations
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.powerProblems.commands}
                title={diagnosticCommands.powerProblems.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('system')}
                >
                  ⚡ Power Problems
                </div>
              </Tooltip>
            </div>
          </div>

          <div className="diagnostic-section">
            <h3>🚀 PERFORMANCE PROBLEMS</h3>
            <div className="diagnostic-buttons">
              <Tooltip 
                commands={diagnosticCommands.slowTransfer.commands}
                title={diagnosticCommands.slowTransfer.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('performance')}
                >
                  🐌 Slow Data Transfer
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.highLatency.commands}
                title={diagnosticCommands.highLatency.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('performance')}
                >
                  📊 High Latency
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.packetLoss.commands}
                title={diagnosticCommands.packetLoss.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('performance')}
                >
                  🔄 Packet Loss
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.thermalThrottling.commands}
                title={diagnosticCommands.thermalThrottling.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('system')}
                >
                  🌡️ Thermal Throttling
                </div>
              </Tooltip>
            </div>
          </div>

          <div className="diagnostic-section">
            <h3>🔗 MESH NETWORK ISSUES</h3>
            <div className="diagnostic-buttons">
              <Tooltip 
                commands={diagnosticCommands.nodeConnectivity.commands}
                title={diagnosticCommands.nodeConnectivity.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('mesh')}
                >
                  🌐 Node Connectivity
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.topologyProblems.commands}
                title={diagnosticCommands.topologyProblems.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('mesh')}
                >
                  📍 Topology Problems
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.routingIssues.commands}
                title={diagnosticCommands.routingIssues.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('mesh')}
                >
                  🔄 Routing Issues
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.loadBalancing.commands}
                title={diagnosticCommands.loadBalancing.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('mesh')}
                >
                  ⚖️ Load Balancing
                </div>
              </Tooltip>
            </div>
          </div>

          <div className="diagnostic-section">
            <h3>⚙️ SYSTEM DIAGNOSTICS</h3>
            <div className="diagnostic-buttons">
              <Tooltip 
                commands={diagnosticCommands.fullHealthScan.commands}
                title={diagnosticCommands.fullHealthScan.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('system')}
                >
                  🔍 Full Health Scan
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.generateReport.commands}
                title={diagnosticCommands.generateReport.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('system')}
                >
                  📋 Generate Report
                </div>
              </Tooltip>
              
              <Tooltip 
                commands={diagnosticCommands.expertMode.commands}
                title={diagnosticCommands.expertMode.title}
              >
                <div 
                  className="diagnostic-btn diagnostic-btn-with-tooltip"
                  onClick={() => onDiagnosticStart('system')}
                >
                  🛠️ Expert Mode
                </div>
              </Tooltip>
              
              <div className="diagnostic-btn">
                📞 Contact Support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="theme-card">
        <div className="panel-title">
          🚀 QUICK ACTIONS
        </div>
        
        <div className="quick-actions">
          <div className="quick-action-btn">
            <div className="icon">🔄</div>
            <div>Restart WiFi</div>
          </div>
          <div className="quick-action-btn">
            <div className="icon">📡</div>
            <div>Optimize Channel</div>
          </div>
          <div className="quick-action-btn">
            <div className="icon">🧹</div>
            <div>Cleanup Memory</div>
          </div>
          <div className="quick-action-btn">
            <div className="icon">📊</div>
            <div>Monitor Live</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;