import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InstructorHeader = ({ totalInstructors }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = () => {
    if (!user?.userName) return 'U';
    return user.userName.charAt(0).toUpperCase();
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="flex justify-between items-center py-2 px-4 bg-transparent">
        <h1 className="text-3xl font-bold text-gray-900">Instructors</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition" />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition`}
              title={user?.userName || 'User'}
            >
              {getInitials()}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.userName || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                  {user?.roles && user.roles.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {user.roles.map((role, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Dashboard / <span className="font-medium text-gray-700">Instructors</span>
        </p>
      </div>
    </>
  );
};

export default InstructorHeader;