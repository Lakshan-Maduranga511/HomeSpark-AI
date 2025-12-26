// components/recommendations/MainRecommendation.js
"use client";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "../auth/AuthModal";

const MainRecommendation = ({ recommendation, onFeedback }) => {
  const { isAuthenticated, saveRecommendation } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      saveRecommendation(recommendation);
      setSaveMessage("✓ Saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage(`✗ ${error.message}`);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  //  function to get badge color based on match quality
  const getMatchBadgeStyle = (quality) => {
    const styles = {
      Perfect: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      Excellent: "bg-green-100 text-green-800 border border-green-200",
      Good: "bg-blue-100 text-blue-800 border border-blue-200",
      Fair: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      Basic: "bg-gray-100 text-gray-800 border border-gray-200",
    };
    return styles[quality] || styles.Good;
  };

  //  Get match quality word (fallback to percentage if not available)
  const matchDisplay =
    recommendation.match_quality ||
    (recommendation.matchPercentage
      ? `${recommendation.matchPercentage}% Match`
      : "Good Match");

  return (
    <>
      <div className="space-y-6">
        {/* Header with Save Button */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-3 mb-2">
              {/* ✨ NEW: Best Match Badge (Star Icon) */}
              {recommendation.is_best_match && (
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center shadow-lg">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Best Match
                </span>
              )}

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {recommendation.name}
              </h2>

              {/*  Word-based match quality badge */}
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getMatchBadgeStyle(
                  recommendation.match_quality
                )}`}
              >
                {matchDisplay}
              </span>
            </div>
            <p className="text-gray-600">{recommendation.explanation}</p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ml-4 flex-shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span>Save</span>
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`p-3 rounded-lg text-sm ${
              saveMessage.includes("✓")
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {saveMessage}
          </div>
        )}

        {/* Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={recommendation.image}
            alt={recommendation.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Price</p>
            <p className="text-xl font-bold text-gray-900">
              ${recommendation.price}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Timeline</p>
            <p className="text-xl font-bold text-gray-900">
              {recommendation.timeline}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">ROI</p>
            <p className="text-xl font-bold text-gray-900">
              {recommendation.roi}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Style</p>
            <p className="text-xl font-bold text-gray-900">
              {recommendation.style}
            </p>
          </div>
        </div>

        {/* Features */}
        {recommendation.features && recommendation.features.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Key Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendation.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cost Breakdown */}
        {recommendation.attributes && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Cost Breakdown
            </h3>
            <div className="space-y-2">
              {Object.entries(recommendation.attributes).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{value.item}</span>
                  <span className="font-semibold text-gray-900">
                    ${value.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="register"
      />
    </>
  );
};

export default MainRecommendation;
