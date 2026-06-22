# PlantNet API Integration Guide

## ðŸŒ± PlantNet API Setup for Crop Analysis

PlantNet is a citizen science project that helps identify plants using machine learning. It's perfect for crop identification and agricultural applications.

### ðŸ“‹ **Step 1: Get PlantNet API Key**

1. Visit: https://my.plantnet.org/
2. Create a free account
3. Go to "Your API keys" section
4. Generate a new API key for your project
5. Copy the API key

### ðŸ”§ **Step 2: Configure Your API Key**

1. Open `frontend/.env` file
2. Replace `your_plantnet_api_key_here` with your actual API key:
   ```
   REACT_APP_PLANTNET_API_KEY=your_actual_api_key_here
   ```

### âš™ï¸ **Step 3: Enable PlantNet API**

1. Open `frontend/src/services/cropAnalysisService.js`
2. Change line 8 from:
   ```javascript
   const MOCK_AI_ANALYSIS = true;
   ```
   to:
   ```javascript
   const MOCK_AI_ANALYSIS = false;
   ```

### ðŸŒ **Available PlantNet Projects**

- `weurope` - Western Europe flora (default)
- `k-world-flora` - World flora 
- `the-plant-list` - The Plant List
- `apd` - African Plant Database

To change project, update `.env`:
```
REACT_APP_PLANTNET_PROJECT=k-world-flora
```

### ðŸŽ¯ **How PlantNet Integration Works**

1. **Image Upload**: User uploads plant/crop image
2. **PlantNet API**: Identifies plant species with confidence score
3. **Crop Detection**: Determines if it's a crop plant vs. weed/wild plant
4. **Health Analysis**: Generates recommendations based on identification
5. **Results**: Returns standardized analysis with:
   - Plant species (scientific and common names)
   - Confidence score
   - Crop vs. non-crop classification
   - Health recommendations
   - Growing tips

### ðŸ“Š **API Limits**

- **Free Tier**: 500 requests/day
- **Paid Plans**: Higher limits available
- **Image Size**: Max 10MB per image
- **Formats**: JPEG, PNG, WebP

### ðŸ”„ **Fallback System**

If PlantNet API fails or is unavailable:
- Automatically falls back to mock analysis
- Ensures your app continues working
- Logs the error for debugging

### ðŸš€ **Ready to Test!**

Once configured:
1. Restart your React app: `npm start`
2. Upload a plant/crop image in your app
3. See real PlantNet identification results!

### ðŸŒ¾ **Best Results Tips**

- Use clear, well-lit photos
- Include leaves, flowers, or fruits when possible
- Avoid blurry or dark images
- Take photos from multiple angles

---

**Your KisanMitra app now uses real AI plant identification! ðŸŽ‰**

