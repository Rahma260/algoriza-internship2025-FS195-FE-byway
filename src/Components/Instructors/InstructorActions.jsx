import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useInstructorContext } from '../Context/InstructorContext';

const InstructorActions = ({ onAddClick }) => {
  const { searchTerm, setSearchTerm, totalInstructors } = useInstructorContext();

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold flex items-baseline">
        Instructors
        <span className="ml-2 px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg">
          {totalInstructors}
        </span>
      </h2>

      <div className="flex items-center space-x-3">
        <button
          onClick={onAddClick}
          className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition font-medium text-sm"
        >
          Add Instructor
        </button>

        <div className="relative">
          <input
            type="text"
            placeholder="Search for Instructors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-60 text-sm"
          />
        </div>

        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
          <Filter className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default InstructorActions;