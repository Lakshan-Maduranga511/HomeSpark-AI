"use client";
import { budgetRanges } from "../../utils/wizardData";

const BudgetStep = ({ formData, setFormData }) => {
  const handleBudgetSelect = (budget) => {
    setFormData((prev) => ({ ...prev, budget: budget.value }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What&apos;s your renovation budget?
        </h2>
        <p className="text-lg text-gray-600">
          Choose a budget range that works best for your project
        </p>
      </div>

      <div className="group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {budgetRanges.map((budget) => (
          <div
            key={budget.id}
            onClick={() => handleBudgetSelect(budget)}
            className={`relative p-4 rounded-xl border-2 cursor-pointer text-center transition-all duration-300 ease-out
              ${
                formData.budget === budget.value
                  ? "border-blue-500 bg-blue-50 shadow-xl scale-110 z-10"
                  : "border-gray-200 bg-white"
              }
               hover:scale-[1.12]
               hover:shadow-xl hover:border-blue-400 hover:bg-blue-50 z-0
              group-hover:[&:not(:hover)]:opacity-50
            `}
          >
            <div className="mb-2 text-lg font-semibold text-gray-900">
              {budget.label}
            </div>
            <div className="text-sm text-gray-500">{budget.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetStep;
