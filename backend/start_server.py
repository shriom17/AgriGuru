#!/usr/bin/env python3
"""
Simple test to verify the farming expert is working
"""
import sys
import os

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_farming_expert():
    """Test the farming expert directly"""
    print("🧪 Testing AgriGuru Farming Expert AI")
    print("=" * 50)
    
    try:
        # Import the farming expert
        from farming_expert_app import farming_expert
        
        print("✅ Successfully imported farming_expert")
        
        # Test different queries
        test_queries = [
            ("How to plant rice?", "rice", "kharif"),
            ("What fertilizers for wheat?", "wheat", "rabi"),
            ("Irrigation for cotton", "cotton", "kharif"),
            ("Pest control in maize", "maize", None),
            ("Soil management tips", None, None),
        ]
        
        for i, (query, crop, season) in enumerate(test_queries, 1):
            print(f"\n{i}. Testing: {query}")
            print(f"   Crop: {crop}, Season: {season}")
            
            try:
                response = farming_expert.get_expert_advice(query, crop=crop, season=season)
                print(f"   Response length: {len(response)} characters")
                print(f"   First 150 chars: {response[:150]}...")
                print("   ✅ SUCCESS")
            except Exception as e:
                print(f"   ❌ ERROR: {e}")
                import traceback
                traceback.print_exc()
        
        print("\n" + "=" * 50)
        print("✅ Farming Expert Test Complete!")
        return True
        
    except Exception as e:
        print(f"❌ Failed to import or test farming expert: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_farming_expert()
    
    if success:
        print("\n🚀 Starting Flask server...")
        try:
            from farming_expert_app import app
            print("✅ Flask app imported successfully")
            print("🌾 AgriGuru Farming Expert API is ready!")
            print("📡 Starting server on http://localhost:5000")
            app.run(debug=True, host='0.0.0.0', port=5000)
        except Exception as e:
            print(f"❌ Failed to start Flask server: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("\n❌ Cannot start server due to farming expert issues")
