import axios from 'axios';

const API_KEY = '47d4ebad8646ecb836a5bfd90deb5c3d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          // Fallback to a default location (New Delhi, India)
          console.warn('Geolocation failed, using default location');
          resolve({
            lat: 28.6139,
            lon: 77.2090
          });
        }
      );
    } else {
      // Fallback to default location
      resolve({
        lat: 28.6139,
        lon: 77.2090
      });
    }
  });
};

// Get current weather by coordinates
export const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get current weather by city name
export const getCurrentWeatherByCity = async (cityName) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get 5-day weather forecast
export const getWeatherForecast = async (lat, lon) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

// Get tomorrow's weather from 5-day forecast
export const getTomorrowWeather = async (lat, lon) => {
  try {
    const forecastData = await getWeatherForecast(lat, lon);
    
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateString = tomorrow.toISOString().split('T')[0];
    
    // Find forecast entries for tomorrow (usually around 12:00 PM)
    const tomorrowForecasts = forecastData.list.filter(item => {
      const forecastDate = item.dt_txt.split(' ')[0];
      return forecastDate === tomorrowDateString;
    });
    
    if (tomorrowForecasts.length > 0) {
      // Get the midday forecast (closest to 12:00) for better accuracy
      const middayForecast = tomorrowForecasts.find(item => 
        item.dt_txt.includes('12:00:00')
      ) || tomorrowForecasts[Math.floor(tomorrowForecasts.length / 2)];
      
      // Calculate min/max temps for tomorrow
      const temps = tomorrowForecasts.map(item => item.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      
      return {
        ...middayForecast,
        main: {
          ...middayForecast.main,
          temp_min: minTemp,
          temp_max: maxTemp
        },
        city: forecastData.city
      };
    }
    
    // Fallback: return first available forecast
    return {
      ...forecastData.list[0],
      city: forecastData.city
    };
  } catch (error) {
    console.error('Error fetching tomorrow weather data:', error);
    throw error;
  }
};

// Get 7-day weather forecast with weather icons
export const getWeeklyForecast = async (lat, lon) => {
  try {
    const forecastData = await getWeatherForecast(lat, lon);
    
    // Group forecasts by day
    const dailyForecasts = {};
    
    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; // Get YYYY-MM-DD
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          forecasts: []
        };
      }
      dailyForecasts[date].forecasts.push(item);
    });
    
    // Process each day to get the most representative weather
    const weeklyData = Object.values(dailyForecasts).slice(0, 7).map(day => {
      const forecasts = day.forecasts;
      
      // Get midday forecast (12:00) or closest available
      const middayForecast = forecasts.find(f => f.dt_txt.includes('12:00:00')) || 
                            forecasts[Math.floor(forecasts.length / 2)];
      
      // Calculate min/max temperatures for the day
      const temps = forecasts.map(f => f.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      
      // Get day name
      const dateObj = new Date(day.date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        date: day.date,
        dayName,
        weatherMain: middayForecast.weather[0].main,
        weatherIcon: getWeatherEmoji(middayForecast.weather[0].main),
        description: middayForecast.weather[0].description,
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
        humidity: middayForecast.main.humidity
      };
    });
    
    return weeklyData;
  } catch (error) {
    console.error('Error fetching weekly forecast data:', error);
    throw error;
  }
};

// Format temperature
export const formatTemperature = (temp) => {
  return Math.round(temp);
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Convert weather description to emoji
export const getWeatherEmoji = (weatherMain) => {
  const weatherEmojis = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️',
    'Dust': '💨',
    'Sand': '💨',
    'Ash': '💨',
    'Squall': '💨',
    'Tornado': '🌪️'
  };
  
  return weatherEmojis[weatherMain] || '🌤️';
};
