import React from 'react';

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center text-gray-600 space-x-2">
    <Icon className="w-5 h-5 text-blue-600" />
    <span className="text-sm">{value}</span>
    <span className="text-xs text-gray-400">({label})</span>
  </div>
);

export default StatItem;