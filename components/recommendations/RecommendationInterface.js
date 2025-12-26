// components/recommendations/RecommendationInterface.js
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import MainRecommendation from "./MainRecommendation";
import AlternativeItems from "./AlternativeItems";
import CustomizationPanel from "./CustomizationPanel";
import { budgetRanges } from "../../utils/recommendationData";
import { getRecommendationsFromML } from "../../utils/mlService";

const RecommendationInterface = ({
  userPreferences = null, // used to store user input wizard data
  initialRecommendations = [], // optional recomendation passed in at page load
  modelInfo = null, // relevent data about the ML model used
}) => {
  const [recommendations, setRecommendations] = useState(
    initialRecommendations
  );
  const [selectedRecommendation, setSelectedRecommendation] = useState(
    initialRecommendations[0] || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with proper default state
  const [filters, setFilters] = useState({
    budgetRange: [0, 550],
    styles: [],
    roomFeatures: [],
    indoorOutdoor: "All",
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  //  Use ref to track if initial load happened
  const initialLoadDone = useRef(false);

  useEffect(() => {
    console.log("RecommendationInterface props:", {
      initialRecommendations,
      modelInfo,
      userPreferences,
    });
  }, []);
  // first step
  //  Load recommendations on mount if none provided
  // check If initialRecommendations is empty AND userPreferences exists
  useEffect(() => {
    if (
      !initialLoadDone.current &&
      initialRecommendations.length === 0 &&
      userPreferences
    ) {
      console.log("🔄 No initial recommendations, loading from ML...");
      initialLoadDone.current = true;
      loadInitialRecommendations();
    } else if (initialRecommendations.length > 0) {
      console.log(
        "✅ Using provided initial recommendations:",
        initialRecommendations.length
      );
      setRecommendations(initialRecommendations);
      setSelectedRecommendation(initialRecommendations[0]);
    }
  }, [userPreferences]); // Only depend on userPreferences

  useEffect(() => {
    if (recommendations.length > 0 && !selectedRecommendation) {
      setSelectedRecommendation(recommendations[0]);
    }
  }, [recommendations, selectedRecommendation]);

  const loadInitialRecommendations = async () => {
    if (!userPreferences) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Loading initial recommendations for:", userPreferences);

      const result = await getRecommendationsFromML(userPreferences, null);

      console.log("📥 Result from ML:", result);

      if (result.success && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
        setSelectedRecommendation(result.recommendations[0]);
        console.log(
          "✅ Initial recommendations loaded:",
          result.recommendations.length
        );
      } else if (result.success && result.recommendations.length === 0) {
        console.warn("⚠️ ML returned 0 recommendations");
        setError("No recommendations found. Try adjusting your preferences.");
      } else {
        setError(result.error);
        if (result.recommendations.length > 0) {
          setRecommendations(result.recommendations);
          setSelectedRecommendation(result.recommendations[0]);
        }
      }
    } catch (err) {
      console.error("❌ Error loading initial recommendations:", err);
      setError("Failed to load recommendations. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlternativeClick = (recommendation) => {
    setSelectedRecommendation(recommendation);

    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  //  Use useCallback with functional update to prevent loops
  const handleFiltersChange = useCallback((updater) => {
    setFilters((prevFilters) => {
      const newFilters =
        typeof updater === "function" ? updater(prevFilters) : updater;

      // Only update if filters actually changed
      if (JSON.stringify(prevFilters) === JSON.stringify(newFilters)) {
        console.log("⏭️ Filters unchanged, skipping update");
        return prevFilters;
      }

      console.log("🎛️ Filters changed:", newFilters);
      return newFilters;
    });
  }, []);

  const handleApplyFilters = async () => {
    if (!userPreferences) {
      console.warn("No user preferences available for filtering");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Applying custom filters:", filters);

      const result = await getRecommendationsFromML(userPreferences, filters);

      if (result.success && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
        setSelectedRecommendation(result.recommendations[0]);
        console.log(
          "✅ Filtered recommendations applied:",
          result.recommendations.length
        );
      } else if (result.success && result.recommendations.length === 0) {
        setError("No recommendations match your filters. Try adjusting them.");
        console.warn("⚠️ Filters removed all recommendations");
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("❌ Error applying filters:", err);
      setError("Failed to apply filters. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    console.log("🔄 Resetting filters to defaults");

    const defaultFilters = {
      budgetRange: [0, 550],
      styles: [],
      roomFeatures: [],
      indoorOutdoor: "All",
    };

    setFilters(defaultFilters);
    setError(null);

    loadInitialRecommendations();
  };

  const handleFeedback = async (recommendationId, feedback) => {
    try {
      console.log("✅ Feedback sent for recommendation:", recommendationId);
    } catch (error) {
      console.error("❌ Failed to send feedback:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Your AI-Powered Recommendations
              </h1>
              <p className="text-gray-600">
                Personalized renovation suggestions based on your preferences
              </p>
            </div>

            {userPreferences && (
              <div className="flex flex-col items-start lg:items-end">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Budget: {userPreferences.budget}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {userPreferences.style}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {userPreferences.roomType}
                  </span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {userPreferences.indoorOutdoor}
                  </span>
                </div>
                <button
                  onClick={() => (window.location.href = "/wizard")}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Change preferences
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error/Status Messages */}
        {error && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong>Notice:</strong> {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && recommendations.length === 0 && (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Generating Your Recommendations
              </h3>
              <p className="text-gray-600">
                Our AI is analyzing your preferences...
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <div className="lg:hidden">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                  Customize Results
                </button>
              </div>

              {selectedRecommendation && (
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                  <MainRecommendation
                    recommendation={selectedRecommendation}
                    onFeedback={handleFeedback}
                  />
                </div>
              )}

              {recommendations.length > 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <AlternativeItems
                    recommendations={recommendations}
                    selectedId={selectedRecommendation?.id}
                    onSelect={handleAlternativeClick}
                  />
                </div>
              )}
            </div>

            <div
              className={`lg:col-span-2 ${
                showMobileFilters ? "block" : "hidden lg:block"
              }`}
            >
              <div className="sticky top-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <CustomizationPanel
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onApplyFilters={handleApplyFilters}
                    onResetFilters={handleResetFilters}
                    isLoading={isLoading}
                    userPreferences={userPreferences}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Recommendations State */}
        {!isLoading && recommendations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 01-8 8 8 8 0 01-8-8 7.962 7.962 0 012-5.291m0 0A7.962 7.962 0 0112 4a7.962 7.962 0 016 2.709M6 6.709V6a2 2 0 012-2h8a2 2 0 012 2v.709"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Recommendations Available
              </h3>
              <p className="text-gray-600 mb-6">
                {error ||
                  "We couldn't generate recommendations with your current preferences."}
              </p>
              <div className="space-y-3">
                <button
                  onClick={loadInitialRecommendations}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = "/wizard")}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Update Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
            <svg
              className="w-4 h-4 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Powered by AI Machine Learning
            {modelInfo && (
              <span className="ml-2 text-gray-400">
                • {recommendations.length} results • {modelInfo.modelType}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationInterface;
