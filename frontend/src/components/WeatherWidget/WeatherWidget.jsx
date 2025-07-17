import React, { useState, useEffect } from 'react';
import { getCurrentLocation, getCurrentWeather, getTomorrowWeather, getWeeklyForecast, formatTemperature, getWeatherEmoji } from '../../services/weatherService';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [tomorrowWeather, setTomorrowWeather] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's current location
      const coords = await getCurrentLocation();
      
      // Get current weather, tomorrow's forecast, and weekly forecast
      const [weatherData, tomorrowData, weeklyData] = await Promise.all([
        getCurrentWeather(coords.lat, coords.lon),
        getTomorrowWeather(coords.lat, coords.lon),
        getWeeklyForecast(coords.lat, coords.lon)
      ]);
      
      setWeather(weatherData);
      setTomorrowWeather(tomorrowData);
      setWeeklyForecast(weeklyData);
      
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = () => {
    fetchWeatherData();
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <h3>🌤️ Weather Forecast</h3>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget error">
        <h3>🌤️ Weather Forecast</h3>
        <p className="error-message">{error}</p>
        <button onClick={refreshWeather} className="refresh-btn">
          🔄 Retry
        </button>
      </div>
    );
  }

  if (!weather) return null;

  // Get current weather data
  const currentWeather = {
    temperature: formatTemperature(weather.main.temp),
    feelsLike: formatTemperature(weather.main.feels_like),
    humidity: weather.main.humidity,
    windSpeed: Math.round(weather.wind.speed * 3.6), // Convert m/s to km/h
    weatherEmoji: getWeatherEmoji(weather.weather[0].main),
    description: weather.weather[0].description,
    cityName: weather.name
  };

  // Get tomorrow's weather data
  const tomorrow = tomorrowWeather ? {
    temperature: formatTemperature(tomorrowWeather.main.temp),
    minTemp: formatTemperature(tomorrowWeather.main.temp_min),
    maxTemp: formatTemperature(tomorrowWeather.main.temp_max),
    humidity: tomorrowWeather.main.humidity,
    windSpeed: Math.round(tomorrowWeather.wind.speed * 3.6),
    weatherEmoji: getWeatherEmoji(tomorrowWeather.weather[0].main),
    description: tomorrowWeather.weather[0].description
  } : null;

  const renderWeatherContent = (weatherData, isToday = true) => (
    <div className="weather-content">
      <div className="weather-main">
        <div className="weather-icon">
          {weatherData.weatherEmoji}
        </div>
        <div className="weather-temp">
          <span className="temperature">
            {isToday ? `${weatherData.temperature}°C` : `${weatherData.maxTemp}°C / ${weatherData.minTemp}°C`}
          </span>
          <span className="description">{weatherData.description}</span>
        </div>
      </div>
      
      {isToday && (
        <div className="weather-location">
          📍 {weatherData.cityName}
        </div>
      )}
      
      <div className="weather-details">
        {isToday && (
          <div className="weather-detail">
            <span className="label">Feels like:</span>
            <span className="value">{weatherData.feelsLike}°C</span>
          </div>
        )}
        <div className="weather-detail">
          <span className="label">Humidity:</span>
          <span className="value">{weatherData.humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="label">Wind:</span>
          <span className="value">{weatherData.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );

  const renderWeeklyForecast = () => (
    <div className="weekly-forecast">
      <h4>7-Day Forecast</h4>
      <div className="forecast-days">
        {weeklyForecast.map((day, index) => (
          <div key={day.date} className="forecast-day">
            <div className="day-name">
              {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day.dayName}
            </div>
            <div className="day-icon">
              {day.weatherIcon}
            </div>
            <div className="day-temps">
              <span className="high-temp">{day.maxTemp}°</span>
              <span className="low-temp">{day.minTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>🌤️ Weather Forecast</h3>
        <button onClick={refreshWeather} className="refresh-btn" title="Refresh Weather">
          🔄
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="weather-tabs">
        <button 
          className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          Today
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tomorrow' ? 'active' : ''}`}
          onClick={() => setActiveTab('tomorrow')}
          disabled={!tomorrowWeather}
        >
          Tomorrow
        </button>
      </div>
      
      {/* Weather Content */}
      {activeTab === 'today' && renderWeatherContent(currentWeather, true)}
      {activeTab === 'tomorrow' && tomorrow && renderWeatherContent(tomorrow, false)}
      {activeTab === 'tomorrow' && !tomorrow && (
        <div className="weather-content">
          <p style={{ textAlign: 'center', opacity: 0.8, padding: '20px' }}>
            Tomorrow's forecast not available
          </p>
        </div>
      )}
      
      {/* 7-Day Forecast */}
      {weeklyForecast.length > 0 && renderWeeklyForecast()}
    </div>
  );
};

export default WeatherWidget;
