// hooks/useRecommendations.js
// Custom hook for ML model integration

import { useState, useEffect } from "react";
import { sampleRecommendations } from "@/utils/recommendationData";

export const useRecommendations = (userPreferences, filters) => {
  const [recommendations, setRecommendations] = useState(sampleRecommendations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recommendations from  ML model
  const fetchRecommendations = async (preferences, appliedFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      
      const response = await fetch("/api/ml-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPreferences: preferences,
          filters: appliedFilters,
          
          modelType: "ensemble", //  'supervised', 'unsupervised'
          maxResults: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

     

      setRecommendations(data.recommendations || sampleRecommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.message);
      // Fallback to sample data on error
      setRecommendations(sampleRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter recommendations locally 
  const filterRecommendationsLocally = (recs, appliedFilters) => {
    return recs.filter((rec) => {
      // Budget filter
      const inBudgetRange =
        rec.price >= appliedFilters.budgetRange[0] &&
        rec.price <= appliedFilters.budgetRange[1];

      // Style filter
      const matchesStyle =
        appliedFilters.styles.length === 0 ||
        appliedFilters.styles.includes(rec.style);

      // Feature filter
      const hasRequiredFeatures =
        appliedFilters.roomFeatures.length === 0 ||
        appliedFilters.roomFeatures.some((feature) =>
          rec.features?.includes(feature)
        );

      return inBudgetRange && matchesStyle && hasRequiredFeatures;
    });
  };

  return {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    filterRecommendationsLocally,
  };
};
