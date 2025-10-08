import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CourseDetailsContext = createContext();

export const useCourseDetails = () => {
  const context = useContext(CourseDetailsContext);
  if (!context) {
    throw new Error('useCourseDetails must be used within CourseDetailsProvider');
  }
  return context;
};

const API_BASE_URL = 'http://byway.runasp.net/api';

const getAuthToken = () => localStorage.getItem('token');

export const CourseDetailsProvider = ({ children, courseId }) => {
  const [courseData, setCourseData] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('Description');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchCourseDetails = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/Courses/GetById/${courseId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const course = response.data;

      const mappedCourse = {
        id: course.id,
        title: course.name,
        tagline: course.description?.substring(0, 200) + '...' || 'Course overview not available.',
        price: course.cost,
        rating: course.rate || 0,
        duration: `${course.totalHours || 0} Hours`,
        lectures: course.contents?.reduce((sum, c) => sum + (c.lecturesNumber || 0), 0) || 0,
        level: course.level || 'Beginner',
        content: (course.contents || []).map(cont => ({
          title: cont.name,
          lectures: cont.lecturesNumber || 0,
          duration: `${cont.time || 0} minutes`
        })),
        description: course.description || 'No description available.',
        certification: course.certification || 'Certificate of completion available.',
        imageUrl: course.imageUrl,
        instructorId: course.instructorId,
        categoryId: course.categoryId
      };

      setCourseData(mappedCourse);
      return mappedCourse;
    } catch (err) {
      console.error('Failed to fetch course:', err);
      throw err;
    }
  };

  const fetchInstructor = async (instructorId) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/Instructor/${instructorId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const inst = response.data;
      const mappedInstructor = {
        name: inst.name || 'Unknown Instructor',
        title: inst.title || 'Expert Instructor',
        avatarUrl: inst.avatarUrl || `https://ui-avatars.com/api/?name=${inst.name || 'Instructor'}&background=000000&color=fff`,
        students: inst.students || 0,
        courses: inst.courses || 0,
        bio: inst.bio || 'Experienced instructor with years of expertise.'
      };

      setInstructor(mappedInstructor);
    } catch (err) {
      console.warn('Failed to fetch instructor:', err);
      setInstructor({
        name: 'Unknown Instructor',
        title: 'Expert Instructor',
        avatarUrl: 'https://ui-avatars.com/api/?name=Instructor&background=000000&color=fff',
        students: 0,
        courses: 0,
        bio: 'Instructor details not available.'
      });
    }
  };

  const fetchRelatedCourses = async (categoryId) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/Courses/GetAll`, {
        params: { page: 1, pageSize: 4, categoryId },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const courses = response.data.data || [];
      const mapped = courses
        .filter(c => c.id !== courseId)
        .slice(0, 4)
        .map(course => ({
          id: course.id,
          title: course.name,
          instructor: course.instructorName || 'Unknown',
          price: course.cost || 0,
          duration: `${course.totalHours || 0} Hours`,
          lectures: `${course.lectureCount || 0} Lectures`,
          imageUrl: course.imageUrl || `https://placehold.co/400x225/000000/ffffff?text=${course.name?.substring(0, 10)}`,
          categoryName: course.categoryName || 'General'
        }));

      setRelatedCourses(mapped);
    } catch (err) {
      console.warn('Failed to fetch related courses:', err);
      setRelatedCourses([]);
    }
  };

  const addToCart = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please login to add courses to cart');
      }

      await axios.post(`${API_BASE_URL}/Cart/add/${courseId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return { success: true, message: 'Added to cart successfully!' };
    } catch (err) {
      console.error('Add to cart failed:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
      }
      throw err;
    }
  };

  const buyNow = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please login to purchase');
      }
      await addToCart();
      navigate('/checkout', { replace: true });
    } catch (err) {
      console.error('Buy now failed:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (!courseId) {
      setError('Course ID not found');
      setIsLoading(false);
      return;
    }

    const loadAllData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const course = await fetchCourseDetails();
        await Promise.all([
          course.instructorId ? fetchInstructor(course.instructorId) : Promise.resolve(),
          course.categoryId ? fetchRelatedCourses(course.categoryId) : Promise.resolve(),
        ]);
      } catch (err) {
        console.error('Failed to load course details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load course details');

        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [courseId]);

  const value = {
    courseData,
    instructor,
    relatedCourses,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    addToCart,
    buyNow
  };

  return (
    <CourseDetailsContext.Provider value={value}>
      {children}
    </CourseDetailsContext.Provider>
  );
};