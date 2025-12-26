// components/recommendations/AlternativeItems.js
"use client";
import React from "react";

const AlternativeItems = ({ recommendations, selectedId, onSelect }) => {
  //   function for match quality badge styling
  const getMatchBadgeStyle = (quality) => {
    const styles = {
      Perfect: "bg-emerald-100 text-emerald-700 border border-emerald-300",
      Excellent: "bg-green-100 text-green-700 border border-green-300",
      Good: "bg-blue-100 text-blue-700 border border-blue-300",
      Fair: "bg-yellow-100 text-yellow-700 border border-yellow-300",
      Basic: "bg-gray-100 text-gray-700 border border-gray-300",
    };
    return styles[quality] || styles.Good;
  };

  // Filter out the currently selected recommendation
  const alternativeRecs = recommendations.filter(
    (rec) => rec.id !== selectedId
  );

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Alternative Options{" "}
        {alternativeRecs.length > 0 && `(${alternativeRecs.length})`}
      </h3>

      {alternativeRecs.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p>No alternative recommendations available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternativeRecs.map((rec) => {
            //  Get match display (word or percentage fallback)
            const matchDisplay =
              rec.match_quality ||
              (rec.matchPercentage ? `${rec.matchPercentage}%` : "Good");

            return (
              <div
                key={rec.id}
                onClick={() => onSelect(rec)}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image with Quality Badge */}
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/*  Quality Badge Overlay */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${getMatchBadgeStyle(
                        rec.match_quality
                      )}`}
                    >
                      {matchDisplay}
                    </span>
                  </div>

                  {/*  Rank Label (Alternative 1, 2, etc.) */}
                  {rec.rank_label && rec.rank_label !== "Best Match" && (
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {rec.rank_label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {rec.name}
                </h4>

                {/* Price & Style Grid */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Price</span>
                    <span className="font-semibold text-gray-900">
                      ${rec.price}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Style</span>
                    <span className="font-medium text-gray-900">
                      {rec.style}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Timeline</span>
                    <span className="font-medium text-gray-900">
                      {rec.timeline}
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <button className="mt-2 w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 group-hover:shadow-md">
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlternativeItems;
