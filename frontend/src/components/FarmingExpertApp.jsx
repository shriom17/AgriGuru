// Enhanced React Frontend for Farming Expert
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FarmingExpertApp.css';

const API_BASE_URL = 'http://localhost:5000/api';

function FarmingExpertApp() {
    const [activeTab, setActiveTab] = useState('expert-advice');
    const [query, setQuery] = useState('');
    const [advice, setAdvice] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [marketData, setMarketData] = useState(null);

    const crops = ['rice', 'wheat', 'cotton', 'maize', 'sugarcane', 'vegetables'];
    const seasons = ['kharif', 'rabi', 'zaid'];

    const handleExpertAdvice = async () => {
        if (!query.trim()) return;
        
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/expert-advice`, {
                query,
                crop: selectedCrop,
                season: selectedSeason
            });
            
            setAdvice(response.data.advice);
        } catch (error) {
            console.error('Error getting expert advice:', error);
            setAdvice('Error getting expert advice. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageAnalysis = async () => {
        if (!imageFile) return;
        
        setLoading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('crop_type', selectedCrop);
        
        try {
            const response = await axios.post(`${API_BASE_URL}/analyze-crop`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setAnalysisResult(response.data);
        } catch (error) {
            console.error('Error analyzing image:', error);
            setAnalysisResult({ error: 'Error analyzing image. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const getWeatherAdvice = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/weather-advice`, {
                location: 'Delhi',
                crop: selectedCrop
            });
            
            setWeatherData(response.data);
        } catch (error) {
            console.error('Error getting weather advice:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMarketInsights = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/market-insights`, {
                params: { crop: selectedCrop || 'rice' }
            });
            
            setMarketData(response.data);
        } catch (error) {
            console.error('Error getting market insights:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatAdvice = (text) => {
        return text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    return (
        <div className="farming-expert-app">
            <header className="app-header">
                <h1>🌾 AgriGuru - Farming Expert AI</h1>
                <p>Your comprehensive agricultural assistant</p>
            </header>

            <nav className="tab-navigation">
                <button 
                    className={activeTab === 'expert-advice' ? 'active' : ''}
                    onClick={() => setActiveTab('expert-advice')}
                >
                    🧠 Expert Advice
                </button>
                <button 
                    className={activeTab === 'crop-analysis' ? 'active' : ''}
                    onClick={() => setActiveTab('crop-analysis')}
                >
                    🔍 Crop Analysis
                </button>
                <button 
                    className={activeTab === 'weather' ? 'active' : ''}
                    onClick={() => setActiveTab('weather')}
                >
                    🌤️ Weather Advice
                </button>
                <button 
                    className={activeTab === 'market' ? 'active' : ''}
                    onClick={() => setActiveTab('market')}
                >
                    📈 Market Insights
                </button>
            </nav>

            <main className="app-content">
                {activeTab === 'expert-advice' && (
                    <div className="expert-advice-section">
                        <h2>🧠 Ask the Farming Expert</h2>
                        
                        <div className="input-group">
                            <select 
                                value={selectedCrop} 
                                onChange={(e) => setSelectedCrop(e.target.value)}
                            >
                                <option value="">Select Crop (Optional)</option>
                                {crops.map(crop => (
                                    <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                                ))}
                            </select>
                            
                            <select 
                                value={selectedSeason} 
                                onChange={(e) => setSelectedSeason(e.target.value)}
                            >
                                <option value="">Select Season (Optional)</option>
                                {seasons.map(season => (
                                    <option key={season} value={season}>{season.charAt(0).toUpperCase() + season.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask your farming question here..."
                            rows={4}
                        />
                        
                        <button onClick={handleExpertAdvice} disabled={loading}>
                            {loading ? 'Getting Advice...' : 'Get Expert Advice'}
                        </button>
                        
                        {advice && (
                            <div className="advice-result">
                                <h3>Expert Advice:</h3>
                                <div dangerouslySetInnerHTML={{ __html: formatAdvice(advice) }} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'crop-analysis' && (
                    <div className="crop-analysis-section">
                        <h2>🔍 Crop Disease Analysis</h2>
                        
                        <div className="input-group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                            
                            <select 
                                value={selectedCrop} 
                                onChange={(e) => setSelectedCrop(e.target.value)}
                            >
                                <option value="">Select Crop Type</option>
                                {crops.map(crop => (
                                    <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button onClick={handleImageAnalysis} disabled={loading || !imageFile}>
                            {loading ? 'Analyzing...' : 'Analyze Crop Image'}
                        </button>
                        
                        {analysisResult && (
                            <div className="analysis-result">
                                <h3>Analysis Results:</h3>
                                {analysisResult.disease_analysis && (
                                    <div>
                                        <p><strong>Disease:</strong> {analysisResult.disease_analysis.disease}</p>
                                        <p><strong>Confidence:</strong> {(analysisResult.disease_analysis.confidence * 100).toFixed(1)}%</p>
                                    </div>
                                )}
                                {analysisResult.expert_advice && (
                                    <div className="expert-advice">
                                        <h4>Expert Recommendation:</h4>
                                        <div dangerouslySetInnerHTML={{ __html: formatAdvice(analysisResult.expert_advice) }} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'weather' && (
                    <div className="weather-section">
                        <h2>🌤️ Weather-Based Farming Advice</h2>
                        
                        <div className="input-group">
                            <select 
                                value={selectedCrop} 
                                onChange={(e) => setSelectedCrop(e.target.value)}
                            >
                                <option value="">Select Crop (Optional)</option>
                                {crops.map(crop => (
                                    <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button onClick={getWeatherAdvice} disabled={loading}>
                            {loading ? 'Getting Weather Data...' : 'Get Weather Advice'}
                        </button>
                        
                        {weatherData && (
                            <div className="weather-result">
                                <h3>Current Weather:</h3>
                                <div className="weather-info">
                                    <p><strong>Temperature:</strong> {weatherData.weather_data.temperature}°C</p>
                                    <p><strong>Humidity:</strong> {weatherData.weather_data.humidity}%</p>
                                    <p><strong>Rainfall:</strong> {weatherData.weather_data.rainfall}mm</p>
                                    <p><strong>Wind Speed:</strong> {weatherData.weather_data.wind_speed} km/h</p>
                                </div>
                                
                                <h4>Weather-Based Advice:</h4>
                                <div dangerouslySetInnerHTML={{ __html: formatAdvice(weatherData.advice) }} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'market' && (
                    <div className="market-section">
                        <h2>📈 Market Insights</h2>
                        
                        <div className="input-group">
                            <select 
                                value={selectedCrop} 
                                onChange={(e) => setSelectedCrop(e.target.value)}
                            >
                                <option value="">Select Crop</option>
                                {crops.map(crop => (
                                    <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button onClick={getMarketInsights} disabled={loading}>
                            {loading ? 'Getting Market Data...' : 'Get Market Insights'}
                        </button>
                        
                        {marketData && (
                            <div className="market-result">
                                <h3>Market Information:</h3>
                                <div className="market-info">
                                    <p><strong>Current Price:</strong> ₹{marketData.market_data.current_price}/quintal</p>
                                    <p><strong>Price Trend:</strong> {marketData.market_data.price_trend}</p>
                                    <p><strong>Price Change:</strong> {marketData.market_data.price_change}</p>
                                    <p><strong>Market Demand:</strong> {marketData.market_data.market_demand}</p>
                                    <p><strong>Supply Status:</strong> {marketData.market_data.supply_status}</p>
                                </div>
                                
                                <h4>Market Advice:</h4>
                                <div dangerouslySetInnerHTML={{ __html: formatAdvice(marketData.advice) }} />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default FarmingExpertApp;
