// utils/climateService.js

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const WEATHER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache result use to avoid repeated api calls
const weatherCache = new Map(); // used to store cache results

export const checkWeatherAPIHealth = async () => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${WEATHER_API_KEY}`
    );
    return {
      healthy: response.ok,
      message: response.ok ? "API is healthy" : "API is down",
    };
  } catch (error) {
    return { healthy: false, message: error.message };
  }
};

export const getClimateWithCache = async (params) => {
  const cacheKey =
    params.locationString || `${params.latitude},${params.longitude}`;

  // Check cache first
  //If we asked for this location in last 30 minutes, return saved result
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_DURATION) {
    console.log(`✅ Using cached climate data for: ${cacheKey}`);
    return cached.data;
  }

  try {
    let lat, lon, locationName;

    //  Handle location string - VALIDATE IT FIRST
    if (params.locationString) {
      console.log(`🔍 Geocoding location: ${params.locationString}`);
      // use open weather geocoding enpoint to convert city name into lan/lon
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        params.locationString
      )}&limit=1&appid=${WEATHER_API_KEY}`;

      const geocodeResponse = await fetch(geocodeUrl);

      if (!geocodeResponse.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const geocodeData = await geocodeResponse.json();

      //  CRITICAL: Check if location was found
      if (!geocodeData || geocodeData.length === 0) {
        return null;
      }

      lat = geocodeData[0].lat;
      lon = geocodeData[0].lon;
      locationName = geocodeData[0].name;

      console.log(`✅ Geocoded to: ${locationName} (${lat}, ${lon})`);
    }
    //  Handle coordinates directly
    else if (params.latitude && params.longitude) {
      lat = params.latitude;
      lon = params.longitude;
      console.log(`📍 Using coordinates: (${lat}, ${lon})`);
    } else {
      throw new Error("No location data provided");
    }

    // STEP 3: Fetch weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Weather service unavailable");
    }

    const weatherData = await weatherResponse.json();

    // STEP 4: Determine climate type
    const temperature = weatherData.main.temp;
    const humidity = weatherData.main.humidity;

    let climate;
    if (temperature < 15) {
      climate = "Cold";
    } else if (humidity > 70) {
      climate = "Humid";
    } else {
      climate = "Dry";
    }

    const result = {
      climate,
      source: "weather_api",
      success: true,
      weatherDetails: {
        temperature: Math.round(temperature * 10) / 10,
        humidity,
        description: weatherData.weather[0].description,
      },
      locationName: locationName || `${lat}, ${lon}`,
    };

    // Cache the result
    weatherCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    console.log(`✅ Climate detected: ${climate} for ${result.locationName}`);
    return result;
  } catch (error) {
    console.error("❌ Climate detection error:", error.message);

    // Re-throw the error so the frontend can handle it
    throw error;
  }
};

// Fallback function using location patterns (if API fails)
export const getClimateFallback = (locationString) => {
  const location = locationString.toLowerCase();

  // Cold climate patterns
  if (
    location.includes("alaska") ||
    location.includes("canada") ||
    location.includes("russia") ||
    location.includes("iceland") ||
    location.includes("norway") ||
    location.includes("sweden") ||
    location.includes("finland")
  ) {
    return {
      climate: "Cold",
      source: "location_pattern",
      success: false,
    };
  }

  // Humid climate patterns
  if (
    location.includes("singapore") ||
    location.includes("miami") ||
    location.includes("mumbai") ||
    location.includes("bangkok") ||
    location.includes("manila") ||
    location.includes("jakarta") ||
    location.includes("kuala lumpur")
  ) {
    return {
      climate: "Humid",
      source: "location_pattern",
      success: false,
    };
  }

  // Default to Dry for unknown locations
  return {
    climate: "Dry",
    source: "location_pattern",
    success: false,
  };
};
