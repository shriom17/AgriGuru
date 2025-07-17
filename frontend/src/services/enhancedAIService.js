// Enhanced AI Service for AgriGuru Farming Expert
const API_BASE_URL = 'http://localhost:5000/api';

class EnhancedAIService {
  /**
   * Get expert farming advice
   * @param {string} query - The farming question
   * @param {string} crop - Optional crop type (rice, wheat, cotton, maize)
   * @param {string} season - Optional season (kharif, rabi, summer)
   * @param {string} location - Optional location
   * @returns {Promise<Object>} - AI response with advice
   */
  async getExpertAdvice(query, crop = null, season = null, location = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/expert-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          crop: crop,
          season: season,
          location: location
        }),
        timeout: 10000 // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        advice: data.advice,
        context: data.context,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Enhanced AI Service error:', error);
      
      // Provide fallback response instead of just error
      return {
        success: false,
        error: error.message,
        advice: this.getFallbackAdvice(query, crop, season)
      };
    }
  }

  /**
   * Analyze crop image for diseases
   * @param {File} imageFile - The image file to analyze
   * @param {string} cropType - Type of crop
   * @returns {Promise<Object>} - Analysis result with advice
   */
  async analyzeCrop(imageFile, cropType = 'general') {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('crop_type', cropType);

      const response = await fetch(`${API_BASE_URL}/analyze-crop`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        disease_analysis: data.disease_analysis,
        expert_advice: data.expert_advice,
        crop_type: data.crop_type
      };
    } catch (error) {
      console.error('Crop analysis error:', error);
      return {
        success: false,
        error: error.message,
        advice: `Sorry, I couldn't analyze the crop image. Error: ${error.message}`
      };
    }
  }

  /**
   * Get weather-based farming advice
   * @param {string} location - Location for weather data
   * @param {string} crop - Optional crop type
   * @returns {Promise<Object>} - Weather advice
   */
  async getWeatherAdvice(location = 'Delhi', crop = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/weather-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location,
          crop: crop
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        weather_data: data.weather_data,
        advice: data.advice,
        location: data.location
      };
    } catch (error) {
      console.error('Weather advice error:', error);
      return {
        success: false,
        error: error.message,
        advice: `Sorry, I couldn't get weather advice. Error: ${error.message}`
      };
    }
  }

  /**
   * Get market insights and price trends
   * @param {string} crop - Crop type
   * @param {string} location - Location
   * @returns {Promise<Object>} - Market insights
   */
  async getMarketInsights(crop = 'rice', location = 'india') {
    try {
      const response = await fetch(`${API_BASE_URL}/market-insights?crop=${crop}&location=${location}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        market_data: data.market_data,
        market_advice: data.market_advice,
        crop: data.crop
      };
    } catch (error) {
      console.error('Market insights error:', error);
      return {
        success: false,
        error: error.message,
        advice: `Sorry, I couldn't get market insights. Error: ${error.message}`
      };
    }
  }

  /**
   * Get seasonal farming calendar
   * @param {string} season - Season type (kharif, rabi, summer)
   * @param {string} location - Location
   * @returns {Promise<Object>} - Seasonal advice
   */
  async getSeasonalCalendar(season = 'kharif', location = 'india') {
    try {
      const response = await fetch(`${API_BASE_URL}/seasonal-calendar?season=${season}&location=${location}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        seasonal_advice: data.seasonal_advice,
        season: data.season,
        location: data.location
      };
    } catch (error) {
      console.error('Seasonal calendar error:', error);
      return {
        success: false,
        error: error.message,
        advice: `Sorry, I couldn't get seasonal calendar. Error: ${error.message}`
      };
    }
  }

  /**
   * Extract crop and season from user query
   * @param {string} query - User query
   * @returns {Object} - Extracted crop and season
   */
  extractCropAndSeason(query) {
    const queryLower = query.toLowerCase();
    
    // Extract crop
    let crop = null;
    if (queryLower.includes('rice') || queryLower.includes('paddy')) {
      crop = 'rice';
    } else if (queryLower.includes('wheat')) {
      crop = 'wheat';
    } else if (queryLower.includes('cotton')) {
      crop = 'cotton';
    } else if (queryLower.includes('maize') || queryLower.includes('corn')) {
      crop = 'maize';
    }

    // Extract season
    let season = null;
    if (queryLower.includes('kharif') || queryLower.includes('monsoon')) {
      season = 'kharif';
    } else if (queryLower.includes('rabi') || queryLower.includes('winter')) {
      season = 'rabi';
    } else if (queryLower.includes('summer')) {
      season = 'summer';
    }

    return { crop, season };
  }

  /**
   * Format AI response for better display
   * @param {string} advice - Raw AI advice
   * @returns {string} - Formatted advice
   */
  formatAdvice(advice) {
    // Convert markdown-style formatting to HTML-friendly format
    return advice
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  /**
   * Check if backend server is running
   * @returns {Promise<boolean>} - Server status
   */
  async checkServerStatus() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`, {
        method: 'GET'
      });
      return response.ok;
    } catch (error) {
      console.error('Server status check failed:', error);
      return false;
    }
  }

  /**
   * Provide fallback advice when backend is not available
   * @param {string} query - User query
   * @param {string} crop - Crop type
   * @param {string} season - Season
   * @returns {string} - Fallback advice
   */
  getFallbackAdvice(query, crop, season) {
    const queryLower = query.toLowerCase();
    
    // Basic fallback advice based on keywords
    if (queryLower.includes('rice') || crop === 'rice') {
      return `🌾 **Rice Cultivation Tips** (Offline Mode)\n\n` +
        `**Basic Rice Growing Guidelines:**\n` +
        `• Plant during kharif season (June-July)\n` +
        `• Requires 800-1200mm rainfall\n` +
        `• Optimal temperature: 20-35°C\n` +
        `• Soil pH: 5.5-7.0\n` +
        `• Harvest in 90-120 days\n\n` +
        `**Note:** For detailed, personalized advice, please start the AgriGuru backend server.`;
    }
    
    if (queryLower.includes('wheat') || crop === 'wheat') {
      return `🌾 **Wheat Cultivation Tips** (Offline Mode)\n\n` +
        `**Basic Wheat Growing Guidelines:**\n` +
        `• Plant during rabi season (November-December)\n` +
        `• Requires 600-800mm rainfall\n` +
        `• Optimal temperature: 15-25°C\n` +
        `• Soil pH: 6.0-7.5\n` +
        `• Harvest in 100-130 days\n\n` +
        `**Note:** For detailed, personalized advice, please start the AgriGuru backend server.`;
    }
    
    if (queryLower.includes('cotton') || crop === 'cotton') {
      return `🌾 **Cotton Cultivation Tips** (Offline Mode)\n\n` +
        `**Basic Cotton Growing Guidelines:**\n` +
        `• Plant during kharif season (May-June)\n` +
        `• Requires 600-800mm rainfall\n` +
        `• Optimal temperature: 21-35°C\n` +
        `• Soil pH: 5.8-8.0\n` +
        `• Harvest in 160-180 days\n\n` +
        `**Note:** For detailed, personalized advice, please start the AgriGuru backend server.`;
    }
    
    if (queryLower.includes('fertilizer') || queryLower.includes('nutrient')) {
      return `🧪 **General Fertilizer Guidelines** (Offline Mode)\n\n` +
        `**Basic NPK Requirements:**\n` +
        `• **Nitrogen (N):** For leaf growth\n` +
        `• **Phosphorus (P):** For root development\n` +
        `• **Potassium (K):** For disease resistance\n` +
        `• Apply based on soil test results\n` +
        `• Use organic alternatives when possible\n\n` +
        `**Note:** For crop-specific fertilizer schedules, please start the AgriGuru backend server.`;
    }
    
    if (queryLower.includes('pest') || queryLower.includes('disease')) {
      return `🐛 **General Pest Management** (Offline Mode)\n\n` +
        `**Integrated Pest Management:**\n` +
        `• Regular field monitoring\n` +
        `• Use resistant crop varieties\n` +
        `• Practice crop rotation\n` +
        `• Biological control methods\n` +
        `• Targeted chemical control if needed\n\n` +
        `**Note:** For specific pest identification and treatment, please start the AgriGuru backend server.`;
    }
    
    if (queryLower.includes('season') || queryLower.includes('calendar')) {
      return `📅 **Seasonal Farming Calendar** (Offline Mode)\n\n` +
        `**General Seasonal Guidelines:**\n` +
        `• **Kharif Season (June-October):** Rice, cotton, sugarcane\n` +
        `• **Rabi Season (November-April):** Wheat, barley, mustard\n` +
        `• **Summer Season (March-June):** Fodder crops, vegetables\n` +
        `• Plan according to monsoon patterns\n\n` +
        `**Note:** For detailed seasonal activities, please start the AgriGuru backend server.`;
    }
    
    // Default fallback
    return `🌾 **AgriGuru Farming Assistant** (Offline Mode)\n\n` +
      `I'm currently unable to connect to the enhanced AI backend, but I can provide basic farming guidance.\n\n` +
      `**To get full expert advice:**\n` +
      `1. Go to the backend folder\n` +
      `2. Run: python farming_expert_app.py\n` +
      `3. Wait for "Server running on http://localhost:5000"\n` +
      `4. Then ask your question again\n\n` +
      `**Your question:** "${query}"\n\n` +
      `The enhanced AI can provide detailed, personalized advice for:\n` +
      `• Crop cultivation guides\n` +
      `• Fertilizer recommendations\n` +
      `• Pest management strategies\n` +
      `• Seasonal farming calendar\n` +
      `• Market insights\n` +
      `• Weather-based advice`;
  }
}

// Export singleton instance
const enhancedAIService = new EnhancedAIService();
export default enhancedAIService;
