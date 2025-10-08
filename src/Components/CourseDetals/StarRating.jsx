import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, count }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      ))}
      {hasHalfStar && (
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 opacity-50" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      {count !== undefined && (
        <span className="text-sm text-gray-500 ml-1">
          ({count.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
};

export default StarRating;
