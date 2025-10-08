import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useCourse } from "../Components/Context/CourseContext";
import { useCourseAPI } from "../Components/Hooks/UseCourseApi";
import { useSessionStorage } from "../Components/Hooks/useSessionStorage";
import { ErrorMessage } from "../Components/UI/ErrorMessage";
import { ImageUpload } from "../Components/UI/ImageUpload";
import { CourseBasicForm } from "../Components/Courses/CourseBasicForm";

export const CourseStep1 = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    step1Data,
    contents,
    loading,
    error,
    hasNewImage,
    originalImageUrl,
    categories,
    instructors,
    imagePreview,
    isUpdateMode: contextUpdateMode,
    dispatch
  } = useCourse();

  const { fetchCategories, fetchInstructors, fetchCourseById } = useCourseAPI();
  const { saveToSession, loadFromSession, clearSession } = useSessionStorage();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isUpdateMode = !!id;

  useEffect(() => {
    const initializeData = async () => {
      dispatch({ type: 'SET_ERROR', payload: '' });

      await fetchCategories();
      await fetchInstructors();

      if (isUpdateMode) {
        const sessionData = sessionStorage.getItem('courseStep1Data');
        const sessionContents = sessionStorage.getItem('courseContents');

        if (sessionData && sessionContents) {
          const parsedData = JSON.parse(sessionData);
          const parsedContents = JSON.parse(sessionContents);

          if (parsedData.id === parseInt(id)) {
            loadFromSession();
            return;
          }
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
          const result = await fetchCourseById(id);
          dispatch({ type: 'SET_UPDATE_MODE', payload: true });

          setTimeout(() => {
            saveToSession(true);
          }, 100);

        } catch (error) {
          console.error('Error fetching course:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load course data' });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        const sessionData = sessionStorage.getItem('courseStep1Data');

        if (sessionData) {
          const parsedData = JSON.parse(sessionData);

          if (!parsedData.isUpdateMode && !parsedData.id) {
            loadFromSession();
            return;
          }
        }

        clearSession();
        dispatch({ type: 'RESET_FOR_CREATE' });
      }
    };

    initializeData();
  }, [id]);

  const validateStep1 = () => {
    console.log('Validating step1...');

    if (!step1Data.name.trim()) {
      console.log('Validation failed: Course name is empty');
      dispatch({ type: 'SET_ERROR', payload: "Course name is required" });
      return false;
    }

    if (!isUpdateMode) {
      if (!step1Data.image && !window.courseImageFile) {
        console.log('Validation failed: No image for new course');
        dispatch({ type: 'SET_ERROR', payload: "Course image is required" });
        return false;
      }
    } else {
      if (!originalImageUrl && !hasNewImage && !window.courseImageFile) {
        console.log('Validation failed: No image for update');
        dispatch({ type: 'SET_ERROR', payload: "Course image is required" });
        return false;
      }
    }

    if (!step1Data.categoryId) {
      console.log('Validation failed: No category selected');
      dispatch({ type: 'SET_ERROR', payload: "Category is required" });
      return false;
    }

    if (!step1Data.instructorId) {
      console.log('Validation failed: No instructor selected');
      dispatch({ type: 'SET_ERROR', payload: "Instructor is required" });
      return false;
    }

    if (!step1Data.description || step1Data.description.length < 100) {
      console.log('Validation failed: Description too short:', step1Data.description?.length || 0);
      dispatch({ type: 'SET_ERROR', payload: "Description must be at least 100 characters" });
      return false;
    }

    if (!step1Data.certification || step1Data.certification.length < 100) {
      console.log('Validation failed: Certification too short:', step1Data.certification?.length || 0);
      dispatch({ type: 'SET_ERROR', payload: "Certification must be at least 100 characters" });
      return false;
    }

    console.log('All validations passed!');
    return true;
  };

  const handleNext = () => {
    console.log('handleNext called');
    console.log('Current step1Data:', step1Data);
    console.log('Image status:', {
      hasImage: !!step1Data.image,
      hasWindowFile: !!window.courseImageFile,
      hasOriginalUrl: !!originalImageUrl,
      hasNewImage: hasNewImage
    });

    const isValid = validateStep1();
    console.log('Validation result:', isValid);

    if (!isValid) {
      console.log('Validation failed, not proceeding');
      return;
    }

    console.log('Validation passed, saving to session...');
    saveToSession(isUpdateMode);

    const nextRoute = isUpdateMode
      ? `/dashboard/courses/update/${id}/step2`
      : "/dashboard/courses/add/step2";

    console.log('Navigating to:', nextRoute);
    navigate(nextRoute);
  };
  const handleCancel = () => {
    clearSession();
    dispatch({ type: 'RESET_FOR_CREATE' });
    navigate("/dashboard/courses");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-64">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard/courses")}
                className="p-2 hover:bg-gray-100 rounded-lg transition md:block hidden"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-200"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {isUpdateMode ? 'Update Course' : 'Add Course'}
                </h1>
                <p className="text-gray-600">Step 1 of 2 - Course Details</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="w-full max-w-5xl bg-white shadow-sm rounded-lg p-8 mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course data...</p>
              </div>
            ) : (
              <>
                <ErrorMessage message={error} />
                <ImageUpload />
                <CourseBasicForm />

                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="px-8 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400 transition-colors font-medium"
                  >
                    {loading ? 'Processing...' : 'Next Step →'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseStep1;