// src/components/Courses/CourseDeleteModal.js
import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';

const CourseDeleteModal = ({
  course,
  onConfirm,
  onCancel,
  isDeleting,
  deleteError
}) => {
  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <p className="text-gray-700 text-center mb-6">
        Are you sure you want to delete <strong>{course.name}</strong>?
        <br />
        <span className="text-sm text-red-600">This action cannot be undone.</span>
      </p>

      {/* Error Alert */}
      {deleteError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Deletion Failed</p>
            <p className="text-sm text-red-700 mt-1">{deleteError}</p>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Deleting...</span>
            </span>
          ) : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default CourseDeleteModal;