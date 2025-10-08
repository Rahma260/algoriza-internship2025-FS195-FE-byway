import React from 'react';
import { Clock, BookOpen, BarChart3 } from 'lucide-react';
import StarRating from './StarRating';

const CourseHeader = ({ courseData }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {courseData.title}
      </h1>
      <p className="text-gray-600 text-lg mb-4">
        {courseData.tagline}
      </p>
      <div className="flex items-center gap-4 mb-4">
        <StarRating rating={courseData.rating} count={courseData.reviewsCount} />
      </div>
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{courseData.duration} Total Hours</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>{courseData.lectures} Lectures</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <BarChart3 className="w-4 h-4" />
          <span>{courseData.level}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;