import React from 'react';
import { useCourse } from '../Context/CourseContext';
import { FormInput } from '../UI/FormInput';
import { FormSelect } from '../UI/FormSelect';
import { FormTextarea } from '../UI/FormTextarea';
import { StarRating } from '../UI/StarRating';

export const CourseBasicForm = () => {
  const {
    step1Data,
    categories,
    instructors,
    dispatch
  } = useCourse();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numberFields = ["categoryId", "instructorId", "level", "totalHours", "cost"];

    dispatch({
      type: 'UPDATE_STEP1_DATA',
      payload: {
        [name]: numberFields.includes(name) ? Number(value) : value
      }
    });
  };

  const levelOptions = [
    { id: 0, name: "All Levels" },
    { id: 1, name: "Beginner" },
    { id: 2, name: "Intermediate" },
    { id: 3, name: "Expert" }
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <FormInput
        name="name"
        value={step1Data.name}
        onChange={handleInputChange}
        placeholder="Course Name"
        maxLength={100}
      />

      <FormSelect
        name="categoryId"
        value={step1Data.categoryId}
        onChange={handleInputChange}
        options={categories}
        placeholder="Select Category"
      />

      <FormSelect
        name="instructorId"
        value={step1Data.instructorId}
        onChange={handleInputChange}
        options={instructors}
        placeholder="Select Instructor"
      />

      <FormSelect
        name="level"
        value={step1Data.level}
        onChange={handleInputChange}
        options={levelOptions}
        placeholder="Select Level"
      />

      <FormInput
        type="number"
        name="totalHours"
        value={step1Data.totalHours}
        onChange={handleInputChange}
        placeholder="Total Hours"
        min="0"
      />

      <FormInput
        type="number"
        name="cost"
        value={step1Data.cost}
        onChange={handleInputChange}
        placeholder="Cost"
        min="0"
      />

      <StarRating />

      <FormTextarea
        name="description"
        value={step1Data.description}
        onChange={handleInputChange}
        placeholder="Write here"
        minLength={100}
        label="Description"
      />

      <FormTextarea
        name="certification"
        value={step1Data.certification}
        onChange={handleInputChange}
        placeholder="Write here"
        minLength={100}
        label="Certification"
      />
    </div>
  );
};