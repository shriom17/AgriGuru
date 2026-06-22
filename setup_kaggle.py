#!/usr/bin/env python3
"""
Quick Setup Script for Kaggle Integration
Simple steps to get started with real agricultural data
"""

import os
import sys
from pathlib import Path

def check_kaggle_setup():
    """Check if Kaggle API is properly configured"""
    print("ðŸ” Checking Kaggle API setup...")
    
    try:
        import kaggle
        print("âœ… Kaggle package is installed")
        
        # Try to access Kaggle API
        kaggle.api.authenticate()
        print("âœ… Kaggle API credentials are working!")
        return True
        
    except ImportError:
        print("âŒ Kaggle package not installed")
        print("   Run: pip install kaggle")
        return False
        
    except OSError as e:
        if "credentials" in str(e).lower():
            print("âŒ Kaggle API credentials not found")
            print("\nðŸ”§ Quick Setup:")
            print("1. Go to: https://www.kaggle.com/settings/account")
            print("2. Scroll to 'API' section")
            print("3. Click 'Create New API Token'")
            print("4. Download the kaggle.json file")
            
            # Get user's home directory
            home_dir = Path.home()
            kaggle_dir = home_dir / '.kaggle'
            
            print(f"5. Create directory: {kaggle_dir}")
            print(f"6. Move kaggle.json to: {kaggle_dir / 'kaggle.json'}")
            
            if os.name == 'nt':  # Windows
                print("7. No additional permissions needed on Windows")
            else:  # Linux/Mac
                print("7. Set permissions: chmod 600 ~/.kaggle/kaggle.json")
                
            return False
        else:
            print(f"âŒ Kaggle API error: {e}")
            return False

def download_sample_dataset():
    """Download a small sample dataset for testing"""
    try:
        import kaggle
        
        print("\nðŸ“¥ Downloading sample dataset for testing...")
        
        # Use a small, reliable dataset for testing
        test_dataset = "abhinand05/crop-production-in-india"
        
        # Create data directory
        data_dir = Path("data/kaggle")
        data_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"   Dataset: {test_dataset}")
        print(f"   Location: {data_dir}")
        
        kaggle.api.dataset_download_files(
            test_dataset,
            path=str(data_dir),
            unzip=True
        )
        
        print("âœ… Sample dataset downloaded successfully!")
        
        # List downloaded files
        files = list(data_dir.glob('*'))
        print(f"ðŸ“ Downloaded files: {[f.name for f in files]}")
        
        return True
        
    except Exception as e:
        print(f"âŒ Download failed: {e}")
        return False

def create_sample_data():
    """Create sample data file if Kaggle download fails"""
    print("\nðŸ“ Creating sample agricultural data...")
    
    sample_data = {
        "dataset_info": {
            "source": "Sample Agricultural Data",
            "total_records": 100,
            "crops": ["Rice", "Wheat", "Cotton", "Maize"],
            "date_range": {"min_year": 2018, "max_year": 2023}
        },
        "historical_yields": [
            {"state": "Punjab", "crop": "Rice", "year": 2018, "yield": 6.55, "area": 3040, "production": 19918},
            {"state": "Punjab", "crop": "Rice", "year": 2019, "yield": 6.61, "area": 3100, "production": 20500},
            {"state": "Punjab", "crop": "Rice", "year": 2020, "yield": 6.67, "area": 3180, "production": 21200},
            {"state": "Haryana", "crop": "Wheat", "year": 2018, "yield": 4.94, "area": 2550, "production": 12600},
            {"state": "Haryana", "crop": "Wheat", "year": 2019, "yield": 5.00, "area": 2580, "production": 12900},
            {"state": "Haryana", "crop": "Wheat", "year": 2020, "yield": 5.08, "area": 2600, "production": 13200},
            {"state": "Maharashtra", "crop": "Cotton", "year": 2018, "yield": 2.00, "area": 4200, "production": 8400},
            {"state": "Maharashtra", "crop": "Cotton", "year": 2019, "yield": 2.05, "area": 4150, "production": 8500},
            {"state": "Karnataka", "crop": "Maize", "year": 2018, "yield": 3.00, "area": 1300, "production": 3900},
            {"state": "Karnataka", "crop": "Maize", "year": 2019, "yield": 3.11, "area": 1320, "production": 4100}
        ]
    }
    
    # Create data directory and file
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    
    import json
    with open(data_dir / "sample_crop_data.json", 'w') as f:
        json.dump(sample_data, f, indent=2)
    
    print("âœ… Sample data created in data/sample_crop_data.json")
    return True

def main():
    """Main setup function"""
    print("ðŸŒ¾ KisanMitra Kaggle Integration Setup")
    print("=" * 40)
    
    # Check if Kaggle is set up
    if check_kaggle_setup():
        print("\nðŸš€ Kaggle API is ready!")
        
        # Try to download sample data
        if download_sample_dataset():
            print("\nâœ… Setup complete! Real Kaggle data is available.")
        else:
            print("\nâš ï¸  Download failed, creating sample data...")
            create_sample_data()
    else:
        print("\nâš ï¸  Kaggle API not configured, using sample data...")
        create_sample_data()
    
    print("\n" + "=" * 40)
    print("ðŸŽ¯ Next Steps:")
    print("1. If using real data: Complete Kaggle API setup above")
    print("2. Run: python download_kaggle_data.py")
    print("3. Start your React app: npm start")
    print("4. Test yield prediction in dashboard")
    print("\nðŸ“š Documentation: YIELD_PREDICTION_KAGGLE_INTEGRATION.md")

if __name__ == "__main__":
    main()
