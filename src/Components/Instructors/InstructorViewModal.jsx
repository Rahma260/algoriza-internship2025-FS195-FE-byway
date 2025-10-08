import React, { useEffect, useState } from 'react';
import { Pencil, ImageIcon, Calendar, Users, BookOpen } from 'lucide-react';
import { useInstructorContext, JobTitleNames } from '../Context/InstructorContext';
import RatingDisplay from './RatingDisplay';

const InstructorViewModal = ({ instructor, onEdit, onClose }) => {
  const { fetchInstructorStats } = useInstructorContext();
  const [stats, setStats] = useState({ courses: 0, students: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (instructor?.id) {
        setLoadingStats(true);
        const instructorStats = await fetchInstructorStats(instructor.id);
        setStats(instructorStats);
        setLoadingStats(false);
      }
    };
    loadStats();
  }, [instructor, fetchInstructorStats]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 pb-4 border-b-2 border-gray-100">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md">
          {instructor.imageUrl ? (
            <img
              src={instructor.imageUrl}
              alt={instructor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="text-blue-500 w-12 h-12" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {instructor.name}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <RatingDisplay rating={instructor.rate} size={18} />
            <span className="text-sm font-medium text-gray-700">
              ({instructor.rate}/5)
            </span>
          </div>
          {instructor.createdAt && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(instructor.createdAt)}</span>
            </div>
          )}
        </div>
      </div>

      {!loadingStats && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-center">
            <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.courses}</p>
            <p className="text-xs text-gray-600">Courses</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
            <p className="text-xs text-gray-600">Students</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
            Job Title
          </label>
          <p className="text-base font-medium text-gray-900">
            {typeof instructor.jobTitle === 'number'
              ? JobTitleNames[instructor.jobTitle]
              : instructor.jobTitle}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
            About Instructor
          </label>
          <p className="text-sm text-gray-700 leading-relaxed">
            {instructor.description || 'No description available'}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={() => {
            onClose();
            onEdit(instructor);
          }}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <Pencil className="w-4 h-4" />
          <span>Edit Instructor</span>
        </button>
        <button
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InstructorViewModal;