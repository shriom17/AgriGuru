#!/bin/bash
# AgriGuru AI Backend Server Starter
# Cross-platform shell script for Unix/Linux/Mac systems

echo "🌾 AgriGuru AI Backend Server Starter"
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    echo "   Please install Python 3.7 or higher"
    exit 1
fi

# Check Python version
python_version=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo "✅ Python version: $python_version"

# Check if we're in the right directory
if [ ! -f "farming_expert_app.py" ]; then
    echo "❌ farming_expert_app.py not found!"
    echo "   Make sure you're in the backend directory"
    exit 1
fi

echo "✅ Found farming_expert_app.py"

# Check if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📋 Found requirements.txt"
    echo "💡 Make sure dependencies are installed: pip install -r requirements.txt"
else
    echo "⚠️  requirements.txt not found"
fi

# Start the server
echo ""
echo "🚀 Starting AgriGuru AI Backend Server..."
echo "🌐 Server will run on: http://localhost:5000"
echo "🧪 Test interface: test_ai.html"
echo "💡 Press Ctrl+C to stop the server"
echo "--------------------------------------------------"

# Run the Flask app
python3 farming_expert_app.py

echo ""
echo "🛑 Server stopped"
