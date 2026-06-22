// Enhanced AI Service for KisanMitra Farming Expert
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Debug logging for development only
if (process.env.NODE_ENV !== 'production') {
  console.log('🔍 AI Backend URL:', API_BASE_URL);
}

class EnhancedAIService {
  /**
   * Multilingual AI Chat endpoint using Enhanced Annapurna
   * @param {string} message - The chat message
   * @param {Object} context - Additional context (crop, season, location, etc.)
   * @returns {Promise<Object>} - AI chat response with language information
   */
  async chat(message, context = {}) {
    try {
      console.log('📤 Sending chat request to:', `${API_BASE_URL}/chat`);
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: context,
          language: context.language || 'en'
        }),
        timeout: 20000 // 20 second timeout for AI processing
      });

      console.log('📥 Chat response status:', response.status);

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Chat response received');
      
      // Handle multilingual response data
      return {
        success: true,
        advice: data.advice,
        context: data.context,
        model_type: data.model_type,
        language_info: data.language_info || { language: 'unknown', region: 'unknown' },
        regional_context: data.regional_context || 'India',
        multilingual_support: data.multilingual_support || false,
        provider: data.provider || 'groq',
        timestamp: data.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ AI Chat error:', error.name, error.message);
      
      return {
        success: false,
        error: error.message,
        advice: this.getFallbackChatResponse(message, context),
        language_info: { language: 'unknown', region: 'unknown' },
        multilingual_support: false
      };
    }
  }

  /**
   * Get expert farming advice (legacy compatibility)
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
   * Get AI model information and status
   * @returns {Promise<Object>} - Model information
   */
  async getModelInfo() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/model-info`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        model_info: data.model_info,
        ai_backend_status: data.ai_backend_status,
        recent_conversations: data.recent_conversations
      };
    } catch (error) {
      console.error('Model info error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get conversation history
   * @param {number} limit - Number of conversations to retrieve
   * @returns {Promise<Object>} - Conversation history
   */
  async getConversationHistory(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation-history?limit=${limit}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        conversations: data.conversations,
        total: data.total
      };
    } catch (error) {
      console.error('Conversation history error:', error);
      return {
        success: false,
        error: error.message,
        conversations: []
      };
    }
  }

  /**
   * Clear conversation history
   * @returns {Promise<Object>} - Success response
   */
  async clearConversationHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/clear-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Clear history error:', error);
      return {
        success: false,
        error: error.message
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const baseUrl = API_BASE_URL.replace('/api', '');
      console.log('🔍 Checking backend status at:', baseUrl);
      
      const response = await fetch(`${baseUrl}/`, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      console.log('✅ Backend response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('❌ Backend check failed:', error.name, error.message);
      console.error('📍 URL attempted:', API_BASE_URL.replace('/api', ''));
      return false;
    }
  }

  /**
   * Provide fallback chat response when backend is not available
   * @param {string} message - User message
   * @param {Object} context - Context information
   * @returns {string} - Fallback response
   */
  getFallbackChatResponse(message, context = {}) {
    return `🤖 **Annapurna - KisanMitra AI Assistant** (Offline Mode)\n\n` +
      `**Your message:** ${message}\n\n` +
      `I'm currently unable to connect to the enhanced AI backend with Groq.\n\n` +
      `**To enable full AI chat features:**\n` +
      `1. Go to the backend folder\n` +
      `2. Run: python farming_expert_app_ai.py\n` +
      `3. Wait for "Server running on http://localhost:5000"\n` +
      `4. Then try your question again\n\n` +
      `**Enhanced AI features include:**\n` +
      `• Conversational farming advice with Groq LLaMA 3\n` +
      `• Context-aware responses\n` +
      `• Personalized recommendations\n` +
      `• Multi-turn conversations\n` +
      `• Advanced crop analysis\n` +
      `• Real-time problem solving\n\n` +
      `**Basic guidance:** ${this.getBasicGuidance(message, context)}`;
  }

  /**
   * Get basic guidance based on keywords
   * @param {string} message - User message
   * @param {Object} context - Context information
   * @returns {string} - Basic guidance
   */
  getBasicGuidance(message, context) {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('chat') || messageLower.includes('conversation')) {
      return "Enable AI backend for interactive chat with farming experts.";
    }
    
    if (messageLower.includes('gemma') || messageLower.includes('ai')) {
      return "Gemma 2 AI provides advanced agricultural insights and personalized advice.";
    }
    
    // Use existing fallback logic
    return this.getFallbackAdvice(message, context.crop, context.season).split('\n\n')[1] || 
           "Please enable the AI backend for detailed agricultural assistance.";
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
        `**Note:** For detailed, personalized advice, please start the KisanMitra backend server.`;
    }
    
    if (queryLower.includes('wheat') || crop === 'wheat') {
      return `🌾 **Wheat Cultivation Tips** (Offline Mode)\n\n` +
        `**Basic Wheat Growing Guidelines:**\n` +
        `• Plant during rabi season (November-December)\n` +
        `• Requires 600-800mm rainfall\n` +
        `• Optimal temperature: 15-25°C\n` +
        `• Soil pH: 6.0-7.5\n` +
        `• Harvest in 100-130 days\n\n` +
        `**Note:** For detailed, personalized advice, please start the KisanMitra backend server.`;
    }
    
    if (queryLower.includes('cotton') || crop === 'cotton') {
      return `🌾 **Cotton Cultivation Tips** (Offline Mode)\n\n` +
        `**Basic Cotton Growing Guidelines:**\n` +
        `• Plant during kharif season (May-June)\n` +
        `• Requires 600-800mm rainfall\n` +
        `• Optimal temperature: 21-35°C\n` +
        `• Soil pH: 5.8-8.0\n` +
        `• Harvest in 160-180 days\n\n` +
        `**Note:** For detailed, personalized advice, please start the KisanMitra backend server.`;
    }
    
    if (queryLower.includes('fertilizer') || queryLower.includes('nutrient')) {
      return `🧪 **General Fertilizer Guidelines** (Offline Mode)\n\n` +
        `**Basic NPK Requirements:**\n` +
        `• **Nitrogen (N):** For leaf growth\n` +
        `• **Phosphorus (P):** For root development\n` +
        `• **Potassium (K):** For disease resistance\n` +
        `• Apply based on soil test results\n` +
        `• Use organic alternatives when possible\n\n` +
        `**Note:** For crop-specific fertilizer schedules, please start the KisanMitra backend server.`;
    }
    
    if (queryLower.includes('pest') || queryLower.includes('disease')) {
      return `🐛 **General Pest Management** (Offline Mode)\n\n` +
        `**Integrated Pest Management:**\n` +
        `• Regular field monitoring\n` +
        `• Use resistant crop varieties\n` +
        `• Practice crop rotation\n` +
        `• Biological control methods\n` +
        `• Targeted chemical control if needed\n\n` +
        `**Note:** For specific pest identification and treatment, please start the KisanMitra backend server.`;
    }
    
    if (queryLower.includes('season') || queryLower.includes('calendar')) {
      return `📅 **Seasonal Farming Calendar** (Offline Mode)\n\n` +
        `**General Seasonal Guidelines:**\n` +
        `• **Kharif Season (June-October):** Rice, cotton, sugarcane\n` +
        `• **Rabi Season (November-April):** Wheat, barley, mustard\n` +
        `• **Summer Season (March-June):** Fodder crops, vegetables\n` +
        `• Plan according to monsoon patterns\n\n` +
        `**Note:** For detailed seasonal activities, please start the KisanMitra backend server.`;
    }
    
    // Default fallback
    return `🌾 **KisanMitra Farming Assistant** (Offline Mode)\n\n` +
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
