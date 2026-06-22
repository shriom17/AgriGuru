#!/usr/bin/env python3
"""
Kaggle Dataset Downloader for KisanMitra Yield Prediction
Downloads and processes agricultural datasets from Kaggle
"""

import os
import sys
import pandas as pd
import json
from pathlib import Path

# Add the script directory to path
script_dir = Path(__file__).parent
sys.path.append(str(script_dir))

class KaggleDatasetManager:
    def __init__(self, data_dir="data/kaggle"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
    def setup_kaggle_api(self):
        """Setup Kaggle API credentials"""
        try:
            import kaggle
            print("âœ… Kaggle API is configured and ready!")
            return True
        except OSError as e:
            if "credentials" in str(e):
                print("âŒ Kaggle API credentials not found!")
                print("\nðŸ”§ Setup Instructions:")
                print("1. Go to https://www.kaggle.com/account")
                print("2. Click 'Create New API Token'")
                print("3. Download kaggle.json file")
                print("4. Place it in one of these locations:")
                print(f"   - Windows: C:\\Users\\{os.getenv('USERNAME', 'YourUsername')}\\.kaggle\\kaggle.json")
                print("   - Linux/Mac: ~/.kaggle/kaggle.json")
                print("5. Make sure the file permissions are correct (chmod 600 kaggle.json)")
                return False
            else:
                print(f"âŒ Error setting up Kaggle API: {e}")
                return False
        except ImportError:
            print("âŒ Kaggle package not installed!")
            print("Run: pip install kaggle")
            return False
    
    def download_dataset(self, dataset_id, extract=True):
        """Download a dataset from Kaggle"""
        if not self.setup_kaggle_api():
            return False
            
        try:
            import kaggle
            print(f"ðŸ“¥ Downloading dataset: {dataset_id}")
            
            dataset_path = self.data_dir / dataset_id.replace('/', '_')
            dataset_path.mkdir(parents=True, exist_ok=True)
            
            kaggle.api.dataset_download_files(
                dataset_id, 
                path=str(dataset_path), 
                unzip=extract
            )
            
            print(f"âœ… Dataset downloaded to: {dataset_path}")
            return dataset_path
            
        except Exception as e:
            print(f"âŒ Error downloading dataset: {e}")
            return False
    
    def process_crop_production_dataset(self, dataset_path):
        """Process Indian crop production dataset"""
        try:
            # Common filenames for crop production datasets
            possible_files = [
                'crop_production.csv',
                'Crop_production.csv',
                'india_crop_production.csv',
                'agriculture_data.csv',
                'agricultural_production.csv'
            ]
            
            csv_file = None
            for filename in possible_files:
                file_path = dataset_path / filename
                if file_path.exists():
                    csv_file = file_path
                    break
            
            if not csv_file:
                # Look for any CSV file
                csv_files = list(dataset_path.glob('*.csv'))
                if csv_files:
                    csv_file = csv_files[0]
                    print(f"ðŸ“„ Using CSV file: {csv_file.name}")
                else:
                    print("âŒ No CSV files found in dataset")
                    return None
            
            # Read and process the dataset
            df = pd.read_csv(csv_file)
            print(f"ðŸ“Š Dataset loaded: {len(df)} rows, {len(df.columns)} columns")
            print(f"ðŸ“‹ Columns: {list(df.columns)}")
            
            # Display sample data
            print("\nðŸ“ˆ Sample data:")
            print(df.head())
            
            # Basic statistics
            if 'Production' in df.columns or 'production' in df.columns:
                prod_col = 'Production' if 'Production' in df.columns else 'production'
                print(f"\nðŸ“Š Production statistics:")
                print(df[prod_col].describe())
            
            # Save processed data for frontend
            processed_data = self.prepare_frontend_data(df)
            output_file = self.data_dir / 'processed_crop_data.json'
            
            with open(output_file, 'w') as f:
                json.dump(processed_data, f, indent=2)
            
            print(f"âœ… Processed data saved to: {output_file}")
            return processed_data
            
        except Exception as e:
            print(f"âŒ Error processing dataset: {e}")
            return None
    
    def prepare_frontend_data(self, df):
        """Prepare data for frontend consumption"""
        try:
            # Standardize column names
            df.columns = df.columns.str.lower().str.replace(' ', '_')
            
            # Create yield column if it doesn't exist
            if 'yield' not in df.columns and 'production' in df.columns and 'area' in df.columns:
                df['yield'] = df['production'] / df['area']
            
            # Group by crop and calculate statistics
            crop_stats = {}
            
            if 'crop' in df.columns:
                for crop in df['crop'].unique():
                    crop_data = df[df['crop'] == crop]
                    
                    if 'yield' in crop_data.columns:
                        crop_stats[crop] = {
                            'avg_yield': float(crop_data['yield'].mean()),
                            'min_yield': float(crop_data['yield'].min()),
                            'max_yield': float(crop_data['yield'].max()),
                            'records': len(crop_data)
                        }
                        
                        # Historical data for charts
                        if 'year' in crop_data.columns:
                            historical = crop_data.groupby('year')['yield'].mean().reset_index()
                            crop_stats[crop]['historical'] = [
                                {'year': int(row['year']), 'yield': float(row['yield'])} 
                                for _, row in historical.iterrows()
                            ]
            
            return {
                'dataset_info': {
                    'total_records': len(df),
                    'columns': list(df.columns),
                    'crops': list(df['crop'].unique()) if 'crop' in df.columns else [],
                    'date_range': {
                        'min_year': int(df['year'].min()) if 'year' in df.columns else None,
                        'max_year': int(df['year'].max()) if 'year' in df.columns else None
                    }
                },
                'crop_statistics': crop_stats,
                'sample_data': df.head(10).to_dict('records')
            }
            
        except Exception as e:
            print(f"âŒ Error preparing frontend data: {e}")
            return {'error': str(e)}

def main():
    """Main function to download and process datasets"""
    print("ðŸŒ¾ KisanMitra Kaggle Dataset Downloader")
    print("=" * 50)
    
    manager = KaggleDatasetManager()
    
    # Recommended datasets for yield prediction
    datasets = {
        '1': {
            'id': 'abhinand05/crop-production-in-india',
            'name': 'Crop Production in India',
            'description': 'Comprehensive crop production data across Indian states'
        },
        '2': {
            'id': 'varshitanalluri/agriculture-crop-production',
            'name': 'Agriculture Crop Production',
            'description': 'Agricultural data with weather and soil parameters'
        },
        '3': {
            'id': 'patelris/crop-yield-prediction-dataset',
            'name': 'Crop Yield Prediction Dataset',
            'description': 'ML-ready dataset with weather and yield data'
        },
        '4': {
            'id': 'akshatgupta7/crop-yield-indian-agriculture',
            'name': 'Indian Agriculture Crop Yield',
            'description': 'Indian agriculture yield data with multiple factors'
        }
    }
    
    print("\nðŸ“Š Available Datasets:")
    for key, info in datasets.items():
        print(f"{key}. {info['name']}")
        print(f"   {info['description']}")
        print(f"   Dataset ID: {info['id']}")
        print()
    
    # Auto-download the first dataset as recommended
    print("ðŸš€ Auto-downloading recommended dataset...")
    dataset_id = datasets['1']['id']
    
    dataset_path = manager.download_dataset(dataset_id)
    
    if dataset_path:
        print("\nðŸ”„ Processing dataset...")
        processed_data = manager.process_crop_production_dataset(dataset_path)
        
        if processed_data:
            print("\nâœ… Dataset ready for use in KisanMitra!")
            print(f"ðŸ“ Data location: {manager.data_dir}")
            print("\nðŸ“‹ Next steps:")
            print("1. The processed data is now available in JSON format")
            print("2. Update your React service to use this real data")
            print("3. Test the yield prediction component")
        else:
            print("âŒ Failed to process dataset")
    else:
        print("âŒ Failed to download dataset")
        print("\nðŸ’¡ Manual Download Instructions:")
        print(f"1. Go to: https://www.kaggle.com/datasets/{dataset_id}")
        print("2. Click 'Download' button")
        print("3. Extract the ZIP file to: data/kaggle/")
        print("4. Run this script again")

if __name__ == "__main__":
    main()
