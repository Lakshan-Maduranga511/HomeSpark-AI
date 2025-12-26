// utils/dataTransforms.js
//  data transformation pipeline for wizard → ML model → UI

export const transformWizardDataToMLFormat = (wizardData) => {
  console.log("🔄 Transforming wizard data:", wizardData);

  const getBudgetRange = (budgetString) => {
    if (!budgetString) return { min: 5000, max: 15000 };
    const cleanBudget = budgetString
      .replace(/[$,K]/g, "")
      .replace(/k/gi, "000");
    const numbers = cleanBudget.match(/\d+/g);

    if (numbers && numbers.length >= 2) {
      return { min: parseInt(numbers[0]), max: parseInt(numbers[1]) };
    } else if (numbers && numbers.length === 1) {
      const singleValue = parseInt(numbers[0]);
      return {
        min: Math.max(1000, singleValue - 2000),
        max: singleValue + 2000,
      };
    }
    return { min: 5000, max: 15000 };
  };

  const budgetRange = getBudgetRange(wizardData.budget);

  const transformedData = {
    user_preferences: {
      budget_min: budgetRange.min,
      budget_max: budgetRange.max,
      style_preference: (wizardData.style || "Modern").toLowerCase(),
      room_type: (wizardData.roomType || "kitchen")
        .toLowerCase()
        .replace("-", "_"),
      indoor_outdoor: (wizardData.indoorOutdoor || "Indoor").toLowerCase(),
      location: wizardData.location || "",
      climate_type: (wizardData.climateType || "dry").toLowerCase(),
      climate_source: wizardData.climateSource || "location_detection",
      timestamp: new Date().toISOString(),
    },
    request_settings: {
      max_results: 3,
      include_explanation: true,
      confidence_threshold: 0.7,
      diversify_results: true,
    },
  };

  console.log("✅ Transformed data for ML:", transformedData);
  return transformedData;
};

// Transform ML response to UI-friendly format
export const transformMLResponseToUI = (mlResponse, userPreferences = {}) => {
  console.log("🔄 Transforming ML response to UI format:", mlResponse);
  console.log("📊 mlResponse.recommendations:", mlResponse.recommendations);

  if (
    !mlResponse ||
    !mlResponse.recommendations ||
    mlResponse.recommendations.length === 0
  ) {
    console.warn("No recommendations in ML response, generating fallback");
    return generateFallbackRecommendations(userPreferences);
  }

  const uiRecommendations = mlResponse.recommendations.map((rec, index) => {
    // ML API returns: item_name, estimated_price, room_type like wise
    const itemName =
      rec.item_name ||
      rec.name ||
      rec.title ||
      generateItemName(rec, userPreferences);

    //  Extract room type from RECOMMENDATION, not user preferences
    const recRoomType = rec.room_type || rec.roomType || "kitchen";
    const recStyle = rec.style || "Modern";
    const recIndoorOutdoor =
      rec.indoor_outdoor || rec.indoorOutdoor || "Indoor";

    console.log(`📦 Processing recommendation ${index + 1}:`, {
      itemName,
      recRoomType,
      recStyle,
      recIndoorOutdoor,
    });

    //  Generate image based on RECOMMENDATION data, not user preferences
    const imageUrl =
      rec.image ||
      rec.image_url ||
      generateImageUrl({
        style: recStyle,
        room_type: recRoomType,
        indoor_outdoor: recIndoorOutdoor,
      });

    const matchPercentage =
      rec.matchPercentage ||
      rec.match_score ||
      (rec.confidence ? Math.round(rec.confidence * 100) : 85);

    // ✅ Extract price from ML response
    const price =
      rec.estimated_price ||
      rec.price ||
      rec.total_cost ||
      rec.budget_estimate ||
      8500;

    const timeline =
      rec.timeline || rec.estimated_timeline || estimateTimeline(price, rec);
    const roi =
      rec.roi ||
      rec.return_on_investment ||
      estimateROI(price, rec.confidence || 0.8);

    return {
      id: rec.id || `ml-rec-${index + 1}`,
      name: itemName,
      image: imageUrl,
      matchPercentage,
      price,
      timeline,
      roi,
      style: formatStyle(recStyle),
      roomType: formatRoomType(recRoomType),
      indoorOutdoor: formatIndoorOutdoor(recIndoorOutdoor),
      climateType: formatClimateType(
        rec.climate_suitability || rec.climate_type || rec.climateType || "Dry"
      ),

      // ✅ Use recommendation's attributes, not generated ones
      attributes:
        rec.attributes ||
        rec.cost_breakdown ||
        generateAttributes(rec, price, recRoomType, recIndoorOutdoor),
      explanation: rec.explanation || generateExplanation(rec, userPreferences),
      features: rec.features || generateFeatures(recRoomType, recIndoorOutdoor),
      materials:
        rec.materials ||
        generateMaterials(
          rec.climate_suitability || rec.climate_type || "Dry",
          recIndoorOutdoor
        ),

      modelConfidence: rec.confidence || rec.modelConfidence || 0.8,
      modelData: {
        originalResponse: rec,
        processingTime:
          mlResponse.processing_time || mlResponse.processing_time_ms || 0,
        modelVersion: mlResponse.model_version || "1.0",
      },
    };
  });

  console.log(`✅ Generated ${uiRecommendations.length} UI recommendations`);
  return uiRecommendations;
};

// ✅ FIX 4: Generate image based on ACTUAL recommendation data
const generateImageUrl = (recData) => {
  // Extract from recommendation data, NOT user preferences
  const style = (recData.style || "modern").toLowerCase();
  const roomType = (
    recData.room_type ||
    recData.roomType ||
    "kitchen"
  ).toLowerCase();

  console.log(`🖼️ Generating image for: ${style} ${roomType}`);

  // Comprehensive photo mapping for all room types and styles
  const photoMap = {
    modern: {
      kitchen: "photo-1556909114-f6e7ad7d3136",
      bathroom: "photo-1620626011761-996317b8d101",
      living_room: "photo-1586023492125-27b2c045efd7",
      "living-room": "photo-1586023492125-27b2c045efd7",
      bedroom: "photo-1566665797739-1674de7a421a",
      "dining-room": "photo-1578662996442-48f60103fc96",
      dining_room: "photo-1578662996442-48f60103fc96",
      patio: "photo-1600607687939-ce8a6c25118c",
      garden: "photo-1585320806297-9794b3e4eeae",
    },
    traditional: {
      kitchen: "photo-1556912172-45b7abe8b7e1",
      bathroom: "photo-1584622650111-993a426fbf0a",
      living_room: "photo-1555041469-a586c61ea9bc",
      "living-room": "photo-1555041469-a586c61ea9bc",
      bedroom: "photo-1560448204-e02f11c3d0e2",
      "dining-room": "photo-1617806118233-18e1de247200",
      dining_room: "photo-1617806118233-18e1de247200",
      patio: "photo-1502672260266-1c1ef2d93688",
      garden: "photo-1416879595882-3373a0480b5b",
    },
    rustic: {
      kitchen: "photo-1585412727339-54e4bae3bbf9",
      bathroom: "photo-1584622650111-993a426fbf0a",
      living_room: "photo-1493663284031-b7e3afd4a9bb",
      "living-room": "photo-1493663284031-b7e3afd4a9bb",
      bedroom: "photo-1578662996442-48f60103fc96",
      "dining-room": "photo-1615874694520-474822394e73",
      dining_room: "photo-1615874694520-474822394e73",
      patio: "photo-1502672260266-1c1ef2d93688",
      garden: "photo-1416879595882-3373a0480b5b",
    },
  };

  // Normalize room type for lookup
  const normalizedRoom = roomType.replace("_", "-").toLowerCase();

  // Get photo ID with fallbacks
  const photoId =
    photoMap[style]?.[normalizedRoom] ||
    photoMap[style]?.[roomType] ||
    photoMap.modern?.[normalizedRoom] ||
    photoMap.modern.kitchen;

  const imageUrl = `https://images.unsplash.com/${photoId}?w=800&h=600&fit=crop&q=80&auto=format`;
  console.log(`✅ Generated image URL: ${imageUrl}`);

  return imageUrl;
};

const generateItemName = (rec, userPrefs) => {
  const style = rec.style || userPrefs.style || "Modern";
  const roomType = formatRoomType(
    rec.room_type || rec.roomType || userPrefs.roomType || "Kitchen"
  );
  const indoorOutdoor =
    rec.indoor_outdoor || rec.indoorOutdoor || userPrefs.indoorOutdoor || "";

  let name = `${style} ${roomType}`;
  if (indoorOutdoor && indoorOutdoor.toLowerCase() !== "indoor") {
    name += ` ${indoorOutdoor}`;
  }
  name += " Renovation";

  return name.replace(/\s+/g, " ").trim();
};

const extractPrice = (rec) => {
  return (
    rec.price ||
    rec.estimated_price ||
    rec.total_cost ||
    rec.budget_estimate ||
    8500
  );
};

// ✅ FIX 5: Use recommendation's room type for attributes
const generateAttributes = (rec, totalPrice, roomType, indoorOutdoor) => {
  // Use the recommendation's room type, not user's preference
  const room = (roomType || "kitchen").toLowerCase();
  const outdoor = (indoorOutdoor || "indoor").toLowerCase() === "outdoor";

  if (outdoor) {
    return {
      furniture: {
        item: "Outdoor Furniture",
        price: Math.round(totalPrice * 0.4),
      },
      hardscape: {
        item: "Hardscape & Structure",
        price: Math.round(totalPrice * 0.35),
      },
      features: {
        item: "Features & Accessories",
        price: Math.round(totalPrice * 0.25),
      },
    };
  }

  if (room.includes("kitchen")) {
    return {
      cabinets: {
        item: "Kitchen Cabinets",
        price: Math.round(totalPrice * 0.45),
      },
      countertops: { item: "Countertops", price: Math.round(totalPrice * 0.3) },
      appliances: {
        item: "Appliances & Fixtures",
        price: Math.round(totalPrice * 0.25),
      },
    };
  } else if (room.includes("bathroom")) {
    return {
      fixtures: {
        item: "Bathroom Fixtures",
        price: Math.round(totalPrice * 0.4),
      },
      tiles: { item: "Tiles & Flooring", price: Math.round(totalPrice * 0.35) },
      vanity: {
        item: "Vanity & Storage",
        price: Math.round(totalPrice * 0.25),
      },
    };
  } else {
    return {
      furniture: {
        item: "Furniture & Fixtures",
        price: Math.round(totalPrice * 0.5),
      },
      flooring: {
        item: "Flooring & Finishes",
        price: Math.round(totalPrice * 0.3),
      },
      decor: {
        item: "Decor & Accessories",
        price: Math.round(totalPrice * 0.2),
      },
    };
  }
};

const generateExplanation = (rec, userPrefs) => {
  if (rec.explanation) return rec.explanation;

  const style = rec.style || userPrefs.style || "modern";
  const roomType = formatRoomType(
    rec.room_type || rec.roomType || userPrefs.roomType || "room"
  );
  const confidence = rec.confidence || 0.8;

  let explanation = `This ${style.toLowerCase()} ${roomType.toLowerCase()} renovation `;

  if (confidence > 0.9) {
    explanation +=
      "is an excellent match for your preferences with high compatibility across all factors.";
  } else if (confidence > 0.8) {
    explanation +=
      "provides strong compatibility with your style preferences and budget requirements.";
  } else {
    explanation +=
      "meets your basic requirements and offers good value for your budget.";
  }

  return explanation;
};

// ✅ FIX 6: Use recommendation's room type for features
const generateFeatures = (roomType, indoorOutdoor) => {
  const room = (roomType || "kitchen").toLowerCase();
  const outdoor = (indoorOutdoor || "indoor").toLowerCase() === "outdoor";

  if (outdoor) {
    return [
      "Weather Resistant",
      "Low Maintenance",
      "Seasonal Flexibility",
      "Durable Materials",
    ];
  }

  if (room.includes("kitchen")) {
    return [
      "Modern Appliances",
      "Ample Storage",
      "Task Lighting",
      "Island/Peninsula",
    ];
  } else if (room.includes("bathroom")) {
    return [
      "Water Efficient Fixtures",
      "Modern Vanity",
      "Good Ventilation",
      "Easy Maintenance",
    ];
  } else {
    return [
      "Comfortable Layout",
      "Natural Light",
      "Quality Materials",
      "Flexible Design",
    ];
  }
};

const generateMaterials = (climateType, indoorOutdoor) => {
  const climate = (climateType || "dry").toLowerCase();
  const outdoor = (indoorOutdoor || "indoor").toLowerCase() === "outdoor";

  if (outdoor) {
    if (climate === "humid") {
      return [
        "Composite Decking",
        "Aluminum",
        "Weather-Resistant Fabrics",
        "Powder-Coated Steel",
      ];
    } else {
      return [
        "Teak Wood",
        "Natural Stone",
        "Stainless Steel",
        "UV-Resistant Materials",
      ];
    }
  } else {
    if (climate === "humid") {
      return ["Quartz", "Ceramic Tiles", "Stainless Steel", "Treated Wood"];
    } else if (climate === "cold") {
      return [
        "Hardwood",
        "Natural Stone",
        "Insulated Materials",
        "Quality Hardware",
      ];
    } else {
      return ["Granite", "Hardwood", "Glass", "Metal Accents"];
    }
  }
};

const estimateTimeline = (price, rec) => {
  if (rec.estimated_timeline || rec.timeline)
    return rec.estimated_timeline || rec.timeline;
  if (price < 3000) return "1-2 weeks";
  if (price < 7000) return "2-3 weeks";
  if (price < 15000) return "3-4 weeks";
  if (price < 25000) return "4-6 weeks";
  return "6-8 weeks";
};

const estimateROI = (price, confidence) => {
  const baseROI = 40 + confidence * 50;
  const priceBonus = Math.min(price / 1000, 15);
  return `${Math.round(baseROI + priceBonus)}%`;
};

const formatStyle = (style) => {
  if (!style) return "Modern";
  return style.charAt(0).toUpperCase() + style.slice(1).toLowerCase();
};

const formatRoomType = (roomType) => {
  if (!roomType) return "Kitchen";
  return roomType
    .replace(/_/g, "-")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatIndoorOutdoor = (type) => {
  if (!type) return "Indoor";
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

const formatClimateType = (climate) => {
  if (!climate) return "Dry";
  return climate.charAt(0).toUpperCase() + climate.slice(1).toLowerCase();
};

const generateFallbackRecommendations = (userPrefs) => {
  const basePrice = extractBudgetFromWizard(userPrefs.budget) || 8500;

  return [
    {
      id: "fallback-1",
      name: `${userPrefs.style || "Modern"} ${formatRoomType(
        userPrefs.roomType || "Kitchen"
      )} Transformation`,
      image: generateImageUrl({
        style: userPrefs.style,
        room_type: userPrefs.roomType,
        indoor_outdoor: userPrefs.indoorOutdoor,
      }),
      matchPercentage: 85,
      price: basePrice,
      timeline: estimateTimeline(basePrice, {}),
      roi: estimateROI(basePrice, 0.85),
      style: formatStyle(userPrefs.style || "Modern"),
      roomType: formatRoomType(userPrefs.roomType || "kitchen"),
      indoorOutdoor: formatIndoorOutdoor(userPrefs.indoorOutdoor || "Indoor"),
      climateType: formatClimateType(userPrefs.climateType || "Dry"),
      attributes: generateAttributes(
        {},
        basePrice,
        userPrefs.roomType,
        userPrefs.indoorOutdoor
      ),
      explanation: `This ${(
        userPrefs.style || "modern"
      ).toLowerCase()} transformation matches your preferences. Showing fallback recommendation as the AI model is currently unavailable.`,
      features: generateFeatures(userPrefs.roomType, userPrefs.indoorOutdoor),
      materials: generateMaterials(
        userPrefs.climateType,
        userPrefs.indoorOutdoor
      ),
      modelConfidence: 0.85,
      modelData: {
        isFallback: true,
        originalResponse: null,
        processingTime: 0,
      },
    },
  ];
};

const extractBudgetFromWizard = (budgetString) => {
  if (!budgetString) return 8500;
  const numbers = budgetString.match(/\d+/g);
  return numbers ? parseInt(numbers[0]) : 8500;
};

export const validateWizardData = (wizardData) => {
  const errors = [];
  if (!wizardData.indoorOutdoor)
    errors.push("Indoor/Outdoor preference required");
  if (!wizardData.budget) errors.push("Budget is required");
  if (!wizardData.style) errors.push("Style preference required");
  if (!wizardData.roomType) errors.push("Room type required");
  if (!wizardData.location?.trim()) errors.push("Location required");
  return { isValid: errors.length === 0, errors };
};

export const debugTransformation = (originalData, transformedData) => {
  if (typeof window !== "undefined" && window.console) {
    console.group("🔄 Data Transformation Debug");
    console.log("Original Wizard Data:", originalData);
    console.log("Transformed ML Data:", transformedData);
    console.groupEnd();
  }
};
