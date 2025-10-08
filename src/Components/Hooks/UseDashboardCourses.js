import { useState, useEffect, useCallback } from 'react';

export const useDashboardCourses = (
  pageNumber,
  pageSize,
  searchTerm,
  categoryFilter,
  ratingFilter = 0,
  priceRange = { min: 0, max: 5000 }
) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();

      params.append('pageNumber', pageNumber);
      params.append('pageSize', pageSize);

      if (searchTerm?.trim()) {
        params.append('name', searchTerm.trim());
      }

      if (categoryFilter !== null) {
        params.append('categories', categoryFilter.toString());
      }

      if (priceRange.min > 0) {
        params.append('minPrice', priceRange.min);
      }
      if (priceRange.max < 5000) {
        params.append('maxPrice', priceRange.max);
      }

      if (ratingFilter > 0) {
        params.append('rating', ratingFilter);
      }

      const url = `/api/Courses/GetAll?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data.data || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Could not load courses");
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm, categoryFilter, ratingFilter, priceRange.min, priceRange.max]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const deleteCourse = async (id) => {
    try {
      const res = await fetch(`/api/Courses/Delete/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete course");

      setCourses(prev => prev.filter(c => c.id !== id));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    courses,
    loading,
    error,
    totalCount,
    deleteCourse,
    refetch: fetchCourses
  };
};
