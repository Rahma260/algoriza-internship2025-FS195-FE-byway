import { useCourse } from '../Context/CourseContext';

export const useCourseAPI = () => {
  const { dispatch } = useCourse();

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://byway.runasp.net/api/Category/GetAll?page=1&pageSize=100');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      dispatch({ type: 'SET_CATEGORIES', payload: data.data || [] });
    } catch (err) {
      console.error('Error fetching categories:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch categories' });
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch('http://byway.runasp.net/api/Instructor/GetAll?page=1&pageSize=100');
      if (!response.ok) throw new Error('Failed to fetch instructors');
      const data = await response.json();
      dispatch({ type: 'SET_INSTRUCTORS', payload: data.data || [] });
    } catch (err) {
      console.error('Error fetching instructors:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch instructors' });
    }
  };

  const fetchCourseById = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch(`http://byway.runasp.net/api/Courses/GetById/${id}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      const data = await response.json();

      const levelStringToNumber = (levelStr) => {
        const map = {
          'AllLevels': 0,
          'Beginner': 1,
          'Intermediate': 2,
          'Expert': 3
        };
        return map[levelStr] || 0;
      };

      const courseData = {
        id: data.id,
        name: data.name || "",
        categoryId: data.categoryId || "",
        instructorId: data.instructorId || "",
        level: typeof data.level === 'string' ? levelStringToNumber(data.level) : (data.level || 0),
        totalHours: data.totalHours || "",
        cost: data.cost || "",
        rate: data.rate || 0,
        description: data.description || "",
        certification: data.certification || "",
        imageUrl: data.imageUrl || null,
        createAt: data.createAt
      };

      const contents = data.contents && data.contents.length > 0
        ? data.contents.map(content => ({
          id: content.id || null,
          name: content.name || "",
          lecturesNumber: content.lecturesNumber || "",
          time: content.time || ""
        }))
        : [{ id: null, name: "", lecturesNumber: "", time: "" }];

      dispatch({
        type: 'LOAD_COURSE_DATA',
        payload: { courseData, contents }
      });

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createCourse = async (step1Data, contents) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const formData = new FormData();

      Object.keys(step1Data).forEach(key => {
        if (key !== 'image' && key !== 'id' && key !== 'imageUrl') {
          formData.append(key, step1Data[key]);
        }
      });

      if (window.courseImageFile) {
        formData.append("image", window.courseImageFile);
      } else if (step1Data.image) {
        formData.append("image", step1Data.image);
      } else {
        throw new Error('Image is required for creating a course');
      }

      contents.forEach((content, index) => {
        formData.append(`contents[${index}].name`, content.name);
        formData.append(`contents[${index}].lecturesNumber`, content.lecturesNumber);
        formData.append(`contents[${index}].time`, content.time);
      });

      const response = await fetch('http://byway.runasp.net/api/Courses/Create', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }

      return await response.json();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCourse = async (id, step1Data, contents, hasNewImage) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const formData = new FormData();

      formData.append('id', id);

      Object.keys(step1Data).forEach(key => {
        if (key !== 'image' && key !== 'imageUrl' && key !== 'id') {
          formData.append(key, step1Data[key]);
        }
      });

      if (hasNewImage && window.courseImageFile) {
        formData.append("image", window.courseImageFile);
      }

      contents.forEach((content, index) => {
        if (content.id) {
          formData.append(`contents[${index}].id`, content.id);
        }
        formData.append(`contents[${index}].name`, content.name);
        formData.append(`contents[${index}].lecturesNumber`, content.lecturesNumber);
        formData.append(`contents[${index}].time`, content.time);
      });

      const response = await fetch(`http://byway.runasp.net/api/Courses/Update/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || 'Failed to update course');
      }

      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  const fetchTopCourses = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('http://byway.runasp.net/api/Courses/GetTop10/Top10');
      if (!response.ok) throw new Error('Failed to fetch top courses');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching top courses:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch top courses' });
      return [];
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };


  return {
    fetchCategories,
    fetchInstructors,
    fetchCourseById,
    createCourse,
    updateCourse,
    fetchTopCourses
  };
};