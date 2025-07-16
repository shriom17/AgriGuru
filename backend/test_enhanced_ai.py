#!/usr/bin/env python3
"""
Test script for the enhanced AgriGuru AI with weather and soil recommendations
"""

import requests
import json

def test_ai_endpoints():
    """Test all AI endpoints"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Enhanced AgriGuru AI System")
    print("=" * 50)
    
    # Test 1: Basic health check
    print("\n1. Testing API Health Check...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            data = response.json()
            print("✅ API is running")
            print(f"   Features: {', '.join(data.get('features', []))}")
        else:
            print("❌ API health check failed")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False
    
    # Test 2: Weather-based advice
    print("\n2. Testing Weather-Based Advice...")
    try:
        weather_data = {
            "location": "Delhi",
            "crop": "wheat"
        }
        response = requests.post(f"{base_url}/api/weather-advice", json=weather_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Weather advice generated")
            print(f"   Location: {data.get('location')}")
            print(f"   Temperature: {data.get('weather_data', {}).get('temperature')}°C")
            print(f"   Advice length: {len(data.get('advice', ''))} characters")
        else:
            print("❌ Weather advice failed")
    except Exception as e:
        print(f"❌ Weather test failed: {e}")
    
    # Test 3: Soil recommendations
    print("\n3. Testing Soil Recommendations...")
    try:
        response = requests.get(f"{base_url}/api/soil-recommendations?location=punjab")
        if response.status_code == 200:
            data = response.json()
            print("✅ Soil recommendations generated")
            print(f"   Location: {data.get('location')}")
            print(f"   Climate zone: {data.get('soil_data', {}).get('climate_zone')}")
            print(f"   Dominant soil: {data.get('soil_data', {}).get('dominant_soil')}")
        else:
            print("❌ Soil recommendations failed")
    except Exception as e:
        print(f"❌ Soil test failed: {e}")
    
    # Test 4: Expert advice with location
    print("\n4. Testing Location-Specific Expert Advice...")
    try:
        expert_data = {
            "query": "What crops should I grow in Maharashtra?",
            "location": "Maharashtra",
            "season": "kharif"
        }
        response = requests.post(f"{base_url}/api/expert-advice", json=expert_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Expert advice generated")
            print(f"   Query: {expert_data['query']}")
            print(f"   Location: {expert_data['location']}")
            print(f"   Response length: {len(data.get('advice', ''))} characters")
        else:
            print("❌ Expert advice failed")
    except Exception as e:
        print(f"❌ Expert advice test failed: {e}")
    
    # Test 5: Weather query through expert advice
    print("\n5. Testing Weather Query via Expert Advice...")
    try:
        weather_query = {
            "query": "What is the weather like in Kerala for rice cultivation?",
            "location": "Kerala",
            "crop": "rice"
        }
        response = requests.post(f"{base_url}/api/expert-advice", json=weather_query)
        if response.status_code == 200:
            data = response.json()
            print("✅ Weather query processed")
            print(f"   Query: {weather_query['query']}")
            print(f"   Response contains weather data: {'weather' in data.get('advice', '').lower()}")
        else:
            print("❌ Weather query failed")
    except Exception as e:
        print(f"❌ Weather query test failed: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Enhanced AI Testing Complete!")
    print("\n🌟 New Features Available:")
    print("• Real-time weather data for any location")
    print("• Location-specific soil recommendations")
    print("• Crop suitability analysis")
    print("• Weather-based farming advice")
    print("• Regional farming insights")
    
    return True

if __name__ == "__main__":
    print("🚀 Make sure the server is running: python farming_expert_app.py")
    input("Press Enter when server is ready...")
    test_ai_endpoints()
