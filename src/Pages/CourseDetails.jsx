import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShoppingContext } from '../Components/Hooks/UseShoppingContext';
import { useCourse } from '../Components/Context/CourseContext';
import { useCourseAPI } from '../Components/Hooks/UseCourseApi';
import { toast } from 'react-toastify';

import Navbar from '../Components/Layout/Navbar';
import Breadcrumbs from '../Components/CourseDetals/Links';
import CourseHeader from '../Components/CourseDetals/CourseHeader';
import TabsComponent from '../Components/CourseDetals/TabsComponent';
import TabContent from '../Components/CourseDetals/TabContent';
import LearnerReviews from '../Components/CourseDetals/LearnerReviews';
import RelatedCourses from '../Components/CourseDetals/RelatedCourses';
import PurchaseCard from '../Components/CourseDetals/PurchaseCard';
import Footer from '../Components/Layout/Footer';
import { LoadingSpinner } from '../Components/Common/LoadingSpinner';

const JobTitleNames = {
  0: 'Fullstack Developer',
  1: 'Backend Developer',
  2: 'Frontend Developer',
  3: 'UX/UI Designer'
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { courses, addToCart } = useShoppingContext();
  const courseContext = useCourse();
  const { fetchCourseById, fetchCategories, fetchInstructors } = useCourseAPI();

  const step1Data = courseContext?.step1Data || {};
  const contents = courseContext?.contents || [];
  const categories = courseContext?.categories || [];
  const instructors = courseContext?.instructors || [];
  const loading = courseContext?.loading || false;
  const error = courseContext?.error || null;

  const [instructor, setInstructor] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('Description');
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setLocalError('Course ID not found.');
        return;
      }

      try {
        setLocalError(null);

        if (categories.length === 0) {
          await fetchCategories();
        }
        if (instructors.length === 0) {
          await fetchInstructors();
        }

        await fetchCourseById(id);
      } catch (err) {
        console.error('Failed to load course details:', err);
        setLocalError(err.message || 'Failed to load course details.');

        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }
      }
    };

    loadData();

    return () => {
      if (courseContext?.dispatch) {
        courseContext.dispatch({ type: 'RESET_FOR_CREATE' });
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    if (step1Data?.instructorId && instructors.length > 0) {
      const instructorData = instructors.find(
        inst => inst.id === step1Data.instructorId
      );

      if (instructorData) {
        setInstructor({
          name: instructorData.name || 'Unknown Instructor',
          title: typeof instructorData.jobTitle === 'number'
            ? JobTitleNames[instructorData.jobTitle]
            : instructorData.jobTitle || 'Expert Instructor',
          imageUrl: instructorData.imageUrl ||
            `https://ui-avatars.com/api/?name=${instructorData.name}&background=4c51bf&color=fff&size=128`,
          reviews: instructorData.reviews || 0,
          students: instructorData.students || 0,
          courses: instructorData.courses || 0,
          bio: instructorData.bio || 'Experienced instructor with years of expertise in the field.'
        });
      }
    }
  }, [step1Data?.instructorId, instructors]);

  useEffect(() => {
    if (step1Data?.categoryId && courses.length > 0) {
      const related = courses
        .filter(c =>
          c &&
          c.id &&
          c.categoryId === step1Data.categoryId &&
          c.id !== step1Data.id
        )
        .slice(0, 4)
        .map(c => ({
          ...c,
          totalHours: c.totalHours || 0,
          lectures: c.lectureCount || 0,
          lectureCount: c.lectureCount || 0,
          instructorName: instructors.find(i => i.id === c.instructorId)?.name || 'Unknown'
        }));

      setRelatedCourses(related);
    }
  }, [step1Data?.categoryId, step1Data?.id, courses, instructors]);

  const getLevelName = (level) => {
    if (typeof level === 'string') return level;
    const levels = {
      0: 'All Levels',
      1: 'Beginner',
      2: 'Intermediate',
      3: 'Expert'
    };
    return levels[level] || 'Beginner';
  };

  const formattedCourseData = step1Data?.id ? {
    id: step1Data.id,
    title: step1Data.name,
    tagline: step1Data.description?.substring(0, 200) + '...' || 'Master the fundamentals and advanced concepts.',
    price: step1Data.cost,
    rating: step1Data.rate || 4.6,
    reviewsCount: step1Data.reviewCount || 0,
    duration: step1Data.totalHours || 0,
    lectures: contents?.reduce((sum, c) => sum + (parseInt(c.lecturesNumber) || 0), 0) || 0,
    level: getLevelName(step1Data.level),
    content: contents?.map(cont => ({
      id: cont.id,
      title: cont.name,
      lectures: cont.lecturesNumber || 0,
      duration: cont.time || 0,
      lectureDetails: cont.lectures || []
    })) || [],
    description: step1Data.description || 'Comprehensive course designed to take you from beginner to advanced.',
    certification: step1Data.certification || 'Certificate of completion available.',
    imageUrl: step1Data.imageUrl || 'https://placehold.co/600x338/1e293b/ffffff?text=Course+Preview',
    instructorId: step1Data.instructorId,
    categoryId: step1Data.categoryId,
    categoryName: categories.find(c => c.id === step1Data.categoryId)?.name || 'General'
  } : null;

  const handleAddToCart = async (courseId) => {
    try {
      await addToCart(courseId);
      toast.success('Course added to cart!');
    } catch (err) {
      console.error('Add to cart failed:', err);
      toast.error('Failed to add course to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      if (step1Data?.id) {
        await addToCart(step1Data.id);
        navigate('/checkout');
      }
    } catch (err) {
      console.error('Buy now failed:', err);
      toast.error('Failed to proceed to checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const displayError = localError || error;
  if (displayError || !formattedCourseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{displayError || 'Course not found.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Retry
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs courseTitle={formattedCourseData.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CourseHeader courseData={formattedCourseData} />

            <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="bg-white rounded-lg p-6">
              <TabContent
                activeTab={activeTab}
                courseData={formattedCourseData}
                instructor={instructor}
                reviews={reviews}
              />
            </div>

            {activeTab !== 'Reviews' && (
              <div className="bg-white rounded-lg p-6">
                <LearnerReviews reviews={reviews} fullDetails={false} />
              </div>
            )}

            <div className="lg:hidden">
              <PurchaseCard
                courseData={formattedCourseData}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <PurchaseCard
                courseData={formattedCourseData}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <RelatedCourses relatedCourses={relatedCourses} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetails;