import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRatingInput = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center space-x-1 cursor-pointer">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: 24, height: 24 }}
          className={`${i <= (hoverValue || value)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300 hover:text-yellow-300'
            }`}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHoverValue(i)}
          onMouseLeave={() => setHoverValue(0)}
        />
      ))}
    </div>
  );
};

export default StarRatingInput;