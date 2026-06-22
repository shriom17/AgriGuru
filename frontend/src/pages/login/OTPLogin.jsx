import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './OTPLogin.css';

const OTPLogin = () => {
  const { t } = useTranslation();
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          purpose: 'login'
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`OTP sent to ${email}`);
        setStep(2);
        startResendCooldown();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
          purpose: 'login'
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Login successful!');
        await checkAuthStatus(); // Refresh auth state
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setIsLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          purpose: 'login'
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('New OTP sent to your email');
        startResendCooldown();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-login-container">
      <div className="otp-login-form">
        <div className="otp-header">
          <h2>🔐 Secure Login</h2>
          <p>Sign in to KisanMitra with OTP verification</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {step === 1 ? (
          /* Step 1: Email Input */
          <form onSubmit={handleSendOTP}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="otp-btn primary"
              disabled={isLoading}
            >
              {isLoading ? '📧 Sending OTP...' : '📧 Send OTP'}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOTP}>
            <div className="otp-info">
              <p>📧 OTP sent to: <strong>{email}</strong></p>
              <button 
                type="button" 
                className="change-email-btn"
                onClick={() => setStep(1)}
              >
                Change Email
              </button>
            </div>

            <div className="input-group">
              <label>Enter 6-digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength="6"
                required
                disabled={isLoading}
                className="otp-input"
              />
            </div>

            <button 
              type="submit" 
              className="otp-btn primary"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? '🔄 Verifying...' : '✅ Verify & Login'}
            </button>

            <div className="resend-section">
              {resendCooldown > 0 ? (
                <p className="resend-timer">
                  Resend OTP in {resendCooldown} seconds
                </p>
              ) : (
                <button 
                  type="button" 
                  className="otp-btn secondary"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  🔄 Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        <div className="login-footer">
          <p>
            Don't have an account? 
            <Link to="/signup" className="signup-link"> Sign Up</Link>
          </p>
          <p>
            <Link to="/login" className="regular-login-link">
              Use Password Login Instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;
