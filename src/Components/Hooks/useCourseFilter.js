import { useState, useEffect } from 'react';

export const useCourseFilters = (updateFilters, resetFilters) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

  const handleRatingChange = (rating) => {
    updateFilters({ selectedRating: rating });
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ searchTerm });
  };

  return {
    searchTerm,
    setSearchTerm,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    selectedRating,
    setSelectedRating,
    priceRange,
    setPriceRange,
    handleRatingChange,
    handleCategoryChange,
    handleLectureRangeChange,
    handlePriceRangeChange,
    handleSortChange,
    handleSearchChange,
    handleSearchSubmit
  };
};