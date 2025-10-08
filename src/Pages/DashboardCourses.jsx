import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import AdminHeader from "../Components/Dashboard/DashboardHeader";
import { useCourseData } from "../Components/Hooks/UseCourseData";
import { useDashboardCourses } from "../Components/Hooks/UseDashboardCourses";
import { DashboardToolbar } from "../Components/Dashboard/DashboardToolbar";
import { CourseCardGrid } from "../Components/Courses/CourseCardGrid";
import { CourseTableRow } from "../Components/Courses/CourseTableRow";
import { Pagination } from "../Components/Common/Pagination";
import { LoadingSpinner } from "../Components/Common/LoadingSpinner";
import { EmptyState } from "../Components/Common/EmptyState";
import CourseDeleteModal from "../Components/Courses/CourseDeleteModal";

export default function DashboardCourses() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    categories,
    instructors,
    fetchCategories,
    fetchInstructors,
    getCategoryName,
    getInstructorName
  } = useCourseData();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(9);
  const [refresh, setRefresh] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [updateError, setUpdateError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

  const {
    courses,
    loading,
    error,
    totalCount,
    deleteCourse,
    updateCourse
  } = useDashboardCourses(pageNumber, pageSize, searchTerm, categoryFilter, selectedRating, priceRange);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (location.state?.refresh) {
      setRefresh(prev => prev + 1);
    }
  }, [location.state]);

  useEffect(() => {
    fetchCategories();
    fetchInstructors();
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const filterValue = value === "" ? null : parseInt(value, 10);
    setCategoryFilter(filterValue);
    setPageNumber(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPageNumber(1);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setPageNumber(1);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    setPageNumber(1);
  };

  const handleDelete = async (id) => {
    setSelectedCourseId(id);
    setDeleteError("");
    setIsDeleting(false);
  };

  const handleView = (courseId) => {
    navigate(`/dashboard/courses/view/${courseId}`);
  };

  const handleUpdate = async (courseId) => {
    setUpdateError("");
    try {
      await updateCourse(courseId);
      setRefresh(prev => prev + 1);
    } catch (err) {
      if (err.message.includes("enrolled students")) {
        setUpdateError("Cannot update a course that has enrolled students.");
      } else {
        setUpdateError("Could not update course.");
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter(null);
    setSelectedRating(0);
    setPriceRange({ min: 0, max: 5000 });
    setPageNumber(1);
  };

  const getFilterDisplayName = () => {
    if (categoryFilter === null) return "All Courses";
    return getCategoryName(categoryFilter);
  };

  const hasFilters = searchTerm || categoryFilter !== null || selectedRating > 0 || (priceRange.min > 0 || priceRange.max < 5000);

  const handleAddCourse = () => {
    navigate('/dashboard/courses/create');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 md:ml-64">
        <AdminHeader
          title="Courses"
          subtitle="Manage your courses"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="p-6">
          <DashboardToolbar
            filterDisplayName={getFilterDisplayName()}
            totalCount={totalCount}
            categories={categories}
            categoryFilter={categoryFilter}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedRating={selectedRating}
            onRatingChange={handleRatingChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
          />

          {loading && <LoadingSpinner message="Loading courses..." />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {updateError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {updateError}
            </div>
          )}

          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {deleteError}
            </div>
          )}

          {!loading && !error && courses.length === 0 && (
            <EmptyState
              hasFilters={hasFilters}
              onClearFilters={handleClearFilters}
            />
          )}

          {!loading && !error && courses.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCardGrid
                      key={course.id}
                      course={course}
                      getCategoryName={getCategoryName}
                      getInstructorName={getInstructorName}
                      onView={handleView}
                      onDelete={() => handleDelete(course.id)}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Instructor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {courses.map((course) => (
                          <CourseTableRow
                            key={course.id}
                            course={course}
                            getCategoryName={getCategoryName}
                            getInstructorName={getInstructorName}
                            onView={handleView}
                            onDelete={() => handleDelete(course.id)}
                            onUpdate={handleUpdate}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                onPageChange={setPageNumber}
              />
            </>
          )}
        </div>

        {selectedCourseId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <CourseDeleteModal
                course={{ name: courses.find(c => c.id === selectedCourseId).name }}
                onConfirm={async () => {
                  setIsDeleting(true);
                  try {
                    await deleteCourse(selectedCourseId);
                    setIsDeleting(false);
                    setSelectedCourseId(null);
                    setDeleteError("");
                    setRefresh(prev => prev + 1);
                  } catch (err) {
                    setDeleteError("Could not delete course.");
                    setIsDeleting(false);
                  }
                }}
                onCancel={() => setSelectedCourseId(null)}
                isDeleting={isDeleting}
                deleteError={deleteError}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}