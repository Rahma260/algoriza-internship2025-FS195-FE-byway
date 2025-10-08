import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Menu } from "lucide-react";
import { useCourse } from "../Components/Context/CourseContext";
import { useCourseAPI } from "../Components/Hooks/UseCourseApi";
import Sidebar from "../Components/Sidebar/Sidebar";

export default function ViewCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    step1Data,
    contents,
    loading,
    error,
    imagePreview,
    categories,
    instructors
  } = useCourse();
  const { fetchCourseById, fetchCategories, fetchInstructors } = useCourseAPI();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    const initializeData = async () => {
      await fetchCategories();
      await fetchInstructors();
      await fetchCourseById(id);
    };
    initializeData();
  }, [id]);

  const getLevelName = (lvl) =>
    ["All Levels", "Beginner", "Intermediate", "Expert"][lvl] ?? "Unknown";

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId || cat.Id === categoryId);
    return category ? category.name : "Loading...";
  };

  const getInstructorName = (instructorId) => {
    const instructor = instructors.find(inst => inst.id === instructorId || inst.Id === instructorId);
    return instructor ? instructor.name : "Loading...";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !step1Data.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Course not found"}</p>
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-64">
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
                  View Course
                </h1>
                <p className="text-gray-600">Course Details</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="w-full max-w-5xl bg-white shadow-sm rounded-lg p-8 mx-auto">

            <div className="mb-6 border rounded-lg p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-10 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt={step1Data.name}
                      className="max-h-64 rounded-lg"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">No image available</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {step1Data.name}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {getCategoryName(step1Data.categoryId)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {getInstructorName(step1Data.instructorId)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {getLevelName(step1Data.level)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Hours
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {step1Data.totalHours} hours
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    ${step1Data.cost}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.floor(step1Data.rate || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-gray-600">
                      ({step1Data.rate || 0})
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 whitespace-pre-wrap min-h-[200px]">
                  {step1Data.description}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification
                </label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 whitespace-pre-wrap min-h-[200px]">
                  {step1Data.certification}
                </div>
              </div>

              {contents?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Course Contents
                  </label>
                  <div className="space-y-3">
                    {contents.map((content, index) => (
                      <div key={content.id || index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <h3 className="font-medium mb-2">
                          Section {index + 1}: {content.name}
                        </h3>
                        <div className="text-sm text-gray-600">
                          {content.lecturesNumber} lectures • {content.time} minutes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t">
              <button
                onClick={() => navigate("/dashboard/courses")}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Courses
              </button>
              <button
                onClick={() => navigate(`/dashboard/courses/update/${id}/step1`)}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Edit size={20} />
                Edit Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}