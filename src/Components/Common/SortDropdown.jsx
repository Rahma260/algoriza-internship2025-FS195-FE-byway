import React from 'react';
import { ChevronDown } from 'lucide-react';

export const SortDropdown = ({ value, onChange }) => (
  <div className="relative">
    <select
      className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
      value={value}
      onChange={onChange}
    >
      <option value="latest">Latest</option>
      <option value="rating">Highest Rated</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <ChevronDown className="h-4 w-4" />
    </div>
  </div>
);