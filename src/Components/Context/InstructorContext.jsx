import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

export const JobTitle = {
  FullstackDeveloper: 0,
  BackendDeveloper: 1,
  FrontendDeveloper: 2,
  UXUIDesigner: 3
};

export const JobTitleNames = {
  0: 'Fullstack Developer',
  1: 'Backend Developer',
  2: 'Frontend Developer',
  3: 'UX/UI Designer'
};

const InstructorContext = createContext(null);

export const useInstructorContext = () => {
  const context = useContext(InstructorContext);
  if (!context) {
    throw new Error('useInstructorContext must be used within InstructorProvider');
  }
  return context;
};

export const InstructorProvider = ({ children }) => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInstructors, setTotalInstructors] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJobTitle, setFilterJobTitle] = useState(null);

  const pageSize = 5;

  const fetchInstructors = useCallback(async (page = 1, name = '', jobTitle = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { page, pageSize };
      if (name) params.name = name;
      if (jobTitle !== null) params.jobTitle = jobTitle;

      const response = await axios.get(`${API_BASE_URL}/Instructor/GetAll`, { params });

      const normalizedInstructors = response.data.data.map((inst, index) => {
        // Try to find an ID from multiple possible fields
        const id = inst.instructorId || inst.Id || inst._id || inst.id;

        // If no ID is found, create a temporary one based on index
        const finalId = id || `temp-id-${Date.now()}-${index}`;

        return {
          ...inst,
          id: finalId,
          // Ensure jobTitle is a number to match JobTitleNames
          jobTitle: typeof inst.jobTitle === 'string' ? JobTitle[inst.jobTitle] || 0 : inst.jobTitle || 0
        };
      });

      setInstructors(normalizedInstructors);
      setTotalInstructors(response.data.total || normalizedInstructors.length);
      setCurrentPage(response.data.page || 1);
    } catch (err) {
      setError('Failed to fetch instructors. Please try again.');
      console.error('Error fetching instructors:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filterJobTitle]);

  const fetchInstructorById = useCallback(async (id) => {
    try {
      if (!id) {
        throw new Error('Instructor ID is required.');
      }
      console.log(`Fetching instructor with ID: ${id}`);
      const response = await axios.get(`${API_BASE_URL}/Instructor/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching instructor:', err);
      if (err.response && err.response.status === 404) {
        setError('Instructor not found.');
      } else {
        setError('Failed to load instructor details.');
      }
      return null;
    }
  }, []);

  const fetchInstructorStats = useCallback(async (instructorId) => {
    try {
      console.log('Fetching instructor stats for:', instructorId);
      const [coursesRes, studentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/Instructor/CountCourses/${instructorId}`),
        axios.get(`${API_BASE_URL}/Instructor/CountStudents/${instructorId}`)
      ]);

      console.log(' Courses response:', coursesRes.data);
      console.log('Students response:', studentsRes.data);

      return {
        courses: coursesRes.data,
        students: studentsRes.data,
        reviews: 0
      };
    } catch (err) {
      console.error('Error fetching instructor stats:', err);
      return { courses: 0, students: 0, reviews: 0 };
    }
  }, []);

  const createInstructor = useCallback(async (formData) => {
    try {
      await axios.post(`${API_BASE_URL}/Instructor`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchInstructors(currentPage, searchTerm, filterJobTitle);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.response?.data?.message || err.response?.data || 'Failed to create instructor.';
      return { success: false, error: errorMessage };
    }
  }, [currentPage, searchTerm, filterJobTitle, fetchInstructors]);

  const updateInstructor = useCallback(async (id, formData) => {
    try {
      await axios.put(`${API_BASE_URL}/Instructor/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchInstructors(currentPage, searchTerm, filterJobTitle);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.response?.data?.message || err.response?.data || 'Failed to update instructor.';
      return { success: false, error: errorMessage };
    }
  }, [currentPage, searchTerm, filterJobTitle, fetchInstructors]);

  const fetchInstructorCount = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Instructor/Count`);
      return response.data;
    } catch (err) {
      console.error('Error fetching instructor count:', err);
      return 0;
    }
  }, []);

  const deleteInstructor = useCallback(async (id) => {
    try {
      if (!id) {
        throw new Error('Instructor ID is required.');
      }
      console.log(`Deleting instructor with ID: ${id}`);
      await axios.delete(`${API_BASE_URL}/Instructor/${id}`);

      if (instructors.length === 1 && currentPage > 1) {
        await fetchInstructors(currentPage - 1, searchTerm, filterJobTitle);
        setCurrentPage(currentPage - 1);
      } else {
        await fetchInstructors(currentPage, searchTerm, filterJobTitle);
      }
      return { success: true };
    } catch (err) {
      let errorMessage = 'Failed to delete instructor.';

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = typeof err.response.data === 'string'
            ? err.response.data
            : err.response.data?.message || 'Cannot delete instructor assigned to courses.';
        } else if (err.response.status === 404) {
          errorMessage = 'Instructor not found.';
        } else if (err.response.data?.errors) {
          errorMessage = Object.values(err.response.data.errors).flat().join(', ');
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error('Error deleting instructor:', err);
      return { success: false, error: errorMessage };
    }
  }, [instructors.length, currentPage, searchTerm, filterJobTitle, fetchInstructors]);

  const fetchTopInstructors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/Instructor/Top10`);
      return response.data;
    } catch (err) {
      setError('Failed to fetch top instructors. Please try again.');
      console.error('Error fetching top instructors:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    instructors,
    selectedInstructor,
    setSelectedInstructor,
    isLoading,
    error,
    setError,
    currentPage,
    setCurrentPage,
    totalInstructors,
    pageSize,
    searchTerm,
    setSearchTerm,
    filterJobTitle,
    setFilterJobTitle,
    fetchInstructors,
    fetchInstructorById,
    fetchInstructorStats,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    fetchInstructorCount,
    fetchTopInstructors
  };

  return (
    <InstructorContext.Provider value={value}>
      {children}
    </InstructorContext.Provider>
  );
};