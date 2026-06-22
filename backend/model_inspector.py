"""
Model Inspector - Analyze the trained disease detection model
"""
import os
import json
import numpy as np
from tensorflow.keras.models import load_model

def inspect_model():
    """Inspect the trained model details"""
    
    # Model paths
    model_path = './models/quick_crop_disease_model.h5'
    training_info_path = './models/quick_training_info.json'
    
    print("🔍 KisanMitra Model Inspector")
    print("=" * 50)
    
    # Check if files exist
    if not os.path.exists(model_path):
        print(f"❌ Model not found: {model_path}")
        return
    
    if not os.path.exists(training_info_path):
        print(f"❌ Training info not found: {training_info_path}")
        return
    
    # Load training information
    print("📊 Loading training information...")
    with open(training_info_path, 'r') as f:
        training_info = json.load(f)
    
    print(f"✅ Training completed: {training_info.get('training_completed', 'Unknown')}")
    print(f"📈 Final accuracy: {training_info.get('final_accuracy', 0):.4f}")
    print(f"📉 Final loss: {training_info.get('final_loss', 0):.4f}")
    print(f"🎯 Total classes: {len(training_info.get('class_names', []))}")
    print(f"📐 Image size: {training_info.get('img_size', 'Unknown')}")
    print(f"🔄 Epochs trained: {training_info.get('epochs', 'Unknown')}")
    
    # Display class names
    print("\n🏷️ Disease Classes:")
    for i, class_name in enumerate(training_info.get('class_names', [])):
        print(f"   {i:2d}: {class_name}")
    
    # Load and inspect model
    print(f"\n🤖 Loading model from {model_path}...")
    try:
        model = load_model(model_path)
        print("✅ Model loaded successfully!")
        
        # Model architecture
        print(f"\n🏗️ Model Architecture:")
        print(f"   📊 Total parameters: {model.count_params():,}")
        print(f"   🔢 Trainable parameters: {sum([np.prod(layer.get_weights()[0].shape) + np.prod(layer.get_weights()[1].shape) if len(layer.get_weights()) == 2 else 0 for layer in model.layers if len(layer.get_weights()) > 0]):,}")
        print(f"   📏 Input shape: {model.input_shape}")
        print(f"   📐 Output shape: {model.output_shape}")
        print(f"   🧩 Number of layers: {len(model.layers)}")
        
        # Model summary
        print(f"\n📋 Model Summary:")
        model.summary()
        
        # File size
        file_size = os.path.getsize(model_path)
        print(f"\n💾 Model File Info:")
        print(f"   📂 File size: {file_size / (1024*1024):.2f} MB")
        print(f"   📍 File path: {os.path.abspath(model_path)}")
        
        return model, training_info
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None, training_info

def test_model_prediction():
    """Test the model with a sample prediction"""
    print("\n🧪 Testing Model Prediction...")
    
    model_path = './models/quick_crop_disease_model.h5'
    training_info_path = './models/quick_training_info.json'
    
    if not os.path.exists(model_path):
        print("❌ Model not found for testing")
        return
    
    try:
        # Load model and info
        model = load_model(model_path)
        with open(training_info_path, 'r') as f:
            training_info = json.load(f)
        
        # Create dummy input (96x96x3 image)
        img_size = training_info.get('img_size', 96)
        dummy_image = np.random.rand(1, img_size, img_size, 3)
        
        # Make prediction
        predictions = model.predict(dummy_image, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        
        class_names = training_info.get('class_names', [])
        predicted_class = class_names[predicted_class_idx] if predicted_class_idx < len(class_names) else 'Unknown'
        
        print(f"✅ Test prediction successful!")
        print(f"🎯 Predicted class: {predicted_class}")
        print(f"📊 Confidence: {confidence:.4f}")
        print(f"🔢 Class index: {predicted_class_idx}")
        
        # Show top 3 predictions
        print(f"\n🏆 Top 3 Predictions:")
        top_indices = np.argsort(predictions[0])[-3:][::-1]
        for i, idx in enumerate(top_indices):
            class_name = class_names[idx] if idx < len(class_names) else f'Class_{idx}'
            conf = predictions[0][idx]
            print(f"   {i+1}. {class_name}: {conf:.4f}")
        
    except Exception as e:
        print(f"❌ Test prediction failed: {e}")

if __name__ == "__main__":
    model, training_info = inspect_model()
    if model is not None:
        test_model_prediction()