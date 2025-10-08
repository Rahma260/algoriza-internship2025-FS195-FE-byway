import { useState } from 'react';
import { JobTitle } from '../Context/InstructorContext';

const initialFormState = {
  name: '',
  jobTitle: JobTitle.FrontendDeveloper,
  rate: 1,
  description: '',
  image: null,
  imagePreview: null
};

export const useInstructorForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const loadInstructor = (instructor) => {
    setFormData({
      id: instructor.id,
      name: instructor.name || '',
      jobTitle: typeof instructor.jobTitle === 'number'
        ? instructor.jobTitle
        : JobTitle.FrontendDeveloper,
      rate: instructor.rate || 1,
      description: instructor.description || '',
      image: null,
      imagePreview: instructor.imageUrl || null
    });
  };

  const handleFileChange = (e, setError) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const buildFormData = (mode) => {
    const formDataToSend = new FormData();

    if (mode === 'edit') {
      formDataToSend.append('id', formData.id);
    }

    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('jobTitle', formData.jobTitle);
    formDataToSend.append('rate', formData.rate);
    formDataToSend.append('description', formData.description.trim());

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    return formDataToSend;
  };

  return {
    formData,
    setFormData,
    isSaving,
    setIsSaving,
    resetForm,
    loadInstructor,
    handleFileChange,
    updateField,
    buildFormData
  };
};