import React from 'react';

export const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="text-center py-12 bg-white rounded-lg">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p className="text-gray-600">{message}</p>
  </div>
);