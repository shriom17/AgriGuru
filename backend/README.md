# KisanMitra AI Backend

KisanMitra AI Backend is a clean, production-ready Flask server that powers expert farming advice, crop analytics, weather-based recommendations, market insights, and more for Indian agriculture.

---

## 🚀 Quick Start

### 1. Install Dependencies

```sh
pip install -r requirements.txt
```

### 2. Start the Server

- **Windows:**  
  Double-click `start_server.bat`  
  or run in PowerShell:  
  ```sh
  start_server.ps1
  ```
- **Direct Python:**  
  ```sh
  python farming_expert_app.py
  ```

---

## 🧪 Testing the AI

- Start the server.
- Open `test_ai.html` in your browser.
- Try pre-defined or custom farming questions.
- See dynamic, fresh responses every time.

---

## 📂 Project Structure

```
backend/
├── farming_expert_app.py      # Main Flask AI application
├── start_server.bat           # Windows batch file to start server
├── start_server.ps1           # PowerShell script to start server
├── check_server.py            # Server status checker
├── check_server.bat           # Windows batch file to check server
├── test_ai.html               # Simple web interface for AI testing
├── requirements.txt           # Python dependencies
└── README.md                  # This documentation
```

---

## 🌾 Features

- **Dynamic AI Responses:**  
  - No cached answers; every reply is fresh and personalized.
  - Context-aware greetings and current date/time.
  - Professional formatting with emojis and structure.
  - Seasonal awareness for timely recommendations.

- **Comprehensive Crop Database:**  
  - Rice, wheat, cotton, maize, and more.
  - Planting, fertilizer, pest management, irrigation, and market insights.

- **Expert Query Processing:**  
  - Understands planting, fertilizer, pest, timing, seasonal, and general farming queries.

- **API Endpoints:**  
  - `/api/expert-advice` — Farming advice (POST)
  - `/api/analyze-crop` — Crop image analysis (POST)
  - `/api/weather-advice` — Weather-based advice (POST)
  - `/api/market-insights` — Market trends (GET)
  - `/api/seasonal-calendar` — Seasonal activities (GET)
  - `/` — API status (GET)

---

## 🔒 Technical Details

- **Essential Dependencies Only:**
  ```
  Flask==2.3.3
  Flask-CORS==4.0.0
  torch==2.0.1
  Pillow==10.0.0
  requests==2.31.0
  ```
- **Removed:**  
  - Old/duplicate files, unused directories, and development scripts for a clean codebase.

---

## 📝 Usage Examples

**Sample Query:**  
- "How to plant rice in kharif season?"
- "Best fertilizers for wheat cultivation?"
- "Cotton pest management strategies"
- "Seasonal farming calendar for rabi"
- "Organic farming practices"

**Sample Response Format:**
```
🌱 Rice Planting Guide

Generated on August 5, 2025

Optimal Growing Conditions:
• Temperature: 25°C (range: 20-35°C)
• Soil pH: 6.5 (range: 5.5-7.0)
• Soil types: clay, loam, alluvial
• Rainfall requirement: 800mm during growing season

Planting Season: kharif, rabi
Harvest Time: {'kharif': 'October-November', 'rabi': 'March-April'}

Kharif Season Specific Tips:
• Plant after monsoon onset
• Ensure good drainage during heavy rains
```

---

## ✅ Success Metrics

- Dynamic, non-repetitive responses
- Personalized advice with current date context
- Comprehensive crop and farming knowledge
- Professional, readable formatting
- Accurate query understanding

---

## 🌟 User Experience

Farmers and users receive:
- Fresh, personalized advice every time
- Timely, season-aware recommendations
- Comprehensive information for all farming aspects
- Professional formatting and structure
- Multiple response types for the same query

KisanMitra AI is now a true **farming expert** for Indian agriculture! 🌾🚜

---

## 📄 License

MIT

---

**For frontend setup and integration,
