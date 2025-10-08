import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { useCourse } from '../Context/CourseContext';

export const CourseListingHeader = ({
  resultsCount,
  sortBy,
  onSortChange,
  onMobileFiltersOpen,
}) => {
  const { fetchCourseCount } = useCourse();
  const [totalCount, setTotalCount] = useState(24);

  useEffect(() => {
    const loadCount = async () => {
      const count = await fetchCourseCount();
      setTotalCount(count);
    };
    loadCount();
  }, [fetchCourseCount]);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 py-4 border-b border-gray-200">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          All Courses{' '}
          <span className="text-gray-600 font-normal text-lg">
            ({totalCount})
          </span>
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Showing {resultsCount} course{resultsCount !== 1 && 's'} matching your filters
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={sortBy}
            onChange={onSortChange}
          >
            <option value="latest">Latest</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        <button
          className="lg:hidden flex items-center text-sm text-gray-700 p-2 border border-gray-300 rounded-md"
          onClick={onMobileFiltersOpen}
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
        </button>
      </div>
    </div>
  );
};
