import { useState, useEffect } from 'react';
import { useCourse } from '../Context/CourseContext';

export const useCourseData = (fetchCoursesOnMount = false, initialFilters = {}) => {
  const {
    categories,
    instructors,
    dispatch,
    courses,
    totalCount,
    listingLoading,
    listingError,
    fetchCourses
  } = useCourse();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://byway.runasp.net/api/Category/GetAll?page=1&pageSize=100");
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      dispatch({ type: 'SET_CATEGORIES', payload: data.data || [] });
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://byway.runasp.net/api/Instructor/GetAll?page=1&pageSize=100");
      if (!res.ok) throw new Error('Failed to fetch instructors');
      const data = await res.json();
      dispatch({ type: 'SET_INSTRUCTORS', payload: data.data || [] });
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async (filters = {}, page = 1, pageSize = 12) => {
    try {
      setLoading(true);
      const { courses: fetchedCourses, total } = await fetchCourses(filters, page, pageSize);
      console.log('Loaded courses in hook:', fetchedCourses.length, 'Total:', total);
      return { courses: fetchedCourses, total };
    } catch (err) {
      console.error("Error loading courses:", err);
      setError(err.message);
      return { courses: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find(c => c.id === id || c.Id === id);
    return category ? category.name : "Unknown";
  };

  const getInstructorName = (id) => {
    const instructor = instructors.find(i => i.id === id || i.Id === id);
    return instructor ? instructor.name : "Unknown";
  };

  useEffect(() => {
    if (fetchCoursesOnMount) {
      loadCourses(initialFilters);
    }
  }, [fetchCoursesOnMount, initialFilters]);

  return {
    categories,
    instructors,
    courses,
    totalCount,
    loading: loading || listingLoading,
    error: error || listingError,
    fetchCategories,
    fetchInstructors,
    loadCourses,
    getCategoryName,
    getInstructorName
  };
};