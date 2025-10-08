import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLevelName, getTotalLectures } from './CourseHelper';

export const CourseCardGrid = ({
  course,
  getCategoryName,
  getInstructorName,
  onView,
  onDelete
}) => {
  const totalLectures = getTotalLectures(course.contents);
  const levelText = getLevelName(course.level);

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        <img
          src={course.imageUrl || '/placeholder-course.jpg'}
          alt={course.name}
          className="w-full h-48 object-cover p-4 rounded-3xl"
          onError={(e) => { e.target.src = '/placeholder-course.jpg'; }}
        />
        <span className="absolute top-6 left-6 bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
          {getCategoryName(course.categoryId)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{course.name}</h3>
        <p className="text-sm text-gray-600 mb-2">By {getInstructorName(course.instructorId)}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-yellow-400 text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(course.rate || 0) ? '' : 'text-gray-300'}>
                ★
              </span>
            ))}
            <span className="ml-1 text-gray-600">({course.rate || 0})</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-3">
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.totalHours}h
          </span>
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {totalLectures} lectures
          </span>
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {levelText}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          <p className="font-bold text-xl">${course.cost}</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(course.id)}
              className="p-1.5 bg-white text-[#5879DC] hover:bg-gray-100 rounded-lg border border-gray-100 transition-colors"
              title="View Course"
            >
              <Eye size={20} />
            </button>
            <Link
              to={`/dashboard/courses/update/${course.id}/step1`}
              className="p-1.5 bg-white border border-gray-100 text-[#5879DC] hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit Course"
            >
              <Edit size={20} />
            </Link>
            <button
              className="p-1.5 text-red-500 border border-gray-100 hover:bg-red-50 rounded transition-colors"
              onClick={() => onDelete(course.id)}
              title="Delete Course"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};