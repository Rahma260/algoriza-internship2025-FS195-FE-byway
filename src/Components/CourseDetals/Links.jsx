import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ courseTitle }) => {
  return (
    <nav className="text-sm text-gray-500 mb-6 hidden md:block">
      <Link to="/" className="hover:text-blue-600">Home</Link>
      <span className="mx-2">&gt;</span>
      <Link to="/courses" className="hover:text-blue-600">Courses</Link>
      <span className="mx-2">&gt;</span>
      <span className="text-blue-600 font-medium">{courseTitle}</span>
    </nav>
  );
};

export default Breadcrumbs;