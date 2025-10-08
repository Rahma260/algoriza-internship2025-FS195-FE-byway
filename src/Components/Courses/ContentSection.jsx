import React from 'react';
import { Trash2 } from 'lucide-react';
import { useCourse } from '../Context/CourseContext';

const ContentSection = ({ content, index }) => {
  const { dispatch } = useCourse();

  const handleChange = (field, value) => {
    dispatch({
      type: 'UPDATE_CONTENT',
      payload: {
        index,
        field,
        value
      }
    });
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this content section?')) {
      dispatch({
        type: 'REMOVE_CONTENT',
        payload: index
      });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Content Section {index + 1}
        </h3>
        {index > 0 && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
            title="Remove section"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor={`content-name-${index}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Section Name *
        </label>
        <input
          type="text"
          id={`content-name-${index}`}
          value={content.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="e.g. Introduction to React"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`content-lectures-${index}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Number of Lectures *
          </label>
          <input
            type="number"
            id={`content-lectures-${index}`}
            value={content.lecturesNumber || ''}
            onChange={(e) => handleChange('lecturesNumber', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="e.g. 12"
            min="1"
          />
        </div>

        <div>
          <label
            htmlFor={`content-time-${index}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Duration (minutes) *
          </label>
          <input
            type="number"
            id={`content-time-${index}`}
            value={content.time || ''}
            onChange={(e) => handleChange('time', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="e.g. 45"
            min="1"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentSection;