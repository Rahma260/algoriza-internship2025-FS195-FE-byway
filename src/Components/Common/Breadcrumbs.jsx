import React from 'react';

export const Breadcrumbs = ({ steps, currentPage, onNavigate }) => {
  const currentIndex = steps.findIndex(s => s.toLowerCase().includes(currentPage));

  return (
    <div className="flex space-x-2 text-sm text-gray-500 font-medium">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <button
            onClick={() => onNavigate(step, index)}
            className={`transition duration-200 ${index <= currentIndex
              ? 'text-gray-900 hover:text-black font-semibold'
              : 'text-gray-400 cursor-default'
              }`}
            disabled={index > currentIndex}
          >
            {step}
          </button>
          {index < steps.length - 1 && <span className="text-gray-300">/</span>}
        </React.Fragment>
      ))}
    </div>
  );
};