# AgriGuru - AI-Powered Farming Assistant

AgriGuru is an intelligent farming assistant that provides weather updates, soil analysis, crop status monitoring, and AI-powered chat support for farmers.

## Features

- **Weather Widget**: Real-time weather information
- **Soil Analysis**: Soil health monitoring and recommendations
- **Crop Status**: Track crop growth and health
- **AI Chat**: Intelligent farming assistance and guidance
- **Dashboard**: Comprehensive farming dashboard
- **Government Schemes**: Information about agricultural schemes

## Project Structure

```
AgriGuru/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── services/      # API service files
│   └── public/        # Static assets
├── backend/           # Flask backend API
└── vercel.json        # Vercel deployment configuration
```

## Local Development

### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Open http://localhost:3000 in your browser

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install Python dependencies: `pip install -r requirements.txt`
3. Run the Flask application: `python app.py`

## Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Sign in with your GitHub account
   - Import your repository

2. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
   - Root Directory: `frontend`

3. **Deploy**:
   - Vercel will automatically detect the configuration from `vercel.json`
   - The app will be built and deployed automatically

### Manual Deployment Steps

1. **Build the frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Vercel**:
   - The `vercel.json` configuration handles routing for React Router
   - Static files are served from the `build` directory
   - All routes redirect to `index.html` for proper SPA functionality

## Configuration Files

- `vercel.json`: Vercel deployment configuration
- `frontend/package.json`: Frontend dependencies and scripts
- `frontend/public/_redirects`: Redirect rules for SPA routing

## Technologies Used

- **Frontend**: React 19.1.0, React Router DOM 7.6.3, Axios
- **Backend**: Flask, Python
- **Deployment**: Vercel
- **Styling**: CSS3, Responsive Design

## Routes

- `/` - Home page
- `/login` - User authentication
- `/signup` - User registration
- `/dashboard` - Main dashboard
- `/about` - About page
- `/contact` - Contact information
- `/govt-schemes` - Government schemes information

## Support

For issues or questions, please check the deployment logs in Vercel dashboard or contact the development team.