import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './WhatsAppSettings.css';

const WhatsAppSettings = () => {
  const { user, setUser } = useAuth();
  
  // Form states
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [alertPreferences, setAlertPreferences] = useState({
    weather: true,
    market_prices: true,
    crop_diseases: true,
    alert_frequency: 'daily',
    time_preference: 'morning'
  });
  
  // UI control states
  const [isVerifying, setIsVerifying] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [testAlertSent, setTestAlertSent] = useState(false);

  // Load initial data when component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log("Loading user data:", user);
      
      if (user.whatsapp) {
        // User has whatsapp data
        if (!editMode) {
          setWhatsappNumber(user.whatsapp.number || user.phone || '');
        }
        setIsEnabled(user.whatsapp.enabled || false);
        setIsVerified(user.whatsapp.verified || false);
        setAlertPreferences({
          weather: true,
          market_prices: true,
          crop_diseases: true,
          alert_frequency: 'daily',
          time_preference: 'morning',
          ...user.whatsapp.alert_preferences
        });
      } else if (!editMode) {
        // No whatsapp data, default to phone
        setWhatsappNumber(user.phone || '');
      }
    }
  }, [user, editMode]);

  // Handle number input change
  const handleNumberChange = (e) => {
    setWhatsappNumber(e.target.value);
    setEditMode(true);
    // If changing a verified number, we need to verify again
    if (isVerified) {
      setIsVerified(false);
    }
  };

  // Handle enabling/disabling WhatsApp alerts
  const handleToggleEnabled = (e) => {
    setIsEnabled(e.target.checked);
  };

  // Handle changing alert preferences
  const handleAlertPreferenceChange = (type, value) => {
    setAlertPreferences({
      ...alertPreferences,
      [type]: value
    });
  };

  // Handle saving preferences
  const handleUpdatePreferences = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/whatsapp/update-preferences`, {
        whatsapp_number: whatsappNumber,
        enabled: isEnabled,
        alert_preferences: alertPreferences
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setMessage('WhatsApp preferences updated successfully');
        setEditMode(false);
        
        // Update user context with new whatsapp data
        if (setUser && user) {
          setUser({
            ...user,
            whatsapp: response.data.whatsapp
          });
        }
      } else {
        setError(response.data.message || 'Error updating preferences');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Send verification code
  const handleVerify = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/whatsapp/verify`, {
        whatsapp_number: whatsappNumber
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setMessage('Verification code sent to your WhatsApp');
        setIsVerifying(true);
      } else {
        setError(response.data.message || 'Error sending verification code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Confirm verification code
  const handleConfirmVerification = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/whatsapp/confirm`, {
        verification_code: verificationCode
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setMessage('WhatsApp number verified successfully');
        setIsVerifying(false);
        setIsVerified(true);
        setIsEnabled(true);
        setEditMode(false);
        
        // Update user context with new whatsapp data
        if (setUser && user) {
          setUser({
            ...user,
            whatsapp: response.data.whatsapp
          });
        }
      } else {
        setError(response.data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Send test alert
  const handleSendTestAlert = async (alertType) => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/test-whatsapp`, {
        phone_number: whatsappNumber
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setMessage('Test alert sent to your WhatsApp');
        setTestAlertSent(true);
        setTimeout(() => setTestAlertSent(false), 5000); // Reset after 5 seconds
      } else {
        setError(response.data.message || 'Error sending test alert');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Start fresh UI
  if (!user) {
    return <div className="whatsapp-settings">Please log in to manage WhatsApp alerts</div>;
  }

  return (
    <div className="whatsapp-settings">
      <h2>WhatsApp Alert Settings</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleUpdatePreferences}>
        {/* WhatsApp Number Field */}
        <div className="form-group">
          <label htmlFor="whatsappNumber">WhatsApp Number:</label>
          <div className="input-with-button">
            <input
              type="text"
              id="whatsappNumber"
              value={whatsappNumber}
              onChange={handleNumberChange}
              placeholder="+91XXXXXXXXXX"
              required
            />
            {!isVerified && !isVerifying && (
              <button 
                type="button" 
                onClick={handleVerify}
                disabled={loading || !whatsappNumber}
                className="verify-button"
              >
                {loading ? 'Sending...' : 'Verify'}
              </button>
            )}
          </div>
          <p className="help-text">Please include country code (e.g., +91 for India)</p>
          {isVerified && <p className="verified-text">✓ Number verified</p>}
        </div>
        
        {/* Verification Code Entry */}
        {isVerifying && (
          <div className="verification-section">
            <p>Enter the 6-digit verification code sent to your WhatsApp:</p>
            <div className="input-with-button">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
              <button 
                type="button" 
                onClick={handleConfirmVerification}
                disabled={loading || verificationCode.length !== 6}
                className="verify-button"
              >
                {loading ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
            <button 
              type="button" 
              onClick={handleVerify}
              disabled={loading}
              className="resend-button"
            >
              Resend Code
            </button>
          </div>
        )}
        
        {/* Alert Enable/Disable */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggleEnabled}
              disabled={!isVerified}
            />
            Enable WhatsApp Alerts
          </label>
          {!isVerified && <p className="verification-note">You need to verify your WhatsApp number first</p>}
        </div>
        
        {/* Alert Preferences */}
        {isVerified && (
          <div className="alert-preferences">
            <h3>Alert Preferences</h3>
            
            {/* Alert Types */}
            <div className="preferences-section">
              <h4>Alert Types</h4>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={alertPreferences.weather}
                    onChange={(e) => handleAlertPreferenceChange('weather', e.target.checked)}
                    disabled={!isEnabled}
                  />
                  Weather Alerts
                </label>
                <span className="alert-description">
                  Daily weather updates and severe weather warnings
                </span>
              </div>
              
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={alertPreferences.market_prices}
                    onChange={(e) => handleAlertPreferenceChange('market_prices', e.target.checked)}
                    disabled={!isEnabled}
                  />
                  Market Price Alerts
                </label>
                <span className="alert-description">
                  Price changes for crops you grow and sell
                </span>
              </div>
              
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={alertPreferences.crop_diseases}
                    onChange={(e) => handleAlertPreferenceChange('crop_diseases', e.target.checked)}
                    disabled={!isEnabled}
                  />
                  Crop Health & Disease Alerts
                </label>
                <span className="alert-description">
                  Warnings about potential diseases affecting your crops
                </span>
              </div>
            </div>
            
            {/* Alert Frequency */}
            <div className="preferences-section">
              <h4>Alert Frequency</h4>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="frequency"
                    value="daily"
                    checked={alertPreferences.alert_frequency === 'daily'}
                    onChange={() => handleAlertPreferenceChange('alert_frequency', 'daily')}
                    disabled={!isEnabled}
                  />
                  Daily
                </label>
                
                <label>
                  <input
                    type="radio"
                    name="frequency"
                    value="weekly"
                    checked={alertPreferences.alert_frequency === 'weekly'}
                    onChange={() => handleAlertPreferenceChange('alert_frequency', 'weekly')}
                    disabled={!isEnabled}
                  />
                  Weekly
                </label>
                
                <label>
                  <input
                    type="radio"
                    name="frequency"
                    value="important"
                    checked={alertPreferences.alert_frequency === 'important'}
                    onChange={() => handleAlertPreferenceChange('alert_frequency', 'important')}
                    disabled={!isEnabled}
                  />
                  Important Updates Only
                </label>
              </div>
            </div>
            
            {/* Time Preference */}
            <div className="preferences-section">
              <h4>Preferred Time of Day</h4>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="time"
                    value="morning"
                    checked={alertPreferences.time_preference === 'morning'}
                    onChange={() => handleAlertPreferenceChange('time_preference', 'morning')}
                    disabled={!isEnabled}
                  />
                  Morning (7-9 AM)
                </label>
                
                <label>
                  <input
                    type="radio"
                    name="time"
                    value="afternoon"
                    checked={alertPreferences.time_preference === 'afternoon'}
                    onChange={() => handleAlertPreferenceChange('time_preference', 'afternoon')}
                    disabled={!isEnabled}
                  />
                  Afternoon (12-2 PM)
                </label>
                
                <label>
                  <input
                    type="radio"
                    name="time"
                    value="evening"
                    checked={alertPreferences.time_preference === 'evening'}
                    onChange={() => handleAlertPreferenceChange('time_preference', 'evening')}
                    disabled={!isEnabled}
                  />
                  Evening (5-7 PM)
                </label>
              </div>
            </div>
            
            {/* Test Alert Button */}
            <div className="test-alert-section">
              <button
                type="button"
                onClick={handleSendTestAlert}
                disabled={loading || !isVerified || !isEnabled || testAlertSent}
                className="test-alert-button"
              >
                {loading ? 'Sending...' : testAlertSent ? 'Test Alert Sent ✓' : 'Send Test Alert'}
              </button>
              <p className="help-text">
                Send a test message to verify your WhatsApp alerts are working correctly
              </p>
            </div>
          </div>
        )}
        
        {/* Save Button */}
        {isVerified && !isVerifying && (
          <button 
            type="submit" 
            className="save-button" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        )}
      </form>
      
      {/* Informational Section */}
      <div className="whatsapp-info">
        <h3>About WhatsApp Alerts</h3>
        <p>
          KisanMitra can send you important alerts via WhatsApp for:
        </p>
        <ul>
          <li><strong>Weather Alerts:</strong> Get notified about weather changes affecting your farm</li>
          <li><strong>Market Prices:</strong> Receive updates when crop prices change significantly</li>
          <li><strong>Crop Diseases:</strong> Get alerts about potential disease outbreaks in your area</li>
        </ul>
        <p className="privacy-note">
          Your privacy is important to us. We will only send you the alerts you choose to receive,
          and you can opt out at any time.
        </p>
        <p className="note">
          <strong>Note:</strong> To join our WhatsApp service, please send a message to <strong>+14155238886</strong> with the text <strong>join adventure-owner</strong>
        </p>
      </div>
    </div>
  );
};

export default WhatsAppSettings;
