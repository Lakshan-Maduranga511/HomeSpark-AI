"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  styleOptions,
  budgetRanges,
  indoorOutdoorOptions,
} from "../../utils/recommendationData";

const CustomizationPanel = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  isLoading,
  userPreferences = null,
}) => {
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  //  Room type options based on indoor/outdoor selection
  const roomTypeOptions = useMemo(() => {
    const rooms = {
      Indoor: [
        { value: "living-room", label: "Living Room", icon: "🛋️" },
        { value: "bedroom", label: "Bedroom", icon: "🛏️" },
        { value: "kitchen", label: "Kitchen", icon: "🍳" },
        { value: "bathroom", label: "Bathroom", icon: "🚿" },
        { value: "dining-room", label: "Dining Room", icon: "🍽️" },
      ],
      Outdoor: [
        { value: "patio", label: "Patio", icon: "🪴" },
        { value: "garden", label: "Garden", icon: "🌳" },
      ],
      All: [
        { value: "living-room", label: "Living Room", icon: "🛋️" },
        { value: "bedroom", label: "Bedroom", icon: "🛏️" },
        { value: "kitchen", label: "Kitchen", icon: "🍳" },
        { value: "bathroom", label: "Bathroom", icon: "🚿" },
        { value: "dining-room", label: "Dining Room", icon: "🍽️" },
        { value: "patio", label: "Patio", icon: "🪴" },
        { value: "garden", label: "Garden", icon: "🌳" },
      ],
    };

    return rooms[filters.indoorOutdoor] || rooms.All;
  }, [filters.indoorOutdoor]);

  //  Validation: Check if all required fields are filled
  const isFormValid = useMemo(() => {
    const hasValidBudget =
      filters.budgetRange[0] >= 0 &&
      filters.budgetRange[1] > filters.budgetRange[0];
    const hasStyle = filters.styles && filters.styles.length > 0;
    const hasIndoorOutdoor =
      filters.indoorOutdoor && filters.indoorOutdoor !== "";
    const hasRoomType = filters.roomFeatures && filters.roomFeatures.length > 0;

    return hasValidBudget && hasStyle && hasIndoorOutdoor && hasRoomType;
  }, [filters]);

  //  Get validation message
  const getValidationMessage = () => {
    if (!filters.styles || filters.styles.length === 0) {
      return "Please select at least one style";
    }
    if (!filters.indoorOutdoor || filters.indoorOutdoor === "") {
      return "Please select Indoor or Outdoor";
    }
    if (!filters.roomFeatures || filters.roomFeatures.length === 0) {
      return "Please select at least one room type";
    }
    if (filters.budgetRange[0] >= filters.budgetRange[1]) {
      return "Maximum budget must be greater than minimum";
    }
    return "";
  };

  const handleBudgetChange = useCallback(
    (value, index) => {
      const newValue = parseInt(value);
      setHasInteracted(true);
      onFiltersChange((prevFilters) => {
        if (prevFilters.budgetRange[index] === newValue) {
          return prevFilters;
        }

        const newRange = [...prevFilters.budgetRange];
        newRange[index] = newValue;
        return { ...prevFilters, budgetRange: newRange };
      });
    },
    [onFiltersChange]
  );

  const handleStyleChange = useCallback(
    (style) => {
      setHasInteracted(true);
      onFiltersChange((prevFilters) => {
        const newStyles = prevFilters.styles.includes(style)
          ? prevFilters.styles.filter((s) => s !== style)
          : [...prevFilters.styles, style];

        if (
          JSON.stringify(prevFilters.styles.sort()) ===
          JSON.stringify(newStyles.sort())
        ) {
          return prevFilters;
        }

        return { ...prevFilters, styles: newStyles };
      });
    },
    [onFiltersChange]
  );

  const handleIndoorOutdoorChange = useCallback(
    (value) => {
      setHasInteracted(true);
      onFiltersChange((prevFilters) => {
        if (prevFilters.indoorOutdoor === value) {
          return prevFilters;
        }

        // Clear room selections when changing indoor/outdoor
        return {
          ...prevFilters,
          indoorOutdoor: value,
          roomFeatures: [], // Reset room types
        };
      });
    },
    [onFiltersChange]
  );

  //   Handle room type selection
  const handleRoomTypeChange = useCallback(
    (roomValue) => {
      setHasInteracted(true);
      onFiltersChange((prevFilters) => {
        const currentRooms = prevFilters.roomFeatures || [];
        const newRooms = currentRooms.includes(roomValue)
          ? currentRooms.filter((r) => r !== roomValue)
          : [...currentRooms, roomValue];

        if (
          JSON.stringify(currentRooms.sort()) ===
          JSON.stringify(newRooms.sort())
        ) {
          return prevFilters;
        }

        return { ...prevFilters, roomFeatures: newRooms };
      });
    },
    [onFiltersChange]
  );

  // Enhanced apply filters with validation and notification
  const handleApplyFiltersWithValidation = useCallback(async () => {
    if (!isFormValid) {
      return; // Button is disabled anyway
    }

    try {
      await onApplyFilters();

      // Show success notification
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 4000);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  }, [isFormValid, onApplyFilters]);

  const presets = useMemo(
    () => [
      {
        name: "Budget Friendly",
        desc: "Under $200",
        action: () =>
          onFiltersChange((prev) => ({ ...prev, budgetRange: [0, 200] })),
      },
      {
        name: "Mid Range",
        desc: "$200 - $400",
        action: () =>
          onFiltersChange((prev) => ({ ...prev, budgetRange: [200, 400] })),
      },
      {
        name: "Premium",
        desc: "Above $400",
        action: () =>
          onFiltersChange((prev) => ({ ...prev, budgetRange: [400, 550] })),
      },
    ],
    [onFiltersChange]
  );

  return (
    <div className="h-full bg-gray-50 relative">
      {/*  Success Notification */}
      {showSuccessNotification && (
        <div className="fixed right-4 z-50 animate-slide-in-right top-20 md:top-24 lg:top-28">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold">Filters Applied Successfully!</p>
              <p className="text-sm text-green-100">
                New recommendations loaded
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 bg-gray-50 p-6 border-b border-gray-200 z-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Customize Your Results
        </h3>
        <p className="text-sm text-gray-600">
          Adjust filters to refine your recommendations
        </p>

        {userPreferences && (
          <div className="mt-3 flex flex-wrap gap-1 text-xs">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {userPreferences.indoorOutdoor}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {userPreferences.roomType}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {userPreferences.climateType} Climate
            </span>
          </div>
        )}
      </div>

      <div
        className="p-6 space-y-8 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 350px)" }}
      >
        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Budget Range <span className="text-red-500">*</span>
          </label>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Minimum Budget
              </label>
              <input
                type="range"
                min={budgetRanges.min}
                max={budgetRanges.max}
                step={budgetRanges.step}
                value={filters.budgetRange[0]}
                onChange={(e) => handleBudgetChange(e.target.value, 0)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Maximum Budget
              </label>
              <input
                type="range"
                min={budgetRanges.min}
                max={budgetRanges.max}
                step={budgetRanges.step}
                value={filters.budgetRange[1]}
                onChange={(e) => handleBudgetChange(e.target.value, 1)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
              />
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <div className="text-center">
                <p className="text-xs text-gray-500">Min</p>
                <p className="font-semibold text-gray-900">
                  ${filters.budgetRange[0].toLocaleString()}
                </p>
              </div>
              <div className="text-gray-400">—</div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Max</p>
                <p className="font-semibold text-gray-900">
                  ${filters.budgetRange[1].toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Style Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Style Preferences <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {styleOptions.map((style) => (
              <label
                key={style}
                className="flex items-center p-3 hover:bg-white rounded-lg transition-colors cursor-pointer border border-gray-200"
              >
                <input
                  type="checkbox"
                  checked={filters.styles.includes(style)}
                  onChange={() => handleStyleChange(style)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-700 select-none font-medium">
                  {style}
                </span>
                {filters.styles.includes(style) && (
                  <span className="ml-auto text-blue-600">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Indoor/Outdoor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Space Type <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {indoorOutdoorOptions.map((option) => (
              <label
                key={option}
                className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              >
                <input
                  type="radio"
                  name="indoorOutdoor"
                  checked={filters.indoorOutdoor === option}
                  onChange={() => handleIndoorOutdoorChange(option)}
                  className="text-blue-600 focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-700 select-none font-medium">
                  {option}
                </span>
                {filters.indoorOutdoor === option && (
                  <span className="ml-auto text-blue-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/*  Room Type Selection (Conditional) */}
        {filters.indoorOutdoor && filters.indoorOutdoor !== "All" && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Room Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {roomTypeOptions.map((room) => (
                <label
                  key={room.value}
                  className="flex items-center p-3 hover:bg-white rounded-lg transition-colors cursor-pointer border border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={(filters.roomFeatures || []).includes(room.value)}
                    onChange={() => handleRoomTypeChange(room.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <span className="text-xl mr-2">{room.icon}</span>
                  <span className="text-sm text-gray-700 select-none font-medium">
                    {room.label}
                  </span>
                  {(filters.roomFeatures || []).includes(room.value) && (
                    <span className="ml-auto text-blue-600">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* Helper text */}
            <p className="mt-2 text-xs text-gray-500">
              Select one or more room types for{" "}
              {filters.indoorOutdoor.toLowerCase()} spaces
            </p>
          </div>
        )}

        {/* Climate Context Info */}
        {userPreferences && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Climate Optimization
            </label>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">
                  {userPreferences.climateType === "Cold" && "❄️"}
                  {userPreferences.climateType === "Humid" && "💧"}
                  {userPreferences.climateType === "Dry" && "☀️"}
                </span>
                <span className="font-medium text-gray-900">
                  {userPreferences.climateType} Climate
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Recommendations optimized for{" "}
                {userPreferences.climateType?.toLowerCase()} conditions
              </p>
            </div>
          </div>
        )}

        {/* Quick Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Quick Presets
          </label>
          <div className="grid grid-cols-1 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={preset.action}
                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">
                  {preset.name}
                </p>
                <p className="text-xs text-gray-500">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons - Sticky Bottom */}
      <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 space-y-3">
        {/*  Validation Warning */}
        {!isFormValid && hasInteracted && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <div className="flex">
              <svg
                className="h-5 w-5 text-yellow-400 mr-2"
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
                {getValidationMessage()}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleApplyFiltersWithValidation}
          disabled={isLoading || !isFormValid}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
            isFormValid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Applying Filters...
            </>
          ) : (
            <>
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Apply Filters
            </>
          )}
        </button>

        <button
          onClick={onResetFilters}
          className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Reset All
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .slider-thumb-blue::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb-blue::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: none;
        }
      `}</style>
    </div>
  );
};

export default CustomizationPanel;
