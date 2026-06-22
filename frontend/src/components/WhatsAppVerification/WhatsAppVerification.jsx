import React, { useState, useEffect } from 'react';
import './WhatsAppVerification.css';

const WhatsAppVerification = ({ onVerificationSuccess, onCancel }) => {
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (step === 2) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your WhatsApp number');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +919876543210)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5002/api/whatsapp/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Verification code sent to your WhatsApp!');
        setStep(2);
        setTimeRemaining(300); // 5 minutes
        setCanResend(false);
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code should be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5002/api/whatsapp/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          verification_code: verificationCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('WhatsApp number verified successfully!');
        if (onVerificationSuccess) {
          onVerificationSuccess(phoneNumber);
        }
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5002/api/whatsapp/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('New verification code sent!');
        setTimeRemaining(300); // 5 minutes
        setCanResend(false);
        setVerificationCode('');
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
    setVerificationCode('');
    setError('');
    setSuccess('');
    setTimeRemaining(0);
  };

  return (
    <div className="whatsapp-verification">
      <div className="verification-header">
        <h3>🌱 WhatsApp Verification</h3>
        <p>Verify your WhatsApp number to receive KisanMitra alerts</p>
      </div>

      {step === 1 && (
        <div className="step-1">
          <div className="input-group">
            <label htmlFor="phoneNumber">WhatsApp Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+919876543210"
              disabled={loading}
            />
            <small>Include country code (e.g., +91 for India)</small>
          </div>

          <div className="button-group">
            <button
              onClick={sendVerificationCode}
              disabled={loading}
              className="send-button"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
            {onCancel && (
              <button onClick={onCancel} className="cancel-button">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-2">
          <div className="phone-display">
            <p>Code sent to: <strong>{phoneNumber}</strong></p>
            <button onClick={goBack} className="change-number">
              Change number
            </button>
          </div>

          <div className="input-group">
            <label htmlFor="verificationCode">Enter 6-digit code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              disabled={loading}
              maxLength="6"
            />
            <small>Check your WhatsApp messages</small>
          </div>

          <div className="timer-section">
            {timeRemaining > 0 ? (
              <p>Code expires in: <strong>{formatTime(timeRemaining)}</strong></p>
            ) : (
              <p>Code has expired</p>
            )}
          </div>

          <div className="button-group">
            <button
              onClick={verifyCode}
              disabled={loading || verificationCode.length !== 6}
              className="verify-button"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            
            <button
              onClick={resendCode}
              disabled={loading || !canResend}
              className={`resend-button ${!canResend ? 'disabled' : ''}`}
            >
              {loading ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="message error">
          <span className="icon">❌</span>
          {error}
        </div>
      )}

      {success && (
        <div className="message success">
          <span className="icon">✅</span>
          {success}
        </div>
      )}

      <div className="help-section">
        <details>
          <summary>Need help?</summary>
          <div className="help-content">
            <p><strong>Not receiving the code?</strong></p>
            <ul>
              <li>Make sure your WhatsApp is connected to internet</li>
              <li>Check if the number is correct</li>
              <li>Wait for 1 minute before requesting a new code</li>
              <li>Make sure you have joined the Twilio sandbox first</li>
            </ul>
            <p><strong>Sandbox Setup:</strong> Send "join [sandbox-code]" to +14155238886</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default WhatsAppVerification;
