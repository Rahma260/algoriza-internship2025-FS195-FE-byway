import { useCourse } from '../Context/CourseContext';

export const useSessionStorage = () => {
  const {
    step1Data,
    contents,
    imagePreview,
    originalImageUrl,
    hasNewImage,
    dispatch
  } = useCourse();

  const saveToSession = (isUpdateMode = false) => {
    const dataToSave = {
      ...step1Data,
      imagePreview,
      originalImageUrl,
      isUpdateMode,
      hasNewImage,
      image: null
    };

    sessionStorage.setItem('courseStep1Data', JSON.stringify(dataToSave));
    sessionStorage.setItem('courseContents', JSON.stringify(contents));
    sessionStorage.setItem('courseIsUpdateMode', JSON.stringify(isUpdateMode));
    sessionStorage.setItem('courseHasNewImage', JSON.stringify(hasNewImage));

    console.log(' Saved to session:', {
      isUpdateMode,
      hasNewImage,
      contentsCount: contents.length,
      contents,
      courseId: step1Data.id
    });

    if (step1Data.image) {
      window.courseImageFile = step1Data.image;
    }
  };

  const loadFromSession = () => {
    try {
      const step1Raw = sessionStorage.getItem('courseStep1Data');
      const contentsRaw = sessionStorage.getItem('courseContents');
      const isUpdateModeRaw = sessionStorage.getItem('courseIsUpdateMode');
      const hasNewImageRaw = sessionStorage.getItem('courseHasNewImage');

      console.log('Loading from session:', {
        step1Data: step1Raw ? 'exists' : 'missing',
        contents: contentsRaw ? JSON.parse(contentsRaw) : 'missing',
        isUpdateMode: isUpdateModeRaw,
        hasNewImage: hasNewImageRaw
      });

      if (step1Raw) {
        const parsedStep1 = JSON.parse(step1Raw);
        dispatch({ type: 'UPDATE_STEP1_DATA', payload: parsedStep1 });

        if (parsedStep1.imagePreview) {
          dispatch({ type: 'SET_IMAGE_PREVIEW', payload: parsedStep1.imagePreview });
        }

        if (parsedStep1.originalImageUrl) {
          dispatch({ type: 'SET_ORIGINAL_IMAGE_URL', payload: parsedStep1.originalImageUrl });
        }
      }

      if (contentsRaw) {
        const parsedContents = JSON.parse(contentsRaw);
        dispatch({ type: 'SET_CONTENTS', payload: parsedContents });
      }

      if (isUpdateModeRaw !== null) {
        dispatch({ type: 'SET_UPDATE_MODE', payload: JSON.parse(isUpdateModeRaw) });
      }

      if (hasNewImageRaw !== null) {
        dispatch({ type: 'SET_HAS_NEW_IMAGE', payload: JSON.parse(hasNewImageRaw) });
      }
    } catch (error) {
      console.error('Error loading from session:', error);
    }
  };

  const clearSession = () => {
    sessionStorage.removeItem('courseStep1Data');
    sessionStorage.removeItem('courseContents');
    sessionStorage.removeItem('courseIsUpdateMode');
    sessionStorage.removeItem('courseHasNewImage');
    delete window.courseImageFile;
  };

  return { saveToSession, loadFromSession, clearSession };
};