import axios from 'axios';

// For soil data, we'll use multiple APIs for comprehensive information
const SOIL_API_BASE = 'https://rest.isric.org/soilgrids/v2.0/properties';
// const AGRO_API_BASE = 'https://api.agromonitoring.com/agro/1.0'; // For future use

// Get soil information by coordinates
export const getSoilData = async (lat, lon) => {
  try {
    // Get soil properties from ISRIC SoilGrids API (free)
    const soilResponse = await axios.get(
      `${SOIL_API_BASE}?lat=${lat}&lon=${lon}&property=phh2o&property=nitrogen&property=soc&property=sand&property=clay&property=silt&depth=0-30cm&value=mean`
    );
    
    return {
      ph: soilResponse.data.properties.phh2o?.mapped_units || 'pH',
      nitrogen: soilResponse.data.properties.nitrogen?.mapped_units || 'N',
      organicCarbon: soilResponse.data.properties.soc?.mapped_units || 'SOC',
      sand: soilResponse.data.properties.sand?.mapped_units || '%',
      clay: soilResponse.data.properties.clay?.mapped_units || '%',
      silt: soilResponse.data.properties.silt?.mapped_units || '%',
      location: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      depth: '0-30cm',
      data: soilResponse.data
    };
  } catch (error) {
    console.error('Error fetching soil data:', error);
    // Return mock data if API fails
    return getMockSoilData(lat, lon);
  }
};

// Mock soil data for demonstration (in case API is down)
const getMockSoilData = (lat, lon) => {
  return {
    ph: 6.8,
    nitrogen: 85,
    organicCarbon: 2.3,
    sand: 45,
    clay: 25,
    silt: 30,
    moisture: 65,
    temperature: 22,
    fertility: 'Good',
    location: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    depth: '0-30cm',
    lastUpdated: new Date().toLocaleDateString(),
    recommendations: [
      'Soil pH is optimal for most crops',
      'Consider adding organic matter',
      'Good moisture retention capacity'
    ]
  };
};

// Analyze soil health based on values
export const analyzeSoilHealth = (soilData) => {
  const analysis = {
    overall: 'Good',
    phStatus: 'Optimal',
    fertilityLevel: 'Good',
    recommendations: []
  };

  // pH Analysis
  if (soilData.ph < 6.0) {
    analysis.phStatus = 'Acidic';
    analysis.recommendations.push('Consider lime application to raise pH');
  } else if (soilData.ph > 8.0) {
    analysis.phStatus = 'Alkaline';
    analysis.recommendations.push('Consider sulfur application to lower pH');
  } else {
    analysis.phStatus = 'Optimal';
    analysis.recommendations.push('pH level is suitable for most crops');
  }

  // Organic Carbon Analysis
  if (soilData.organicCarbon < 1.5) {
    analysis.fertilityLevel = 'Low';
    analysis.recommendations.push('Add compost or organic matter');
  } else if (soilData.organicCarbon > 3.0) {
    analysis.fertilityLevel = 'High';
    analysis.recommendations.push('Excellent organic matter content');
  }

  // Nitrogen Analysis
  if (soilData.nitrogen < 50) {
    analysis.recommendations.push('Consider nitrogen fertilizer application');
  }

  // Overall assessment
  const scores = [
    soilData.ph >= 6.0 && soilData.ph <= 8.0 ? 1 : 0,
    soilData.organicCarbon >= 2.0 ? 1 : 0,
    soilData.nitrogen >= 60 ? 1 : 0
  ];
  
  const totalScore = scores.reduce((a, b) => a + b, 0);
  
  if (totalScore >= 2) {
    analysis.overall = 'Excellent';
  } else if (totalScore === 1) {
    analysis.overall = 'Good';
  } else {
    analysis.overall = 'Needs Improvement';
  }

  return analysis;
};

// Get soil type based on sand, clay, silt percentages
export const getSoilType = (sand, clay, silt) => {
  if (sand > 85) return 'Sand';
  if (clay > 40) return 'Clay';
  if (silt > 80) return 'Silt';
  if (sand > 45 && clay < 20) return 'Sandy Loam';
  if (clay > 27 && clay < 40 && sand > 20) return 'Clay Loam';
  if (silt > 50 && clay < 27) return 'Silt Loam';
  return 'Loam';
};

// Get soil color for visualization
export const getSoilColor = (organicCarbon) => {
  if (organicCarbon > 3) return '#3d2914'; // Dark brown - high organic matter
  if (organicCarbon > 2) return '#8b4513'; // Brown - good organic matter
  if (organicCarbon > 1) return '#daa520'; // Light brown - moderate organic matter
  return '#d2b48c'; // Light tan - low organic matter
};

// Get soil health emoji
export const getSoilHealthEmoji = (overall) => {
  switch (overall) {
    case 'Excellent': return '🌱';
    case 'Good': return '🌿';
    case 'Needs Improvement': return '🌾';
    default: return '🌱';
  }
};
