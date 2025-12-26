// utils/recommendationData.js


export const sampleRecommendations = [
  // Indoor Kitchen Recommendations
  {
    id: 1,
    name: "Modern Kitchen Transformation",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    matchPercentage: 95,
    price: 8500,
    timeline: "3-4 weeks",
    roi: "78%",
    style: "Modern",
    roomType: "kitchen",
    indoorOutdoor: "Indoor",
    climateType: "Dry",
    attributes: {
      cabinets: { item: "White Shaker Cabinets", price: 3200 },
      countertops: { item: "Quartz Countertops", price: 2800 },
      appliances: { item: "Stainless Steel Appliances", price: 2500 },
    },
    explanation:
      "This modern kitchen design matches your indoor preference and style perfectly. The materials are suitable for dry climates and provide excellent durability.",
    materials: ["Quartz", "Stainless Steel", "Hardwood"],
  },
  {
    id: 2,
    name: "Contemporary Clean Kitchen",
    image:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop",
    matchPercentage: 87,
    price: 6200,
    timeline: "2-3 weeks",
    roi: "65%",
    style: "Contemporary",
    roomType: "kitchen",
    indoorOutdoor: "Indoor",
    climateType: "Humid",
    attributes: {
      cabinets: { item: "Flat Panel Cabinets", price: 2800 },
      countertops: { item: "Marble Countertops", price: 2400 },
      appliances: { item: "Black Appliances", price: 1000 },
    },
    explanation:
      "A budget-friendly contemporary kitchen perfect for humid climates with moisture-resistant materials.",
    materials: ["Marble", "Black Metal", "Glass"],
  },
  {
    id: 3,
    name: "Traditional Living Room Elegance",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    matchPercentage: 82,
    price: 9100,
    timeline: "4-5 weeks",
    roi: "72%",
    style: "Traditional",
    roomType: "living-room",
    indoorOutdoor: "Indoor",
    climateType: "Cold",
    attributes: {
      furniture: { item: "Classic Furniture Set", price: 4000 },
      flooring: { item: "Hardwood Flooring", price: 3200 },
      decor: { item: "Traditional Decor", price: 1900 },
    },
    explanation:
      "Classic traditional living room design optimized for cold climates with proper insulation materials.",
    materials: ["Solid Wood", "Brass Hardware", "Natural Fabrics"],
  },
  // Outdoor Recommendations
  {
    id: 4,
    name: "Modern Patio Paradise",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    matchPercentage: 90,
    price: 7500,
    timeline: "2-3 weeks",
    roi: "68%",
    style: "Modern",
    roomType: "patio",
    indoorOutdoor: "Outdoor",
    climateType: "Dry",
    attributes: {
      furniture: { item: "Weather-Resistant Furniture", price: 3000 },
      flooring: { item: "Composite Decking", price: 2800 },
      features: { item: "Outdoor Kitchen Setup", price: 1700 },
    },
    explanation:
      "Modern patio design perfect for dry climates with UV-resistant and low-maintenance materials.",
    materials: ["Composite Materials", "Aluminum", "Weather-Resistant Fabrics"],
  },
  {
    id: 5,
    name: "Rustic Garden Retreat",
    image:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop",
    matchPercentage: 85,
    price: 5800,
    timeline: "3-4 weeks",
    roi: "60%",
    style: "Rustic",
    roomType: "garden",
    indoorOutdoor: "Outdoor",
    climateType: "Humid",
    attributes: {
      landscaping: { item: "Native Plant Installation", price: 2500 },
      hardscape: { item: "Natural Stone Pathways", price: 2000 },
      features: { item: "Water Feature & Seating", price: 1300 },
    },
    explanation:
      "Rustic garden design using native plants and materials suitable for humid climate conditions.",
    materials: ["Natural Stone", "Cedar Wood", "Native Plants"],
  },
];

// Style options - Only the 3 main styles from your dataset
export const styleOptions = ["Modern", "Traditional", "Rustic"];

// Indoor/Outdoor options from your dataset
export const indoorOutdoorOptions = ["Indoor", "Outdoor"];

// Climate types from your dataset
export const climateTypes = ["Dry", "Humid", "Cold"];

// Room types by indoor/outdoor preference
export const indoorRoomTypes = [
  "kitchen",
  "bathroom",
  "bedroom",
  "living-room",
  "dining-room",
];

export const outdoorRoomTypes = ["patio", "garden"];

export const getRoomTypes = (indoorOutdoor) => {
  if (indoorOutdoor === "Indoor") {
    return indoorRoomTypes;
  } else if (indoorOutdoor === "Outdoor") {
    return outdoorRoomTypes;
  }
  return [...indoorRoomTypes, ...outdoorRoomTypes];
};

// Budget ranges from your dataset (0-550 scale)
export const budgetRanges = {
  min: 0,
  max: 550,
  step: 5,
  defaultRange: [0, 550],
};

// Filter recommendations based on user preferences
export const filterRecommendations = (recommendations, filters) => {
  return recommendations.filter((rec) => {
    // Filter by indoor/outdoor preference
    if (filters.indoorOutdoor && rec.indoorOutdoor !== filters.indoorOutdoor) {
      return false;
    }

    // Filter by style (only if styles are selected)
    if (filters.styles && filters.styles.length > 0) {
      if (!filters.styles.includes(rec.style)) {
        return false;
      }
    }

    // Filter by budget range
    if (filters.budgetRange) {
      const [minBudget, maxBudget] = filters.budgetRange;
      if (rec.price < minBudget || rec.price > maxBudget) {
        return false;
      }
    }

    return true;
  });
};
