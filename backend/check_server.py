#!/usr/bin/env python3
"""
Simple Backend Server Checker for AgriGuru
This script checks if the backend server is running properly
"""

import requests
import sys
import json
from datetime import datetime

def check_backend_status():
    """Check if the backend server is running"""
    try:
        # Test the main endpoint
        response = requests.get('http://localhost:5000/', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend server is running!")
            print(f"   Message: {data.get('message', 'N/A')}")
            print(f"   Status: {data.get('status', 'N/A')}")
            return True
        else:
            print(f"❌ Backend server responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running")
        print("   Please start the server with: python farming_expert_app.py")
        return False
    except requests.exceptions.Timeout:
        print("❌ Backend server is not responding (timeout)")
        return False
    except Exception as e:
        print(f"❌ Error checking backend: {e}")
        return False

def test_ai_endpoint():
    """Test the AI expert advice endpoint"""
    try:
        test_query = {
            "query": "How to plant rice?",
            "crop": "rice",
            "season": "kharif"
        }
        
        response = requests.post(
            'http://localhost:5000/api/expert-advice',
            json=test_query,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ AI expert advice endpoint is working!")
            print(f"   Response length: {len(data.get('advice', ''))} characters")
            print(f"   Success: {data.get('success', False)}")
            return True
        else:
            print(f"❌ AI endpoint responded with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing AI endpoint: {e}")
        return False

def main():
    print("🌾 AgriGuru Backend Status Checker")
    print("=" * 40)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Check basic server status
    server_ok = check_backend_status()
    print()
    
    if server_ok:
        # Test AI endpoint
        ai_ok = test_ai_endpoint()
        print()
        
        if ai_ok:
            print("🎉 All systems are working correctly!")
            print("🚀 Your frontend can now connect to the enhanced AI")
            print()
            print("Next steps:")
            print("1. Start your React frontend: npm start")
            print("2. Open the AI chat in your browser")
            print("3. Test with quick actions or custom queries")
        else:
            print("⚠️  Server is running but AI endpoint has issues")
            print("   Check the backend logs for errors")
    else:
        print("🔧 To start the backend server:")
        print("   1. Go to the backend folder")
        print("   2. Run: python farming_expert_app.py")
        print("   3. Wait for 'Server running on http://localhost:5000'")
        print("   4. Run this checker again")

if __name__ == "__main__":
    main()
