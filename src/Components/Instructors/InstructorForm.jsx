import React from 'react';
import { Camera, ImageIcon } from 'lucide-react';
import { JobTitle, JobTitleNames } from '../Context/InstructorContext';
import StarRatingInput from './StarRatingInput';

const InstructorForm = ({
  formData,
  onFieldChange,
  onFileChange,
  onSubmit,
  isSaving,
  onCancel,
  mode = 'add'
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex justify-start relative">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
            {formData.imagePreview ? (
              <img
                src={formData.imagePreview}
                alt="Instructor"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="text-gray-400 w-12 h-12" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer border-2 border-white hover:bg-blue-700 transition">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>
        {mode === 'add' && !formData.image && (
          <p className="ml-4 text-sm text-red-500 self-center">* Image is required</p>
        )}
        {mode === 'edit' && (
          <p className="ml-4 text-sm text-gray-500 self-center">
            Upload new image to replace current one (optional)
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
          maxLength={50}
          placeholder="Enter instructor name"
        />
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.jobTitle}
            onChange={(e) => onFieldChange('jobTitle', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Object.entries(JobTitle).map(([name, value]) => (
              <option key={value} value={value}>
                {JobTitleNames[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Rate <span className="text-red-500">*</span>
          </label>
          <StarRatingInput
            value={formData.rate}
            onChange={(rate) => onFieldChange('rate', rate)}
          />
          <p className="text-xs text-gray-500 mt-1">Selected: {formData.rate}/5</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          rows="4"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          minLength={100}
          placeholder="Enter description (minimum 100 characters)"
        ></textarea>
        <p className={`text-xs mt-1 ${formData.description.length < 100 ? 'text-red-500' : 'text-green-600'}`}>
          {formData.description.length}/100 characters {formData.description.length >= 100 ? '✓' : ''}
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || formData.description.length < 100 || (mode === 'add' && !formData.image)}
          className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </span>
          ) : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default InstructorForm;