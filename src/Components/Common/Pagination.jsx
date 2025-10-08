import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-10">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
          const showPage =
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1;

          if (!showPage) {
            if (page === 2 && currentPage > 3) {
              return <span key={`ellipsis-start`} className="px-2">...</span>;
            }
            if (page === totalPages - 1 && currentPage < totalPages - 2) {
              return <span key={`ellipsis-end`} className="px-2">...</span>;
            }
            return null;
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-semibold transition ${page === currentPage
                ? 'bg-black text-white'
                : 'text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};