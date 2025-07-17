import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./home.css"
import backGround from "./homebg.avif"
import Navbar from "../../components/Navbar/Navbar"
import AIChat from "../../components/AIChat/AIChat"

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

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
          <h1 className="home-title">Welcome to AgriGuru</h1>
            <h3 className="home-description">
                Your one-stop solution for all agricultural needs. Explore our services, connect with experts, and enhance your farming experience.
            </h3>
            <button className="home-button" onClick={handleGetStarted}>Get Started</button>
                
                {/* Features Section */}
                <div className="features-container">
                  <div className="feature-box">
                    <div className="feature-icon">🎯</div>
                    <h4 className="feature-title">95% Accuracy Rate</h4>
                    <p className="feature-description">Precise agricultural insights and recommendations</p>
                  </div>
                  <div className="feature-box">
                    <div className="feature-icon">👨‍🌾</div>
                    <h4 className="feature-title">Farmers Help</h4>
                    <p className="feature-description">Expert guidance for all your farming needs</p>
                  </div>
                  <div className="feature-box">
                    <div className="feature-icon">🌤️</div>
                    <h4 className="feature-title">24/7 Weather Support</h4>
                    <p className="feature-description">Real-time weather updates and forecasts</p>
                  </div>
                </div>
                
        </div>
      </div>
      
      {/* AI Chat Component */}
      <AIChat />
    </div>
  )
}

export default Home
