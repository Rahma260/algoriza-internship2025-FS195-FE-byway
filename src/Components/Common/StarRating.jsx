import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating, size = 'w-4 h-4' }) => {
  const fullStars = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < fullStars ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
          fill={i < fullStars ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
};