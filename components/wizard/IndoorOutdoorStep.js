"use client";

const IndoorOutdoorStep = ({ formData, setFormData }) => {
  const handlePreferenceSelect = (preference) => {
    setFormData((prev) => ({
      ...prev,
      indoorOutdoor: preference.value,
      roomType: "",
    }));
  };

  const preferences = [
    {
      id: "indoor",
      value: "Indoor",
      label: "Indoor Renovation",
      description:
        "Transform interior spaces like kitchens, bathrooms, bedrooms, and living areas",
      icon: "🏠",
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      examples: [
        "Kitchen",
        "Bathroom",
        "Bedroom",
        "Living Room",
        "Dining Room",
      ],
    },
    {
      id: "outdoor",
      value: "Outdoor",
      label: "Outdoor Renovation",
      description:
        "Enhance exterior spaces like patios, gardens, and outdoor living areas",
      icon: "🌿",
      color: "from-green-500 to-emerald-600",
      hoverColor: "from-green-600 to-emerald-700",
      examples: ["Patio", "Garden"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 animate-fadeIn">
        <div className="inline-block mb-4">
          <span className="bg-gradient-to-r from-blue-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
            🚀 Step 1 of 6 - Let's Begin!
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          What Type of Space Do You Want to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Renovate?
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Let's start by understanding whether you're planning an indoor or
          outdoor renovation project
        </p>
      </div>

      {/* Preference Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {preferences.map((preference, index) => (
          <div
            key={preference.id}
            onClick={() => handlePreferenceSelect(preference)}
            className={`group relative rounded-3xl cursor-pointer transition-all duration-500 transform ${
              formData.indoorOutdoor === preference.value
                ? "scale-105 shadow-2xl"
                : "hover:scale-105 hover:shadow-2xl"
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Card Container with Overflow Hidden */}
            <div className="relative overflow-hidden rounded-3xl min-h-[560px] flex">
              {/* Animated Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  formData.indoorOutdoor === preference.value
                    ? preference.hoverColor
                    : preference.color
                } transition-all duration-500`}
              >
                <div className="absolute inset-0 bg-black/5"></div>
              </div>

              {/* Decorative Glow Elements - Properly Positioned */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
              </div>

              {/* Content */}
              <div className="relative p-10 border-2 rounded-3xl transition-all duration-300 backdrop-blur-sm bg-white/10 border-white/30 flex flex-col justify-between w-full">
                {/* Selection Badge */}
                {formData.indoorOutdoor === preference.value && (
                  <div
                    className="absolute -top-1 -right-1 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce"
                    style={{
                      boxShadow:
                        "0 10px 20px rgba(0, 0, 0, 0.5), 0 5px 10px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-purple-600"
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

                <div className="text-center text-white">
                  {/* Icon with animated ring */}
                  <div className="relative inline-block mb-8">
                    <div
                      className={`w-28 h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto shadow-2xl transition-all duration-300 ${
                        formData.indoorOutdoor === preference.value
                          ? "scale-110"
                          : "group-hover:scale-110"
                      }`}
                    >
                      <span className="text-6xl">{preference.icon}</span>
                    </div>

                    {/* Animated rings */}
                    {formData.indoorOutdoor === preference.value && (
                      <>
                        <div className="absolute inset-0 rounded-3xl border-4 border-white/50 animate-ping"></div>
                        <div
                          className="absolute inset-0 rounded-3xl border-4 border-white/30"
                          style={{
                            animation:
                              "ping 2s cubic-bezier(0, 0, 0.2, 1) 0.5s infinite",
                          }}
                        ></div>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                    {preference.label}
                  </h3>

                  {/* Description */}
                  <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/90">
                    {preference.description}
                  </p>

                  {/* Examples */}
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                    <h4 className="text-sm font-bold uppercase tracking-wide mb-4 text-white/90">
                      Popular Options:
                    </h4>
                    <div
                      className={`${
                        preference.value === "Outdoor"
                          ? "flex flex-col items-center gap-4"
                          : "flex flex-wrap justify-center gap-3"
                      }`}
                    >
                      {preference.examples.map((example, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-white/30 backdrop-blur-sm text-white font-medium text-sm rounded-full border border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {formData.indoorOutdoor === preference.value && (
                    <div className="mt-6 flex items-center justify-center">
                      <div className="px-6 py-3 bg-white/30 backdrop-blur-md rounded-full border-2 border-white/50 shadow-xl">
                        <div className="flex items-center text-white font-bold">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Selected</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Information Panel */}
      <div className="bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 rounded-3xl p-8 md:p-10 border-2 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
            <svg
              className="w-7 h-7 text-white"
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
          <div className="ml-6 flex-1">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">
              Why Do We Ask This?
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <p className="text-gray-700">
                  Customize room types specific to indoor or outdoor spaces
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <p className="text-gray-700">
                  Recommend appropriate materials for your environment
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <p className="text-gray-700">
                  Suggest design options that work best for your space type
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <p className="text-gray-700">
                  Provide accurate climate and weather considerations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { number: "5K+", label: "Indoor Projects", icon: "🏠" },
          { number: "3K+", label: "Outdoor Projects", icon: "🌿" },
          { number: "98%", label: "Satisfaction", icon: "⭐" },
          { number: "24/7", label: "Support", icon: "💬" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.number}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndoorOutdoorStep;
