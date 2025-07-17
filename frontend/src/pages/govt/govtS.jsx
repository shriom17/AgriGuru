import React from 'react';
import './govtS.css';
import Navbar from '../../components/Navbar/Navbar';

const govtS = () => {
  const schemes = [
    {
      id: 1,
      title: "PM-KISAN",
      description: "Direct income support of ₹6,000 per year to eligible farmer families",
      eligibility: "All landholding farmer families with cultivable landholding",
      benefits: ["Financial support", "Three equal installments", "Direct bank transfer"],
      icon: "🌾",
      officialUrl: "https://pmkisan.gov.in/"
    },
    {
      id: 2,
      title: "Pradhan Mantri Fasal Bima Yojana",
      description: "Comprehensive crop insurance scheme to protect farmers against crop failure",
      eligibility: "All farmers growing notified crops in notified areas",
      benefits: ["Crop loss protection", "Low premium rates", "Quick claim settlement"],
      icon: "🛡️",
      officialUrl: "https://pmfby.gov.in/"
    },
    {
      id: 3,
      title: "Kisan Credit Card",
      description: "Provides farmers with timely access to credit",
      eligibility: "All farmers, sharecroppers, and agricultural laborers",
      benefits: ["Easy credit access", "Flexible repayment", "Lower interest rates"],
      icon: "💳",
      officialUrl: "https://www.nabard.org/content1.aspx?id=1720&catid=23&mid=23"
    },
    {
      id: 4,
      title: "Soil Health Card Scheme",
      description: "Provides information on soil health and recommended fertilizers",
      eligibility: "All farmers across India",
      benefits: ["Free soil testing", "Fertilizer recommendations", "Improved crop yield"],
      icon: "🌱",
      officialUrl: "https://soilhealth.dac.gov.in/"
    },
    {
      id: 5,
      title: "PM Krishi Sinchai Yojana",
      description: "Enhances water efficiency through 'Per Drop More Crop' and precision irrigation technologies",
      eligibility: "Farmers seeking improved irrigation and water conservation",
      benefits: [
        "Micro-irrigation systems",
        "Water conservation infrastructure",
        "Enhanced water use efficiency",
        "Sustainable agriculture practices"
      ],
      icon: "💧",
      officialUrl: "https://pmksy.gov.in/"
    },
    {
      id: 6,
      title: "National Agricultural Market (eNAM)",
      description: "Online trading platform for agricultural commodities to get better price discovery",
      eligibility: "Farmers, traders, and buyers registered on eNAM platform",
      benefits: [
        "Direct market access",
        "Better price discovery",
        "Transparent auction process",
        "Reduced market fees"
      ],
      icon: "🏪",
      officialUrl: "https://www.enam.gov.in/"
    }
  ];

  const handleLearnMore = (url) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <div className="government-schemes">
      <Navbar />
      <div className="schemes-container">
        <div className="schemes-header">
          <h1>🏛️ Government Agricultural Schemes</h1>
          <p>Explore various government initiatives to support farmers</p>
        </div>
        
        <div className="schemes-grid">
          {schemes.map(scheme => (
            <div key={scheme.id} className="scheme-card">
              <div className="scheme-icon">{scheme.icon}</div>
              <h2>{scheme.title}</h2>
              <p className="scheme-description">{scheme.description}</p>
              <div className="scheme-details">
                <div className="eligibility">
                  <h3>Eligibility</h3>
                  <p>{scheme.eligibility}</p>
                </div>
                <div className="benefits">
                  <h3>Benefits</h3>
                  <ul>
                    {scheme.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button 
                className="learn-more-btn" 
                onClick={() => handleLearnMore(scheme.officialUrl)}
              >
                Learn More 🔗
              </button>
            </div>
          ))}
        </div>

        <div className="contact-section">
          <h2>Need Help?</h2>
          <p>Contact your local agricultural office or call our toll-free number:</p>
          <a href="tel:1800-180-1551" className="helpline-btn">
            📞 1800-180-1551
          </a>
        </div>
      </div>
    </div>
  );
};

export default govtS;