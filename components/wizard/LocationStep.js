"use client";
import { useState, useEffect, useRef } from "react";
import {
  checkWeatherAPIHealth,
  getClimateWithCache,
} from "../../utils/climateService";
import { getClimateFallback } from "../../utils/climateService";

// support 2 input methods: manual string entry and current location
// Mock climate service functions for demonstration

const LocationStep = ({ formData = {}, setFormData }) => {
  const [locationError, setLocationError] = useState("");
  const [isDetectingClimate, setIsDetectingClimate] = useState(false);
  const [climateInfo, setClimateInfo] = useState(null);
  const [apiHealthy, setApiHealthy] = useState(true);
  const [inputMethod, setInputMethod] = useState(null); // 'manual' = type or 'current' browser gps

  // Debounce timer for auto-detection
  const debounceTimer = useRef(null);

  // Check Weather API health on mount
  useEffect(() => {
    const checkAPI = async () => {
      const health = await checkWeatherAPIHealth();
      setApiHealthy(health.healthy);
      if (!health.healthy) {
        console.warn("Weather API not available:", health.message);
      }
    };
    checkAPI();
  }, []);

  //  Auto-detect climate when location changes (after 1 second delay)
  //only run auto detect if inputMethod === "manual" AND location exists and length >= 3.
  useEffect(() => {
    if (
      inputMethod === "manual" &&
      formData.location &&
      formData.location.trim().length >= 3
    ) {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer for auto-detection
      debounceTimer.current = setTimeout(() => {
        detectClimate({ locationString: formData.location });
      }, 1000); // 1 second delay after user stops typing
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData.location, inputMethod]);

  // Handle manual input change
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setInputMethod("manual");
    setFormData((prev) => ({ ...prev, location: value }));

    if (locationError && value.trim()) setLocationError("");
    if (climateInfo && value.trim().length < 3) {
      setClimateInfo(null);
      setFormData((prev) => ({
        ...prev,
        climateType: null,
        climateSource: null,
      }));
    }
  };
 // main detection function 
  // Detect climate using string or coordinates
  const detectClimate = async (params) => {
    const hasLocationString =
      params.locationString && params.locationString.trim().length >= 3; //some city
    const hasCoords = params.latitude && params.longitude; // cordinates

    // Validate input
    if (!hasLocationString && !hasCoords) {
      setLocationError("Please enter a valid location (at least 3 characters)");
      return;
    }

    setIsDetectingClimate(true);
    setLocationError("");

    try {
      console.log("🔍 Detecting climate for:", params);

      const result = await getClimateWithCache(params);

      // result = null means invalid city
      if (!result) {
        throw new Error("InvalidCity");
      }

      // Successful climate detection
      setClimateInfo(result);

      setFormData((prev) => ({
        ...prev,
        climateType: result.climate,
        climateSource: result.source,
      }));

      console.log(`✅ Climate detected: ${result.climate} (${result.source})`);
    } catch (error) {
      console.log("❌ Climate detection error:", error.message);

      //  Case 1: Invalid City
    // ------------------------------------------
      if (
        error.message === "InvalidCity" ||
        error.message === "Location not found"
      ) {
        setLocationError(
          `❌ "${params.locationString}" is not a valid city name.`
        );
        setClimateInfo(null);
        setFormData((prev) => ({
          ...prev,
          climateType: null,
          climateSource: null,
        }));
        return;
      }

      
      //  Case 2: API is available but city is wrong
      
  

      
      //  Case 3: API Failure → Use fallback pattern
      
      if (
        error.message === "Geocoding service unavailable" ||
        error.message === "Weather service unavailable"
      ) {
        const fallback = getClimateFallback(params.locationString);

        setClimateInfo(fallback);

        setFormData((prev) => ({
          ...prev,
          climateType: fallback.climate,
          climateSource: fallback.source,
        }));

        setLocationError(
          `⚠️ Weather service unavailable. Using fallback detection for "${params.locationString}".`
        );
        return;
      }

      
      //  Case 4: Unknown unexpected error
  
      setLocationError("⚠️ Error detecting climate. Please try again.");
      setClimateInfo(null);
      setFormData((prev) => ({
        ...prev,
        climateType: null,
        climateSource: null,
      }));
    } finally {
      setIsDetectingClimate(false);
    }
  };

  // Handle Current Location button
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingClimate(true);
    setLocationError("");
    setInputMethod("current");
    setClimateInfo(null); // Clear previous climate info

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const coordsString = `${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`;

          setFormData((prev) => ({
            ...prev,
            location: coordsString,
          }));

          await detectClimate({ latitude, longitude });
        } catch (error) {
          console.error(
            "Error detecting climate from current location:",
            error
          );
          setLocationError("Unable to detect climate from current location");
          setFormData((prev) => ({
            ...prev,
            climateType: null,
            climateSource: null,
          }));
        } finally {
          setIsDetectingClimate(false);
        }
      },
      (error) => {
        setIsDetectingClimate(false);
        setInputMethod(null);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location access denied. Please enable location services."
          );
        } else {
          setLocationError(
            "Unable to get your current location. Please try manual entry."
          );
        }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Where are you located?
        </h2>
        <p className="text-lg text-gray-600">
          We'll automatically detect your climate to recommend suitable
          materials and designs
        </p>
      </div>

      {/* Location Input Options */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <div className="space-y-6">
          {/* Option 1: Manual Entry */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Your Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                value={formData.location || ""}
                onChange={handleLocationChange}
                placeholder="e.g., New York, San Francisco, London..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />

              {/* Location Icon */}
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              {/* Auto-detecting indicator */}
              {isDetectingClimate && inputMethod === "manual" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-blue-600 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Detecting climate...
                </div>
              )}
            </div>

            {inputMethod === "manual" &&
              formData.location &&
              formData.location.length >= 3 &&
              !isDetectingClimate &&
              !climateInfo &&
              !locationError && (
                <p className="mt-2 text-sm text-gray-500">
                  ⏳ Climate will be detected automatically...
                </p>
              )}

            {locationError && (
              <div className="mt-2 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0 text-red-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-700 whitespace-pre-line flex-1">
                    {locationError}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Option 2: Current Location Button */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isDetectingClimate}
            className="w-full flex items-center justify-center px-6 py-4 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isDetectingClimate && inputMethod === "current" ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                Detecting your location...
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Use My Current Location
              </>
            )}
          </button>

          {inputMethod === "current" && formData.location && (
            <div className="text-sm text-gray-600 text-center">
              📍 Using coordinates: {formData.location}
            </div>
          )}

          {/* Climate Detection Result */}
          {climateInfo && (
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl animate-fadeIn">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                    {climateInfo.climate === "Cold" && "❄️"}
                    {climateInfo.climate === "Humid" && "💧"}
                    {climateInfo.climate === "Dry" && "☀️"}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-lg font-bold text-green-900 mb-1">
                    Climate Detected: {climateInfo.climate}
                  </h4>

                  {climateInfo.success && climateInfo.weatherDetails ? (
                    <div className="text-sm text-green-800 space-y-1">
                      <p className="flex items-center">
                        <span className="font-medium mr-2">
                          🌡️ Temperature:
                        </span>
                        {climateInfo.weatherDetails.temperature}°C
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium mr-2">💧 Humidity:</span>
                        {climateInfo.weatherDetails.humidity}%
                      </p>
                      <p className="capitalize flex items-center">
                        <span className="font-medium mr-2">☁️ Conditions:</span>
                        {climateInfo.weatherDetails.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-green-700">
                      ✓ Detected using location patterns (Weather data
                      unavailable)
                    </p>
                  )}

                  <div className="mt-3 p-2 bg-white bg-opacity-50 rounded-lg">
                    <p className="text-xs text-green-800 font-medium">
                      ✨ We'll recommend materials and designs suitable for{" "}
                      {climateInfo.climate.toLowerCase()} climates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manual Climate Override */}
          {climateInfo && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Not correct? You can adjust the climate type:
              </label>
              <select
                value={formData.climateType || climateInfo.climate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    climateType: e.target.value,
                    climateSource: "user_override",
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                <option value="Dry">☀️ Dry Climate (Hot & Arid)</option>
                <option value="Humid">💧 Humid Climate (Moist & Rainy)</option>
                <option value="Cold">❄️ Cold Climate (Snowy & Freezing)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-base font-bold text-blue-900 mb-2">
              Why we need your location & climate
            </h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Recommend materials that work best in your climate</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Ensure renovations are weather-appropriate</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Provide accurate local pricing and contractors</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>
                  Match you with{" "}
                  {climateInfo ? climateInfo.climate.toLowerCase() : "climate"}
                  -optimized designs
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Warning */}
      {!apiHealthy && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-yellow-800">
              <strong>Notice:</strong> Weather service is temporarily
              unavailable. Climate will be detected using location patterns
              instead.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LocationStep;
