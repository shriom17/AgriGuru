import React, { useState, useEffect } from 'react';
import enhancedAIService from '../../services/enhancedAIService';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking');
  const [serverInfo, setServerInfo] = useState(null);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    setStatus('checking');
    
    try {
      const isOnline = await enhancedAIService.checkServerStatus();
      
      if (isOnline) {
        // Get server info
        const response = await fetch('http://localhost:5000/');
        const data = await response.json();
        
        setServerInfo(data);
        setStatus('connected');
      } else {
        setStatus('disconnected');
      }
    } catch (error) {
      console.error('Backend status check failed:', error);
      setStatus('error');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#28a745';
      case 'disconnected': return '#dc3545';
      case 'checking': return '#ffc107';
      case 'error': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return '✅ Enhanced AI Connected';
      case 'disconnected': return '❌ Backend Disconnected';
      case 'checking': return '🔄 Checking Connection...';
      case 'error': return '⚠️ Connection Error';
      default: return '❓ Unknown Status';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      padding: '15px 20px',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: `2px solid ${getStatusColor()}`,
      zIndex: 1000,
      minWidth: '280px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          animation: status === 'checking' ? 'pulse 1s infinite' : 'none'
        }}></div>
        <span style={{
          fontWeight: 'bold',
          color: getStatusColor()
        }}>
          {getStatusText()}
        </span>
      </div>
      
      {status === 'connected' && serverInfo && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          marginBottom: '10px'
        }}>
          <div>🌾 {serverInfo.message}</div>
          <div>🚀 Enhanced Farming Expert Active</div>
        </div>
      )}
      
      {status === 'disconnected' && (
        <div style={{
          fontSize: '12px',
          color: '#dc3545',
          marginBottom: '10px'
        }}>
          <div>Please start the backend server:</div>
          <div>1. Go to backend folder</div>
          <div>2. Run: python farming_expert_app.py</div>
        </div>
      )}
      
      <button
        onClick={checkBackendStatus}
        style={{
          background: getStatusColor(),
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        🔄 Refresh Status
      </button>
      
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BackendStatus;
