import React from 'react';
import { Search, Plus, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardToolbar = ({
  filterDisplayName,
  totalCount,
  categories,
  categoryFilter,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{filterDisplayName}</h2>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {totalCount}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
        <Link
          to="/dashboard/courses/add/step1"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-white hover:text-black border border-black transition duration-500 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Course
        </Link>

        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={categoryFilter === null ? "" : categoryFilter}
          onChange={onCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map(cat => {
            const categoryId = cat.id || cat.Id;
            return (
              <option key={categoryId} value={categoryId}>
                {cat.name}
              </option>
            );
          })}
        </select>

        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full sm:w-64 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 border rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
            title="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 border rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
            title="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
);