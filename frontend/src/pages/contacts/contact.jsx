import React, { useState, useEffect } from 'react';
import './contact.css';

const ContactPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyADOs, setNearbyADOs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample ADO data (In a real app, this would come from an API)
  const adoData = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      designation: "Agricultural Development Officer",
      district: "Central District",
      office: "District Agricultural Office",
      phone: "+91-9876543210",
      email: "rajesh.kumar@agri.gov.in",
      address: "Block A, Agricultural Complex, Sector 10",
      specialization: "Crop Disease Management, Soil Health"
    },
    {
      id: 2,
      name: "Dr. Priya Singh",
      designation: "Senior ADO",
      district: "Eastern District",
      office: "Regional Agricultural Center",
      phone: "+91-9876543211",
      email: "priya.singh@agri.gov.in",
      address: "Agricultural Extension Center, Near City Park",
      specialization: "Organic Farming, Sustainable Agriculture"
    },
    {
      id: 3,
      name: "Mr. Amit Patel",
      designation: "ADO",
      district: "Western District",
      office: "Agricultural Support Office",
      phone: "+91-9876543212",
      email: "amit.patel@agri.gov.in",
      address: "Krishi Bhavan, Market Road",
      specialization: "Modern Farming Techniques, Irrigation"
    }
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // In a real app, we would use these coordinates to fetch nearby ADOs
          // For now, we'll just show all ADOs
          setNearbyADOs(adoData);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setNearbyADOs(adoData);
          setLoading(false);
        }
      );
    } else {
      console.log("Geolocation not supported");
      setNearbyADOs(adoData);
      setLoading(false);
    }
  }, []);

  return (
    <div className="contact-page">
      <h1>Agricultural Development Officers Near You</h1>
      
      {loading ? (
        <div className="loading">Loading nearby ADOs...</div>
      ) : (
        <div className="ado-grid">
          {nearbyADOs.map((ado) => (
            <div key={ado.id} className="ado-card">
              <div className="ado-header">
                <h2>{ado.name}</h2>
                <span className="designation">{ado.designation}</span>
              </div>
              <div className="ado-details">
                <p><strong>District:</strong> {ado.district}</p>
                <p><strong>Office:</strong> {ado.office}</p>
                <p><strong>Specialization:</strong> {ado.specialization}</p>
                <p><strong>Address:</strong> {ado.address}</p>
                <div className="contact-info">
                  <a href={`tel:${ado.phone}`} className="contact-button phone">
                    Call
                  </a>
                  <a href={`mailto:${ado.email}`} className="contact-button email">
                    Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactPage;
