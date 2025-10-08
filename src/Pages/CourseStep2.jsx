import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useCourse } from "../Components/Context/CourseContext";
import { useCourseAPI } from "../Components/Hooks/UseCourseApi";
import { useSessionStorage } from "../Components/Hooks/useSessionStorage";
import { ErrorMessage } from "../Components/UI/ErrorMessage";
import ContentSection from "../Components/Courses/ContentSection";

export const CourseStep2 = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    step1Data,
    contents,
    loading,
    error,
    hasNewImage,
    originalImageUrl,
    dispatch
  } = useCourse();

  const { createCourse, updateCourse } = useCourseAPI();
  const { loadFromSession, clearSession, saveToSession } = useSessionStorage();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isUpdateMode = !!id;

  useEffect(() => {
    const sessionStep1Data = sessionStorage.getItem('courseStep1Data');
    if (!sessionStep1Data) {
      const backRoute = isUpdateMode
        ? `/dashboard/courses/update/${id}/step1`
        : "/dashboard/courses/add/step1";
      navigate(backRoute);
      return;
    }

    loadFromSession();
  }, [navigate, id, isUpdateMode]);

  const validateStep2 = () => {
    for (let content of contents) {
      if (!content.name.trim()) {
        dispatch({ type: 'SET_ERROR', payload: "All content sections must have a name" });
        return false;
      }
      if (!content.lecturesNumber || content.lecturesNumber <= 0) {
        dispatch({ type: 'SET_ERROR', payload: "All content sections must have a valid number of lectures" });
        return false;
      }
      if (!content.time || content.time <= 0) {
        dispatch({ type: 'SET_ERROR', payload: "All content sections must have a valid time" });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    try {
      if (isUpdateMode) {
        await updateCourse(
          id,
          step1Data,
          contents,
          hasNewImage,
          originalImageUrl
        );
      } else {
        await createCourse(step1Data, contents);
      }

      clearSession();
      const successMessage = isUpdateMode
        ? 'Course updated successfully!'
        : 'Course created successfully!';

      navigate('/dashboard/courses', { state: { success: successMessage } });
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleBack = () => {
    saveToSession(isUpdateMode);

    const backRoute = isUpdateMode
      ? `/dashboard/courses/update/${id}/step1`
      : "/dashboard/courses/add/step1";
    navigate(backRoute);
  };

  const handleCancel = () => {
    clearSession();
    navigate("/dashboard/courses");
  };

  const addContent = () => {
    dispatch({ type: 'ADD_CONTENT' });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-64 p-6 space-y-6">
        <div className="flex items-center justify-between md:justify-start mb-6">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold">
            {isUpdateMode ? 'Update' : 'Add'} Course{" "}
            <span className="ml-2 text-lg font-medium text-gray-500">
              Step 2 of 2
            </span>
          </h2>
        </div>

        <ErrorMessage message={error} />

        <div className="max-w-5xl bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <div className="space-y-6">
            {contents.map((content, index) => (
              <ContentSection
                key={`${index}-${content.id || 'new'}`}
                content={content}
                index={index}
              />
            ))}
          </div>

          <button
            onClick={addContent}
            className="mt-6 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            + Add Another Content
          </button>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-7 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading
                  ? (isUpdateMode ? 'Updating...' : 'Creating...')
                  : (isUpdateMode ? 'Update Course' : 'Create Course')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseStep2;