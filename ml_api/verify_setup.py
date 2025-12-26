# verify_setup.py
# Verify all files are in place and complete

import os
import sys

def check_file_exists(filepath, description):
    """Check if a file exists"""
    exists = os.path.exists(filepath)
    status = "✅" if exists else "❌"
    print(f"{status} {description}: {filepath}")
    return exists

def check_imports():
    """Check if required packages are installed"""
    print("\n" + "=" * 70)
    print("CHECKING PYTHON PACKAGES")
    print("=" * 70)
    
    required_packages = {
        'fastapi': 'FastAPI',
        'uvicorn': 'Uvicorn',
        'pandas': 'Pandas',
        'numpy': 'NumPy',
        'sklearn': 'Scikit-learn',
        'pydantic': 'Pydantic',
        'requests': 'Requests'
    }
    
    missing = []
    
    for package, name in required_packages.items():
        try:
            __import__(package)
            print(f"✅ {name} installed")
        except ImportError:
            print(f"❌ {name} NOT installed")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print(f"Install with: pip install {' '.join(missing)}")
        return False
    
    return True

def verify_model_structure():
    """Verify model file structure"""
    print("\n" + "=" * 70)
    print("VERIFYING MODEL FILE STRUCTURE")
    print("=" * 70)
    
    try:
        import pickle
        
        with open('home_renovation_model_package.pkl', 'rb') as f:
            model_package = pickle.load(f)
        
        required_keys = [
            'best_model_type',
            'models',
            'scaler',
            'label_encoders',
            'dataset'
        ]
        
        all_good = True
        for key in required_keys:
            if key in model_package:
                print(f"✅ {key} found")
            else:
                print(f"❌ {key} MISSING")
                all_good = False
        
        # Check NMF+KMeans model
        if 'models' in model_package:
            if 'nmf_kmeans' in model_package['models']:
                print(f"✅ NMF+KMeans model found")
            else:
                print(f"❌ NMF+KMeans model MISSING")
                print(f"   Available models: {list(model_package['models'].keys())}")
                all_good = False
        
        # Check label encoders
        if 'label_encoders' in model_package:
            required_encoders = [
                'user_preferred_style',
                'user_preferred_room_type',
                'user_indoor_outdoor',
                'user_climate_type'
            ]
            
            print("\nLabel Encoders:")
            for encoder in required_encoders:
                if encoder in model_package['label_encoders']:
                    classes = list(model_package['label_encoders'][encoder].classes_)
                    print(f"  ✅ {encoder}: {classes}")
                else:
                    print(f"  ❌ {encoder}: MISSING")
                    all_good = False
        
        return all_good
        
    except FileNotFoundError:
        print("❌ Model file not found!")
        return False
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return False

def create_missing_files():
    """Create any missing configuration files"""
    print("\n" + "=" * 70)
    print("CHECKING CONFIGURATION FILES")
    print("=" * 70)
    
    # Check requirements.txt
    if not os.path.exists('requirements.txt'):
        print("Creating requirements.txt...")
        with open('requirements.txt', 'w') as f:
            f.write("""fastapi==0.115.5
uvicorn[standard]==0.32.1
pandas==2.2.3
numpy==2.2.1
pydantic==2.10.3
scikit-learn==1.6.1
requests==2.32.3
""")
        print("✅ requirements.txt created")
    else:
        print("✅ requirements.txt exists")
    
    # Check .env file
    if not os.path.exists('.env'):
        print("\nCreating .env file...")
        with open('.env', 'w') as f:
            f.write("""# ML API Configuration
ML_API_HOST=127.0.0.1
ML_API_PORT=8000
MODEL_PATH=home_renovation_model_package.pkl
""")
        print("✅ .env created")
    else:
        print("✅ .env exists")

def run_quick_test():
    """Run a quick test of the model"""
    print("\n" + "=" * 70)
    print("RUNNING QUICK MODEL TEST")
    print("=" * 70)
    
    try:
        import pickle
        import numpy as np
        
        with open('home_renovation_model_package.pkl', 'rb') as f:
            model_package = pickle.load(f)
        
        # Get sample data
        df = model_package['dataset']
        print(f"\n✅ Dataset loaded: {len(df)} rows")
        
        # Test label encoders
        label_encoders = model_package['label_encoders']
        
        print("\nTesting label encoders:")
        test_values = {
            'user_preferred_style': 'Modern',
            'user_preferred_room_type': 'Kitchen',
            'user_indoor_outdoor': 'Indoor',
            'user_climate_type': 'Dry'
        }
        
        for key, value in test_values.items():
            if key in label_encoders:
                try:
                    # Try encoding
                    encoded = label_encoders[key].transform([value])[0]
                    print(f"  ✅ {key}: '{value}' → {encoded}")
                except ValueError:
                    # Try first available class
                    first_class = label_encoders[key].classes_[0]
                    encoded = label_encoders[key].transform([first_class])[0]
                    print(f"  ⚠️  {key}: '{value}' not found, using '{first_class}' → {encoded}")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        return False

def main():
    print("\n" + "=" * 70)
    print(" ML API SETUP VERIFICATION ")
    print("=" * 70)
    
    print("\nCurrent directory:", os.getcwd())
    
    # Check files
    print("\n" + "=" * 70)
    print("CHECKING FILES")
    print("=" * 70)
    
    files_ok = True
    files_ok &= check_file_exists('main.py', 'ML API Server')
    files_ok &= check_file_exists('home_renovation_model_package.pkl', 'Trained Model')
    files_ok &= check_file_exists('fix_and_test_encoding.py', 'Encoding Test Script')
    
    if not files_ok:
        print("\n❌ Some required files are missing!")
        print("Make sure you're in the ml_api directory and have all files")
        return
    
    # Check packages
    packages_ok = check_imports()
    
    if not packages_ok:
        print("\n❌ Install missing packages first:")
        print("   pip install -r requirements.txt")
        return
    
    # Verify model
    model_ok = verify_model_structure()
    
    if not model_ok:
        print("\n❌ Model file has issues. Please check the model file.")
        return
    
    # Create missing config files
    create_missing_files()
    
    # Run quick test
    test_ok = run_quick_test()
    
    # Summary
    print("\n" + "=" * 70)
    print("VERIFICATION SUMMARY")
    print("=" * 70)
    
    checks = {
        "Files Present": files_ok,
        "Packages Installed": packages_ok,
        "Model Valid": model_ok,
        "Quick Test": test_ok
    }
    
    all_passed = all(checks.values())
    
    for check_name, passed in checks.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{check_name:20} {status}")
    
    if all_passed:
        print("\n🎉 ALL CHECKS PASSED!")
        print("\nYou're ready to:")
        print("1. Start the ML API server: python main.py")
        print("2. Test encoding: python fix_and_test_encoding.py")
        print("3. Start your Next.js app and test the full flow")
    else:
        print("\n⚠️  Some checks failed. Please fix the issues above.")
    
    print("=" * 70)

if __name__ == "__main__":
    main()