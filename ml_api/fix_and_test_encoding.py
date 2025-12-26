# fix_and_test_encoding.py
# for test and fix encoding issues

import pickle
import requests
import json

def check_model_categories():
    """Check what categories the model expects"""
    print("=" * 70)
    print("STEP 1: CHECKING MODEL EXPECTED CATEGORIES")
    print("=" * 70)
    
    with open('home_renovation_model_package.pkl', 'rb') as f:
        model_package = pickle.load(f)
    
    label_encoders = model_package['label_encoders']
    
    categories = {}
    
    for encoder_name in ['user_preferred_style', 'user_preferred_room_type', 
                          'user_indoor_outdoor', 'user_climate_type']:
        if encoder_name in label_encoders:
            encoder = label_encoders[encoder_name]
            categories[encoder_name] = list(encoder.classes_)
            print(f"\n✅ {encoder_name}:")
            print(f"   Expected values: {categories[encoder_name]}")
    
    return categories

def test_api_with_correct_format(categories):
    """Test the API with correctly formatted data"""
    print("\n" + "=" * 70)
    print("STEP 2: TESTING API WITH CORRECT FORMAT")
    print("=" * 70)
    
    # test request with first available category from each
    test_request = {
        "user_preferences": {
            "budget_min": 5000,
            "budget_max": 15000,
            "style_preference": categories.get('user_preferred_style', ['Modern'])[0],
            "room_type": categories.get('user_preferred_room_type', ['Kitchen'])[0],
            "indoor_outdoor": categories.get('user_indoor_outdoor', ['Indoor'])[0],
            "location": "New York",
            "climate_type": categories.get('user_climate_type', ['Dry'])[0]
        },
        "request_settings": {
            "max_results": 3
        }
    }
    
    print(f"\n📤 Sending test request:")
    print(json.dumps(test_request, indent=2))
    
    try:
        response = requests.post(
            'http://127.0.0.1:8000/api/recommendations',
            json=test_request,
            timeout=30
        )
        
        print(f"\n📥 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS! Got {len(data.get('recommendations', []))} recommendations")
            
            if data.get('recommendations'):
                print("\nFirst recommendation:")
                rec = data['recommendations'][0]
                print(f"  - Name: {rec.get('item_name')}")
                print(f"  - Price: ${rec.get('estimated_price')}")
                print(f"  - Confidence: {rec.get('confidence')}")
                return True
            else:
                print("⚠️  No recommendations returned")
                return False
        else:
            print(f"❌ Error: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure server is running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_various_formats(categories):
    """Test API with various input formats to see what works"""
    print("\n" + "=" * 70)
    print("STEP 3: TESTING VARIOUS INPUT FORMATS")
    print("=" * 70)
    
    # Test cases with different formats
    test_cases = [
        {
            "name": "Lowercase",
            "style": "modern" if 'Modern' in categories.get('user_preferred_style', []) else categories.get('user_preferred_style', ['Modern'])[0].lower(),
            "room": "kitchen" if 'Kitchen' in categories.get('user_preferred_room_type', []) else categories.get('user_preferred_room_type', ['Kitchen'])[0].lower(),
            "indoor": "indoor" if 'Indoor' in categories.get('user_indoor_outdoor', []) else categories.get('user_indoor_outdoor', ['Indoor'])[0].lower(),
            "climate": "dry" if 'Dry' in categories.get('user_climate_type', []) else categories.get('user_climate_type', ['Dry'])[0].lower()
        },
        {
            "name": "Title Case",
            "style": "Modern",
            "room": "Kitchen",
            "indoor": "Indoor",
            "climate": "Dry"
        },
        {
            "name": "UPPERCASE",
            "style": "MODERN",
            "room": "KITCHEN",
            "indoor": "INDOOR",
            "climate": "DRY"
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\n🧪 Testing {test_case['name']} format...")
        
        request_data = {
            "user_preferences": {
                "budget_min": 5000,
                "budget_max": 15000,
                "style_preference": test_case['style'],
                "room_type": test_case['room'],
                "indoor_outdoor": test_case['indoor'],
                "location": "New York",
                "climate_type": test_case['climate']
            },
            "request_settings": {
                "max_results": 3
            }
        }
        
        try:
            response = requests.post(
                'http://127.0.0.1:8000/api/recommendations',
                json=request_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                num_recs = len(data.get('recommendations', []))
                print(f"   ✅ Works! Got {num_recs} recommendations")
                results.append((test_case['name'], True, num_recs))
            else:
                print(f"   ❌ Failed with status {response.status_code}")
                results.append((test_case['name'], False, 0))
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            results.append((test_case['name'], False, 0))
    
    return results

def generate_wizard_mapping(categories):
    """Generate mapping guide for your wizard"""
    print("\n" + "=" * 70)
    print("STEP 4: WIZARD DATA MAPPING GUIDE")
    print("=" * 70)
    
    print("\n📋 Use these exact values in your wizard:")
    print("\nconst wizardData = {")
    print(f"  style: \"{categories.get('user_preferred_style', ['Modern'])[0]}\",  // Use exactly this format")
    print(f"  roomType: \"{categories.get('user_preferred_room_type', ['Kitchen'])[0]}\",  // Use exactly this format")
    print(f"  indoorOutdoor: \"{categories.get('user_indoor_outdoor', ['Indoor'])[0]}\",  // Use exactly this format")
    print(f"  climateType: \"{categories.get('user_climate_type', ['Dry'])[0]}\",  // Use exactly this format")
    print("  budget: \"5000-15000\",")
    print("  location: \"New York\"")
    print("}")
    
    print("\n📝 Available options for each field:")
    print(f"\nStyles: {categories.get('user_preferred_style', [])}")
    print(f"Room Types: {categories.get('user_preferred_room_type', [])}")
    print(f"Indoor/Outdoor: {categories.get('user_indoor_outdoor', [])}")
    print(f"Climate Types: {categories.get('user_climate_type', [])}")

def main():
    print("\n" + "=" * 70)
    print(" HOME RENOVATION ML MODEL - ENCODING FIX & TEST ")
    print("=" * 70)
    
    # Step 1: Check what model expects
    categories = check_model_categories()
    
    # Step 2: Test API with correct format
    api_works = test_api_with_correct_format(categories)
    
    if not api_works:
        print("\n⚠️  API test failed. Make sure:")
        print("   1. ML API server is running (python main.py)")
        print("   2. Server is on http://127.0.0.1:8000")
        print("   3. Model file is loaded correctly")
        return
    
    # Step 3: Test various formats
    format_results = test_various_formats(categories)
    
    print("\n" + "=" * 70)
    print("FORMAT TEST RESULTS")
    print("=" * 70)
    for name, works, num_recs in format_results:
        status = "✅ WORKS" if works else "❌ FAILS"
        print(f"{name:15} {status:10} ({num_recs} recommendations)")
    
    # Step 4: Generate mapping guide
    generate_wizard_mapping(categories)
    
    print("\n" + "=" * 70)
    print("NEXT STEPS")
    print("=" * 70)
    print("1. Update your wizard to use the exact format shown above")
    print("2. The updated ML API server will auto-normalize different formats")
    print("3. Restart your ML server: python main.py")
    print("4. Test your Next.js app with the wizard")
    print("=" * 70)

if __name__ == "__main__":
    main()