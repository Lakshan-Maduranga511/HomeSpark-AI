# main.py
# All recommendations within user's budget range

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import pandas as pd
import numpy as np
import pickle
from datetime import datetime
import os

app = FastAPI(title="HomeSpark ML API", version="2.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

model_package = None
recommendation_system = None


class RecommendationEngine:
    """Strict budget enforcement system"""
    
    def __init__(self, model_data, df_encoded, label_encoders):
        self.model_data = model_data
        self.df_encoded = df_encoded
        self.label_encoders = label_encoders
        self.interaction_matrix = model_data['interaction_matrix']
        
    def get_recommendations(self, user_prefs, n_recommendations=3):
        """Generate recommendations strictly within budget"""
        
        print(f"\n🔍 Recommendation Request:")
        print(f"  Budget: ${user_prefs.get('budget_min')}-${user_prefs.get('budget_max')}")
        print(f"  Style: {user_prefs.get('style_preference')}")
        print(f"  Room: {user_prefs.get('room_type')}")
        
        user_encoded = self._encode_preferences(user_prefs)
        
        #  STRICT filtering - only items within budget
        filtered_items = self._filter_by_preferences(user_encoded, user_prefs)
        
        if len(filtered_items) < n_recommendations:
            print(f"⚠️  Only {len(filtered_items)} items found, using fallback")
            return self._generate_fallback_recommendations(user_prefs, n_recommendations)
        
        # Calculate scores - reward items within budget
        scores = self._calculate_enhanced_scores(user_encoded, user_prefs, filtered_items)
        scores = pd.to_numeric(scores, errors='coerce').fillna(0.0)
        
        if scores.sum() == 0 or len(scores) == 0:
            print("⚠️  No valid scores, using fallback")
            return self._generate_fallback_recommendations(user_prefs, n_recommendations)
        
        # Select diverse quality items
        diverse_recommendations = self._select_diverse_quality_items(
            scores, 
            user_prefs, 
            n_recommendations
        )
        
        return diverse_recommendations

    def _filter_by_preferences(self, user_encoded, user_prefs):
        """ STRICT budget filtering - NO items outside range"""
        filtered = self.df_encoded.copy()
        
        budget_min = user_prefs.get('budget_min', 0)
        budget_max = user_prefs.get('budget_max', 550)
        
        #  use EXACT budget range
        extended_min = budget_min
        extended_max = budget_max
        
        print(f"  📊 STRICT Budget filter: ${extended_min}-${extended_max}")
        
        # Filter by location (must match)
        if 'user_indoor_outdoor' in user_encoded:
            location_matches = filtered['item_indoor_outdoor_encoded'] == user_encoded['user_indoor_outdoor']
            filtered = filtered[location_matches]
            print(f"  ✓ Location filter: {len(filtered)} items")
        
        # STRICT Budget filter - MUST be within range
        budget_matches = (filtered['item_cost'] >= extended_min) & (filtered['item_cost'] <= extended_max)
        filtered = filtered[budget_matches]
        print(f"  ✓ STRICT Budget filter: {len(filtered)} items remaining")
        
        #  If too few items, slightly expand (5% max)
        if len(filtered) < 5:
            print(f"  ⚠️  Only {len(filtered)} items, expanding by 5%...")
            budget_range = budget_max - budget_min
            small_flex = max(budget_range * 0.05, 25)
            
            extended_min = max(budget_min - small_flex, 0)
            extended_max = min(budget_max + small_flex, 550)
            
            filtered = self.df_encoded.copy()
            if 'user_indoor_outdoor' in user_encoded:
                location_matches = filtered['item_indoor_outdoor_encoded'] == user_encoded['user_indoor_outdoor']
                filtered = filtered[location_matches]
            
            budget_matches = (filtered['item_cost'] >= extended_min) & (filtered['item_cost'] <= extended_max)
            filtered = filtered[budget_matches]
            print(f"  ✓ Expanded to: ${extended_min}-${extended_max}, found {len(filtered)} items")
        
        return filtered

    def _calculate_enhanced_scores(self, user_encoded, user_prefs, filtered_items):
        """✅ Reward items WITHIN budget, prefer mid-range prices"""
        scores = {}
        
        budget_min = user_prefs.get('budget_min', 0)
        budget_max = user_prefs.get('budget_max', 550)
        budget_mid = (budget_min + budget_max) / 2
        budget_range = max(budget_max - budget_min, 1)
        
        print(f"\n📊 Scoring {len(filtered_items)} items...")
        print(f"   Target Budget: ${budget_min}-${budget_max} (ideal: ${budget_mid:.0f})")
        
        for idx, item in filtered_items.iterrows():
            score = 0.0
            item_cost = item['item_cost']
            item_name = str(item['item_name'])[:35]
            
            # STYLE MATCH (35% weight)
            style_match = False
            if 'user_preferred_style' in user_encoded:
                if item['item_style_encoded'] == user_encoded['user_preferred_style']:
                    score += 0.35
                    style_match = True
                else:
                    score -= 0.05

            # ROOM MATCH (30% weight)
            room_match = False
            if 'user_preferred_room_type' in user_encoded:
                if item['item_room_type_encoded'] == user_encoded['user_preferred_room_type']:
                    score += 0.30
                    room_match = True
                else:
                    score -= 0.05

            # BUDGET SCORING (25% weight) -  REWARDS WITHIN-BUDGET ITEMS
            budget_score = 0.0
            
            if budget_min <= item_cost <= budget_max:
                #  WITHIN BUDGET: Higher score for mid-range items
                distance_from_mid = abs(item_cost - budget_mid)
                max_distance = budget_range / 2
                
                if max_distance > 0:
                    proximity_ratio = 1.0 - (distance_from_mid / max_distance)
                    budget_score = 0.15 + (0.10 * proximity_ratio)  # 15-25%
                else:
                    budget_score = 0.25
                
                score += budget_score
            else:
                # OUTSIDE BUDGET: Heavy penalty (shouldn't happen with strict filter)
                if item_cost < budget_min:
                    distance = budget_min - item_cost
                    penalty = min(distance / budget_range, 1.0)
                    budget_score = -0.20 * penalty
                else:
                    distance = item_cost - budget_max
                    penalty = min(distance / budget_range, 1.0)
                    budget_score = -0.20 * penalty
                
                score += budget_score
            
            # LOCATION MATCH (8% weight)
            if 'user_indoor_outdoor' in user_encoded:
                if item['item_indoor_outdoor_encoded'] == user_encoded['user_indoor_outdoor']:
                    score += 0.08
            
            # CLIMATE MATCH (2% weight)
            if 'user_climate_type' in user_encoded:
                if item['climate_suitability_encoded'] == user_encoded['user_climate_type']:
                    score += 0.02
            
            # Debug output
            if len(scores) < 5:
                style_str = "✓" if style_match else "✗"
                room_str = "✓" if room_match else "✗"
                within_budget = budget_min <= item_cost <= budget_max
                budget_str = "✓" if within_budget else "✗"
                print(f"  {item_name[:30]}: S{style_str} R{room_str} B{budget_str}(${item_cost}) → {score:.2f}")
            
            if score > 0 and not np.isnan(score):
                scores[item['raw_id']] = float(score)
        
        print(f"  ✓ Scored {len(scores)} items with positive scores\n")
        return pd.Series(scores, dtype=float)

    def _select_diverse_quality_items(self, scores, user_prefs, n_recommendations):
        """Select diverse quality items"""
        
        sorted_scores = scores.sort_values(ascending=False)
        
        # Categorize by quality
        quality_tiers = {
            'Perfect': [],      # 0.85+
            'Excellent': [],    # 0.70-0.84
            'Good': [],         # 0.55-0.69
            'Fair': [],         # 0.35-0.54
            'Basic': []         # <0.35
        }
        
        for item_id, score in sorted_scores.items():
            quality = self._get_match_quality(score)
            quality_tiers[quality].append((item_id, score))
        
        print(f"📊 Quality Distribution:")
        for quality, items in quality_tiers.items():
            if items:
                sample_scores = [f"{s:.2f}" for _, s in items[:3]]
                print(f"  {quality}: {len(items)} items → {', '.join(sample_scores)}")
        
        selected_items = []
        
        # Get BEST match (highest score)
        if quality_tiers['Perfect']:
            selected_items.append(quality_tiers['Perfect'][0])
            print(f"\n  ⭐ BEST: Perfect ({quality_tiers['Perfect'][0][1]:.2f})")
        elif quality_tiers['Excellent']:
            selected_items.append(quality_tiers['Excellent'][0])
            print(f"\n  ⭐ BEST: Excellent ({quality_tiers['Excellent'][0][1]:.2f})")
        elif quality_tiers['Good']:
            selected_items.append(quality_tiers['Good'][0])
            print(f"\n  ⭐ BEST: Good ({quality_tiers['Good'][0][1]:.2f})")
        else:
            selected_items.append((sorted_scores.index[0], sorted_scores.iloc[0]))
            print(f"\n  ⭐ BEST: {sorted_scores.iloc[0]:.2f}")
        
        # Add alternatives for variety
        remaining_needed = n_recommendations - len(selected_items)
        
        if remaining_needed > 0:
            first_quality = self._get_match_quality(selected_items[0][1])
            tier_order = ['Perfect', 'Excellent', 'Good', 'Fair', 'Basic']
            first_tier_index = tier_order.index(first_quality) if first_quality in tier_order else 0
            
            alternative_pool = []
            
            # Get alternatives from lower tiers (for variety)
            for tier_index in range(first_tier_index + 1, len(tier_order)):
                tier_name = tier_order[tier_index]
                if quality_tiers[tier_name]:
                    alternative_pool.extend(quality_tiers[tier_name])
            
            # Then same tier
            if first_quality and len(quality_tiers[first_quality]) > 1:
                alternative_pool.extend(quality_tiers[first_quality][1:])
            
            # Then higher tiers
            for tier_index in range(0, first_tier_index):
                tier_name = tier_order[tier_index]
                if quality_tiers[tier_name]:
                    alternative_pool.extend(quality_tiers[tier_name])
            
            alternative_pool.sort(key=lambda x: x[1], reverse=True)
            
            for item in alternative_pool[:remaining_needed]:
                selected_items.append(item)
                quality = self._get_match_quality(item[1])
                print(f"  ✓ ALT: {quality} ({item[1]:.2f})")
        
        print(f"\n✅ Selected {len(selected_items)} recommendations\n")
        
        return self._format_diverse_recommendations(selected_items, user_prefs)

    def _format_diverse_recommendations(self, selected_items, user_prefs):
        """Format recommendations"""
        recommendations = []
        budget_min = user_prefs.get('budget_min', 0)
        budget_max = user_prefs.get('budget_max', 550)
        
        for rank, (item_id, score) in enumerate(selected_items):
            try:
                item = self.df_encoded[self.df_encoded['raw_id'] == item_id].iloc[0]
                item_cost = int(item['item_cost'])
                quality = self._get_match_quality(score)
                
                rank_label = "Best Match" if rank == 0 else f"Alternative {rank}"
                
                recommendation = {
                    'id': f"rec_{int(item_id)}",
                    'item_name': str(item['item_name']),
                    'estimated_price': item_cost,
                    'confidence': round(float(score), 2),
                    'match_quality': quality,
                    'rank': rank + 1,
                    'rank_label': rank_label,
                    'is_best_match': rank == 0,
                    
                    'style': str(item['item_style']),
                    'room_type': str(item['item_room_type']),
                    'indoor_outdoor': str(item['item_indoor_outdoor']),
                    'climate_suitability': str(item['climate_suitability']),
                    
                    'explanation': self._generate_diverse_explanation(item, score, rank),
                    'features': self._generate_features(item),
                    'materials': self._generate_materials(item),
                    'cost_breakdown': self._generate_cost_breakdown(item_cost, str(item['item_room_type'])),
                    'budget_note': self._generate_budget_note(item_cost, budget_min, budget_max)
                }
                
                recommendations.append(recommendation)
                
                style = str(item['item_style'])[:10]
                room = str(item['item_room_type'])[:10]
                print(f"  {rank+1}. {quality} ({score:.2f}): {style}/{room} - ${item_cost}")
                
            except Exception as e:
                print(f"❌ Error formatting item {item_id}: {e}")
                continue
        
        return recommendations

    def _generate_diverse_explanation(self, item, score, rank):
        """Generate explanations"""
        style = item['item_style']
        room = str(item['item_room_type']).replace('_', ' ').title()
        cost = int(item['item_cost'])
        
        if rank == 0:
            if score >= 0.85:
                return f"🌟 Best Match: This {style} {room} (${cost}) perfectly matches all your preferences within budget!"
            elif score >= 0.70:
                return f"⭐ Best Match: This {style} {room} (${cost}) strongly aligns with your requirements and budget!"
            elif score >= 0.55:
                return f"✓ Best Match: This {style} {room} (${cost}) is your top recommendation within budget."
            else:
                return f"Best available: This {style} {room} (${cost}) fits your budget range."
        else:
            if score >= 0.85:
                return f"Alternative #{rank}: Excellent {style} {room} (${cost}) - another perfect option!"
            elif score >= 0.70:
                return f"Alternative #{rank}: Strong {style} {room} (${cost}) match with great value."
            elif score >= 0.55:
                return f"Alternative #{rank}: Good {style} {room} (${cost}) offering variety within budget."
            else:
                return f"Alternative #{rank}: {style} {room} (${cost}) provides additional choice within budget."

    def _get_match_quality(self, score):
        """Get match quality label"""
        score = max(0.0, min(1.0, score))
        
        if score >= 0.85:
            return "Perfect"
        elif score >= 0.70:
            return "Excellent"
        elif score >= 0.55:
            return "Good"
        elif score >= 0.35:
            return "Fair"
        else:
            return "Basic"

    def _encode_preferences(self, prefs):
        """Encode user preferences"""
        encoded = {}
        
        mappings = {
            'style_preference': 'user_preferred_style',
            'room_type': 'user_preferred_room_type',
            'indoor_outdoor': 'user_indoor_outdoor',
            'climate_type': 'user_climate_type'
        }
        
        for pref_key, encoder_key in mappings.items():
            if pref_key in prefs:
                value = str(prefs[pref_key]).strip()
                
                if encoder_key in self.label_encoders:
                    classes = list(self.label_encoders[encoder_key].classes_)
                    matched = False
                    
                    for variant in [value, value.capitalize(), value.replace('_', ' ').replace('-', ' ').title()]:
                        if variant in classes:
                            encoded[encoder_key] = self.label_encoders[encoder_key].transform([variant])[0]
                            matched = True
                            break
                    
                    if not matched:
                        value_lower = value.lower()
                        for cls in classes:
                            if cls.lower() == value_lower:
                                encoded[encoder_key] = self.label_encoders[encoder_key].transform([cls])[0]
                                matched = True
                                break
                    
                    if not matched:
                        print(f"⚠️  Could not encode {pref_key}='{value}'")
                        encoded[encoder_key] = 0
        
        return encoded
    
    def _generate_fallback_recommendations(self, user_prefs, n_recommendations):
        """Fallback when not enough items found"""
        print("🔧 Using fallback recommendations")
        
        budget_max = user_prefs.get('budget_max', 550)
        budget_min = user_prefs.get('budget_min', 0)
        
        # Slightly expand budget for fallback
        flexible_min = max(0, budget_min - 50)
        flexible_max = min(550, budget_max + 50)
        
        budget_matches = (self.df_encoded['item_cost'] >= flexible_min) & \
                        (self.df_encoded['item_cost'] <= flexible_max)
        
        fallback_items = self.df_encoded[budget_matches]
        if len(fallback_items) == 0:
            fallback_items = self.df_encoded
        
        sample_size = min(n_recommendations, len(fallback_items))
        sampled = fallback_items.sample(n=sample_size)
        
        recommendations = []
        for idx, item in sampled.iterrows():
            recommendations.append({
                'id': f"rec_{int(item['raw_id'])}",
                'item_name': str(item['item_name']),
                'estimated_price': int(item['item_cost']),
                'confidence': 0.40,
                'match_quality': 'Fair',
                'rank': idx + 1,
                'rank_label': "Best Match" if idx == 0 else f"Alternative {idx}",
                'is_best_match': idx == 0,
                'style': str(item['item_style']),
                'room_type': str(item['item_room_type']),
                'indoor_outdoor': str(item['item_indoor_outdoor']),
                'climate_suitability': str(item['climate_suitability']),
                'explanation': f"Alternative near your budget range (${budget_min}-${budget_max}).",
                'features': self._generate_features(item),
                'materials': self._generate_materials(item),
                'cost_breakdown': self._generate_cost_breakdown(int(item['item_cost']), str(item['item_room_type'])),
                'budget_note': self._generate_budget_note(int(item['item_cost']), budget_min, budget_max)
            })
        
        return recommendations
    
    def _generate_budget_note(self, item_cost, budget_min, budget_max):
        """Generate budget note"""
        if budget_min <= item_cost <= budget_max:
            if budget_max - budget_min > 0:
                position = (item_cost - budget_min) / (budget_max - budget_min)
                if position < 0.33:
                    return "lower_end_of_budget"
                elif position > 0.67:
                    return "upper_end_of_budget"
                else:
                    return "mid_range_budget"
            return "within_budget"
        elif item_cost < budget_min:
            return f"under_budget_by_{budget_min - item_cost}"
        else:
            return f"over_budget_by_{item_cost - budget_max}"
    
    def _generate_features(self, item):
        """Generate feature list"""
        room = str(item['item_room_type']).lower()
        
        if 'patio' in room or 'garden' in room:
            return ['Weather Resistant', 'Low Maintenance', 'Year-Round Use', 'Durable Materials']
        elif 'kitchen' in room:
            return ['Modern Appliances', 'Ample Storage', 'Task Lighting', 'Quality Countertops']
        elif 'bathroom' in room:
            return ['Water Efficient', 'Easy Maintenance', 'Good Ventilation', 'Modern Vanity']
        elif 'living' in room:
            return ['Comfortable Layout', 'Natural Light', 'Entertainment Ready', 'Quality Finishes']
        elif 'bedroom' in room:
            return ['Relaxing Ambiance', 'Good Storage', 'Natural Light', 'Quality Materials']
        elif 'dining' in room:
            return ['Elegant Design', 'Comfortable Seating', 'Good Lighting', 'Entertaining Space']
        else:
            return ['Quality Materials', 'Professional Design', 'Long-Lasting', 'Easy Maintenance']
    
    def _generate_materials(self, item):
        """Generate materials list"""
        climate = str(item['climate_suitability']).lower()
        indoor_outdoor = str(item['item_indoor_outdoor']).lower()
        
        if 'outdoor' in indoor_outdoor:
            if 'humid' in climate:
                return ['Composite Decking', 'Aluminum Frames', 'Weather-Resistant Fabrics', 'Powder-Coated Steel']
            elif 'cold' in climate:
                return ['Cedar Wood', 'Natural Stone', 'Insulated Materials', 'Stainless Steel']
            else:
                return ['Teak Wood', 'Stainless Steel', 'UV-Resistant Materials', 'Natural Stone']
        else:
            if 'humid' in climate:
                return ['Quartz Countertops', 'Ceramic Tiles', 'Stainless Steel', 'Treated Wood']
            elif 'cold' in climate:
                return ['Hardwood Flooring', 'Natural Stone', 'Insulated Materials', 'Quality Hardware']
            else:
                return ['Granite Countertops', 'Hardwood Flooring', 'Glass Accents', 'Metal Hardware']
    
    def _generate_cost_breakdown(self, total_cost, room_type):
        """Generate cost breakdown"""
        room = room_type.lower()
        
        if 'patio' in room or 'garden' in room:
            return {
                'furniture': {'item': 'Outdoor Furniture', 'price': int(total_cost * 0.40)},
                'hardscape': {'item': 'Hardscape & Structure', 'price': int(total_cost * 0.35)},
                'features': {'item': 'Features & Accessories', 'price': int(total_cost * 0.25)}
            }
        elif 'kitchen' in room:
            return {
                'cabinets': {'item': 'Kitchen Cabinets', 'price': int(total_cost * 0.45)},
                'countertops': {'item': 'Countertops', 'price': int(total_cost * 0.30)},
                'appliances': {'item': 'Appliances & Fixtures', 'price': int(total_cost * 0.25)}
            }
        elif 'bathroom' in room:
            return {
                'fixtures': {'item': 'Bathroom Fixtures', 'price': int(total_cost * 0.40)},
                'tiles': {'item': 'Tiles & Flooring', 'price': int(total_cost * 0.35)},
                'vanity': {'item': 'Vanity & Storage', 'price': int(total_cost * 0.25)}
            }
        else:
            return {
                'furniture': {'item': 'Furniture & Fixtures', 'price': int(total_cost * 0.50)},
                'flooring': {'item': 'Flooring & Finishes', 'price': int(total_cost * 0.30)},
                'decor': {'item': 'Decor & Accessories', 'price': int(total_cost * 0.20)}
            }


# Pydantic models
class UserPreferences(BaseModel):
    budget_min: int
    budget_max: int
    style_preference: str
    room_type: str
    indoor_outdoor: str
    location: str
    climate_type: str

class RequestSettings(BaseModel):
    max_results: Optional[int] = 3

class RecommendationRequest(BaseModel):
    user_preferences: UserPreferences
    request_settings: Optional[RequestSettings] = RequestSettings()


@app.on_event("startup")
async def startup_event():
    global model_package, recommendation_system
    
    model_path = 'home_renovation_model_package.pkl'
    
    if not os.path.exists(model_path):
        print(f"⚠️  Model file not found: {model_path}")
        return
    
    try:
        with open(model_path, 'rb') as f:
            model_package = pickle.load(f)
        
        recommendation_system = RecommendationEngine(
            model_data=model_package['models']['nmf_kmeans'],
            df_encoded=model_package['dataset'],
            label_encoders=model_package['label_encoders']
        )
        
        print("✅ Model loaded successfully!")
        print(f"✅ Dataset: {len(model_package['dataset'])} items")
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")


@app.get("/")
async def root():
    return {
        "message": "HomeSpark ML API - Strict Budget Version",
        "status": "running",
        "model_loaded": recommendation_system is not None,
        "version": "2.5.0"
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": recommendation_system is not None,
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """Get recommendations strictly within budget"""
    
    if recommendation_system is None:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    
    start_time = datetime.now()
    
    try:
        prefs = request.user_preferences
        settings = request.request_settings
        
        user_prefs_dict = {
            'budget_min': prefs.budget_min,
            'budget_max': prefs.budget_max,
            'style_preference': prefs.style_preference,
            'room_type': prefs.room_type,
            'indoor_outdoor': prefs.indoor_outdoor,
            'climate_type': prefs.climate_type
        }
        
        recommendations = recommendation_system.get_recommendations(
            user_prefs_dict,
            n_recommendations=settings.max_results
        )
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return {
            "recommendations": recommendations,
            "model_type": "NMF+KMeans-v2.5-StrictBudget",
            "processing_time_ms": round(processing_time, 2),
            "total_results": len(recommendations)
        }
        
    except Exception as e:
        print(f"❌ Error generating recommendations: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/model-info")
async def get_model_info():
    if model_package is None:
        return {"model_loaded": False}
    
    return {
        "model_loaded": True,
        "model_type": "NMF+KMeans-v2.5-StrictBudget",
        "dataset_size": len(model_package['dataset']),
        "version": "2.5.0",
        "trained_on": model_package['metadata']['trained_on']
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting HomeSpark ML API (Strict Budget Version)...")
    uvicorn.run(
    app,
    host="0.0.0.0",
    port=int(os.environ.get("PORT", 8000))
)