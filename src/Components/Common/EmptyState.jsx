import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  hasFilters,
  onClearFilters,
  addLink = "/dashboard/courses/add/step1"
}) => (
  <div className="text-center py-12 bg-white rounded-lg">
    <p className="text-gray-500 mb-4">
      {hasFilters ? "No courses found matching your criteria" : "No courses found"}
    </p>
    {hasFilters && (
      <button
        onClick={onClearFilters}
        className="text-blue-600 hover:text-blue-800 font-medium mb-4 block mx-auto"
      >
        Clear filters
      </button>
    )}
    <div>
      <Link
        to={addLink}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} />
        Add Your First Course
      </Link>
    </div>
  </div>
);