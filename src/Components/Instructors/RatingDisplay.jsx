import React from 'react';
import { Star } from 'lucide-react';

const RatingDisplay = ({ rating, size = 16 }) => {
  const fullStars = Math.floor(rating);
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        style={{ width: size, height: size }}
        className={i <= fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    );
  }

  return <div className="flex items-center space-x-0.5">{stars}</div>;
};

export default RatingDisplay;