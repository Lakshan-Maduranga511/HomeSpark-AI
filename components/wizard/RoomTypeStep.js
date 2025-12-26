"use client";
import { roomTypes } from "../../utils/wizardData";

const RoomTypeStep = ({ formData, setFormData }) => {
  const handleRoomSelect = (room) => {
    setFormData((prev) => ({ ...prev, roomType: room.value }));
  };

  const getFilteredRoomTypes = () => {
    if (!formData.indoorOutdoor) {
      return roomTypes;
    }
    return roomTypes.filter((room) => {
      return room.type === formData.indoorOutdoor.toLowerCase();
    });
  };

  const filteredRoomTypes = getFilteredRoomTypes();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            🏠 Step 4 of 6
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Which{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {formData.indoorOutdoor?.toLowerCase()}
          </span>{" "}
          Space?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Choose the primary {formData.indoorOutdoor?.toLowerCase()} area you
          want to transform
        </p>

        {/* Selected Preference Badge */}
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-800 rounded-2xl text-sm font-semibold shadow-lg">
          <span className="text-2xl mr-3">
            {formData.indoorOutdoor === "Indoor" ? "🏠" : "🌿"}
          </span>
          <span>{formData.indoorOutdoor} Renovation Selected</span>
        </div>
      </div>

      {/* No rooms available message */}
      {filteredRoomTypes.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-yellow-900 font-semibold text-lg">
              No room types available for {formData.indoorOutdoor} renovation.
            </p>
            <p className="text-yellow-700 mt-2">
              Please go back and select your preference again.
            </p>
          </div>
        </div>
      )}

      {/* Room Type Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {filteredRoomTypes.map((room, index) => (
          <div
            key={room.id}
            onClick={() => handleRoomSelect(room)}
            className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform ${
              formData.roomType === room.value
                ? "scale-110 shadow-2xl"
                : "hover:scale-105 hover:shadow-xl"
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Background with gradient */}
            <div
              className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                formData.roomType === room.value
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                  : "bg-white border-2 border-gray-200 group-hover:border-blue-300 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:bg-gradient-to-br"
              }`}
            ></div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Selected Check */}
              {formData.roomType === room.value && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  formData.roomType === room.value
                    ? "bg-white/20 backdrop-blur-sm scale-110"
                    : `${room.color} group-hover:scale-110`
                }`}
              >
                <span
                  className={`text-4xl ${
                    formData.roomType === room.value
                      ? "filter drop-shadow-lg"
                      : ""
                  }`}
                >
                  {room.icon}
                </span>
              </div>

              {/* Label */}
              <h3
                className={`text-lg font-bold transition-colors ${
                  formData.roomType === room.value
                    ? "text-white"
                    : "text-gray-900 group-hover:text-blue-700"
                }`}
              >
                {room.label}
              </h3>

              {/* Shine effect on hover */}
              <div
                className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                  formData.roomType === room.value
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Information Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-3xl p-8 border-2 border-blue-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {formData.indoorOutdoor} Space Specializations
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                {formData.indoorOutdoor === "Indoor" ? (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  What We Offer
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {formData.indoorOutdoor === "Indoor"
                    ? "We offer renovation solutions for all indoor spaces with climate-controlled materials, smart lighting options, and modern design trends."
                    : "We specialize in outdoor renovations with weather-resistant materials, sustainable landscaping, and outdoor living space designs."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Quality Promise
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Every recommendation is tailored to your selected room type
                  with space-optimized layouts and proven design patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Choices Indicator */}
      {filteredRoomTypes.length > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl">
            <span className="text-2xl mr-3">⭐</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-amber-900">
                Most Popular
              </p>
              <p className="text-xs text-amber-700">
                {formData.indoorOutdoor === "Indoor"
                  ? "Kitchens & Bathrooms"
                  : "Patios & Gardens"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypeStep;
