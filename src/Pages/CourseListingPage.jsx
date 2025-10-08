import React, { useState, useEffect } from 'react';
import { useShoppingContext } from '../Components/Hooks/UseShoppingContext';
import { FilterSidebar } from '../Components/Shopping/FilterSidebar';
import { CourseListingHeader } from '../Components/Courses/CourseListingHeader';
import { CourseGrid } from '../Components/Shopping/CourseGrid';
import { Pagination } from '../Components/Common/Pagination';

import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import { Link } from 'react-router-dom';

export const CourseListingPage = () => {
  const {
    filteredCourses,
    isLoading,
    addToCart,
    filters,
    updateFilters,
    categories,
    resetFilters,
    pageSize
  } = useShoppingContext();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPageLocal, setCurrentPageLocal] = useState(1);

  const totalFilteredPages = Math.ceil(filteredCourses.length / pageSize);
  const startIndex = (currentPageLocal - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageCourses = filteredCourses.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPageLocal(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPageLocal(1);
  }, [filters]);

  const handleRatingChange = (rating) => {
    updateFilters({ selectedRating: filters.selectedRating === rating ? 0 : rating });
  };

  const handleCategoryChange = (categoryId) => {
    const newSet = new Set(filters.selectedCategories);
    if (newSet.has(categoryId)) {
      newSet.delete(categoryId);
    } else {
      newSet.add(categoryId);
    }
    updateFilters({ selectedCategories: newSet });
  };

  const handleLectureRangeChange = (range) => {
    const currentRanges = new Set(filters.selectedLectureRanges || []);
    const rangeKey = `${range.min}-${range.max}`;

    if (currentRanges.has(rangeKey)) {
      currentRanges.delete(rangeKey);
    } else {
      currentRanges.add(rangeKey);
    }

    updateFilters({ selectedLectureRanges: currentRanges });
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    updateFilters({
      priceRange: {
        ...filters.priceRange,
        [name]: Number(value)
      }
    });
  };

  const handleSortChange = (e) => {
    updateFilters({ sortBy: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
          <p className='mt-2 text-lg font-semibold'>All Development Courses</p>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CourseListingHeader
            resultsCount={filteredCourses.length}
            sortBy={filters.sortBy}
            onSortChange={handleSortChange}
            onMobileFiltersOpen={() => setMobileFiltersOpen(true)}
          />

          <div className="mt-6 flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block w-64 shrink-0">
              <FilterSidebar
                filters={filters}
                categories={categories}
                onRatingChange={handleRatingChange}
                onCategoryChange={handleCategoryChange}
                onLectureRangeChange={handleLectureRangeChange}
                onPriceRangeChange={handlePriceRangeChange}
                onResetFilters={resetFilters}
              />
            </div>

            <FilterSidebar
              isMobile={true}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              filters={filters}
              categories={categories}
              onRatingChange={handleRatingChange}
              onCategoryChange={handleCategoryChange}
              onLectureRangeChange={handleLectureRangeChange}
              onPriceRangeChange={handlePriceRangeChange}
              onResetFilters={resetFilters}
            />

            <div className="flex-1">
              <CourseGrid
                courses={currentPageCourses}
                onAddToCart={addToCart}
                isLoading={isLoading}
                onResetFilters={resetFilters}
              />

              <Pagination
                currentPage={currentPageLocal}
                totalPages={totalFilteredPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};