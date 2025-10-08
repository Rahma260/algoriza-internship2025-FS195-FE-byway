import React from 'react';
import { Eye, Pencil, Trash2, ImageIcon } from 'lucide-react';
import { useInstructorContext, JobTitleNames } from '../Context/InstructorContext';
import RatingDisplay from './RatingDisplay';

const InstructorTable = ({ onView, onEdit, onDelete, onAdd }) => {
  const { instructors, isLoading } = useInstructorContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full">
        <thead className="bg-white border-b border-gray-200">
          <tr>
            {['Name', 'Job Title', 'Rate', 'Action'].map(header => (
              <th
                key={header}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {instructors.map(instructor => (
            <tr key={instructor.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm font-medium">{instructor.name}</td>
              <td className="px-6 py-4 text-sm">
                {typeof instructor.jobTitle === 'number'
                  ? JobTitleNames[instructor.jobTitle]
                  : instructor.jobTitle}
              </td>
              <td className="px-6 py-4">
                <RatingDisplay rating={instructor.rate} size={16} />
              </td>
              <td className="px-6 py-4 flex space-x-3">
                <button
                  onClick={() => onView(instructor)}
                  className="hover:scale-110 transition"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => onEdit(instructor)}
                  className="hover:scale-110 transition"
                  title="Edit Instructor"
                >
                  <Pencil className="w-4 h-4 text-blue-500" />
                </button>
                <button
                  onClick={() => onDelete(instructor)}
                  className="hover:scale-110 transition"
                  title="Delete Instructor"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </td>
            </tr>
          ))}
          {instructors.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center space-y-2">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                  <p>No instructors found.</p>
                  <button
                    onClick={onAdd}
                    className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition text-sm"
                  >
                    Add Your First Instructor
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorTable;