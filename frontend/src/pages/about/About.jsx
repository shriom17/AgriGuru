import React from 'react'
import './about.css'
import Navbar from '../../components/Navbar/Navbar'
const About = () => {
  return (
    <div className='About'>
        <Navbar />
        <div className='about-container'>
            <h1 className='about-title'>About AgriGuru</h1>
            <p className='about-description'>
                AgriGuru is your one-stop solution for all agricultural needs. Our platform connects farmers with experts, providing real-time insights, weather updates, and personalized recommendations to enhance farming practices.
            </p>
            <div className='about-features-title'>
                <h2>Key Features</h2>
            <ul className='about-features-list'>
                <li>95% Accuracy Rate in Crop Predictions</li>
                <li>24/7 Weather Support</li>
                <li>Expert Guidance for Farmers</li>
                <li>Community Support and Resources</li>
            </ul>
            </div>
            <div className='our-services'>
                <h2>Our Services</h2>
                <ul className='services-list'>
                    <li>Crop Analysis and Recommendations</li>
                    <li>Weather Forecasting and Alerts</li>
                    <li>Soil Health Monitoring</li>
                    <li>Pest and Disease Management</li>
                </ul>
            </div>
            <div className='mission'>
                <h2>Our Mission & Visions</h2>
                <p>
                    Our mission is to empower farmers with the knowledge and tools they need to succeed. <br></br>
                    We envision a future where technology and agriculture work hand in hand to create sustainable farming practices that benefit both the environment and the economy.<br></br>
                    Guide by AI Agent and helps to predict crop disease, weather, soil quality
                    </p>
            </div>
        </div>
    </div>
  )
}

export default About