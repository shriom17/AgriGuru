import React, { useState, useEffect } from 'react';
import './WhatsAppSetup.css';

const WhatsAppSetup = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [sandboxInfo, setSandboxInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSandboxInfo();
    }, []);

    const fetchSandboxInfo = async () => {
        try {
            const response = await fetch('/api/whatsapp/sandbox-info');
            const data = await response.json();
            if (data.success) {
                setSandboxInfo(data);
            }
        } catch (err) {
            console.error('Failed to fetch sandbox info:', err);
        }
    };

    const sendVerificationCode = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('/api/whatsapp/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phoneNumber })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess('Verification code sent to your WhatsApp!');
                setCurrentStep(3);
            } else {
                setError(data.error || 'Failed to send verification code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('/api/whatsapp/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    phone_number: phoneNumber, 
                    code: verificationCode 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess('WhatsApp verified successfully! You will now receive KisanMitra alerts.');
                setCurrentStep(4);
            } else {
                setError(data.error || 'Invalid verification code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="whatsapp-setup">
            <div className="setup-header">
                <h2>🌱 Setup WhatsApp Alerts</h2>
                <p>Get KisanMitra farming alerts directly on WhatsApp</p>
            </div>

            <div className="setup-steps">
                <div className="step-indicator">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
                    <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4</div>
                </div>

                {/* Step 1: Join WhatsApp Sandbox */}
                {currentStep === 1 && (
                    <div className="setup-step">
                        <h3>📱 Step 1: Join WhatsApp Sandbox</h3>
                        <div className="sandbox-instructions">
                            <div className="instruction-box">
                                <h4>🔗 Join KisanMitra WhatsApp</h4>
                                <ol>
                                    <li>Open WhatsApp on your phone</li>
                                    <li>Start a new chat with: <strong>+14155238886</strong></li>
                                    <li>Send this exact message:</li>
                                </ol>
                                
                                <div className="join-code-box">
                                    <code>{sandboxInfo?.example_message || 'join [your-code]'}</code>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(sandboxInfo?.example_message)}
                                        className="copy-btn"
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                                
                                <p className="note">
                                    ⚠️ You must send this message exactly as shown to +14155238886
                                </p>
                            </div>
                        </div>
                        
                        <button 
                            className="next-btn"
                            onClick={() => setCurrentStep(2)}
                        >
                            ✅ I've sent the message, continue
                        </button>
                    </div>
                )}

                {/* Step 2: Enter Phone Number */}
                {currentStep === 2 && (
                    <div className="setup-step">
                        <h3>📞 Step 2: Enter Your WhatsApp Number</h3>
                        <div className="phone-input">
                            <input
                                type="tel"
                                placeholder="+91 9876543210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="phone-number-input"
                            />
                            <p className="input-help">
                                Enter your WhatsApp number with country code (e.g., +91 for India)
                            </p>
                        </div>
                        
                        <button 
                            className="verify-btn"
                            onClick={sendVerificationCode}
                            disabled={!phoneNumber || loading}
                        >
                            {loading ? '📤 Sending...' : '📤 Send Verification Code'}
                        </button>
                    </div>
                )}

                {/* Step 3: Enter Verification Code */}
                {currentStep === 3 && (
                    <div className="setup-step">
                        <h3>🔐 Step 3: Enter Verification Code</h3>
                        <p>Check your WhatsApp for a 6-digit code from KisanMitra Bot</p>
                        
                        <div className="code-input">
                            <input
                                type="text"
                                placeholder="123456"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="verification-code-input"
                                maxLength="6"
                            />
                        </div>
                        
                        <button 
                            className="verify-btn"
                            onClick={verifyCode}
                            disabled={verificationCode.length !== 6 || loading}
                        >
                            {loading ? '🔍 Verifying...' : '🔍 Verify Code'}
                        </button>
                        
                        <button 
                            className="resend-btn"
                            onClick={sendVerificationCode}
                            disabled={loading}
                        >
                            📤 Resend Code
                        </button>
                    </div>
                )}

                {/* Step 4: Success */}
                {currentStep === 4 && (
                    <div className="setup-step success">
                        <h3>🎉 WhatsApp Alerts Activated!</h3>
                        <div className="success-message">
                            <p>✅ Your WhatsApp is now verified for KisanMitra alerts</p>
                            <p>📱 You will receive:</p>
                            <ul>
                                <li>🌦️ Weather updates</li>
                                <li>⚠️ Crop disease warnings</li>
                                <li>💰 Market price alerts</li>
                                <li>🌱 Farming tips and advice</li>
                            </ul>
                        </div>
                        
                        <button 
                            className="done-btn"
                            onClick={() => window.location.reload()}
                        >
                            🏠 Return to Dashboard
                        </button>
                    </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                    <div className="message error">
                        ❌ {error}
                    </div>
                )}
                
                {success && (
                    <div className="message success">
                        ✅ {success}
                    </div>
                )}

                {/* Help Section */}
                <div className="help-section">
                    <h4>❓ Need Help?</h4>
                    <details>
                        <summary>Troubleshooting</summary>
                        <ul>
                            <li><strong>Not receiving WhatsApp confirmation?</strong> Make sure you sent the exact join message to +14155238886</li>
                            <li><strong>No verification code?</strong> Check if you've joined the WhatsApp sandbox first</li>
                            <li><strong>Wrong phone number?</strong> Make sure to include the country code (+91 for India)</li>
                            <li><strong>Code expired?</strong> Request a new verification code</li>
                        </ul>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppSetup;
