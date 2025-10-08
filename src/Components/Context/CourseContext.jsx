import React, { createContext, useContext, useReducer } from 'react';

const CourseContext = createContext();

const initialState = {
  step1Data: {
    id: null,
    name: "",
    image: null,
    categoryId: "",
    instructorId: "",
    level: 0,
    totalHours: "",
    cost: "",
    rate: 0,
    description: "",
    certification: ""
  },
  contents: [
    { id: null, name: "", lecturesNumber: "", time: "" }
  ],
  imagePreview: null,
  categories: [],
  instructors: [],
  loading: false,
  error: "",
  isUpdateMode: false,
  originalImageUrl: null,
  hasNewImage: false
};

const courseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_INSTRUCTORS':
      return { ...state, instructors: action.payload };

    case 'UPDATE_STEP1_DATA':
      return {
        ...state,
        step1Data: { ...state.step1Data, ...action.payload }
      };

    case 'SET_IMAGE_PREVIEW':
      return {
        ...state,
        imagePreview: action.payload,
        hasNewImage: !!action.payload && action.payload !== state.originalImageUrl
      };

    case 'SET_ORIGINAL_IMAGE_URL':
      return { ...state, originalImageUrl: action.payload };

    case 'SET_CONTENTS':
      return { ...state, contents: action.payload };

    case 'ADD_CONTENT':
      return {
        ...state,
        contents: [...state.contents, { id: null, name: "", lecturesNumber: "", time: "" }]
      };

    case 'REMOVE_CONTENT':
      return {
        ...state,
        contents: state.contents.filter((_, index) => index !== action.payload)
      };

    case 'UPDATE_CONTENT':
      const newContents = [...state.contents];
      newContents[action.payload.index][action.payload.field] = action.payload.value;
      return { ...state, contents: newContents };

    case 'LOAD_COURSE_DATA':
      return {
        ...state,
        step1Data: { ...initialState.step1Data, ...action.payload.courseData },
        contents: action.payload.contents || initialState.contents,
        imagePreview: action.payload.courseData.imageUrl || null,
        originalImageUrl: action.payload.courseData.imageUrl || null,
        isUpdateMode: true,
        hasNewImage: false
      };

    case 'SET_UPDATE_MODE':
      return { ...state, isUpdateMode: action.payload };

    case 'SET_HAS_NEW_IMAGE':
      return { ...state, hasNewImage: action.payload };

    case 'RESET_FOR_CREATE':
      return {
        ...initialState,
        categories: state.categories,
        instructors: state.instructors
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
};

export const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  return (
    <CourseContext.Provider
      value={{
        ...state,
        dispatch,
        currentCourse: state.step1Data,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};