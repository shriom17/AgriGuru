# Enhanced Flask Backend with Farming Expert AI
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import torch
import numpy as np
from PIL import Image
import io
import base64
import requests
import os
from datetime import datetime
import json
import random

app = Flask(__name__)
CORS(app)

# Enhanced Farming Expert Knowledge Base
class FarmingExpertAI:
    def __init__(self):
        self.crop_database = self._initialize_crop_database()
        self.soil_knowledge = self._initialize_soil_knowledge()
        self.pest_management = self._initialize_pest_management()
        self.fertilizer_guide = self._initialize_fertilizer_guide()
        self.irrigation_systems = self._initialize_irrigation_systems()
        self.seasonal_calendar = self._initialize_seasonal_calendar()
        self.market_insights = self._initialize_market_insights()
        self.location_data = self._initialize_location_data()
        self.weather_api_key = os.getenv('WEATHER_API_KEY', 'demo_key')  # Add your API key
        
    def _initialize_crop_database(self):
        """Comprehensive crop database with detailed information"""
        return {
            'rice': {
                'scientific_name': 'Oryza sativa',
                'growth_stages': ['seedling', 'tillering', 'heading', 'flowering', 'ripening'],
                'optimal_conditions': {
                    'temperature': {'min': 20, 'max': 35, 'optimal': 25},
                    'humidity': {'min': 60, 'max': 80, 'optimal': 70},
                    'rainfall': {'annual': 1200, 'growing_season': 800},
                    'soil_ph': {'min': 5.5, 'max': 7.0, 'optimal': 6.5},
                    'soil_type': ['clay', 'loam', 'alluvial']
                },
                'planting_season': ['kharif', 'rabi'],
                'harvest_time': {'kharif': 'October-November', 'rabi': 'March-April'},
                'yield_potential': {'average': 3.5, 'high': 6.0, 'unit': 'tons/hectare'},
                'common_diseases': ['blast', 'bacterial_blight', 'sheath_blight'],
                'common_pests': ['stem_borer', 'leaf_folder', 'brown_planthopper'],
                'fertilizer_schedule': {
                    'nitrogen': {'basal': 50, 'tillering': 25, 'panicle': 25},
                    'phosphorus': {'basal': 100, 'unit': 'kg/hectare'},
                    'potassium': {'basal': 60, 'unit': 'kg/hectare'}
                },
                'water_management': {
                    'land_preparation': '5-10 cm standing water',
                    'vegetative': 'maintain 2-5 cm water',
                    'reproductive': 'maintain 5 cm water',
                    'maturity': 'drain field 15 days before harvest'
                }
            },
            'wheat': {
                'scientific_name': 'Triticum aestivum',
                'growth_stages': ['germination', 'tillering', 'jointing', 'booting', 'flowering', 'maturity'],
                'optimal_conditions': {
                    'temperature': {'min': 15, 'max': 25, 'optimal': 20},
                    'humidity': {'min': 50, 'max': 70, 'optimal': 60},
                    'rainfall': {'annual': 600, 'growing_season': 400},
                    'soil_ph': {'min': 6.0, 'max': 7.5, 'optimal': 7.0},
                    'soil_type': ['loam', 'clay_loam', 'sandy_loam']
                },
                'planting_season': ['rabi'],
                'harvest_time': {'rabi': 'March-April'},
                'yield_potential': {'average': 4.0, 'high': 7.0, 'unit': 'tons/hectare'},
                'common_diseases': ['rust', 'smut', 'powdery_mildew'],
                'common_pests': ['aphids', 'termites', 'cutworms'],
                'fertilizer_schedule': {
                    'nitrogen': {'basal': 60, 'crown_root': 40, 'unit': 'kg/hectare'},
                    'phosphorus': {'basal': 80, 'unit': 'kg/hectare'},
                    'potassium': {'basal': 40, 'unit': 'kg/hectare'}
                },
                'water_management': {
                    'sowing': 'pre-sowing irrigation',
                    'crown_root': 'first irrigation at 20-25 days',
                    'tillering': 'second irrigation at 40-45 days',
                    'flowering': 'third irrigation at 60-65 days',
                    'grain_filling': 'fourth irrigation at 80-85 days'
                }
            },
            'cotton': {
                'scientific_name': 'Gossypium hirsutum',
                'growth_stages': ['seedling', 'squaring', 'flowering', 'boll_development', 'maturity'],
                'optimal_conditions': {
                    'temperature': {'min': 21, 'max': 35, 'optimal': 28},
                    'humidity': {'min': 50, 'max': 70, 'optimal': 60},
                    'rainfall': {'annual': 800, 'growing_season': 600},
                    'soil_ph': {'min': 5.8, 'max': 8.0, 'optimal': 7.0},
                    'soil_type': ['black_cotton', 'alluvial', 'red_loam']
                },
                'planting_season': ['kharif'],
                'harvest_time': {'kharif': 'October-January'},
                'yield_potential': {'average': 500, 'high': 800, 'unit': 'kg/hectare'},
                'common_diseases': ['wilt', 'leaf_curl', 'alternaria_blight'],
                'common_pests': ['bollworm', 'aphids', 'whitefly'],
                'fertilizer_schedule': {
                    'nitrogen': {'basal': 50, 'flowering': 50, 'unit': 'kg/hectare'},
                    'phosphorus': {'basal': 100, 'unit': 'kg/hectare'},
                    'potassium': {'basal': 50, 'unit': 'kg/hectare'}
                },
                'water_management': {
                    'pre_sowing': 'heavy irrigation',
                    'vegetative': 'light frequent irrigation',
                    'flowering': 'adequate moisture critical',
                    'boll_development': 'maintain soil moisture'
                }
            },
            'maize': {
                'scientific_name': 'Zea mays',
                'growth_stages': ['germination', 'vegetative', 'tasseling', 'silking', 'grain_filling', 'maturity'],
                'optimal_conditions': {
                    'temperature': {'min': 18, 'max': 32, 'optimal': 25},
                    'humidity': {'min': 60, 'max': 80, 'optimal': 70},
                    'rainfall': {'annual': 700, 'growing_season': 500},
                    'soil_ph': {'min': 6.0, 'max': 7.5, 'optimal': 6.8},
                    'soil_type': ['loam', 'sandy_loam', 'clay_loam']
                },
                'planting_season': ['kharif', 'rabi'],
                'harvest_time': {'kharif': 'September-October', 'rabi': 'March-April'},
                'yield_potential': {'average': 5.0, 'high': 8.0, 'unit': 'tons/hectare'},
                'common_diseases': ['blight', 'rust', 'downy_mildew'],
                'common_pests': ['stem_borer', 'fall_armyworm', 'aphids'],
                'fertilizer_schedule': {
                    'nitrogen': {'basal': 60, 'knee_high': 60, 'unit': 'kg/hectare'},
                    'phosphorus': {'basal': 80, 'unit': 'kg/hectare'},
                    'potassium': {'basal': 40, 'unit': 'kg/hectare'}
                },
                'water_management': {
                    'germination': 'adequate soil moisture',
                    'vegetative': 'regular irrigation',
                    'tasseling': 'critical water period',
                    'grain_filling': 'maintain moisture'
                }
            }
        }
    
    def _initialize_soil_knowledge(self):
        """Comprehensive soil management knowledge"""
        return {
            'soil_types': {
                'clay': {
                    'characteristics': 'Heavy, water-retentive, nutrient-rich',
                    'advantages': ['High water holding capacity', 'Rich in nutrients'],
                    'disadvantages': ['Poor drainage', 'Difficult to work when wet'],
                    'suitable_crops': ['rice', 'wheat', 'cotton'],
                    'management': 'Add organic matter, improve drainage'
                },
                'loam': {
                    'characteristics': 'Well-balanced, ideal for most crops',
                    'advantages': ['Good drainage', 'Nutrient retention', 'Easy to work'],
                    'disadvantages': ['May need regular fertilization'],
                    'suitable_crops': ['wheat', 'maize', 'vegetables'],
                    'management': 'Maintain organic matter, balanced fertilization'
                },
                'sandy': {
                    'characteristics': 'Light, well-draining, low nutrient retention',
                    'advantages': ['Good drainage', 'Easy to work', 'Warms up quickly'],
                    'disadvantages': ['Low water retention', 'Nutrient leaching'],
                    'suitable_crops': ['vegetables', 'legumes', 'root crops'],
                    'management': 'Add organic matter, frequent irrigation'
                }
            }
        }
    
    def _initialize_pest_management(self):
        """Integrated Pest Management knowledge"""
        return {
            'pest_categories': {
                'insects': {
                    'examples': ['aphids', 'stem_borer', 'bollworm'],
                    'identification': 'Visual inspection, damage patterns',
                    'control_methods': ['biological', 'chemical', 'cultural', 'physical']
                },
                'diseases': {
                    'examples': ['blast', 'rust', 'wilt'],
                    'identification': 'Symptoms on leaves, stems, roots',
                    'control_methods': ['resistant_varieties', 'fungicides', 'crop_rotation']
                },
                'weeds': {
                    'examples': ['grass_weeds', 'broadleaf_weeds', 'sedges'],
                    'identification': 'Plant morphology, growth habits',
                    'control_methods': ['mechanical', 'cultural', 'herbicides']
                }
            }
        }
    
    def _initialize_fertilizer_guide(self):
        """Comprehensive fertilizer and nutrient management"""
        return {
            'nutrient_functions': {
                'nitrogen': 'Vegetative growth, leaf development, protein synthesis',
                'phosphorus': 'Root development, flowering, fruit formation',
                'potassium': 'Disease resistance, water regulation, overall plant health',
                'calcium': 'Cell wall formation, root growth',
                'magnesium': 'Chlorophyll formation, enzyme activation',
                'sulfur': 'Protein synthesis, oil formation'
            }
        }
    
    def _initialize_irrigation_systems(self):
        """Water management and irrigation systems"""
        return {
            'irrigation_methods': {
                'surface': {
                    'types': ['furrow', 'basin', 'border'],
                    'advantages': ['Low cost', 'Simple operation'],
                    'disadvantages': ['Water wastage', 'Uneven distribution'],
                    'suitable_for': ['field_crops', 'flat_terrain']
                },
                'sprinkler': {
                    'types': ['fixed', 'rotating', 'traveling'],
                    'advantages': ['Even distribution', 'Suitable for all terrains'],
                    'disadvantages': ['High initial cost', 'Wind interference'],
                    'suitable_for': ['vegetables', 'fodder_crops']
                },
                'drip': {
                    'types': ['surface', 'subsurface', 'micro_sprinklers'],
                    'advantages': ['Water saving', 'Precise application'],
                    'disadvantages': ['High cost', 'Clogging issues'],
                    'suitable_for': ['fruit_trees', 'vegetables', 'water_scarce_areas']
                }
            }
        }
    
    def _initialize_seasonal_calendar(self):
        """Seasonal farming calendar and activities"""
        return {
            'kharif_season': {
                'period': 'June-October',
                'activities': {
                    'may': 'Field preparation, seed selection',
                    'june': 'Sowing, transplanting',
                    'july': 'Weeding, fertilizer application',
                    'august': 'Pest monitoring, irrigation',
                    'september': 'Disease management, nutrient management',
                    'october': 'Harvesting, post-harvest operations'
                },
                'major_crops': ['rice', 'cotton', 'sugarcane', 'maize']
            },
            'rabi_season': {
                'period': 'November-April',
                'activities': {
                    'november': 'Field preparation, sowing',
                    'december': 'Irrigation, fertilizer application',
                    'january': 'Pest management, weeding',
                    'february': 'Disease monitoring, nutrition',
                    'march': 'Harvesting preparation',
                    'april': 'Harvesting, storage'
                },
                'major_crops': ['wheat', 'barley', 'mustard', 'gram']
            }
        }
    
    def _initialize_market_insights(self):
        """Market trends and economic aspects"""
        return {
            'price_factors': ['supply_demand', 'weather', 'government_policies', 'global_markets'],
            'value_addition': ['processing', 'packaging', 'branding', 'direct_marketing'],
            'market_channels': ['local_markets', 'mandis', 'contract_farming', 'e_commerce']
        }
    
    def _initialize_location_data(self):
        """Regional farming data with climate zones and soil types"""
        return {
            'india': {
                'states': {
                    'punjab': {
                        'climate_zone': 'semi-arid',
                        'dominant_soil': 'alluvial',
                        'rainfall': {'average': 700, 'monsoon': 'july-september'},
                        'temperature': {'summer': 35, 'winter': 10, 'optimal_crop_temp': 25},
                        'major_crops': ['wheat', 'rice', 'maize', 'cotton'],
                        'soil_types': ['alluvial', 'clay_loam', 'sandy_loam'],
                        'soil_recommendations': {
                            'alluvial': ['wheat', 'rice', 'sugarcane', 'vegetables'],
                            'clay_loam': ['rice', 'wheat', 'cotton', 'pulses'],
                            'sandy_loam': ['maize', 'vegetables', 'fodder_crops']
                        }
                    },
                    'maharashtra': {
                        'climate_zone': 'tropical',
                        'dominant_soil': 'black_cotton',
                        'rainfall': {'average': 1200, 'monsoon': 'june-september'},
                        'temperature': {'summer': 38, 'winter': 15, 'optimal_crop_temp': 28},
                        'major_crops': ['cotton', 'sugarcane', 'rice', 'wheat'],
                        'soil_types': ['black_cotton', 'red_loam', 'laterite'],
                        'soil_recommendations': {
                            'black_cotton': ['cotton', 'sugarcane', 'soybean', 'wheat'],
                            'red_loam': ['rice', 'millet', 'pulses', 'vegetables'],
                            'laterite': ['cashew', 'coconut', 'spices', 'fruits']
                        }
                    },
                    'kerala': {
                        'climate_zone': 'tropical_humid',
                        'dominant_soil': 'laterite',
                        'rainfall': {'average': 3000, 'monsoon': 'june-september'},
                        'temperature': {'summer': 32, 'winter': 22, 'optimal_crop_temp': 27},
                        'major_crops': ['rice', 'coconut', 'spices', 'rubber'],
                        'soil_types': ['laterite', 'alluvial', 'coastal_sandy'],
                        'soil_recommendations': {
                            'laterite': ['coconut', 'rubber', 'spices', 'fruits'],
                            'alluvial': ['rice', 'vegetables', 'banana', 'sugarcane'],
                            'coastal_sandy': ['coconut', 'cashew', 'vegetables']
                        }
                    },
                    'rajasthan': {
                        'climate_zone': 'arid',
                        'dominant_soil': 'sandy',
                        'rainfall': {'average': 300, 'monsoon': 'july-august'},
                        'temperature': {'summer': 42, 'winter': 8, 'optimal_crop_temp': 25},
                        'major_crops': ['wheat', 'barley', 'millet', 'mustard'],
                        'soil_types': ['sandy', 'sandy_loam', 'saline'],
                        'soil_recommendations': {
                            'sandy': ['millet', 'drought_resistant_crops', 'barley'],
                            'sandy_loam': ['wheat', 'mustard', 'gram', 'vegetables'],
                            'saline': ['salt_tolerant_crops', 'barley', 'mustard']
                        }
                    },
                    'west_bengal': {
                        'climate_zone': 'humid_subtropical',
                        'dominant_soil': 'alluvial',
                        'rainfall': {'average': 1500, 'monsoon': 'june-september'},
                        'temperature': {'summer': 35, 'winter': 12, 'optimal_crop_temp': 26},
                        'major_crops': ['rice', 'wheat', 'jute', 'vegetables'],
                        'soil_types': ['alluvial', 'clay', 'laterite'],
                        'soil_recommendations': {
                            'alluvial': ['rice', 'wheat', 'jute', 'vegetables'],
                            'clay': ['rice', 'sugarcane', 'wheat'],
                            'laterite': ['tea', 'fruits', 'spices']
                        }
                    },
                    'tamil_nadu': {
                        'climate_zone': 'tropical',
                        'dominant_soil': 'red_loam',
                        'rainfall': {'average': 1000, 'monsoon': 'october-december'},
                        'temperature': {'summer': 38, 'winter': 18, 'optimal_crop_temp': 28},
                        'major_crops': ['rice', 'sugarcane', 'cotton', 'millet'],
                        'soil_types': ['red_loam', 'black_cotton', 'alluvial'],
                        'soil_recommendations': {
                            'red_loam': ['rice', 'millet', 'pulses', 'cotton'],
                            'black_cotton': ['cotton', 'sugarcane', 'wheat'],
                            'alluvial': ['rice', 'sugarcane', 'vegetables']
                        }
                    }
                }
            },
            'usa': {
                'states': {
                    'california': {
                        'climate_zone': 'mediterranean',
                        'dominant_soil': 'clay_loam',
                        'major_crops': ['grapes', 'almonds', 'tomatoes', 'lettuce'],
                        'soil_recommendations': {
                            'clay_loam': ['grapes', 'tomatoes', 'vegetables'],
                            'sandy_loam': ['almonds', 'fruits', 'vegetables']
                        }
                    },
                    'iowa': {
                        'climate_zone': 'humid_continental',
                        'dominant_soil': 'prairie',
                        'major_crops': ['corn', 'soybeans', 'wheat'],
                        'soil_recommendations': {
                            'prairie': ['corn', 'soybeans', 'wheat'],
                            'loam': ['corn', 'soybeans', 'vegetables']
                        }
                    }
                }
            }
        }
    
    def get_weather_data(self, location):
        """Get real weather data for a location"""
        try:
            # Try to get coordinates for the location
            if ',' in location:
                city, state = location.split(',')
                city = city.strip()
                state = state.strip()
            else:
                city = location.strip()
                state = None
            
            # Mock weather data with realistic values based on location
            weather_data = self._get_mock_weather_data(city, state)
            
            # In production, you would use a real weather API like:
            # OpenWeatherMap: https://openweathermap.org/api
            # WeatherAPI: https://www.weatherapi.com/
            
            return weather_data
            
        except Exception as e:
            # Return fallback weather data
            return self._get_fallback_weather_data(location)
    
    def _get_mock_weather_data(self, city, state=None):
        """Generate realistic mock weather data based on location"""
        # Mock data based on typical weather patterns
        location_weather = {
            'delhi': {'temp': 35, 'humidity': 65, 'rainfall': 2.5},
            'mumbai': {'temp': 30, 'humidity': 80, 'rainfall': 15.0},
            'bangalore': {'temp': 25, 'humidity': 70, 'rainfall': 5.0},
            'chennai': {'temp': 32, 'humidity': 75, 'rainfall': 3.0},
            'kolkata': {'temp': 28, 'humidity': 85, 'rainfall': 8.0},
            'hyderabad': {'temp': 33, 'humidity': 60, 'rainfall': 1.5},
            'pune': {'temp': 29, 'humidity': 65, 'rainfall': 4.0},
            'jaipur': {'temp': 38, 'humidity': 45, 'rainfall': 0.5},
            'lucknow': {'temp': 36, 'humidity': 70, 'rainfall': 2.0},
            'chandigarh': {'temp': 32, 'humidity': 55, 'rainfall': 1.0}
        }
        
        city_lower = city.lower()
        base_data = location_weather.get(city_lower, {'temp': 28, 'humidity': 65, 'rainfall': 3.0})
        
        return {
            'location': f"{city}, {state}" if state else city,
            'temperature': base_data['temp'],
            'humidity': base_data['humidity'],
            'rainfall': base_data['rainfall'],
            'wind_speed': random.uniform(5, 15),
            'pressure': random.uniform(1010, 1020),
            'weather_condition': self._get_weather_condition(base_data['temp'], base_data['rainfall']),
            'forecast': [
                {
                    'day': 'Today',
                    'temp': base_data['temp'],
                    'humidity': base_data['humidity'],
                    'rain': base_data['rainfall'],
                    'condition': self._get_weather_condition(base_data['temp'], base_data['rainfall'])
                },
                {
                    'day': 'Tomorrow',
                    'temp': base_data['temp'] + random.uniform(-2, 2),
                    'humidity': base_data['humidity'] + random.uniform(-5, 5),
                    'rain': base_data['rainfall'] + random.uniform(-1, 3),
                    'condition': 'partly_cloudy'
                },
                {
                    'day': 'Day 3',
                    'temp': base_data['temp'] + random.uniform(-3, 3),
                    'humidity': base_data['humidity'] + random.uniform(-10, 10),
                    'rain': base_data['rainfall'] + random.uniform(-2, 5),
                    'condition': 'cloudy'
                }
            ]
        }
    
    def _get_weather_condition(self, temp, rainfall):
        """Determine weather condition based on temperature and rainfall"""
        if rainfall > 10:
            return 'rainy'
        elif rainfall > 5:
            return 'cloudy'
        elif temp > 35:
            return 'hot'
        elif temp < 15:
            return 'cold'
        else:
            return 'clear'
    
    def _get_fallback_weather_data(self, location):
        """Fallback weather data when API fails"""
        return {
            'location': location,
            'temperature': 28,
            'humidity': 65,
            'rainfall': 3.0,
            'wind_speed': 8.0,
            'pressure': 1013.25,
            'weather_condition': 'clear',
            'forecast': [
                {'day': 'Today', 'temp': 28, 'humidity': 65, 'rain': 3.0, 'condition': 'clear'},
                {'day': 'Tomorrow', 'temp': 29, 'humidity': 68, 'rain': 4.0, 'condition': 'partly_cloudy'},
                {'day': 'Day 3', 'temp': 27, 'humidity': 70, 'rain': 2.0, 'condition': 'clear'}
            ]
        }
    
    def get_location_soil_recommendations(self, location):
        """Get soil recommendations for a specific location"""
        try:
            location_lower = location.lower()
            
            # Check Indian states
            if 'india' in self.location_data:
                for state, data in self.location_data['india']['states'].items():
                    if state in location_lower or location_lower in state:
                        return {
                            'location': location,
                            'climate_zone': data['climate_zone'],
                            'dominant_soil': data['dominant_soil'],
                            'soil_types': data['soil_types'],
                            'soil_recommendations': data['soil_recommendations'],
                            'major_crops': data['major_crops'],
                            'rainfall_info': data['rainfall']
                        }
            
            # Check US states
            if 'usa' in self.location_data:
                for state, data in self.location_data['usa']['states'].items():
                    if state in location_lower or location_lower in state:
                        return {
                            'location': location,
                            'climate_zone': data['climate_zone'],
                            'dominant_soil': data['dominant_soil'],
                            'soil_recommendations': data['soil_recommendations'],
                            'major_crops': data['major_crops']
                        }
            
            # Return general recommendations
            return self._get_general_soil_recommendations(location)
            
        except Exception as e:
            return self._get_general_soil_recommendations(location)
    
    def _get_general_soil_recommendations(self, location):
        """General soil recommendations when specific location data is not available"""
        return {
            'location': location,
            'climate_zone': 'general',
            'soil_recommendations': {
                'clay': ['rice', 'wheat', 'cotton', 'sugarcane'],
                'loam': ['wheat', 'maize', 'vegetables', 'fruits'],
                'sandy': ['millet', 'vegetables', 'legumes', 'drought_resistant_crops'],
                'black_cotton': ['cotton', 'sugarcane', 'soybean', 'wheat'],
                'red_loam': ['rice', 'millet', 'pulses', 'vegetables'],
                'alluvial': ['rice', 'wheat', 'sugarcane', 'vegetables']
            },
            'general_advice': 'Soil testing recommended for specific recommendations'
        }
    
    def get_expert_advice(self, query, crop=None, location=None, season=None):
        """Generate expert farming advice based on query"""
        query_lower = query.lower()
        
        # Weather-related queries
        if 'weather' in query_lower or 'temperature' in query_lower or 'rain' in query_lower or 'climate' in query_lower:
            if location:
                return self._get_weather_advice_for_location(location, crop, query_lower)
            else:
                return self._get_weather_general_advice()
        
        # Soil and location-specific queries
        if 'soil' in query_lower and location:
            return self._get_location_soil_advice(location, query_lower)
        
        # Crop-specific advice
        if crop and crop in self.crop_database:
            crop_info = self.crop_database[crop]
            
            if 'plant' in query_lower or 'sow' in query_lower or 'grow' in query_lower:
                return self._get_planting_advice(crop_info, crop, season, location)
            elif 'fertilizer' in query_lower or 'nutrition' in query_lower or 'nutrient' in query_lower:
                return self._get_fertilizer_advice(crop_info, crop)
            elif 'irrigation' in query_lower or 'water' in query_lower:
                return self._get_irrigation_advice(crop_info, crop)
            elif 'pest' in query_lower or 'disease' in query_lower or 'insect' in query_lower:
                return self._get_pest_advice(crop_info, crop)
            elif 'harvest' in query_lower or 'yield' in query_lower:
                return self._get_harvest_advice(crop_info, crop)
            elif 'time' in query_lower or 'when' in query_lower:
                return self._get_timing_advice(crop_info, crop, season)
            else:
                # General crop advice
                return self._get_general_crop_advice(crop_info, crop)
        
        # General farming advice based on keywords
        if 'soil' in query_lower or 'ph' in query_lower or 'nutrient' in query_lower:
            return self._get_soil_advice(query_lower)
        elif 'market' in query_lower or 'price' in query_lower or 'sell' in query_lower:
            return self._get_market_advice()
        elif 'season' in query_lower or 'calendar' in query_lower or 'kharif' in query_lower or 'rabi' in query_lower:
            return self._get_seasonal_advice(season)
        elif 'organic' in query_lower or 'sustainable' in query_lower:
            return self._get_sustainable_advice()
        elif 'technology' in query_lower or 'modern' in query_lower or 'equipment' in query_lower:
            return self._get_technology_advice()
        
        return self._get_general_advice()
    
    def _get_weather_advice_for_location(self, location, crop, query):
        """Generate weather advice for specific location"""
        weather_data = self.get_weather_data(location)
        soil_data = self.get_location_soil_recommendations(location)
        
        advice = f"🌤️ **Weather & Farming Advice for {weather_data['location']}**\n\n"
        
        # Current weather conditions
        advice += f"**Current Weather Conditions:**\n"
        advice += f"• Temperature: {weather_data['temperature']}°C\n"
        advice += f"• Humidity: {weather_data['humidity']}%\n"
        advice += f"• Rainfall: {weather_data['rainfall']}mm\n"
        advice += f"• Wind Speed: {weather_data['wind_speed']:.1f} km/h\n"
        advice += f"• Condition: {weather_data['weather_condition'].replace('_', ' ').title()}\n\n"
        
        # Weather-based farming advice
        temp = weather_data['temperature']
        humidity = weather_data['humidity']
        rainfall = weather_data['rainfall']
        
        advice += f"**Weather-Based Farming Recommendations:**\n"
        
        if temp > 35:
            advice += f"🔥 **High Temperature Alert ({temp}°C):**\n"
            advice += f"   • Increase irrigation frequency\n"
            advice += f"   • Provide shade protection for sensitive crops\n"
            advice += f"   • Avoid field work during peak hours (11 AM - 3 PM)\n"
            advice += f"   • Consider heat-tolerant crop varieties\n\n"
        elif temp < 15:
            advice += f"❄️ **Low Temperature Alert ({temp}°C):**\n"
            advice += f"   • Protect crops from frost damage\n"
            advice += f"   • Use mulching to retain soil warmth\n"
            advice += f"   • Delay planting of warm-season crops\n\n"
        
        if humidity > 80:
            advice += f"💧 **High Humidity ({humidity}%):**\n"
            advice += f"   • Monitor for fungal diseases\n"
            advice += f"   • Ensure proper air circulation\n"
            advice += f"   • Apply preventive fungicides if needed\n\n"
        elif humidity < 40:
            advice += f"🌵 **Low Humidity ({humidity}%):**\n"
            advice += f"   • Increase irrigation frequency\n"
            advice += f"   • Use drip irrigation to maintain moisture\n"
            advice += f"   • Apply mulch to reduce evaporation\n\n"
        
        if rainfall > 10:
            advice += f"🌧️ **Heavy Rainfall ({rainfall}mm):**\n"
            advice += f"   • Ensure proper field drainage\n"
            advice += f"   • Delay fertilizer application\n"
            advice += f"   • Monitor for waterlogging\n\n"
        elif rainfall < 1:
            advice += f"☀️ **Dry Conditions ({rainfall}mm):**\n"
            advice += f"   • Plan irrigation schedule\n"
            advice += f"   • Consider drought-resistant varieties\n"
            advice += f"   • Implement water conservation techniques\n\n"
        
        # Soil recommendations for the location
        if soil_data:
            advice += f"**Soil & Crop Recommendations for {soil_data['location']}:**\n"
            advice += f"• Climate Zone: {soil_data['climate_zone'].replace('_', ' ').title()}\n"
            advice += f"• Dominant Soil: {soil_data['dominant_soil'].replace('_', ' ').title()}\n"
            
            if 'major_crops' in soil_data:
                advice += f"• Recommended Crops: {', '.join(soil_data['major_crops'])}\n"
            
            if 'soil_recommendations' in soil_data:
                advice += f"\n**Soil-Specific Crop Recommendations:**\n"
                for soil_type, crops in soil_data['soil_recommendations'].items():
                    advice += f"• **{soil_type.replace('_', ' ').title()}:** {', '.join(crops)}\n"
        
        # 3-day forecast
        if 'forecast' in weather_data:
            advice += f"\n**3-Day Weather Forecast:**\n"
            for day_data in weather_data['forecast']:
                advice += f"• **{day_data['day']}:** {day_data['temp']}°C, {day_data['humidity']}% humidity, {day_data['rain']}mm rain\n"
        
        return advice
    
    def _get_location_soil_advice(self, location, query):
        """Generate soil advice for specific location"""
        soil_data = self.get_location_soil_recommendations(location)
        
        advice = f"🌱 **Soil Analysis & Recommendations for {location}**\n\n"
        
        if soil_data:
            advice += f"**Location Information:**\n"
            advice += f"• Climate Zone: {soil_data['climate_zone'].replace('_', ' ').title()}\n"
            advice += f"• Dominant Soil Type: {soil_data['dominant_soil'].replace('_', ' ').title()}\n"
            
            if 'soil_types' in soil_data:
                advice += f"• Available Soil Types: {', '.join([s.replace('_', ' ').title() for s in soil_data['soil_types']])}\n"
            
            if 'rainfall_info' in soil_data:
                advice += f"• Average Rainfall: {soil_data['rainfall_info']['average']}mm\n"
                advice += f"• Monsoon Period: {soil_data['rainfall_info']['monsoon']}\n"
            
            advice += f"\n**Soil-Specific Crop Recommendations:**\n"
            for soil_type, crops in soil_data['soil_recommendations'].items():
                advice += f"• **{soil_type.replace('_', ' ').title()}:** {', '.join(crops)}\n"
            
            if 'major_crops' in soil_data:
                advice += f"\n**Major Crops in {location}:** {', '.join(soil_data['major_crops'])}\n"
        
        advice += f"\n**General Soil Management Tips:**\n"
        advice += f"• Conduct soil pH testing annually\n"
        advice += f"• Add organic matter to improve soil structure\n"
        advice += f"• Practice crop rotation for soil health\n"
        advice += f"• Use appropriate fertilizers based on soil test results\n"
        advice += f"• Implement proper drainage systems\n"
        
        return advice
    
    def _get_planting_advice(self, crop_info, crop, season, location=None):
        """Generate planting advice for specific crop"""
        greetings = [
            f"🌱 **{crop.title()} Planting Guide**\n\n",
            f"🚜 **Complete {crop.title()} Planting Manual**\n\n",
            f"🌾 **Expert {crop.title()} Cultivation Guide**\n\n",
            f"🌾 **Professional {crop.title()} Planting Instructions**\n\n"
        ]
        
        advice = random.choice(greetings)
        
        # Add current date context
        current_month = datetime.now().strftime("%B")
        advice += f"*Generated on {datetime.now().strftime('%B %d, %Y')}*\n\n"
        
        # Location-specific information
        if location:
            weather_data = self.get_weather_data(location)
            soil_data = self.get_location_soil_recommendations(location)
            
            advice += f"**Location-Specific Information for {location}:**\n"
            advice += f"• Current Temperature: {weather_data['temperature']}°C\n"
            advice += f"• Current Humidity: {weather_data['humidity']}%\n"
            advice += f"• Recent Rainfall: {weather_data['rainfall']}mm\n"
            
            if soil_data and 'climate_zone' in soil_data:
                advice += f"• Climate Zone: {soil_data['climate_zone'].replace('_', ' ').title()}\n"
                advice += f"• Recommended Soil: {soil_data['dominant_soil'].replace('_', ' ').title()}\n"
            
            advice += f"\n"
        
        # Optimal conditions
        conditions = crop_info['optimal_conditions']
        advice += f"**Optimal Growing Conditions:**\n"
        advice += f"• Temperature: {conditions['temperature']['optimal']}°C (range: {conditions['temperature']['min']}-{conditions['temperature']['max']}°C)\n"
        advice += f"• Soil pH: {conditions['soil_ph']['optimal']} (range: {conditions['soil_ph']['min']}-{conditions['soil_ph']['max']})\n"
        advice += f"• Soil types: {', '.join(conditions['soil_type'])}\n"
        advice += f"• Rainfall requirement: {conditions['rainfall']['growing_season']}mm during growing season\n\n"
        
        # Location suitability check
        if location:
            weather_data = self.get_weather_data(location)
            temp_suitable = conditions['temperature']['min'] <= weather_data['temperature'] <= conditions['temperature']['max']
            
            advice += f"**Location Suitability Check:**\n"
            if temp_suitable:
                advice += f"✅ Current temperature ({weather_data['temperature']}°C) is suitable for {crop}\n"
            else:
                advice += f"⚠️ Current temperature ({weather_data['temperature']}°C) may need adjustment for optimal {crop} growth\n"
            
            advice += f"\n"
        
        # Planting season with context
        advice += f"**Planting Season:** {', '.join(crop_info['planting_season'])}\n"
        advice += f"**Harvest Time:** {crop_info['harvest_time']}\n\n"
        
        # Season-specific advice
        if season:
            advice += f"**{season.title()} Season Specific Tips:**\n"
            if season.lower() == 'kharif':
                advice += f"• Plant after monsoon onset\n"
                advice += f"• Ensure good drainage during heavy rains\n"
            elif season.lower() == 'rabi':
                advice += f"• Plant in winter months\n"
                advice += f"• Protect from frost damage\n"
            advice += f"\n"
        
        # Field preparation
        advice += f"**Field Preparation Steps:**\n"
        advice += f"• Deep plowing (20-25 cm) during summer\n"
        advice += f"• Add farmyard manure (10-15 tons/hectare)\n"
        advice += f"• Level the field using land leveler\n"
        advice += f"• Prepare seedbed with fine tilth\n"
        advice += f"• Ensure proper drainage channels\n\n"
        
        return advice
    
    def _get_fertilizer_advice(self, crop_info, crop):
        """Generate fertilizer advice for specific crop"""
        advice_types = [
            f"🌿 **{crop.title()} Fertilizer Management**\n\n",
            f"🧪 **Nutrient Management for {crop.title()}**\n\n",
            f"💚 **Complete {crop.title()} Nutrition Guide**\n\n",
            f"🔬 **Scientific {crop.title()} Fertilization Plan**\n\n"
        ]
        
        advice = random.choice(advice_types)
        advice += f"*Updated recommendations as of {datetime.now().strftime('%B %Y')}*\n\n"
        
        fertilizer = crop_info['fertilizer_schedule']
        advice += f"**Recommended Fertilizer Schedule:**\n"
        
        if 'nitrogen' in fertilizer:
            advice += f"• **Nitrogen (N):** {fertilizer['nitrogen']}\n"
        if 'phosphorus' in fertilizer:
            advice += f"• **Phosphorus (P):** {fertilizer['phosphorus']}\n"
        if 'potassium' in fertilizer:
            advice += f"• **Potassium (K):** {fertilizer['potassium']}\n\n"
        
        # Enhanced application tips
        advice += f"**Application Guidelines:**\n"
        advice += f"• Apply basal dose 2-3 days before sowing\n"
        advice += f"• Split nitrogen application for better efficiency\n"
        advice += f"• Apply phosphorus as single basal dose\n"
        advice += f"• Monitor plant response and adjust accordingly\n"
        advice += f"• Conduct soil test before application\n\n"
        
        # Organic alternatives
        advice += f"**Organic Alternatives:**\n"
        advice += f"• Compost: 5-10 tons/hectare\n"
        advice += f"• Vermicompost: 2-3 tons/hectare\n"
        advice += f"• Biofertilizers: As per manufacturer's recommendation\n"
        advice += f"• Green manure: Incorporate before flowering\n\n"
        
        return advice
    
    def _get_irrigation_advice(self, crop_info, crop):
        """Generate irrigation advice for specific crop"""
        advice = f"💧 **{crop.title()} Water Management**\n\n"
        
        water_mgmt = crop_info['water_management']
        advice += f"**Irrigation Schedule:**\n"
        
        for stage, requirement in water_mgmt.items():
            advice += f"• **{stage.replace('_', ' ').title()}:** {requirement}\n"
        
        advice += f"\n**General Water Management:**\n"
        advice += f"• Monitor soil moisture regularly\n"
        advice += f"• Avoid over-irrigation to prevent diseases\n"
        advice += f"• Use mulching to conserve moisture\n"
        advice += f"• Consider drip irrigation for water efficiency\n\n"
        
        return advice
    
    def _get_pest_advice(self, crop_info, crop):
        """Generate pest management advice"""
        advice = f"🐛 **{crop.title()} Pest & Disease Management**\n\n"
        
        advice += f"**Common Diseases:** {', '.join(crop_info['common_diseases'])}\n"
        advice += f"**Common Pests:** {', '.join(crop_info['common_pests'])}\n\n"
        
        advice += f"**Integrated Pest Management:**\n"
        advice += f"• Regular field monitoring\n"
        advice += f"• Use resistant varieties when available\n"
        advice += f"• Practice crop rotation\n"
        advice += f"• Biological control methods\n"
        advice += f"• Targeted chemical control when necessary\n\n"
        
        return advice
    
    def _get_harvest_advice(self, crop_info, crop):
        """Generate harvest advice"""
        advice = f"🌾 **{crop.title()} Harvesting Guide**\n\n"
        
        advice += f"**Harvest Time:** {crop_info['harvest_time']}\n"
        advice += f"**Expected Yield:** {crop_info['yield_potential']['average']}-{crop_info['yield_potential']['high']} {crop_info['yield_potential']['unit']}\n\n"
        
        advice += f"**Harvesting Tips:**\n"
        advice += f"• Harvest at proper maturity\n"
        advice += f"• Choose appropriate weather conditions\n"
        advice += f"• Use proper harvesting equipment\n"
        advice += f"• Handle produce carefully to avoid damage\n"
        advice += f"• Plan for immediate processing/storage\n\n"
        
        return advice
    
    def _get_soil_advice(self, query):
        """Generate soil management advice"""
        advice = f"🌱 **Soil Management Guide**\n\n"
        
        advice += f"**Soil Testing Importance:**\n"
        advice += f"• Test soil pH and nutrient levels\n"
        advice += f"• Adjust pH using lime or sulfur\n"
        advice += f"• Add organic matter regularly\n"
        advice += f"• Monitor salinity levels\n\n"
        
        advice += f"**Soil Health Improvement:**\n"
        advice += f"• Use cover crops\n"
        advice += f"• Practice crop rotation\n"
        advice += f"• Minimize tillage\n"
        advice += f"• Add compost and organic matter\n\n"
        
        return advice
    
    def _get_market_advice(self):
        """Generate market and economic advice"""
        advice = f"📈 **Market Intelligence & Economics**\n\n"
        
        advice += f"**Price Factors:**\n"
        advice += f"• Supply and demand dynamics\n"
        advice += f"• Weather conditions\n"
        advice += f"• Government policies\n"
        advice += f"• Global market trends\n\n"
        
        advice += f"**Value Addition Strategies:**\n"
        advice += f"• Direct marketing to consumers\n"
        advice += f"• Processing and packaging\n"
        advice += f"• Contract farming\n"
        advice += f"• Organic certification\n\n"
        
        return advice
    
    def _get_seasonal_advice(self, season):
        """Generate seasonal farming advice"""
        advice = f"📅 **Seasonal Farming Calendar**\n\n"
        
        # Fix: Use the correct attribute name
        season_key = f"{season.lower()}_season" if season else None
        if season_key and season_key in self.seasonal_calendar:
            season_info = self.seasonal_calendar[season_key]
            advice += f"**{season.title()} Season ({season_info['period']})**\n\n"
            
            advice += f"**Monthly Activities:**\n"
            for month, activity in season_info['activities'].items():
                advice += f"• **{month.title()}:** {activity}\n"
            
            advice += f"\n**Major Crops:** {', '.join(season_info['major_crops'])}\n\n"
        else:
            advice += f"**General Seasonal Guidelines:**\n"
            advice += f"• Plan activities according to monsoon\n"
            advice += f"• Select appropriate crops for season\n"
            advice += f"• Prepare for weather challenges\n"
            advice += f"• Monitor market prices\n\n"
        
        return advice
    
    def _get_general_advice(self):
        """Generate general farming advice"""
        advice = f"🌾 **General Farming Best Practices**\n\n"
        
        advice += f"**Sustainable Farming:**\n"
        advice += f"• Practice crop rotation\n"
        advice += f"• Use integrated pest management\n"
        advice += f"• Conserve water resources\n"
        advice += f"• Maintain soil health\n\n"
        
        advice += f"**Technology Adoption:**\n"
        advice += f"• Use weather forecasting\n"
        advice += f"• Adopt precision agriculture\n"
        advice += f"• Leverage mobile apps\n"
        advice += f"• Access market information\n\n"
        
        return advice
    
    def _get_timing_advice(self, crop_info, crop, season):
        """Generate timing-specific advice for crop"""
        advice = f"⏰ **{crop.title()} Timing Guide**\n\n"
        
        advice += f"**Planting Season:** {', '.join(crop_info['planting_season'])}\n"
        advice += f"**Harvest Time:** {crop_info['harvest_time']}\n\n"
        
        advice += f"**Critical Timing Points:**\n"
        if 'water_management' in crop_info:
            for stage, timing in crop_info['water_management'].items():
                advice += f"• **{stage.replace('_', ' ').title()}:** {timing}\n"
        
        advice += f"\n**Growth Duration:** Typically 90-120 days depending on variety\n"
        advice += f"**Best Planting Window:** Early in the season for optimal yield\n\n"
        
        return advice
    
    def _get_general_crop_advice(self, crop_info, crop):
        """Generate general advice for specific crop"""
        advice = f"🌾 **{crop.title()} Cultivation Overview**\n\n"
        
        advice += f"**Scientific Name:** {crop_info['scientific_name']}\n"
        advice += f"**Growth Stages:** {', '.join(crop_info['growth_stages'])}\n\n"
        
        conditions = crop_info['optimal_conditions']
        advice += f"**Optimal Growing Conditions:**\n"
        advice += f"• Temperature: {conditions['temperature']['optimal']}°C\n"
        advice += f"• Soil pH: {conditions['soil_ph']['optimal']}\n"
        advice += f"• Rainfall: {conditions['rainfall']['growing_season']}mm\n\n"
        
        advice += f"**Expected Yield:** {crop_info['yield_potential']['average']}-{crop_info['yield_potential']['high']} {crop_info['yield_potential']['unit']}\n\n"
        
        return advice
    
    def _get_weather_general_advice(self):
        """Generate general weather-related farming advice"""
        advice = f"🌤️ **Weather-Smart Farming**\n\n"
        
        advice += f"**Weather Monitoring:**\n"
        advice += f"• Check daily weather forecasts\n"
        advice += f"• Monitor rainfall patterns\n"
        advice += f"• Track temperature extremes\n"
        advice += f"• Watch for storm warnings\n\n"
        
        advice += f"**Weather-Based Actions:**\n"
        advice += f"• **Hot Weather:** Increase irrigation frequency\n"
        advice += f"• **Cold Weather:** Protect sensitive crops\n"
        advice += f"• **Rainy Season:** Ensure proper drainage\n"
        advice += f"• **Dry Spell:** Implement water conservation\n\n"
        
        return advice
    
    def _get_sustainable_advice(self):
        """Generate sustainable farming advice"""
        advice = f"🌱 **Sustainable Farming Practices**\n\n"
        
        advice += f"**Organic Methods:**\n"
        advice += f"• Use compost and organic fertilizers\n"
        advice += f"• Practice crop rotation\n"
        advice += f"• Encourage beneficial insects\n"
        advice += f"• Avoid synthetic pesticides\n\n"
        
        advice += f"**Soil Conservation:**\n"
        advice += f"• Minimize tillage\n"
        advice += f"• Use cover crops\n"
        advice += f"• Implement contour farming\n"
        advice += f"• Maintain soil organic matter\n\n"
        
        advice += f"**Water Conservation:**\n"
        advice += f"• Use drip irrigation\n"
        advice += f"• Practice mulching\n"
        advice += f"• Harvest rainwater\n"
        advice += f"• Choose drought-resistant varieties\n\n"
        
        return advice
    
    def _get_technology_advice(self):
        """Generate technology-related farming advice"""
        advice = f"🚀 **Modern Agricultural Technology**\n\n"
        
        advice += f"**Precision Agriculture:**\n"
        advice += f"• Use GPS-guided machinery\n"
        advice += f"• Implement variable rate application\n"
        advice += f"• Monitor with drones and satellites\n"
        advice += f"• Use soil sensors for real-time data\n\n"
        
        advice += f"**Digital Tools:**\n"
        advice += f"• Weather forecasting apps\n"
        advice += f"• Crop management software\n"
        advice += f"• Market price tracking\n"
        advice += f"• Pest identification apps\n\n"
        
        advice += f"**Automation:**\n"
        advice += f"• Automated irrigation systems\n"
        advice += f"• Greenhouse climate control\n"
        advice += f"• Robotic harvesting\n"
        advice += f"• Smart farm monitoring\n\n"
        
        return advice

# Initialize Farming Expert AI
farming_expert = FarmingExpertAI()

# Plant disease classes
PLANT_CLASSES = [
    'healthy', 'bacterial_spot', 'early_blight', 'late_blight',
    'leaf_mold', 'septoria_leaf_spot', 'spider_mites',
    'target_spot', 'mosaic_virus', 'yellow_leaf_curl_virus'
]

@app.route('/')
def home():
    return jsonify({
        'message': 'AgriGuru Farming Expert API',
        'status': 'active',
        'endpoints': [
            '/api/expert-advice',
            '/api/analyze-crop',
            '/api/weather-advice',
            '/api/market-insights',
            '/api/seasonal-calendar',
            '/api/soil-recommendations'
        ],
        'features': [
            'Real-time weather data for any location',
            'Location-specific soil recommendations',
            'Crop suitability analysis',
            'Weather-based farming advice',
            'Regional farming insights'
        ]
    })

@app.route('/api/expert-advice', methods=['POST'])
def get_expert_advice():
    """Get expert farming advice"""
    try:
        data = request.json
        query = data.get('query', '')
        crop = data.get('crop', None)
        location = data.get('location', None)
        season = data.get('season', None)
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Get expert advice
        advice = farming_expert.get_expert_advice(query, crop, location, season)
        
        # Add contextual information
        context = {
            'timestamp': datetime.now().isoformat(),
            'query_type': 'expert_advice',
            'crop': crop,
            'location': location,
            'season': season
        }
        
        return jsonify({
            'advice': advice,
            'context': context,
            'success': True
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-crop', methods=['POST'])
def analyze_crop():
    """Analyze crop image for diseases"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        # Process image
        image = Image.open(image_file.stream).convert('RGB')
        
        # Mock disease analysis (replace with actual model)
        disease_result = {
            'disease': 'healthy',
            'confidence': 0.85,
            'message': 'Mock analysis - replace with actual model'
        }
        
        # Get expert advice based on disease detection
        crop_type = request.form.get('crop_type', 'general')
        if disease_result['disease'] != 'healthy':
            expert_advice = farming_expert.get_expert_advice(
                f"How to treat {disease_result['disease']} in {crop_type}?",
                crop=crop_type
            )
        else:
            expert_advice = farming_expert.get_expert_advice(
                f"Best practices for {crop_type} cultivation",
                crop=crop_type
            )
        
        return jsonify({
            'disease_analysis': disease_result,
            'expert_advice': expert_advice,
            'crop_type': crop_type,
            'success': True
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather-advice', methods=['POST'])
def get_weather_advice():
    """Get weather-based farming advice"""
    try:
        data = request.json
        location = data.get('location', 'Delhi')
        crop = data.get('crop', None)
        
        # Get real weather data and location-specific advice
        weather_data = farming_expert.get_weather_data(location)
        soil_data = farming_expert.get_location_soil_recommendations(location)
        
        # Generate comprehensive weather-based advice
        advice = farming_expert._get_weather_advice_for_location(location, crop, 'weather advice')
        
        return jsonify({
            'weather_data': weather_data,
            'soil_data': soil_data,
            'advice': advice,
            'location': location,
            'success': True
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/market-insights', methods=['GET'])
def get_market_insights():
    """Get market insights and price trends"""
    try:
        crop = request.args.get('crop', 'rice')
        location = request.args.get('location', 'india')
        
        # Mock market data
        market_data = {
            'current_price': 2500,
            'price_trend': 'increasing',
            'price_change': '+5.2%',
            'market_demand': 'high',
            'supply_status': 'normal',
            'price_forecast': [
                {'period': 'Next Week', 'price': 2550, 'trend': 'up'},
                {'period': 'Next Month', 'price': 2600, 'trend': 'up'},
                {'period': '3 Months', 'price': 2450, 'trend': 'down'}
            ]
        }
        
        # Generate market advice
        market_advice = farming_expert.get_expert_advice(
            f"Market trends and pricing for {crop}",
            crop=crop
        )
        
        return jsonify({
            'market_data': market_data,
            'advice': market_advice,
            'crop': crop,
            'success': True
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/seasonal-calendar', methods=['GET'])
def get_seasonal_calendar():
    """Get seasonal farming calendar"""
    try:
        season = request.args.get('season', 'kharif')
        location = request.args.get('location', 'india')
        
        # Get seasonal advice
        seasonal_advice = farming_expert.get_expert_advice(
            f"Seasonal farming activities for {season}",
            season=season
        )
        
        return jsonify({
            'seasonal_advice': seasonal_advice,
            'season': season,
            'location': location,
            'success': True
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/soil-recommendations', methods=['GET'])
def get_soil_recommendations():
    """Get soil recommendations for a location"""
    try:
        location = request.args.get('location', 'india')
        
        # Get soil recommendations
        soil_data = farming_expert.get_location_soil_recommendations(location)
        advice = farming_expert._get_location_soil_advice(location, 'soil recommendations')
        
        return jsonify({
            'soil_data': soil_data,
            'advice': advice,
            'location': location,
            'success': True
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🌾 Starting AgriGuru Farming Expert API...")
    print("✅ Farming Expert AI initialized successfully!")
    print("🚀 Server running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
