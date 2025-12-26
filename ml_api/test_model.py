# train_model.py


import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.decomposition import NMF
from sklearn.cluster import KMeans
import pickle
from datetime import datetime

class HomeRenovationModelTrainer:
    """Train recommendation model on your real dataset"""
    
    def __init__(self, csv_path='dataset_v6.csv'):
        self.csv_path = csv_path
        self.df = None
        self.df_encoded = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.models = {}
        
    def load_and_prepare_data(self):
        """Load CSV and prepare for training"""
        print("📂 Loading dataset...")
        self.df = pd.read_csv(self.csv_path)
        
        print(f"✅ Loaded {len(self.df)} records")
        print(f"📊 Columns: {list(self.df.columns)}")
        print(f"\n🔍 Data Preview:")
        print(self.df.head())
        
        # Check for missing values
        missing = self.df.isnull().sum()
        if missing.any():
            print(f"\n⚠️  Missing values found:\n{missing[missing > 0]}")
            self.df = self.df.fillna({
                'item_name': 'Unknown Item',
                'item_cost': self.df['item_cost'].median(),
                'material_sustainability_score': 5
            })
        
        return self.df
    
    def encode_categorical_features(self):
        """Encode categorical columns to numeric"""
        print("\n🔧 Encoding categorical features...")
        
        # Create a copy for encoding
        self.df_encoded = self.df.copy()
        
        # Add raw_id if not exists
        if 'raw_id' not in self.df_encoded.columns:
            self.df_encoded['raw_id'] = range(len(self.df_encoded))
        
        # Define categorical columns to encode
        categorical_columns = {
            'item_style': 'item_style',
            'item_room_type': 'item_room_type', 
            'item_indoor_outdoor': 'item_indoor_outdoor',
            'climate_suitability': 'climate_suitability',
            'user_preferred_style': 'user_preferred_style',
            'user_preferred_room_type': 'user_preferred_room_type',
            'user_indoor_outdoor': 'user_indoor_outdoor',
            'user_climate_type': 'user_climate_type'
        }
        
        # Encode each categorical column
        for col_name, col_key in categorical_columns.items():
            if col_name in self.df_encoded.columns:
                le = LabelEncoder()
                
                # Clean and normalize values
                self.df_encoded[col_name] = self.df_encoded[col_name].astype(str).str.strip()
                
                # Fit and transform
                self.df_encoded[f'{col_key}_encoded'] = le.fit_transform(self.df_encoded[col_name])
                self.label_encoders[col_key] = le
                
                print(f"✅ Encoded {col_name}: {len(le.classes_)} unique values")
                print(f"   Classes: {list(le.classes_)[:5]}...")
        
        print(f"\n✅ Encoding complete. Shape: {self.df_encoded.shape}")
        return self.df_encoded
    
    def create_interaction_matrix(self):
        """Create user-item interaction matrix"""
        print("\n📊 Creating interaction matrix...")
        
        # Group by user preferences and aggregate items
        user_groups = self.df_encoded.groupby([
            'user_preferred_style_encoded',
            'user_preferred_room_type_encoded',
            'user_indoor_outdoor_encoded',
            'user_climate_type_encoded'
        ])
        
        # Create interaction matrix (users x items)
        n_users = len(user_groups)
        n_items = len(self.df_encoded)
        
        # Initialize matrix
        interaction_matrix = pd.DataFrame(
            0, 
            index=range(n_users),
            columns=self.df_encoded['raw_id'].values
        )
        
        # Fill interaction matrix with compatibility scores
        for user_idx, (group_key, group_df) in enumerate(user_groups):
            for _, item in group_df.iterrows():
                item_id = item['raw_id']
                
                # Calculate compatibility score (0-1)
                score = 0.0
                
                # Style match (30%)
                if item['item_style_encoded'] == group_key[0]:
                    score += 0.30
                
                # Room type match (30%)
                if item['item_room_type_encoded'] == group_key[1]:
                    score += 0.30
                
                # Indoor/outdoor match (20%)
                if item['item_indoor_outdoor_encoded'] == group_key[2]:
                    score += 0.20
                
                # Climate match (20%)
                if item['climate_suitability_encoded'] == group_key[3]:
                    score += 0.20
                
                interaction_matrix.loc[user_idx, item_id] = score
        
        print(f"✅ Interaction matrix shape: {interaction_matrix.shape}")
        return interaction_matrix
    
    def train_nmf_kmeans(self, interaction_matrix, n_components=10, n_clusters=5):
        """Train NMF + KMeans model"""
        print("\n🤖 Training NMF + KMeans model...")
        
        # Apply NMF to find latent features
        nmf_model = NMF(n_components=n_components, random_state=42, max_iter=500)
        user_features = nmf_model.fit_transform(interaction_matrix)
        item_features = nmf_model.components_
        
        print(f"✅ NMF complete. User features: {user_features.shape}")
        print(f"   Item features: {item_features.shape}")
        
        # Cluster users based on NMF features
        kmeans_model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        user_clusters = kmeans_model.fit_predict(user_features)
        
        print(f"✅ KMeans clustering complete. {n_clusters} clusters created")
        print(f"   Cluster distribution: {np.bincount(user_clusters)}")
        
        return {
            'nmf_model': nmf_model,
            'kmeans_model': kmeans_model,
            'user_features': user_features,
            'item_features': item_features,
            'user_clusters': user_clusters,
            'interaction_matrix': interaction_matrix
        }
    
    def save_model_package(self, output_path='home_renovation_model_package.pkl'):
        """Save complete model package"""
        print(f"\n💾 Saving model package to {output_path}...")
        
        model_package = {
            'best_model_type': 'nmf_kmeans',
            'models': {
                'nmf_kmeans': self.models['nmf_kmeans']
            },
            'dataset': self.df_encoded,
            'label_encoders': self.label_encoders,
            'scaler': self.scaler,
            'feature_columns': [
                'item_cost', 'item_style_encoded', 'item_room_type_encoded',
                'item_indoor_outdoor_encoded', 'climate_suitability_encoded',
                'material_sustainability_score'
            ],
            'metadata': {
                'trained_on': datetime.now().isoformat(),
                'dataset_size': len(self.df_encoded),
                'model_version': '1.0.0'
            }
        }
        
        with open(output_path, 'wb') as f:
            pickle.dump(model_package, f)
        
        print(f"✅ Model package saved successfully!")
        print(f"   File size: {os.path.getsize(output_path) / (1024*1024):.2f} MB")
        
        return output_path
    
    def train_complete_pipeline(self):
        """Execute complete training pipeline"""
        print("=" * 60)
        print("🚀 Starting HomeSpark ML Model Training")
        print("=" * 60)
        
        # Step 1: Load data
        self.load_and_prepare_data()
        
        # Step 2: Encode features
        self.encode_categorical_features()
        
        # Step 3: Create interaction matrix
        interaction_matrix = self.create_interaction_matrix()
        
        # Step 4: Train NMF+KMeans
        self.models['nmf_kmeans'] = self.train_nmf_kmeans(interaction_matrix)
        
        # Step 5: Save model
        model_path = self.save_model_package()
        
        print("\n" + "=" * 60)
        print("✅ Training Complete!")
        print("=" * 60)
        print(f"📦 Model saved to: {model_path}")
        print(f"📊 Dataset size: {len(self.df_encoded)} records")
        print(f"🎯 Ready for predictions!")
        
        return model_path


def main():
    """Main training function"""
    import os
    
    # Check if dataset exists
    if not os.path.exists('dataset_v6.csv'):
        print("❌ Error: dataset_v6.csv not found!")
        print("   Please place your CSV file in the same directory as this script.")
        return
    
    # Initialize trainer
    trainer = HomeRenovationModelTrainer('dataset_v6.csv')
    
    # Train model
    try:
        model_path = trainer.train_complete_pipeline()
        print(f"\n✅ Success! Model ready at: {model_path}")
        print("\n📝 Next steps:")
        print("   1. Start the FastAPI server: python main.py")
        print("   2. Test the API: curl http://localhost:8000/api/health")
        print("   3. Connect your React app to the API")
        
    except Exception as e:
        print(f"\n❌ Error during training: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()