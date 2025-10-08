import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Clock, Video, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShoppingContext } from '../Context/ShoppingContext';
import { getLevelName, getTotalLectures } from '../Courses/CourseHelper';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const RatingDisplay = ({ rating, size = 16 }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FaStar
        key={i}
        style={{ width: size, height: size }}
        className={i <= fullStars ? 'text-yellow-400' : 'text-gray-300'}
      />
    );
  }
  return <div className="flex items-center space-x-0.5">{stars}</div>;
};

function CoursesSection() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const {
    topCourses,
    isLoading
  } = useShoppingContext();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [topCourses]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Top Courses</h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full border transition-all ${canScrollLeft
                  ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-2 rounded-full border transition-all ${canScrollRight
                  ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              See All
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {topCourses.length > 0 ? (
                topCourses.map((course, index) => {
                  const totalLectures = getTotalLectures(course.contents);
                  const levelText = getLevelName(course.level);

                  return (
                    <motion.div
                      key={course.id || index}
                      onClick={() => handleCourseClick(course.id)}
                      className="bg-white shadow-md overflow-hidden rounded-lg flex-shrink-0 w-[280px] cursor-pointer snap-start"
                      variants={fadeInUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={course.imageUrl}
                        alt={course.name || course.title}
                        className="w-full h-40 object-cover p-4 rounded-3xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/400x225/3b82f6/ffffff?text=Course';
                        }}
                      />
                      <div className="p-4">
                        <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                          {course.categoryName || 'General'}
                        </span>
                        <h3 className="font-semibold mt-2 line-clamp-2">
                          {course.name || course.title || "Beginner's Guide to Design"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          By {course.instructorName || 'Unknown Instructor'}
                        </p>
                        <div className="mt-2">
                          <RatingDisplay rating={course.rate || course.rating || 0} />
                        </div>

                        {/* Course Details: Hours, Lectures, Level */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-3 mb-3">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Clock className="w-3.5 h-3.5" />
                            {course.totalHours || 0}h
                          </span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Video className="w-3.5 h-3.5" />
                            {totalLectures} lectures
                          </span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Zap className="w-3.5 h-3.5" />
                            {levelText}
                          </span>
                        </div>

                        <p className="mt-2 font-bold">
                          ${(course.cost || course.price || 0)?.toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="w-full text-center text-gray-500">No top courses available.</p>
              )}
            </div>

            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 z-10"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 z-10"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default CoursesSection;