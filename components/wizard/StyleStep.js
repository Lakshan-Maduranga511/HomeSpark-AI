"use client";
import { designStyles } from "../../utils/wizardData";

const StyleStep = ({ formData, setFormData }) => {
  const handleStyleSelect = (style) => {
    setFormData((prev) => ({ ...prev, style: style.value }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeIn">
        <div className="inline-block mb-4">
          <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            🎨 Step 3 of 6
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          What's Your{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Design Style?
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select the style that best matches your taste and personality. Your
          choice will guide our design recommendations.
        </p>
      </div>

      {/* Style Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {designStyles.map((style, index) => (
          <div
            key={style.id}
            onClick={() => handleStyleSelect(style)}
            className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ${
              formData.style === style.value
                ? "scale-105 shadow-2xl"
                : "hover:scale-105 hover:shadow-2xl"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                formData.style === style.value
                  ? `${style.color} opacity-20`
                  : "from-gray-50 to-gray-100"
              } transition-all duration-500`}
            ></div>

            {/* Card Content */}
            <div
              className={`relative z-10 p-8 border-2 rounded-3xl transition-all duration-300 ${
                formData.style === style.value
                  ? "border-purple-500 bg-white/80 backdrop-blur-sm"
                  : "border-gray-200 bg-white hover:border-purple-300"
              }`}
            >
              {/* Selected Badge */}
              {formData.style === style.value && (
                <div className="absolute -top-0 -right-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <svg
                    className="w-6 h-6 text-white"
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

              <div className="text-center">
                {/* Icon */}
                <div
                  className={`relative w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${
                    formData.style === style.value
                      ? `${style.color} scale-110`
                      : `${style.color} group-hover:scale-110`
                  }`}
                >
                  <span className="text-5xl">{style.icon}</span>

                  {/* Animated Ring */}
                  {formData.style === style.value && (
                    <div className="absolute inset-0 rounded-2xl border-4 border-purple-500 animate-ping"></div>
                  )}
                </div>

                {/* Title */}
                <h3
                  className={`text-2xl md:text-3xl font-bold mb-4 transition-colors ${
                    formData.style === style.value
                      ? "text-purple-700"
                      : "text-gray-900 group-hover:text-purple-600"
                  }`}
                >
                  {style.label}
                </h3>

                {/* Description */}
                <p
                  className={`text-base md:text-lg leading-relaxed transition-colors ${
                    formData.style === style.value
                      ? "text-purple-700"
                      : "text-gray-600 group-hover:text-gray-700"
                  }`}
                >
                  {style.description}
                </p>

                {/* Style Features */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap justify-center gap-2">
                    {style.value === "modern" && (
                      <>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          Minimalist
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          Tech-forward
                        </span>
                      </>
                    )}
                    {style.value === "traditional" && (
                      <>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          Classic
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          Elegant
                        </span>
                      </>
                    )}
                    {style.value === "rustic" && (
                      <>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                          Natural
                        </span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                          Cozy
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div
                className={`absolute inset-0 rounded-3xl transition-all duration-300 pointer-events-none -z-10 ${
                  formData.style === style.value
                    ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                    : "bg-transparent group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-pink-50"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Style Inspiration Section */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-3xl p-8 border-2 border-purple-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Not Sure Which Style Fits You?
          </h3>
          <p className="text-gray-600">
            Here are some quick questions to help you decide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl">✨</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Modern</h4>
            <p className="text-sm text-gray-600">
              Do you love clean lines, open spaces, and the latest tech?
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl">👑</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Traditional</h4>
            <p className="text-sm text-gray-600">
              Do you appreciate timeless elegance and classic furniture?
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl">🌿</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Rustic</h4>
            <p className="text-sm text-gray-600">
              Do you love natural materials and cozy, warm atmospheres?
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Tip */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xl">💡</span>
          </div>
          <div className="ml-4 flex-1">
            <h4 className="text-lg font-bold text-purple-900 mb-2">
              Style Mixing is Okay!
            </h4>
            <p className="text-purple-800">
              Don't worry if you like elements from multiple styles. Many
              beautiful homes blend different design aesthetics. Your choice
              here helps us start with a foundation, and we can always customize
              later!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleStep;
