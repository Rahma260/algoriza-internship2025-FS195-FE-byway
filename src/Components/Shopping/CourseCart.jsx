import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCourse } from '../../Components/Context/CourseContext';
import { StarRating } from '../Common/StarRating';
import { Clock, BookOpen, BarChart3 } from 'lucide-react';

export const CourseCard = ({ course, onAddToCart }) => {
  const navigate = useNavigate();

  const instructorName = course.instructorName || course.instructor || 'Unknown Instructor';

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
    if (!contents || !Array.isArray(contents)) return 0;
    return contents.reduce((total, content) => {
      const lectures = parseInt(content.lecturesNumber) || 0;
      return total + lectures;
    }, 0);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await onAddToCart(course.id);
    if (result?.requiresLogin) {
      navigate('/login');
    }
  };

  const totalLectures = getTotalLectures(course.contents);
  const levelText = getLevelName(course.level);

  return (
    <Link
      to={`/course/${course.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden"
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

          <div className="flex items-center text-sm mb-3">
            <StarRating rating={course.rating || course.rate || 0} size="w-3.5 h-3.5" />
            <span className="ml-1 text-gray-600">
              ({(course.rating || course.rate || 0).toFixed(1)})
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-auto w-full bg-white hover:bg-black hover:text-white border border-black text-black py-2 px-4 rounded-md font-medium transition duration-500 "
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};