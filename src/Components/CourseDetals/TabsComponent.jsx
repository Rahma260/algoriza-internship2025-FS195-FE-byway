import React from 'react';

const TabsComponent = ({ activeTab, setActiveTab }) => {
  const tabs = ['Description', 'Instructor', 'Content', 'Reviews'];

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex overflow-x-auto whitespace-nowrap -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              py-3 px-4 md:px-6 text-sm font-semibold transition duration-150 ease-in-out
              ${activeTab === tab
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-4 border-transparent'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsComponent;