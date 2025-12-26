// utils/mlService.js

const ML_API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_ML_API_URL || "http://127.0.0.1:8000", // python api address
  timeout: 30000, // Wait 30 seconds max
  retries: 2, // Retry failed calls 2 times
};

/**
  Send custom filters to ML API instead of filtering on frontend
 */
export const getRecommendationsFromML = async (
  wizardData,
  customFilters = null
) => {
  console.log("🚀 Requesting ML recommendations");
  console.log("📋 Wizard Input:", wizardData);
  console.log("🎛️ Custom Filters:", customFilters);

  try {
    //  Merge custom filters with wizard data before sending to API
    const mergedPreferences = customFilters
      ? mergeFiltersWithWizardData(wizardData, customFilters) // merger wizard data with filter data
      : wizardData; //if not include filter data use original wizard data

    console.log("📤 Merged Preferences:", mergedPreferences);

    const apiRequest = transformWizardToAPI(mergedPreferences);
    console.log("📤 API Request:", apiRequest);

    const response = await callMLAPIWithRetry(apiRequest);
    console.log("📥 ML Response:", response);

    // Transform to UI format
    const uiRecommendations = await transformAPIToUI(
      response,
      mergedPreferences
    );
    console.log("✅ UI Recommendations:", uiRecommendations);

    return {
      success: true,
      recommendations: uiRecommendations,
      modelInfo: {
        modelType: response.model_type || "NMF+KMeans",
        processingTime: response.processing_time_ms || 0,
        totalResults: uiRecommendations.length,
        isRealtime: true,
      },
    };
  } catch (error) {
    console.error("❌ ML API Error:", error);
    return handleMLError(error, wizardData);
  }
};

// NEW: Merge custom filters with original wizard data

const mergeFiltersWithWizardData = (wizardData, customFilters) => {
  const merged = { ...wizardData };

  // Update budget if customFilters has budgetRange
  if (customFilters.budgetRange) {
    const [min, max] = customFilters.budgetRange;
    merged.budget = `${min}-${max}`;
  }

  // Update indoor/outdoor if specified and not "All"
  if (customFilters.indoorOutdoor && customFilters.indoorOutdoor !== "All") {
    merged.indoorOutdoor = customFilters.indoorOutdoor;
  }

  // Update style if filters specify styles (take first one if multiple selected)
  if (customFilters.styles && customFilters.styles.length > 0) {
    merged.style = customFilters.styles[0];
  }

  console.log("🔄 Merged wizard + filters:", merged);
  return merged;
};

/**
 * Transform wizard data to ML API format
 */
const transformWizardToAPI = (wizardData) => {
  const budgetRange = extractBudgetRange(wizardData.budget);

  return {
    user_preferences: {
      budget_min: budgetRange.min,
      budget_max: budgetRange.max,
      style_preference: wizardData.style || "Modern",
      room_type: (wizardData.roomType || "kitchen")
        .toLowerCase()
        .replace("-", "_"),
      indoor_outdoor: wizardData.indoorOutdoor || "Indoor",
      location: wizardData.location || "",
      climate_type: wizardData.climateType || "Dry",
    },
    request_settings: {
      max_results: 3,
      include_explanation: true,
      confidence_threshold: 0.6,
    },
  };
};

/**
 * Extract budget range from wizard input
 */
const extractBudgetRange = (budgetString) => {
  if (!budgetString) return { min: 0, max: 550 };

  const numbers = budgetString.match(/\d+/g);

  if (numbers && numbers.length >= 2) {
    let min = parseInt(numbers[0]);
    let max = parseInt(numbers[1]);

    // Ensure within 0-550 bounds
    min = Math.max(0, Math.min(min, 550));
    max = Math.max(min, Math.min(max, 550));

    return { min, max };
  } else if (numbers && numbers.length === 1) {
    let value = parseInt(numbers[0]);
    value = Math.max(0, Math.min(value, 550));

    return {
      min: Math.max(0, value - 50),
      max: Math.min(550, value + 50),
    };
  }

  return { min: 0, max: 550 };
};

/**
 * Call ML API with retry logic
 */
const callMLAPIWithRetry = async (requestData, attempt = 1) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ML_API_CONFIG.timeout);

  try {
    console.log(`📡 API Call Attempt ${attempt}/${ML_API_CONFIG.retries + 1}`);

    const response = await fetch(
      `${ML_API_CONFIG.baseURL}/api/recommendations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.recommendations || !Array.isArray(data.recommendations)) {
      throw new Error("Invalid response format: missing recommendations array");
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (attempt <= ML_API_CONFIG.retries && isRetryableError(error)) {
      console.log(`🔄 Retrying... (${attempt}/${ML_API_CONFIG.retries})`);
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return callMLAPIWithRetry(requestData, attempt + 1);
    }

    throw error;
  }
};

const isRetryableError = (error) => {
  const retryable = ["fetch", "network", "timeout", "abort"];
  return retryable.some(
    (keyword) =>
      error.message.toLowerCase().includes(keyword) ||
      error.name.toLowerCase().includes(keyword)
  );
};

/**
 * Transform ML API response to UI format
 */
const transformAPIToUI = async (apiResponse, originalWizardData) => {
  const recommendations = await Promise.all(
    apiResponse.recommendations.map(async (rec, index) => {
      const imageUrl = await getImageForRecommendation(
        rec.style,
        rec.room_type,
        rec.indoor_outdoor,
        rec.item_name
      );

      return {
        id: rec.id || `ml-rec-${index + 1}`,
        name: rec.item_name || `${rec.style} ${formatRoomType(rec.room_type)}`,
        image: imageUrl,
        matchPercentage: Math.round(rec.confidence * 100),
        match_quality: rec.match_quality || "Good", //  Word-based match
        price: rec.estimated_price,
        timeline: estimateTimeline(rec.estimated_price),
        roi: estimateROI(rec.estimated_price, rec.confidence),

        style: formatStyle(rec.style),
        roomType: formatRoomType(rec.room_type),
        indoorOutdoor: formatIndoorOutdoor(rec.indoor_outdoor),
        climateType: formatClimate(rec.climate_suitability),

        attributes:
          rec.cost_breakdown ||
          generateCostBreakdown(rec.estimated_price, rec.room_type),
        explanation:
          rec.explanation ||
          `This ${rec.style} ${rec.room_type} renovation matches your preferences.`,
        features: rec.features || [],
        materials: rec.materials || [],

        modelConfidence: rec.confidence,
        modelData: { isRealML: true, originalResponse: rec },
      };
    })
  );

  return recommendations;
};

/**
 * Get image for recommendation
 */
const getImageForRecommendation = async (
  style,
  roomType,
  indoorOutdoor,
  itemName
) => {
  const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (unsplashKey) {
    try {
      const query = (itemName, style, roomType, indoorOutdoor) => {
        return [
          itemName,
          style,
          roomType,
          indoorOutdoor,
          "eco friendly",
          "sustainable",
          "recycled",
          "and most relevant",
        ]
          .filter(Boolean)
          .join(" ");
      };

      const q = query(itemName, style, indoorOutdoor, roomType);
      console.log("🔍 Unsplash query:", q);

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          q
        )}&per_page=1&client_id=${unsplashKey}`,
        { cache: "force-cache" }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.results?.length > 0) {
          return data.results[0].urls.regular;
        }
      }
    } catch (error) {
      console.warn("⚠️ Unsplash fetch failed, using fallback");
    }
  }

  return getStaticImageUrl(style, roomType);
};

const getStaticImageUrl = (style, roomType) => {
  const styleKey = (style || "modern").toLowerCase();
  const roomKey = (roomType || "kitchen")
    .toLowerCase()
    .replace("_", "")
    .replace("-", "");

  const imageMap = {
    modern: {
      kitchen: "photo-1556909114-f6e7ad7d3136",
      bathroom: "photo-1620626011761-996317b8d101",
      livingroom: "photo-1586023492125-27b2c045efd7",
      bedroom: "photo-1566665797739-1674de7a421a",
      diningroom: "photo-1578662996442-48f60103fc96",
      patio: "photo-1600607687939-ce8a6c25118c",
      garden: "photo-1585320806297-9794b3e4eeae",
    },
    traditional: {
      kitchen: "photo-1556912172-45b7abe8b7e1",
      bathroom: "photo-1584622650111-993a426fbf0a",
      livingroom: "photo-1555041469-a586c61ea9bc",
      bedroom: "photo-1560448204-e02f11c3d0e2",
      diningroom: "photo-1617806118233-18e1de247200",
      patio: "photo-1502672260266-1c1ef2d93688",
      garden: "photo-1416879595882-3373a0480b5b",
    },
    rustic: {
      kitchen: "photo-1585412727339-54e4bae3bbf9",
      bathroom: "photo-1584622650111-993a426fbf0a",
      livingroom: "photo-1493663284031-b7e3afd4a9bb",
      bedroom: "photo-1578662996442-48f60103fc96",
      diningroom: "photo-1615874694520-474822394e73",
      patio: "photo-1502672260266-1c1ef2d93688",
      garden: "photo-1416879595882-3373a0480b5b",
    },
  };

  const photoId =
    imageMap[styleKey]?.[roomKey] ||
    imageMap.modern?.[roomKey] ||
    imageMap.modern.kitchen;

  return `https://images.unsplash.com/${photoId}?w=800&h=600&fit=crop&q=80&auto=format`;
};

const generateCostBreakdown = (totalCost, roomType) => {
  const room = (roomType || "kitchen").toLowerCase();

  if (room.includes("kitchen")) {
    return {
      cabinets: {
        item: "Kitchen Cabinets",
        price: Math.round(totalCost * 0.45),
      },
      countertops: { item: "Countertops", price: Math.round(totalCost * 0.3) },
      appliances: {
        item: "Appliances & Fixtures",
        price: Math.round(totalCost * 0.25),
      },
    };
  } else if (room.includes("bathroom")) {
    return {
      fixtures: {
        item: "Bathroom Fixtures",
        price: Math.round(totalCost * 0.4),
      },
      tiles: { item: "Tiles & Flooring", price: Math.round(totalCost * 0.35) },
      vanity: { item: "Vanity & Storage", price: Math.round(totalCost * 0.25) },
    };
  } else {
    return {
      furniture: {
        item: "Furniture & Fixtures",
        price: Math.round(totalCost * 0.5),
      },
      flooring: {
        item: "Flooring & Finishes",
        price: Math.round(totalCost * 0.3),
      },
      decor: {
        item: "Decor & Accessories",
        price: Math.round(totalCost * 0.2),
      },
    };
  }
};

const estimateTimeline = (price) => {
  if (price < 50) return "1-2 days";
  if (price < 150) return "3-5 days";
  if (price < 300) return "1-2 weeks";
  if (price < 450) return "2-3 weeks";
  return "3-4 weeks";
};

const estimateROI = (price, confidence) => {
  const baseROI = 10 + confidence * 30;
  return `${Math.round(baseROI)}%`;
};

const formatStyle = (style) => {
  if (!style) return "Modern";
  return style.charAt(0).toUpperCase() + style.slice(1).toLowerCase();
};

const formatRoomType = (roomType) => {
  if (!roomType) return "Kitchen";
  return roomType
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatIndoorOutdoor = (type) => {
  if (!type) return "Indoor";
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

const formatClimate = (climate) => {
  if (!climate) return "Dry";
  return climate.charAt(0).toUpperCase() + climate.slice(1).toLowerCase();
};

const handleMLError = async (error, wizardData) => {
  console.error("🔧 Handling ML error:", error.message);

  const fallbackRecs = await generateFallbackRecommendations(wizardData);

  return {
    success: false,
    error: categorizeError(error),
    recommendations: fallbackRecs,
    modelInfo: {
      modelType: "fallback",
      isFallback: true,
      processingTime: 0,
      totalResults: fallbackRecs.length,
      isRealtime: false,
    },
  };
};

const categorizeError = (error) => {
  const msg = error.message.toLowerCase();

  if (msg.includes("fetch") || msg.includes("network")) {
    return "Unable to connect to ML service. Using fallback recommendations.";
  }
  if (msg.includes("timeout") || msg.includes("abort")) {
    return "ML service is taking too long. Using fallback recommendations.";
  }
  if (msg.includes("503") || msg.includes("500")) {
    return "ML service temporarily unavailable. Using fallback recommendations.";
  }
  if (msg.includes("404")) {
    return "ML service endpoint not found. Check server configuration.";
  }

  return "ML service error. Using fallback recommendations.";
};

const generateFallbackRecommendations = async (wizardData) => {
  const budgetRange = extractBudgetRange(wizardData.budget);
  const basePrice = Math.round((budgetRange.min + budgetRange.max) / 2);

  const imageUrl = await getImageForRecommendation(
    wizardData.style,
    wizardData.roomType,
    wizardData.indoorOutdoor,
    null
  );

  return [
    {
      id: "fallback-1",
      name: `${wizardData.style} ${formatRoomType(
        wizardData.roomType
      )} Renovation`,
      image: imageUrl,
      matchPercentage: 85,
      price: basePrice,
      timeline: estimateTimeline(basePrice),
      roi: estimateROI(basePrice, 0.85),
      style: wizardData.style,
      roomType: formatRoomType(wizardData.roomType),
      indoorOutdoor: wizardData.indoorOutdoor,
      climateType: wizardData.climateType,
      attributes: generateCostBreakdown(basePrice, wizardData.roomType),
      explanation: `Smart fallback recommendation matching your ${wizardData.style.toLowerCase()} style preferences.`,
      features: [],
      materials: [],
      modelConfidence: 0.85,
      modelData: { isFallback: true },
    },
  ];
};

export const checkMLHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${ML_API_CONFIG.baseURL}/api/health`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        isHealthy: true,
        modelLoaded: data.model_loaded,
        timestamp: data.timestamp,
      };
    }

    return { isHealthy: false };
  } catch (error) {
    return { isHealthy: false, error: error.message };
  }
};
