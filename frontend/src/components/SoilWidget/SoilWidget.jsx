import React, { useState, useEffect } from 'react';
import { getSoilData, analyzeSoilHealth, getSoilType, getSoilColor, getSoilHealthEmoji } from '../../services/soilService';
import './SoilWidget.css';


const SoilWidget = () => {
  const [soilData, setSoilData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        setLoading(true);
        
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              setLocation({ lat, lon });
              
              try {
                const data = await getSoilData(lat, lon);
                setSoilData(data);
                const soilAnalysis = analyzeSoilHealth(data);
                setAnalysis(soilAnalysis);
                setError(null);
              } catch (err) {
                console.error('Error fetching soil data:', err);
                setError('Unable to fetch soil data');
              } finally {
                setLoading(false);
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
              // Use default location (Delhi, India) if geolocation fails
              const defaultLat = 28.6139;
              const defaultLon = 77.2090;
              setLocation({ lat: defaultLat, lon: defaultLon });
              
              getSoilData(defaultLat, defaultLon)
                .then(data => {
                  setSoilData(data);
                  const soilAnalysis = analyzeSoilHealth(data);
                  setAnalysis(soilAnalysis);
                  setError('Location access denied. Showing sample data for Delhi, India.');
                })
                .catch(err => {
                  console.error('Error with fallback soil data:', err);
                  setError('Unable to fetch soil data');
                })
                .finally(() => setLoading(false));
            }
          );
        } else {
          setError('Geolocation not supported');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in fetchSoilData:', err);
        setError('Unable to fetch soil data');
        setLoading(false);
      }
    };

    fetchSoilData();
  }, []);

  const refreshSoilData = async () => {
    if (location.lat && location.lon) {
      setLoading(true);
      try {
        const data = await getSoilData(location.lat, location.lon);
        setSoilData(data);
        const soilAnalysis = analyzeSoilHealth(data);
        setAnalysis(soilAnalysis);
        setError(null);
      } catch (err) {
        console.error('Error refreshing soil data:', err);
        setError('Unable to refresh soil data');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="soil-widget">
        <div className="widget-header">
          <h3>🌱 Soil Health</h3>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing soil...</p>
        </div>
      </div>
    );
  }

  if (error && !soilData) {
    return (
      <div className="soil-widget">
        <div className="widget-header">
          <h3>🌱 Soil Health</h3>
          <button onClick={refreshSoilData} className="refresh-btn">🔄</button>
        </div>
        <div className="error">
          <p>{error}</p>
          <button onClick={refreshSoilData} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  const soilType = getSoilType(soilData?.sand || 45, soilData?.clay || 25, soilData?.silt || 30);
  const soilColor = getSoilColor(soilData?.organicCarbon || 2.3);
  const healthEmoji = getSoilHealthEmoji(analysis?.overall || 'Good');

  return (
    <div className="soil-widget">
      <div className="widget-header">
        <h3>{healthEmoji} Soil Health</h3>
        <button onClick={refreshSoilData} className="refresh-btn" title="Refresh">🔄</button>
      </div>
      
      {error && (
        <div className="warning">
          <small>{error}</small>
        </div>
      )}

      <div className="soil-overview">
        <div className="soil-status">
          <div className="status-indicator" style={{ backgroundColor: soilColor }}>
            <span className="status-text">{analysis?.overall || 'Good'}</span>
          </div>
          <div className="soil-type">
            <strong>{soilType}</strong>
            <small>Soil Type</small>
          </div>
        </div>
        
        <div className="location-info">
          <small>📍 {soilData?.location || 'Unknown Location'}</small>
          <small>📏 Depth: {soilData?.depth || '0-30cm'}</small>
        </div>
      </div>

      <div className="soil-metrics">
        <div className="metric">
          <span className="metric-label">pH Level</span>
          <span className="metric-value">{soilData?.ph || 6.8}</span>
          <span className="metric-status">{analysis?.phStatus || 'Optimal'}</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Nitrogen</span>
          <span className="metric-value">{soilData?.nitrogen || 85}</span>
          <span className="metric-unit">mg/kg</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Organic Carbon</span>
          <span className="metric-value">{soilData?.organicCarbon || 2.3}</span>
          <span className="metric-unit">%</span>
        </div>
        
        {soilData?.moisture && (
          <div className="metric">
            <span className="metric-label">Moisture</span>
            <span className="metric-value">{soilData.moisture}</span>
            <span className="metric-unit">%</span>
          </div>
        )}
      </div>

      <div className="soil-composition">
        <h4>Soil Composition</h4>
        <div className="composition-bars">
          <div className="composition-item">
            <span>Sand: {soilData?.sand || 45}%</span>
            <div className="progress-bar">
              <div 
                className="progress-fill sand" 
                style={{ width: `${soilData?.sand || 45}%` }}
              ></div>
            </div>
          </div>
          <div className="composition-item">
            <span>Clay: {soilData?.clay || 25}%</span>
            <div className="progress-bar">
              <div 
                className="progress-fill clay" 
                style={{ width: `${soilData?.clay || 25}%` }}
              ></div>
            </div>
          </div>
          <div className="composition-item">
            <span>Silt: {soilData?.silt || 30}%</span>
            <div className="progress-bar">
              <div 
                className="progress-fill silt" 
                style={{ width: `${soilData?.silt || 30}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {analysis?.recommendations && analysis.recommendations.length > 0 && (
        <div className="recommendations">
          <h4>💡 Recommendations</h4>
          <ul>
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {soilData?.lastUpdated && (
        <div className="last-updated">
          <small>Last updated: {soilData.lastUpdated}</small>
        </div>
      )}
    </div>
  );
};

export default SoilWidget;
