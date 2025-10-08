import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarRating } from '../Common/StarRating';
import { Clock, BookOpen, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

const RelatedCourseCard = ({ course }) => {
  const navigate = useNavigate();

  if (!course) {
    console.warn('RelatedCourseCard received undefined course');
    return null;
  }

  const instructorName = course.instructorName ||
    course.instructor ||
    course.instructorId ||
    'Unknown Instructor';

  const getLevelName = (level) => {
    if (level === undefined || level === null) return "All Levels";
    if (typeof level === 'string') return level;

    const levels = {
      0: "All Levels",
      1: "Beginner",
      2: "Intermediate",
      3: "Expert"
    };
    return levels[level] ?? "All Levels";
  };

  const getTotalLectures = (contents) => {
    if (!contents || !Array.isArray(contents)) return course.lectures || course.lectureCount || 0;
    return contents.reduce((total, content) => {
      const lectures = parseInt(content.lecturesNumber) || 0;
      return total + lectures;
    }, 0);
  };

  const handleCardClick = () => {
    navigate(`/course/${course.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalLectures = getTotalLectures(course.contents);
  const levelText = getLevelName(course.level);

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex-shrink-0 w-[280px] sm:w-full"
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-video">
          <img
            src={course.imageUrl}
            alt={course.title || course.name}
            className="w-full h-full object-cover p-4 rounded-3xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x225/3b82f6/ffffff?text=Course"
            }}
          />
          <div className="absolute top-6 left-6 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded">
            {course.categoryName || 'Development'}
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
            {course.title || course.name}
          </h3>

          <p className="text-xl font-bold text-black mb-2">
            ${(course.price || course.cost)?.toFixed(2) || '0.00'}
          </p>

          <p className="text-sm text-gray-600 mb-3">
            By <span className="font-medium text-gray-700">{instructorName}</span>
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3 border-y border-gray-100 py-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.totalHours || 0}h
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {totalLectures} lectures
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" />
              {levelText}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <StarRating rating={course.rating || course.rate || 0} size="w-3.5 h-3.5" />
            <span className="ml-1 text-gray-600">
              ({(course.rating || course.rate || 0).toFixed(1)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RelatedCourses = ({ relatedCourses = [] }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const validCourses = relatedCourses.filter(course => course && course.id);

  console.log('Related courses to display:', validCourses);

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
  }, [validCourses]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (validCourses.length === 0) {
    return (
      <div className="w-full mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          More Courses Like This
        </h2>
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No related courses found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          More Courses Like This
        </h2>

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
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {validCourses.map((course) => (
            <div key={course.id} className="snap-start">
              <RelatedCourseCard course={course} />
            </div>
          ))}
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

      <div className="md:hidden flex justify-center gap-2 mt-4">
        {validCourses.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300"
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;