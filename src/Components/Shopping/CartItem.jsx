import React from 'react';
import { StarRating } from '../Common/StarRating';

export const CartItem = ({ item, onRemove }) => (
  <div className="flex p-4 border-b border-gray-200 bg-white items-start">
    <img
      src={item.imageUrl}
      alt={item.title}
      className="w-20 h-20 rounded-lg object-cover mr-4 flex-shrink-0"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/80x80/2f3337/ffffff?text=Course"
      }}
    />
    <div className="flex-grow">
      <h4 className="text-base font-semibold text-gray-900">{item.title}</h4>
      <p className="text-sm text-gray-600">{item.instructor}</p>
      <div className="flex items-center space-x-2 mt-1">
        <StarRating rating={item.rating} size="w-3 h-3" />
        <span className="text-xs text-gray-500">{item.details}</span>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(item.courseId)}
          className="flex items-center text-xs text-red-500 hover:text-red-700 mt-2 font-medium"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Remove
        </button>
      )}
    </div>
    <p className="text-lg font-bold text-gray-900 flex-shrink-0">${item.price.toFixed(2)}</p>
  </div>
);