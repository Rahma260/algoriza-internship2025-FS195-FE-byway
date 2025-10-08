import React from 'react';
import { useCourse } from '../Context/CourseContext';

export const StarRating = () => {
  // Fix: Destructure directly from useCourse()
  const { step1Data, dispatch } = useCourse();

  const handleRateClick = (rating) => {
    dispatch({ type: 'UPDATE_STEP1_DATA', payload: { rate: rating } });
  };

  return (
    <div className="col-span-2 flex items-center gap-2">
      <label className="text-gray-700">Rate</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <span
            key={rating}
            onClick={() => handleRateClick(rating)}
            className={`text-2xl cursor-pointer ${rating <= step1Data.rate ? 'text-yellow-400' : 'text-gray-300'
              }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-gray-500 ml-2">({step1Data.rate}/5)</span>
    </div>
  );
};