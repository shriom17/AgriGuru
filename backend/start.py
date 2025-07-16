#!/usr/bin/env python3
"""
AgriGuru AI Backend Server Starter
Modern cross-platform Python script to start the farming expert AI server
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        print(f"   Current version: {sys.version}")
        return False
    return True

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = ['flask', 'flask_cors', 'torch', 'PIL', 'requests']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\n💡 Install with: pip install -r requirements.txt")
        return False
    return True

def start_server():
    """Start the farming expert AI server"""
    print("🌾 AgriGuru AI Backend Server Starter")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Check if farming_expert_app.py exists
    if not Path('farming_expert_app.py').exists():
        print("❌ farming_expert_app.py not found!")
        print("   Make sure you're in the correct directory")
        return False
    
    print("✅ Found farming_expert_app.py")
    
    # Check dependencies
    print("\n🔍 Checking dependencies...")
    if not check_dependencies():
        return False
    
    print("✅ All dependencies are installed")
    
    # Start the server
    print("\n🚀 Starting AgriGuru AI Backend Server...")
    print("🌐 Server will run on: http://localhost:5000")
    print("🧪 Test interface: test_ai.html")
    print("💡 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Start the Flask app
        subprocess.run([sys.executable, 'farming_expert_app.py'], check=True)
        return True
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error starting server: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = start_server()
    
    if not success:
        print("\n🔧 Troubleshooting:")
        print("1. Make sure Python 3.7+ is installed")
        print("2. Install dependencies: pip install -r requirements.txt")
        print("3. Ensure you're in the backend directory")
        print("4. Check if port 5000 is available")
        
        # Keep window open on Windows
        if os.name == 'nt':
            input("\nPress Enter to exit...")
        sys.exit(1)
    
    print("✅ Server started successfully!")
    
    # Keep window open on Windows
    if os.name == 'nt':
        input("\nPress Enter to exit...")
