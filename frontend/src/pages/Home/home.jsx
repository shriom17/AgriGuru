import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import "./home.css"
import backGround from "./homebg.avif"
import Navbar from "../../components/Navbar/Navbar"
import AIChat from "../../components/AIChat/AIChat"
import WeatherWidget from "../../components/WeatherWidget/WeatherWidget"
import UserChat from "../../components/UserChat/UserChat"

import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { user: currentUser } = useAuth();
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleWeatherCardClick = () => {
    setShowWeatherModal(true);
  };

  const closeWeatherModal = () => {
    setShowWeatherModal(false);
  };

  const handleAIChatClick = () => {
    // Find and click the AI Chat toggle button
    const aiChatButton = document.querySelector('.chat-toggle-btn');
    if (aiChatButton) {
      aiChatButton.click();
    } else {
      // If button not found, scroll to bottom where AI chat usually is
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleExpertAdviceClick = () => {
    // Navigate to AgriGuide
    navigate('/kheti-saath');
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showWeatherModal) {
        closeWeatherModal();
      }
    };

    if (showWeatherModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showWeatherModal]);

  return (
    <div className="home-container">
      <Navbar />
      <div 
        className="homebg" 
        style={{
          backgroundImage: `url(${backGround})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        <div className="content">
          <h1 className="home-title">{t('homepage.hero.title')}</h1>
            <h3 className="home-description">
                {t('homepage.hero.description')}
            </h3>
            <button className="home-button" onClick={handleGetStarted}>{t('homepage.hero.cta_primary')}</button>
                {/* Features Section */}
                <div className="features-container">
                  <div 
                    className="feature-box ai-chat-feature clickable"
                    onClick={handleAIChatClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAIChatClick();
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Open AI-powered chat assistant"
                  >
                    <div className="feature-icon">🎯</div>
                    <h4 className="feature-title">{t('homepage.features.ai_chat.title')}</h4>
                    <p className="feature-description">{t('homepage.features.ai_chat.description')}</p>
                  </div>
                  <div 
                    className="feature-box expert-advice-feature clickable"
                    onClick={handleExpertAdviceClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleExpertAdviceClick();
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Navigate to AgriGuide expert advice"
                  >
                    <div className="feature-icon">👨‍🌾</div>
                    <h4 className="feature-title">{t('homepage.features.expert_advice.title')}</h4>
                    <p className="feature-description">{t('homepage.features.expert_advice.description')}</p>
                  </div>
                  <div 
                    className="feature-box weather-feature clickable" 
                    onClick={handleWeatherCardClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleWeatherCardClick();
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Open weather forecast modal"
                  >
                    <div className="feature-icon">🌤️</div>
                    <h4 className="feature-title">{t('homepage.features.weather_integration.title')}</h4>
                    <p className="feature-description">{t('homepage.features.weather_integration.description')}</p>
                  </div>
                  <div 
                    className="feature-box marketplace-feature clickable" 
                    onClick={() => navigate('/marketplace')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('/marketplace');
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Navigate to KisanMitra Marketplace"
                  >
                    <div className="feature-icon">🛒</div>
                    <h4 className="feature-title">{t('ecommerce.title')}</h4>
                    <p className="feature-description">{t('ecommerce.subtitle')}</p>
                  </div>
                </div>
        </div>
      </div>
      {/* Farmer ChatBar (floating icon and chat) */}
      {/* Always render ChatBox, but pass currentUser as null until login. ChatBox will handle hiding itself. */}
      
      {/* User-to-User Chat Component */}
      <UserChat />
      
      {/* AI Chat Component */}
      <AIChat />
      
      {/* Weather Modal */}
      {showWeatherModal && (
        <div 
          className="weather-modal-overlay" 
          onClick={closeWeatherModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="weather-modal-title"
        >
          <div className="weather-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="weather-modal-header">
              <h3 id="weather-modal-title">🌤️ Weather Forecast</h3>
              <button 
                className="weather-modal-close" 
                onClick={closeWeatherModal}
                aria-label="Close weather modal"
                autoFocus
              >
                ×
              </button>
            </div>
            <div className="weather-modal-body">
              <WeatherWidget />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
