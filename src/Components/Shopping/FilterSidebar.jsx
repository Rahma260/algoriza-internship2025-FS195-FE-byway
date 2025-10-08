import React from 'react';
import { Check } from 'lucide-react';
import { FilterGroup } from '../Common/FilterGroup';
import { StarRating } from '../Common/StarRating';

const MIN_PRICE = 0;
const MAX_PRICE = 5000;

const lectureRanges = [
  { label: '1-10 lectures', min: 1, max: 10 },
  { label: '11-20 lectures', min: 11, max: 20 },
  { label: '21-30 lectures', min: 21, max: 30 },
  { label: '30+ lectures', min: 31, max: 10000 }
];

export const FilterSidebar = ({
  isMobile = false,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  filters,
  categories,
  onRatingChange,
  onCategoryChange,
  onLectureRangeChange,
  onPriceRangeChange,
  onResetFilters
}) => (
  <div className={`
    ${isMobile ? 'fixed inset-0 z-40 flex' : 'hidden lg:block'}
    ${isMobile && !mobileFiltersOpen && 'hidden'}
  `}>
    {isMobile && (
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)}></div>
    )}

    <div className={`
      ${isMobile ? 'ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto' : 'sticky top-20 w-64'}
    `}>
      <div className="px-4">
        {isMobile && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className={isMobile ? "" : "bg-white rounded-lg shadow p-6"}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <button
              onClick={onResetFilters}
              className="text-sm text-black hover:text-blue-800"
            >
              Reset All
            </button>
          </div>

          <FilterGroup title="Rating">
            {[5, 4, 3, 2, 1].map((r) => (
              <div
                key={r}
                className={`flex items-center cursor-pointer p-2 rounded-md ${filters.selectedRating === r ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => onRatingChange(r)}
              >
                <StarRating rating={r} />
                <span className="ml-2 text-sm text-gray-700">{r}.0 & Up</span>
                {filters.selectedRating === r && <Check className="w-4 h-4 ml-auto text-black" />}
              </div>
            ))}
          </FilterGroup>

          <FilterGroup title="Price">
            <div className="px-1 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>${filters.priceRange.min}</span>
                <span>${filters.priceRange.max}</span>
              </div>

              <input
                type="range"
                name="min"
                value={filters.priceRange.min}
                onChange={onPriceRangeChange}
                min={MIN_PRICE}
                max={filters.priceRange.max}
                step="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />

              <input
                type="range"
                name="max"
                value={filters.priceRange.max}
                onChange={onPriceRangeChange}
                min={filters.priceRange.min}
                max={MAX_PRICE}
                step="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>
          </FilterGroup>

          <FilterGroup title="Category">
            <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {categories && categories.length > 0 ? (
                categories.map((category) => {
                  const categoryId = category.id || category.Id;
                  const categoryName = category.name || category.Name;

                  return (
                    <label key={categoryId} className="flex items-center py-1 cursor-pointer hover:bg-gray-50 rounded-md px-1">
                      <input
                        type="checkbox"
                        checked={filters.selectedCategories.has(categoryId)}
                        onChange={() => onCategoryChange(categoryId)}
                        className="rounded text-black focus:ring-blue-500 border-gray-300 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">{categoryName}</span>
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 py-2">Loading categories...</p>
              )}
            </div>
          </FilterGroup>

          <FilterGroup title="Number of Lectures">
            {lectureRanges.map((range) => (
              <label
                key={`${range.min}-${range.max}`}
                className="flex items-center py-1 cursor-pointer hover:bg-gray-50 rounded-md px-1"
              >
                <input
                  type="checkbox"
                  checked={filters.selectedLectureRanges?.has(`${range.min}-${range.max}`)}
                  onChange={() => onLectureRangeChange(range)}
                  className="rounded text-black focus:ring-blue-500 border-gray-300 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </FilterGroup>
        </div>
      </div>
    </div>
  </div>
);