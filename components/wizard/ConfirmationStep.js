"use client";
import { budgetRanges, designStyles, roomTypes } from "../../utils/wizardData";

const ConfirmationStep = ({ formData, onSubmit, isSubmitting, onEditStep }) => {
  const handleEdit = (stepNumber) => {
    onEditStep(stepNumber);
  };

  const getBudgetLabel = (value) => {
    return budgetRanges.find((b) => b.value === value)?.label || value;
  };

  const getStyleLabel = (value) => {
    return designStyles.find((s) => s.value === value)?.label || value;
  };

  const getRoomLabel = (value) => {
    return roomTypes.find((r) => r.value === value)?.label || value;
  };

  const getStyleIcon = (value) => {
    return designStyles.find((s) => s.value === value)?.icon || "🏠";
  };

  const getRoomIcon = (value) => {
    return roomTypes.find((r) => r.value === value)?.icon || "🏠";
  };

  const getClimateIcon = (climateType) => {
    switch (climateType) {
      case "Cold":
        return "❄️";
      case "Humid":
        return "💧";
      case "Dry":
        return "☀️";
      default:
        return "🌤️";
    }
  };

  const preferences = [
    {
      step: 1,
      icon: formData.indoorOutdoor === "Indoor" ? "🏠" : "🌿",
      gradient: "from-indigo-500 to-purple-600",
      title: "Space Type",
      value: `${formData.indoorOutdoor} Renovation`,
    },
    {
      step: 2,
      icon: "💰",
      gradient: "from-green-500 to-emerald-600",
      title: "Budget Range",
      value: getBudgetLabel(formData.budget),
    },
    {
      step: 3,
      icon: getStyleIcon(formData.style),
      gradient: "from-purple-500 to-pink-600",
      title: "Design Style",
      value: getStyleLabel(formData.style),
    },
    {
      step: 4,
      icon: getRoomIcon(formData.roomType),
      gradient: "from-blue-500 to-cyan-600",
      title: "Room Type",
      value: getRoomLabel(formData.roomType),
    },
    {
      step: 5,
      icon: "📍",
      gradient: "from-red-500 to-orange-600",
      title: "Location",
      value: formData.location,
      subtitle: formData.climateType
        ? `${getClimateIcon(formData.climateType)} Climate: ${
            formData.climateType
          }`
        : null,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
            ✅ Final Step - Review & Confirm
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Review Your{" "}
          <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Renovation Preferences
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Please confirm your renovation details before we create your
          personalized plan
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden mb-8">
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
              Your Renovation Summary
            </h3>
            <p className="text-white/90 text-center">
              Everything looks perfect? Let's create your custom plan!
            </p>
          </div>
        </div>

        {/* Preferences List */}
        <div className="p-8 space-y-4">
          {preferences.map((pref, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${pref.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-2xl">{pref.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 ml-5">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">
                    {pref.title}
                  </h4>
                  <p className="text-gray-700 font-medium">{pref.value}</p>
                  {pref.subtitle && (
                    <p className="text-sm text-gray-500 mt-1">
                      {pref.subtitle}
                    </p>
                  )}
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(pref.step)}
                  className="flex-shrink-0 ml-4 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 flex items-center font-semibold border-2 border-transparent hover:border-blue-300"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828H9V13z"
                    />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 space-y-6">
          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:from-green-600 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl relative overflow-hidden group"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                  <span className="text-lg">Creating Your Perfect Plan...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl mr-3">🚀</span>
                  <span className="text-lg">Create My Renovation Plan</span>
                </>
              )}
            </span>
          </button>

          {/* Privacy Notice */}
          <p className="text-sm text-gray-600 text-center flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            By proceeding, you agree to receive personalized renovation
            recommendations
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 text-center">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">⚡</span>
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Instant Results</h4>
          <p className="text-sm text-gray-700">
            Get your personalized plan in seconds
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 text-center">
          <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">🎯</span>
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Tailored to You</h4>
          <p className="text-sm text-gray-700">
            100% customized to your preferences
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 text-center">
          <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">💎</span>
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Expert Quality</h4>
          <p className="text-sm text-gray-700">
            Professional design recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
