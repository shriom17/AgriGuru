# 🌾 KisanMitra

AI-powered smart farming platform for Indian farmers, agricultural officers, and rural communities.

[![Made with ❤️ for Farmers](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20for%20Farmers-green.svg)](https://github.com/shriom17/KisanMitra)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://kisanmitra.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## About

KisanMitra brings together weather intelligence, crop health insights, market data, and AI-guided recommendations in a single platform. It is designed to help farmers make faster, better decisions with simple digital tools that work well even in low-connectivity environments.

> “Empowering farmers with AI-driven insights for better crops, better yields, and better lives.”

## Key Features

- 🌦️ Real-time weather forecasts and farming alerts
- 🌱 Soil health analysis and crop recommendations
- 🧠 AI-based crop disease detection and treatment guidance
- 🧪 Fertilizer and nutrient planning support
- 📈 Live market prices and commodity trends
- 🏛️ Government schemes and agricultural program information
- 🤖 AI agricultural assistant with multilingual support
- 📲 WhatsApp-based alerts and notifications
- 📰 Latest agricultural news and updates

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Recharts
- Socket.IO client
- i18next for multilingual UI
- CSS and custom styling

### Backend
- Python
- Flask
- Flask-CORS
- Requests
- Pillow
- Python-dotenv
- TensorFlow / scikit-learn for AI and model workflows

### Data & Integrations
- OpenWeatherMap API
- Agmarknet / market data APIs
- Google APIs
- Twilio / Gupshup-style messaging integrations
- News APIs

### Deployment & Infrastructure
- Vercel for frontend hosting
- Docker Compose support
- Smart contracts in the smart-contracts folder for marketplace-related features

## Project Structure

```text
KisanMitra/
├── frontend/          # React-based web app
├── backend/           # Flask APIs and AI services
├── smart-contracts/   # Blockchain / marketplace contracts
├── data/              # Data files and processed datasets
├── docker-compose.yml # Local container setup
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Frontend Setup

```bash
git clone https://github.com/shriom17/KisanMitra.git
cd KisanMitra/frontend
npm install
npm start
```

Open http://localhost:3000 in your browser.

### Backend Setup

```bash
cd ../backend
pip install -r requirements.txt
python farming_expert_app_ai.py
```

The backend typically runs on http://localhost:5000.

### Environment Variables

Create environment files as needed for your local setup:

#### Frontend
```env
REACT_APP_WEATHER_API_KEY=your_weather_key
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_NEWS_API_KEY=your_news_key
```

#### Backend
```env
GROQ_API_KEY=your_groq_key
WEATHER_API_KEY=your_weather_key
TWILIO_API_KEY=your_twilio_key
```

## Core Modules

| Module | Description | Status |
|---|---|---|
| Dashboard | Main farming insights dashboard | Complete |
| AI Chat | Multilingual agricultural assistant | Complete |
| Soil Analysis | Soil and crop recommendations | Complete |
| Disease Detection | AI crop disease identification | Complete |
| Market Prices | Live commodity pricing | Complete |
| Weather | Hyperlocal weather insights | Complete |
| Government Schemes | Subsidy and program information | Complete |
| WhatsApp Alerts | Notifications and alerts | In Progress |
| News Feed | Agricultural news updates | Complete |

## API Overview

| Endpoint | Method | Purpose |
|---|---|---|
| /api/expert-advice | POST | AI farming guidance |
| /api/crop-analysis | POST | Crop disease analysis |
| /api/weather | GET | Weather data |
| /api/soil-analysis | GET | Soil health information |
| /api/market-prices | GET | Commodity prices |
| /api/news | GET | Agricultural news |

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch
3. Make your changes
4. Commit clearly
5. Open a pull request

Please keep changes farmer-focused, well-documented, and easy to test.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

## Contact

- GitHub: https://github.com/shriom17/KisanMitra
- Website: https://kisanmitra.vercel.app

Made with ❤️ for Indian farmers.
