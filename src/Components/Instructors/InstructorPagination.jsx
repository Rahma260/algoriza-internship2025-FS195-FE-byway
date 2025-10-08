import React from 'react';
import { useInstructorContext } from '../Context/InstructorContext';

const InstructorPagination = () => {
  const { currentPage, setCurrentPage, totalInstructors, pageSize } = useInstructorContext();
  const totalPages = Math.ceil(totalInstructors / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center space-x-0.5 text-sm p-1 border border-gray-200 rounded-lg">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium transition ${page === currentPage
              ? 'bg-black text-white'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default InstructorPagination;