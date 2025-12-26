// pages/recommendations/page.js
"use client";
import React, { useState, useEffect } from "react";
import RecommendationInterface from "../../../components/recommendations/RecommendationInterface";
import { getRecommendationsFromML } from "../../../utils/mlService";
import Header from "../../../components/Header";

const RecommendationsPage = () => {
  const [userPreferences, setUserPreferences] = useState(null);
  const [initialRecommendations, setInitialRecommendations] = useState([]);
  const [modelInfo, setModelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserPreferencesAndRecommendations();
  }, []);

  const loadUserPreferencesAndRecommendations = async () => {
    try {
      // Load user preferences from localStorage (saved by wizard)
      const savedPreferences = localStorage.getItem("renovationPreferences");
      const timestamp = localStorage.getItem("renovationPreferencesTimestamp");

      if (!savedPreferences) {
        // Redirect to wizard if no preferences found
        window.location.href = "/wizard";
        return;
      }

      const preferences = JSON.parse(savedPreferences);

      // Check if preferences are stale (older than 1 hour)
      const isStale =
        timestamp && Date.now() - parseInt(timestamp) > 60 * 60 * 1000;

      if (isStale) {
        console.log("Preferences are stale, redirecting to wizard");
        localStorage.removeItem("renovationPreferences");
        localStorage.removeItem("renovationPreferencesTimestamp");
        window.location.href = "/wizard";
        return;
      }

      console.log("✅ Loaded user preferences:", preferences);
      setUserPreferences(preferences);

      
      // Get initial recommendations from ML model
      const result = await getRecommendationsFromML(preferences);
      console.log("🎯 Final Recommendation Result:", result);

      if (result.success) {
        setInitialRecommendations(result.recommendations);
        setModelInfo(result.modelInfo);
        console.log("✅ Initial recommendations loaded");
        // In the page context (put this in the console), if you can access the component state:
        console.log(
          "Initial recommendations from page:",
          window.__INITIAL_RECS__ || null
        );
      } else {
        setError(result.error);
        // Still show fallback recommendations
        if (result.recommendations.length > 0) {
          setInitialRecommendations(result.recommendations);
          setModelInfo(result.modelInfo);
        }
      }
    } catch (err) {
      console.error("❌ Error loading preferences/recommendations:", err);
      setError("Failed to load your preferences. Please try the wizard again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Your Recommendations
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We&apos;re analyzing your preferences and generating personalized
            renovation suggestions...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !userPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/wizard")}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main recommendation interface
  return (
    <>
      <Header />

      <RecommendationInterface
        userPreferences={userPreferences}
        initialRecommendations={initialRecommendations}
        modelInfo={modelInfo}
      />
    </>
  );
};

export default RecommendationsPage;
