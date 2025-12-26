"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";

// Helper Component for Success Notification
const SuccessNotification = () => (
  <>
    {/* Defined animation locally to ensure it works */}
    <style jsx>{`
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `}</style>
    <div
      className="fixed top-24 right-4 z-50 shadow-2xl rounded-lg overflow-hidden"
      style={{ animation: "slideIn 0.5s ease-out forwards" }}
    >
      <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-6 py-4 flex items-center shadow-md">
        <svg
          className="w-6 h-6 text-green-600 mr-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <div>
          <p className="font-bold text-green-900">Success</p>
          <p className="text-sm text-green-700">Item removed successfully.</p>
        </div>
      </div>
    </div>
  </>
);

// Helper Component for Delete Confirmation Modal
const DeleteConfirmationModal = ({ savedId, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Remove Saved Design?
          </h3>
          <p className="text-gray-600">
            Are you sure you want to remove this recommendation from your saved
            designs? This action cannot be undone.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-base flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(savedId)}
            className="flex-1 px-4 py-3 bg-red-600 !text-white rounded-lg font-medium hover:bg-red-700 transition text-base flex items-center justify-center"
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const SavedRecommendationsPage = () => {
  const {
    isAuthenticated,
    getSavedRecommendations,
    removeSavedRecommendation,
    loading,
  } = useAuth();
  const [savedItems, setSavedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const router = useRouter();

  // Load saved items and handle redirection
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/");
        return;
      }

      setSavedItems(getSavedRecommendations());
    }
  }, [isAuthenticated, loading, router, getSavedRecommendations]);

  // Use useCallback to memoize handleRemove (good practice for function stability)
  const handleRemove = useCallback(
    (savedId) => {
      removeSavedRecommendation(savedId);
      // Re-fetch saved items after removal
      setSavedItems(getSavedRecommendations());

      setShowDeleteConfirm(null);

      // If the removed item was the one currently in detail view, close the detail view
      if (selectedItem?.savedId === savedId) {
        setSelectedItem(null);
      }

      // Show success notification
      setShowSuccessNotification(true);
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
    },
    [removeSavedRecommendation, getSavedRecommendations, selectedItem]
  );

  const getMatchBadgeStyle = (quality) => {
    const styles = {
      Perfect: "bg-emerald-100 text-emerald-800",
      Excellent: "bg-green-100 text-green-800",
      Good: "bg-blue-100 text-blue-800",
      Fair: "bg-yellow-100 text-yellow-800",
      Basic: "bg-gray-100 text-gray-800",
    };
    return styles[quality] || styles.Good;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Detail View
  if (selectedItem) {
    const matchDisplay =
      selectedItem.match_quality ||
      (selectedItem.matchPercentage
        ? `${selectedItem.matchPercentage}%`
        : "Good");

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Saved Designs
          </button>

          {/* Detail Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {selectedItem.name}
                    </h1>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${getMatchBadgeStyle(
                        selectedItem.match_quality
                      )}`}
                    >
                      {matchDisplay}
                    </span>
                  </div>
                  <p className="text-gray-600">{selectedItem.explanation}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Saved on{" "}
                    {new Date(selectedItem.savedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-96">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Grid */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${selectedItem.price}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Timeline</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedItem.timeline}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ROI</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedItem.roi}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Style</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedItem.style}
                  </p>
                </div>
              </div>

              {/* Features */}
              {selectedItem.features && selectedItem.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedItem.features.map((feature, index) => (
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
              {selectedItem.attributes && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Cost Breakdown
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(selectedItem.attributes).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-gray-700">{value.item}</span>
                          <span className="font-semibold text-gray-900">
                            ${value.price}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(selectedItem.savedId)}
                  className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 transition duration-300 font-medium"
                >
                  Remove from Saved
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal and Notification rendered at the end of the Detail View */}
        {showDeleteConfirm && (
          <DeleteConfirmationModal
            savedId={showDeleteConfirm}
            onConfirm={handleRemove}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        )}
        {showSuccessNotification && <SuccessNotification />}
      </div>
    );
  }

  // Grid View
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Saved Designs
          </h1>
          <p className="text-gray-600">
            Your collection of favorite renovation recommendations (
            {savedItems.length} {savedItems.length === 1 ? "item" : "items"})
          </p>
        </div>

        {savedItems.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Saved Recommendations Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring and save your favorite designs!
            </p>
            <button
              onClick={() => router.push("/wizard")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
            >
              Get Recommendations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map((item) => {
              const matchDisplay =
                item.match_quality ||
                (item.matchPercentage ? `${item.matchPercentage}%` : "Good");

              return (
                <div
                  key={item.savedId}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchBadgeStyle(
                          item.match_quality
                        )}`}
                      >
                        {matchDisplay}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {item.name}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-semibold text-gray-900">
                          ${item.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Style</p>
                        <p className="font-semibold text-gray-900">
                          {item.style}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.explanation}
                    </p>

                    <div className="text-xs text-gray-500 mb-4">
                      Saved on {new Date(item.savedAt).toLocaleDateString()}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowDeleteConfirm(item.savedId)}
                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition duration-300 font-medium"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal and Notification rendered at the end of the Grid View */}
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          savedId={showDeleteConfirm}
          onConfirm={handleRemove}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
      {showSuccessNotification && <SuccessNotification />}
    </div>
  );
};

export default SavedRecommendationsPage;
