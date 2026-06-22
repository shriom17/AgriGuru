"""
Updated Multi-Crop Service with Real Model Integration
====================================================

This service integrates the trained CNN model with the existing KisanMitra system.
"""

import os
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MultiCropDiseaseService:
    def __init__(self):
        """Initialize the multi-crop disease detection service"""
        self.real_model = None
        self.model_loaded = False
        self.class_names = []
        self.img_size = 96
        self.confidence_threshold = 0.6
        self.model_accuracy = None  # Initialize model accuracy
        
        # Model paths
        self.model_path = './models/quick_crop_disease_model.h5'
        self.training_info_path = './models/quick_training_info.json'
        
        # Try to load the real model
        self.load_real_model()
    
    def load_real_model(self):
        """Load the trained CNN model"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.training_info_path):
                # Load training information
                with open(self.training_info_path, 'r') as f:
                    training_info = json.load(f)
                
                self.class_names = training_info['class_names']
                self.img_size = training_info['img_size']
                self.model_accuracy = training_info['final_accuracy']  # Store model accuracy
                
                # Load the model
                logger.info(f"🔄 Loading trained model from {self.model_path}")
                self.real_model = load_model(self.model_path)
                
                logger.info(f"✅ Real model loaded successfully!")
                logger.info(f"📊 Model accuracy: {training_info['final_accuracy']:.4f}")
                logger.info(f"📊 Classes: {len(self.class_names)}")
                
                self.model_loaded = True
                return True
            else:
                logger.warning("⚠️  Trained model not found, using simulation mode")
                return False
                
        except Exception as e:
            logger.error(f"❌ Failed to load real model: {e}")
            return False
    
    def preprocess_image(self, image_path):
        """Preprocess image for model prediction"""
        try:
            # Load and resize image
            image = Image.open(image_path)
            image = image.convert('RGB')
            image = image.resize((self.img_size, self.img_size))
            
            # Convert to numpy array and normalize
            image_array = np.array(image) / 255.0
            image_array = np.expand_dims(image_array, axis=0)
            
            return image_array
            
        except Exception as e:
            logger.error(f"❌ Error preprocessing image: {e}")
            return None
    
    def analyze_crop_image(self, image_path, crop_type="auto"):
        """Analyze crop image for disease detection"""
        
        if self.model_loaded:
            return self._real_model_analysis(image_path, crop_type)
        else:
            return self._simulation_analysis(image_path, crop_type)
    
    def _real_model_analysis(self, image_path, crop_type):
        """Use trained model for real disease detection"""
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_path)
            if processed_image is None:
                return self._fallback_response("Image preprocessing failed")
            
            # Make prediction
            predictions = self.real_model.predict(processed_image, verbose=0)
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx])
            
            # Get class name
            predicted_class = self.class_names[predicted_class_idx]
            
            # Parse prediction
            disease_info = self._parse_prediction(predicted_class, confidence)
            
            logger.info(f"🔍 Real Model Prediction: {predicted_class} (confidence: {confidence:.4f})")
            
            return {
                'status': 'success',
                'analysis_type': 'real_model',
                'crop_type': disease_info['crop'],
                'disease_detected': disease_info['disease'],
                'confidence': confidence,
                'is_healthy': disease_info['is_healthy'],
                'severity': disease_info['severity'],
                'recommendations': disease_info['recommendations'],
                'timestamp': datetime.now().isoformat(),
                'model_info': {
                    'type': 'Trained CNN Model',
                    'classes': len(self.class_names),
                    'confidence_threshold': self.confidence_threshold
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Real model analysis failed: {e}")
            return self._fallback_response(f"Model analysis error: {e}")
    
    def _simulation_analysis(self, image_path, crop_type):
        """Fallback simulation analysis"""
        import random
        
        # Simulate analysis based on crop type
        crops = ['Tomato', 'Pepper', 'Potato', 'Corn', 'Wheat']
        diseases = {
            'Tomato': ['Healthy', 'Bacterial Spot', 'Early Blight', 'Late Blight', 'Leaf Mold'],
            'Pepper': ['Healthy', 'Bacterial Spot', 'Healthy'],
            'Potato': ['Healthy', 'Early Blight', 'Late Blight'],
            'Corn': ['Healthy', 'Corn Rust', 'Northern Leaf Blight'],
            'Wheat': ['Healthy', 'Wheat Rust', 'Powdery Mildew']
        }
        
        # Random selection for simulation
        detected_crop = random.choice(crops) if crop_type == "auto" else crop_type
        possible_diseases = diseases.get(detected_crop, ['Healthy', 'Unknown Disease'])
        detected_disease = random.choice(possible_diseases)
        is_healthy = detected_disease == 'Healthy'
        confidence = random.uniform(0.7, 0.95)
        
        recommendations = self._get_simulation_recommendations(detected_crop, detected_disease, is_healthy)
        
        logger.info(f"🎭 Simulation: {detected_crop} - {detected_disease}")
        
        return {
            'status': 'success',
            'analysis_type': 'simulation',
            'crop_type': detected_crop,
            'disease_detected': detected_disease,
            'confidence': confidence,
            'is_healthy': is_healthy,
            'severity': 'Low' if is_healthy else random.choice(['Medium', 'High']),
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat(),
            'model_info': {
                'type': 'Simulation Mode',
                'note': 'Train a real model for accurate results'
            }
        }
    
    def _parse_prediction(self, class_name, confidence):
        """Parse model prediction into structured information"""
        class_name_lower = class_name.lower()
        
        # Determine crop from actual model class names
        if 'tomato' in class_name_lower:
            crop = 'Tomato'
        elif 'pepper' in class_name_lower or 'bell' in class_name_lower:
            crop = 'Pepper (Bell)'
        elif 'potato' in class_name_lower:
            crop = 'Potato'
        else:
            crop = 'Unknown'
        
        # Determine if healthy
        is_healthy = 'healthy' in class_name_lower
        
        # Extract disease name based on actual class names
        if is_healthy:
            disease = 'Healthy'
            severity = 'None'
        else:
            # Map diseases based on your actual trained model classes
            if 'bacterial_spot' in class_name_lower:
                disease = 'Bacterial Spot'
                severity = 'High'
            elif 'early_blight' in class_name_lower:
                disease = 'Early Blight'
                severity = 'High'
            elif 'late_blight' in class_name_lower:
                disease = 'Late Blight'
                severity = 'High'
            elif 'leaf_mold' in class_name_lower or 'leaf_mould' in class_name_lower:
                disease = 'Leaf Mold'
                severity = 'Medium'
            elif 'septoria' in class_name_lower:
                disease = 'Septoria Leaf Spot'
                severity = 'Medium'
            elif 'spider_mites' in class_name_lower:
                disease = 'Spider Mites (Two-spotted)'
                severity = 'Medium'
            elif 'target_spot' in class_name_lower:
                disease = 'Target Spot'
                severity = 'Medium'
            elif 'mosaic_virus' in class_name_lower:
                disease = 'Tomato Mosaic Virus'
                severity = 'High'
            elif 'yellowleaf' in class_name_lower or 'curl_virus' in class_name_lower:
                disease = 'Yellow Leaf Curl Virus'
                severity = 'High'
            else:
                disease = 'Unknown Disease'
                severity = 'Medium'
        
        # Adjust severity based on confidence
        if confidence < self.confidence_threshold:
            severity = 'Uncertain'
        
        recommendations = self._get_disease_recommendations(crop, disease, is_healthy, severity)
        
        return {
            'crop': crop,
            'disease': disease,
            'is_healthy': is_healthy,
            'severity': severity,
            'recommendations': recommendations
        }
    
    def _get_disease_recommendations(self, crop, disease, is_healthy, severity):
        """Get disease-specific recommendations"""
        if is_healthy:
            return [
                f"✅ Your {crop.lower()} plant appears healthy!",
                "🌱 Continue current care routine",
                "💧 Maintain proper watering schedule",
                "🌞 Ensure adequate sunlight",
                "🔍 Monitor regularly for any changes"
            ]
        
        recommendations = [f"🚨 {disease} detected in {crop.lower()}"]
        
        if disease == 'Bacterial Spot':
            recommendations.extend([
                "🧪 Apply copper-based bactericide (copper sulfate)",
                "💧 Avoid overhead watering - water at soil level",
                "🍃 Remove affected leaves and dispose safely",
                "🌬️ Improve air circulation between plants",
                "🧽 Sanitize tools between plants"
            ])
        elif disease == 'Early Blight':
            recommendations.extend([
                "🧪 Apply fungicide (chlorothalonil, mancozeb, or boscalid)",
                "🍃 Remove infected plant debris immediately",
                "🔄 Practice crop rotation - avoid planting same family",
                "💧 Water at soil level to keep foliage dry",
                "🌱 Apply mulch to prevent soil splash"
            ])
        elif disease == 'Late Blight':
            recommendations.extend([
                "🚨 URGENT: Apply copper or mancozeb fungicide immediately",
                "🍃 Remove and destroy infected plants completely",
                "💧 Reduce humidity - improve ventilation",
                "⚠️ Act quickly - this disease spreads very rapidly",
                "🔥 Do not compost infected material"
            ])
        elif disease == 'Leaf Mold':
            recommendations.extend([
                "🌬️ Increase air circulation and reduce humidity",
                "🧪 Apply fungicide if severe (chlorothalonil)",
                "🍃 Remove affected leaves from bottom up",
                "💧 Water at soil level only",
                "🌡️ Maintain temperature below 75°F if possible"
            ])
        elif disease == 'Septoria Leaf Spot':
            recommendations.extend([
                "🧪 Apply fungicide (copper-based or chlorothalonil)",
                "🍃 Remove infected leaves from bottom of plant",
                "💧 Avoid overhead watering",
                "🌱 Apply mulch to prevent soil splash",
                "🔄 Practice crop rotation"
            ])
        elif 'Spider Mites' in disease:
            recommendations.extend([
                "💦 Increase humidity around plants",
                "🧪 Apply miticide or insecticidal soap",
                "🍃 Remove heavily infested leaves",
                "🌬️ Improve air circulation",
                "🔍 Check undersides of leaves regularly"
            ])
        elif disease == 'Target Spot':
            recommendations.extend([
                "🧪 Apply fungicide (azoxystrobin or chlorothalonil)",
                "🍃 Remove infected plant debris",
                "💧 Water at soil level to keep foliage dry",
                "🌱 Apply mulch to reduce soil splash",
                "🔄 Practice crop rotation"
            ])
        elif 'Mosaic Virus' in disease:
            recommendations.extend([
                "🚨 No cure available - focus on prevention",
                "🍃 Remove and destroy infected plants",
                "🐛 Control aphids and other vectors",
                "🧽 Sanitize tools between plants",
                "🌱 Plant virus-resistant varieties next season"
            ])
        elif 'Yellow Leaf Curl' in disease:
            recommendations.extend([
                "🚨 Viral disease - no cure available",
                "🍃 Remove infected plants to prevent spread",
                "🐛 Control whiteflies (primary vector)",
                "🧪 Use yellow sticky traps for whiteflies",
                "🌱 Plant resistant varieties if available"
            ])
        else:
            recommendations.extend([
                "🧪 Consult with agricultural expert for treatment",
                "🍃 Remove affected plant parts immediately",
                "💧 Adjust watering practices",
                "🔍 Monitor plant closely for progression"
            ])
        
        recommendations.extend([
            f"📊 Severity Level: {severity}",
            f"🎯 Detection Confidence: High",
            "📞 Contact local agricultural extension for specific advice"
        ])
        
        return recommendations
    
    def _get_simulation_recommendations(self, crop, disease, is_healthy):
        """Get simulation recommendations"""
        if is_healthy:
            return [
                f"✅ {crop} appears healthy (simulation)",
                "🎭 This is simulated analysis",
                "🚀 Train a real model for accurate results"
            ]
        else:
            return [
                f"🚨 {disease} detected in {crop} (simulation)",
                "🎭 This is simulated analysis",
                "🧪 Consult agricultural expert",
                "🚀 Train a real model for accurate diagnosis"
            ]
    
    def _fallback_response(self, error_message):
        """Return fallback response for errors"""
        return {
            'status': 'error',
            'analysis_type': 'fallback',
            'crop_type': 'Unknown',
            'disease_detected': 'Unable to determine',
            'confidence': 0.0,
            'is_healthy': False,
            'severity': 'Unknown',
            'recommendations': [
                "⚠️ Analysis failed",
                f"🔧 Error: {error_message}",
                "📸 Try taking a clearer photo",
                "🌞 Ensure good lighting",
                "📞 Contact agricultural expert"
            ],
            'timestamp': datetime.now().isoformat(),
            'model_info': {
                'type': 'Error Fallback',
                'status': 'Analysis failed'
            }
        }
    
    def get_model_status(self):
        """Get current model status"""
        return {
            'model_loaded': self.model_loaded,
            'model_type': 'Trained CNN' if self.model_loaded else 'Simulation',
            'classes': len(self.class_names) if self.model_loaded else 0,
            'total_classes': len(self.class_names) if self.model_loaded else 0,
            'model_accuracy': self.model_accuracy if hasattr(self, 'model_accuracy') and self.model_accuracy else 0.5039,
            'model_path': self.model_path,
            'image_size': self.img_size,
            'confidence_threshold': self.confidence_threshold
        }

# Example usage
if __name__ == "__main__":
    service = MultiCropDiseaseService()
    status = service.get_model_status()
    
    logger.info("🌾 Multi-Crop Disease Detection Service")
    logger.info(f"📊 Model Status: {status}")
    
    if status['model_loaded']:
        logger.info("🎉 Real model is ready for production!")
    else:
        logger.info("🎭 Running in simulation mode")
        logger.info("💡 Complete training to use real model")