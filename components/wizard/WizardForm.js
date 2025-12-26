"use client";
import { useState } from "react";
import { steps } from "../../utils/wizardData";
import StepIndicator from "./StepIndicator";
import IndoorOutdoorStep from "./IndoorOutdoorStep";
import BudgetStep from "./BudgetStep";
import StyleStep from "./StyleStep";
import RoomTypeStep from "./RoomTypeStep";
import LocationStep from "./LocationStep";
import ConfirmationStep from "./ConfirmationStep";

const WizardForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    indoorOutdoor: "",
    budget: "",
    style: "",
    roomType: "",
    location: "",
    climateType: "",
    climateSource: "",
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setIsEditMode(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      setCurrentStep(stepNumber);
      setIsEditMode(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleEditStep = (stepNumber) => {
    goToStep(stepNumber);
  };

  const handleNextClick = () => {
    if (isEditMode && currentStep < steps.length) {
      setCurrentStep(steps.length);
      setIsEditMode(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      nextStep();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.indoorOutdoor !== "";
      case 2:
        return formData.budget !== "";
      case 3:
        return formData.style !== "";
      case 4:
        return formData.roomType !== "";
      case 5:
        return formData.location !== "" && formData.location.trim().length > 0;
      case 6:
        return true;
      default:
        s;
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      localStorage.setItem("renovationPreferences", JSON.stringify(formData));
      localStorage.setItem(
        "renovationPreferencesTimestamp",
        Date.now().toString()
      );
      window.location.href = "/recommendations";
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IndoorOutdoorStep formData={formData} setFormData={setFormData} />
        );
      case 2:
        return <BudgetStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <StyleStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <RoomTypeStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <LocationStep formData={formData} setFormData={setFormData} />;
      case 6:
        return (
          <ConfirmationStep
            formData={formData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onEditStep={handleEditStep}
          />
        );
      default:
        return null;
    }
  };

  const getNextButtonText = () => {
    if (isEditMode && currentStep < steps.length) {
      return "Save & Return to Review";
    }
    return currentStep === 5 ? "Review & Confirm" : "Next Step";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Wizard Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200">
              <span className="text-2xl">✨</span>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Renovation Wizard
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Create Your Dream Space
          </h1>
          <p className="text-lg text-gray-600">
            Answer a few questions to get personalized renovation
            recommendations
          </p>
        </div>

        {/* Edit Mode Banner */}
        {isEditMode && currentStep < steps.length && (
          <div className="max-w-4xl mx-auto mb-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Edit Mode Active</p>
                    <p className="text-white/90 text-sm">
                      Make your changes and save to return to review
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentStep(steps.length);
                    setIsEditMode(false);
                  }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-300 border border-white/30"
                >
                  Cancel & Return
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Step Content */}
        <div className="mb-12 animate-fadeIn">{renderStep()}</div>

        {/* Navigation Buttons */}
        {currentStep < steps.length && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-4xl mx-auto">
            {/* Previous Button */}
            <button
              onClick={() => {
                if (isEditMode) {
                  setCurrentStep(steps.length);
                  setIsEditMode(false);
                } else {
                  prevStep();
                }
              }}
              disabled={currentStep === 1 && !isEditMode}
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center group"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {isEditMode ? "Back to Review" : "Previous"}
            </button>

            {/* Progress Indicator (Mobile) */}
            <div className="sm:hidden flex items-center space-x-2">
              {steps.slice(0, -1).map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 w-8"
                      : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextClick}
              disabled={!isStepValid()}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center group relative overflow-hidden"
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <span className="relative z-10 flex items-center">
                {getNextButtonText()}
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </button>
          </div>
        )}

        {/* Help Section */}
        {currentStep < steps.length && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    Need Help?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Don't worry if you're unsure about any step. You can always
                    go back and change your answers before submitting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WizardForm;
