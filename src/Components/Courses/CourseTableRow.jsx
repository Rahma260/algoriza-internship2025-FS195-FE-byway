import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLevelName, getTotalLectures } from './CourseHelper';

export const CourseTableRow = ({
  course,
  getCategoryName,
  getInstructorName,
  onView,
  onDelete
}) => {
  const totalLectures = getTotalLectures(course.contents);
  const levelText = getLevelName(course.level);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={course.imageUrl || '/placeholder-course.jpg'}
            alt={course.name}
            className="w-10 h-10 rounded-lg object-cover mr-3"
            onError={(e) => { e.target.src = '/placeholder-course.jpg'; }}
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{course.name}</div>
            <div className="text-sm text-gray-500">{levelText}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {getCategoryName(course.categoryId)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
        {getInstructorName(course.instructorId)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
        <div className="space-y-1">
          <div>{course.totalHours}h total</div>
          <div>{totalLectures} lectures</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.floor(course.rate || 0) ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
          <span className="ml-1">({course.rate || 0})</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        ${course.cost}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onView(course.id)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <Link
            to={`/dashboard/courses/update/${course.id}/step1`}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={() => onDelete(course.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};