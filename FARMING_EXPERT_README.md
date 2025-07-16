# 🌾 AgriGuru - Farming Expert AI

## Overview
AgriGuru has been transformed into a comprehensive farming expert AI system that provides specialized agricultural guidance across multiple domains. This system combines advanced machine learning with extensive agricultural knowledge to help farmers make informed decisions.

## 🎯 Features

### 1. **Comprehensive Knowledge Base**
- **4 Major Crops**: Rice, Wheat, Cotton, Maize
- **Growth Stages**: Complete lifecycle management
- **Optimal Conditions**: Temperature, humidity, rainfall, soil requirements
- **Seasonal Guidelines**: Kharif, Rabi, and Zaid seasons

### 2. **Expert Domains**
- 🌱 **Crop Management**: Planting, fertilization, irrigation, harvesting
- 🌿 **Soil Health**: Testing, improvement, nutrient management
- 🐛 **Pest Control**: Integrated pest management, disease identification
- 💧 **Water Management**: Irrigation systems, water scheduling
- 📈 **Market Intelligence**: Price trends, value addition strategies
- 📅 **Seasonal Planning**: Activity calendar, timing optimization

### 3. **AI-Powered Features**
- **Plant Disease Detection**: Image-based crop health analysis
- **Weather Integration**: Weather-based farming recommendations
- **Market Insights**: Price forecasting and market trends
- **Personalized Advice**: Crop and location-specific guidance

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- Flask
- React

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install flask flask-cors torch torchvision pillow numpy requests
```

3. Run the farming expert backend:
```bash
python farming_expert_app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install axios
```

3. Copy the `FarmingExpertApp.jsx` and `FarmingExpertApp.css` to your React app:
```bash
# Copy to your components directory
cp src/components/FarmingExpertApp.jsx src/components/
cp src/components/FarmingExpertApp.css src/components/
```

4. Import and use the component in your main App.js:
```javascript
import FarmingExpertApp from './components/FarmingExpertApp';

function App() {
  return (
    <div className="App">
      <FarmingExpertApp />
    </div>
  );
}
```

5. Start the React development server:
```bash
npm start
```

## 🔧 API Endpoints

### 1. Expert Advice
```
POST /api/expert-advice
{
  "query": "How to plant rice in kharif season?",
  "crop": "rice",
  "season": "kharif"
}
```

### 2. Crop Analysis
```
POST /api/analyze-crop
FormData: {
  image: File,
  crop_type: "rice"
}
```

### 3. Weather Advice
```
POST /api/weather-advice
{
  "location": "Delhi",
  "crop": "wheat"
}
```

### 4. Market Insights
```
GET /api/market-insights?crop=rice&location=india
```

### 5. Seasonal Calendar
```
GET /api/seasonal-calendar?season=kharif&location=india
```

## 🌾 Usage Examples

### Example 1: Crop-Specific Advice
```javascript
// Get rice planting advice
const response = await axios.post('http://localhost:5000/api/expert-advice', {
  query: "Best time to plant rice",
  crop: "rice",
  season: "kharif"
});
```

### Example 2: Disease Analysis
```javascript
// Analyze crop image for diseases
const formData = new FormData();
formData.append('image', imageFile);
formData.append('crop_type', 'rice');

const response = await axios.post('http://localhost:5000/api/analyze-crop', formData);
```

### Example 3: Weather-Based Recommendations
```javascript
// Get weather-based farming advice
const response = await axios.post('http://localhost:5000/api/weather-advice', {
  location: 'Delhi',
  crop: 'wheat'
});
```

## 📊 Knowledge Base Structure

### Crop Database
Each crop contains:
- **Scientific Name**: Botanical classification
- **Growth Stages**: Complete development phases
- **Optimal Conditions**: Environmental requirements
- **Seasonal Info**: Planting and harvest times
- **Disease/Pest Info**: Common issues and solutions
- **Fertilizer Schedule**: Nutrient management plan
- **Water Management**: Irrigation guidelines

### Soil Knowledge
- **Soil Types**: Clay, loam, sandy characteristics
- **Testing Parameters**: pH, nutrients, organic matter
- **Improvement Methods**: Amendments and practices

### Pest Management
- **Categories**: Insects, diseases, weeds
- **IPM Strategies**: Integrated approaches
- **Control Methods**: Biological, chemical, cultural

## 🎯 Training Data

The system includes comprehensive training data:
- **30+ Training Samples**: Covering all major crops and topics
- **Quality Evaluation**: Automated response assessment
- **Expertise Levels**: Beginner to advanced recommendations
- **Contextual Responses**: Crop, season, and location-specific advice

## 🔮 Future Enhancements

### Planned Features
1. **Real-time Weather Integration**: Live weather API connections
2. **Satellite Imagery**: Crop monitoring via satellite data
3. **IoT Integration**: Sensor data for precision agriculture
4. **Mobile App**: Native mobile application
5. **Multilingual Support**: Regional language support
6. **Advanced Analytics**: Predictive modeling and forecasting

### Data Sources (To Be Integrated)
- Weather APIs (OpenWeatherMap, etc.)
- Government agricultural databases
- Market price APIs
- Soil databases
- Satellite imagery services

## 🤝 Contributing

To contribute to AgriGuru:
1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎉 Acknowledgments

- Agricultural experts for domain knowledge
- Open-source community for tools and libraries
- Farmers for feedback and requirements

---

**AgriGuru - Empowering Farmers with AI Technology** 🌾
