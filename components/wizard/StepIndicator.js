"use client";

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="mb-16">
      <div className="max-w-5xl mx-auto">
        {/* Mobile Progress Bar */}
        <div className="md:hidden mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {Math.round((currentStep / steps.length) * 100)}%
            </span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Desktop Step Indicators */}
        <div className="hidden md:flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-700 ease-out rounded-full shadow-lg"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            >
              {/* Animated glow */}
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>

          {/* Step Circles */}
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
                style={{ width: `${100 / steps.length}%` }}
              >
                {/* Circle */}
                <div className="relative">
                  {/* Outer ring for current step */}
                  {isCurrent && (
                    <div className="absolute inset-0 w-16 h-16 -m-3 border-4 border-blue-300 rounded-full animate-ping"></div>
                  )}

                  {/* Main circle */}
                  <div
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 transform ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl scale-110"
                        : isCurrent
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl scale-125 animate-pulse"
                        : "bg-white text-gray-400 border-2 border-gray-300 shadow-md"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-lg">{step.id}</span>
                    )}
                  </div>

                  {/* Sparkle effect for completed steps */}
                  {isCompleted && (
                    <div className="absolute inset-0 w-12 h-12">
                      <span className="absolute -top-1 -right-1 text-yellow-400 text-xs animate-bounce">
                        ✨
                      </span>
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-4 text-center max-w-32">
                  <p
                    className={`text-sm font-bold mb-1 transition-colors duration-300 ${
                      isCompleted
                        ? "text-green-600"
                        : isCurrent
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      isCurrent ? "text-gray-700 font-medium" : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Status Badge */}
                {isCurrent && (
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full animate-pulse">
                      In Progress
                    </span>
                  </div>
                )}
                {isCompleted && (
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      ✓ Complete
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step Info Card (Mobile) */}
        {steps[currentStep - 1] && (
          <div className="md:hidden mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white/80">
                Current Step
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                {currentStep}/{steps.length}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-white/90">
              {steps[currentStep - 1].description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepIndicator;
