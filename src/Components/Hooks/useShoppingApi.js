import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://byway.runasp.net/api';
const getAuthToken = () => localStorage.getItem('token');

const handlePublicApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || error.message || defaultMessage;
  toast.error(message);
};

const handleAuthApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error);

  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.error('Session expired. Please login again.');
    window.location.href = '/login';
    return;
  }

  const message = error.response?.data?.message || error.message || defaultMessage;
  toast.error(message);
};

export const useShoppingAPI = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [topInstructors, setTopInstructors] = useState([]);
  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    selectedRating: 0,
    selectedCategories: new Set(),
    selectedLectureRanges: new Set(),
    priceRange: { min: 0, max: 5000 },
    sortBy: 'latest',
    searchTerm: '',
  });

  const [totalCourses, setTotalCourses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const fetchTopCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Courses/GetTop10/Top10`, {
      });

      const topCoursesData = response.data || [];

      const instructorMap = {};
      instructors.forEach(inst => {
        instructorMap[inst.id] = inst.name || inst.Name;
      });

      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.id] = cat.name || cat.Name;
      });

      const mappedTopCourses = topCoursesData.map(course => ({
        id: course.id,
        title: course.name,
        name: course.name,
        instructor: instructorMap[course.instructorId] || course.instructorName || 'Unknown Instructor',
        instructorName: instructorMap[course.instructorId] || course.instructorName || 'Unknown Instructor',
        instructorId: course.instructorId,
        categoryId: course.categoryId,
        categoryName: categoryMap[course.categoryId] || 'General',
        rating: course.rate || 4.5,
        rate: course.rate || 4.5,
        reviewCount: Math.floor(Math.random() * 100) + 10,
        price: course.cost,
        cost: course.cost,
        imageUrl: course.imageUrl || `https://placehold.co/400x225/3b82f6/ffffff?text=${encodeURIComponent(course.name?.substring(0, 10) || 'Course')}`,
        totalHours: course.totalHours || 0,
        level: course.level || 'Beginner',
        lectureCount: course.contents?.reduce((sum, content) => sum + (content.lecturesNumber || 0), 0) || 0,
        contents: course.contents || []
      }));

      setTopCourses(mappedTopCourses);
    } catch (error) {
      handlePublicApiError(error, 'Failed to load top courses');
      setTopCourses([]);
    }
  }, [categories, instructors]);
  const fetchTopInstructors = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Instructor/Top10`, {
      });

      const topInstructorsData = response.data || [];

      const mappedTopInstructors = topInstructorsData.map(instructor => ({
        id: instructor.id,
        name: instructor.name,
        jobTitle: instructor.jobTitle,
        rate: instructor.rate || 0,
        imageUrl: instructor.imageUrl || '/images/instructor.png',
      }));

      setTopInstructors(mappedTopInstructors);
    } catch (error) {
      handlePublicApiError(error, 'Failed to load top instructors');
      setTopInstructors([]);
    }
  }, []);
  const fetchCategories = useCallback(async () => {
    try {

      const response = await axios.get(`${API_BASE_URL}/Category/GetAll`, {
        params: { page: 1, pageSize: 100 },
      });

      const data = response.data.data || [];
      setCategories(data);
    } catch (error) {
      handlePublicApiError(error, 'Failed to load categories');
    }
  }, []);
  const fetchInstructors = useCallback(async () => {
    try {
      const possibleEndpoints = [
        `${API_BASE_URL}/Instructor/GetAll`,
        `${API_BASE_URL}/Instructors/GetAll`,
        `${API_BASE_URL}/Instructors`,
      ];

      let instructorsData = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying instructor endpoint: ${endpoint}`);
          const response = await axios.get(endpoint, {
          });

          instructorsData = response.data.data || response.data;
          console.log('Successfully fetched instructors:', instructorsData);
          break;
        } catch (err) {
          console.log(`Failed with ${endpoint}:`, err.response?.status);
          continue;
        }
      }

      if (instructorsData && Array.isArray(instructorsData)) {
        setInstructors(instructorsData);
      } else {
        console.warn('No instructors data found, using empty array');
        setInstructors([]);
      }
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    }
  }, []);
  const fetchCoursesWithPagination = useCallback(async () => {
    console.log("Starting to fetch courses...");
    setIsLoading(true);
    try {
      let allCourses = [];
      let currentPageNum = 1;
      let hasMore = true;
      let totalCount = 0;

      while (hasMore) {
        console.log(`Fetching page ${currentPageNum}...`);

        const response = await axios.get(`${API_BASE_URL}/Courses/GetAll`, {
          params: {
            pageNumber: currentPageNum,
            pageSize: 50
          },
        });

        const responseData = response.data;
        console.log("API Response:", responseData);

        const pageData = responseData.data || responseData;
        totalCount = responseData.totalCount || pageData.length;

        console.log(`Page ${currentPageNum}: Got ${pageData.length} courses, Total: ${totalCount}`);

        allCourses = [...allCourses, ...pageData];

        hasMore = allCourses.length < totalCount && pageData.length > 0;

        console.log(`Total fetched so far: ${allCourses.length}, Has more: ${hasMore}`);

        currentPageNum++;

        if (currentPageNum > 10) {
          console.warn("Stopping after 10 pages to prevent infinite loop");
          break;
        }
      }

      console.log(`Finished fetching. Total courses: ${allCourses.length}`);

      const instructorMap = {};
      instructors.forEach(inst => {
        instructorMap[inst.id] = inst.name || inst.Name;
      });

      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.id] = cat.name || cat.Name;
      });

      console.log('Instructor map:', instructorMap);
      console.log('Category map:', categoryMap);

      const mappedCourses = allCourses.map(course => {
        const instructorName = instructorMap[course.instructorId] || course.instructorName || 'Unknown Instructor';

        return {
          id: course.id,
          title: course.name,
          name: course.name,
          instructor: instructorName,
          instructorName: instructorName,
          instructorId: course.instructorId,
          categoryId: course.categoryId,
          categoryName: categoryMap[course.categoryId] || 'General',
          rating: course.rate || 4.5,
          rate: course.rate || 4.5,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          price: course.cost,
          cost: course.cost,
          imageUrl: course.imageUrl || `https://placehold.co/400x225/3b82f6/ffffff?text=${encodeURIComponent(course.name?.substring(0, 10) || 'Course')}`,
          totalHours: course.totalHours || 0,
          level: course.level || 'Beginner',
          lectureCount: course.contents?.reduce((sum, content) => sum + (content.lecturesNumber || 0), 0) || 0,
          contents: course.contents || []
        };
      });

      console.log('Mapped courses sample:', mappedCourses[0]);

      setCourses(mappedCourses);
      setTotalCourses(mappedCourses.length);
      setCurrentPage(1);
      setPageSize(9);
    } catch (error) {
      handlePublicApiError(error, 'Failed to load courses');
      setCourses([]);
      setTotalCourses(0);
    } finally {
      setIsLoading(false);
    }
  }, [categories, instructors]);
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchCategories();
      await fetchInstructors();
    };
    fetchInitialData();
  }, [fetchCategories, fetchInstructors]);


  useEffect(() => {
    if (categories.length > 0) {
      const timer = setTimeout(() => {
        fetchCoursesWithPagination();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [categories.length, fetchCoursesWithPagination]);

  useEffect(() => {
    if (categories.length > 0 && instructors.length > 0) {
      fetchTopCourses();
      fetchTopInstructors();
    }
  }, [categories.length, instructors.length, fetchTopCourses, fetchTopInstructors]);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Please login to view cart');
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/Cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      const mappedItems = (data.items || []).map(item => ({
        id: item.courseId,
        courseId: item.courseId,
        title: item.courseName,
        courseName: item.courseName,
        instructor: item.instructorName || 'Unknown',
        instructorName: item.instructorName,
        details: `${item.totalHours || 0} Total Hours. ${item.level || 'Beginner'}`,
        price: item.price || 0,
        imageUrl: item.imageUrl || `https://placehold.co/80x80/2f3337/ffffff?text=${encodeURIComponent(item.courseName?.substring(0, 3) || 'C')}`,
        rating: 4.5,
        totalHours: item.totalHours || 0,
        level: item.level || 'Beginner'
      }));

      setCart({
        items: mappedItems,
        itemCount: data.itemCount || 0,
        subTotal: data.subTotal || 0,
        tax: data.tax || 0,
        total: data.total || 0,
      });
    } catch (error) {
      handleAuthApiError(error, 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (courseId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Please login to add courses to cart');
        window.location.href = '/login';
        return;
      }

      await axios.post(`${API_BASE_URL}/Cart/add/${courseId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchCart();
      toast.success('Course added to cart successfully! 🎉');
    } catch (error) {
      if (error.response?.data?.message?.includes('already in cart')) {
        toast.warning('Course is already in your cart');
      } else {
        handleAuthApiError(error, 'Failed to add course to cart');

      }
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (courseId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Please login');
        window.location.href = '/login';
        return;
      }

      await axios.delete(`${API_BASE_URL}/Cart/remove/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchCart();
      toast.success('Course removed from cart');
    } catch (error) {
      handleAuthApiError(error, 'Failed to remove course from cart');
    }
  }, [fetchCart]);

  const checkout = useCallback(async (checkoutData) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Please login to checkout');
        return { success: false };
      }

      console.log("Sending checkout data:", checkoutData);

      const response = await axios.post(`${API_BASE_URL}/Order/Checkout`, checkoutData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Order placed successfully! 🎉');
      await fetchCart();

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Checkout error:', error);
      console.error('Response data:', error.response?.data);

      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach(msg => toast.error(msg));
      } else {
        handleAuthApiError(error, 'Failed to complete checkout. Please try again.');
      }

      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart]);

  const getFilteredCourses = useCallback(() => {
    return courses.filter(course => {
      const ratingMatch = filters.selectedRating === 0 || course.rating >= filters.selectedRating;

      const categoryMatch = filters.selectedCategories.size === 0 ||
        filters.selectedCategories.has(course.categoryId);

      const priceMatch = course.price >= filters.priceRange.min &&
        course.price <= filters.priceRange.max;

      let lectureMatch = true;
      if (filters.selectedLectureRanges && filters.selectedLectureRanges.size > 0) {
        lectureMatch = false;
        for (const rangeKey of filters.selectedLectureRanges) {
          const [min, max] = rangeKey.split('-').map(Number);
          if (course.lectureCount >= min && course.lectureCount <= max) {
            lectureMatch = true;
            break;
          }
        }
      }

      const searchMatch = !filters.searchTerm ||
        course.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (course.categoryName && course.categoryName.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      return ratingMatch && categoryMatch && priceMatch && lectureMatch && searchMatch;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'latest':
        default:
          return b.id - a.id;
      }
    });
  }, [courses, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      selectedRating: 0,
      selectedCategories: new Set(),
      selectedLectureRanges: new Set(),
      priceRange: { min: 0, max: 5000 },
      sortBy: 'latest',
      searchTerm: '',
    });
  }, []);

  const fetchTopCategories = useCallback(async (top = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Category/TopCategoriesByCourses`, {
        params: { top },
      });

      const topCategoriesData = response.data || [];
      console.log('Top categories from API:', topCategoriesData);

      const mappedCategories = topCategoriesData.map(cat => ({
        id: cat.CategoryId,
        name: cat.CategoryName,
        imageUrl: cat.ImageUrl,
        courseCount: cat.CoursesCount,
      }));

      setCategories(mappedCategories);
      return mappedCategories;
    } catch (error) {
      handlePublicApiError(error, 'Failed to load top categories');
      setCategories([]);
      return [];
    }
  }, []);
  return {
    courses,
    cart,
    isLoading,
    filters,
    categories,
    instructors,
    topCourses,
    topInstructors,

    totalCourses,
    currentPage,
    pageSize,

    filteredCourses: getFilteredCourses(),

    fetchCoursesWithPagination,
    fetchCart,
    addToCart,
    removeFromCart,
    checkout,
    updateFilters,
    resetFilters,
    fetchTopCourses,
    fetchTopInstructors,
    fetchTopCategories
  };
};