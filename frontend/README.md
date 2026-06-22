# KisanMitra Frontend

KisanMitra is a modern, multilingual web platform for Indian farmers, providing AI-powered expert advice, crop analytics, weather forecasts, marketplace, contract farming, and more.

## Features

- 🌾 **AI Chatbot:** Ask farming questions and get instant expert advice.
- ☀️ **Weather Forecast:** Real-time weather updates for your region.
- 📈 **Market Dashboard:** Crop price analytics and loan schemes.
- 🛒 **Ecommerce:** Buy/sell farming equipment, seeds, fertilizers, and tools.
- 🧑‍🌾 **Farmer Group Chat:** Connect and chat with other farmers.
- 📚 **AgriGuide (KhetiSaath):** Comprehensive resource hub for machines, tools, fertilizers, and organic solutions.
- 📝 **Contract Farming:** Apply for contract farming and view application status.
- 🔒 **Secure Login:** Email/password and OTP-based authentication.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
  git clone https://github.com/yourusername/KisanMitra.git
  cd KisanMitra/frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App

Start the development server:
```sh
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```sh
npm run build
```
The optimized build will be in the `build/` folder.

## Project Structure

```
src/
  ├── components/         # Reusable UI components
  ├── pages/              # Main pages (Home, Dashboard, Market&Loan, Ecommerce, KhetiSaath, Login, etc.)
  ├── contexts/           # React context providers (Auth, Theme, etc.)
  ├── services/           # API service functions
  ├── assets/             # Images, icons, etc.
  ├── App.js              # Main app component
  └── index.js            # Entry point
public/
  ├── images/             # Static images for products, etc.
  └── Organic-Fertilizers-Guide.pdf
```

## Environment Variables

Create a `.env` file in the `frontend` directory for API endpoints and keys:
```
REACT_APP_API_URL=http://localhost:5001
```

## Authentication

- Context-based authentication (`AuthContext`)
- Supports email/password and OTP login

## API Integration

- Connects to backend Flask API for chat, weather, crop analytics, contract farming, and more.
- Uses external APIs (Agmarknet, ISRIC SoilGrids) for market and soil data.

## Deployment

See [Create React App Deployment Guide](https://facebook.github.io/create-react-app/docs/deployment).

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT

---

**For backend setup and API documentation, see
