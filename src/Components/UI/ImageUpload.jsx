import React from 'react';
import { Upload, X } from 'lucide-react';
import { useCourse } from '../Context/CourseContext';

export const ImageUpload = () => {
  // Fix: Destructure all properties directly from useCourse()
  const {
    imagePreview,
    originalImageUrl,
    isUpdateMode,
    hasNewImage,
    dispatch
  } = useCourse();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image/(jpg|jpeg|png|gif)')) {
        dispatch({ type: 'SET_ERROR', payload: 'Please upload a valid image file (.jpg, .jpeg, .png, .gif)' });
        return;
      }

      // Update the image in state
      dispatch({ type: 'UPDATE_STEP1_DATA', payload: { image: file } });
      dispatch({ type: 'SET_HAS_NEW_IMAGE', payload: true });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ type: 'SET_IMAGE_PREVIEW', payload: reader.result });
      };
      reader.readAsDataURL(file);

      // Store file reference globally
      window.courseImageFile = file;

      dispatch({ type: 'SET_ERROR', payload: "" });
    }
  };

  const handleRemoveImage = () => {
    if (isUpdateMode && originalImageUrl) {
      // In update mode, revert to original image
      dispatch({ type: 'SET_IMAGE_PREVIEW', payload: originalImageUrl });
      dispatch({ type: 'UPDATE_STEP1_DATA', payload: { image: null } });
      dispatch({ type: 'SET_HAS_NEW_IMAGE', payload: false });
      delete window.courseImageFile;
    } else {
      // In create mode or update mode without original image, remove completely
      dispatch({ type: 'SET_IMAGE_PREVIEW', payload: null });
      dispatch({ type: 'UPDATE_STEP1_DATA', payload: { image: null } });
      dispatch({ type: 'SET_HAS_NEW_IMAGE', payload: false });
      delete window.courseImageFile;
    }
  };

  const displayImage = imagePreview || originalImageUrl;

  return (
    <div className="mb-6 border rounded-lg p-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-10 text-center relative">
        {displayImage ? (
          <div className="relative">
            <img src={displayImage} alt="Preview" className="max-h-64 rounded-lg" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
            {isUpdateMode && hasNewImage && (
              <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                New Image
              </div>
            )}
            {isUpdateMode && !hasNewImage && originalImageUrl && (
              <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                Current Image
              </div>
            )}
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500">Size: 700x430 pixels</p>
            <p className="text-gray-500 mb-3">File Support: .jpg, .jpeg, .png, .gif</p>
            <label className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer ">
              {isUpdateMode ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      {/* Always show the file input for changing image */}
      {displayImage && (
        <div className="mt-4 text-center">
          <label className="px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-700 text-sm">
            {isUpdateMode ? 'Change Image' : 'Replace Image'}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {isUpdateMode && originalImageUrl && !hasNewImage && (
        <p className="text-sm text-green-600 mt-2 text-center">✓ Using existing image</p>
      )}
    </div>
  );
};