import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User, Settings, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminHeader = ({
  sidebarOpen,
  setSidebarOpen,
  title,
  subtitle,
  breadcrumb,
  actions = null
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const getInitials = () => {
    if (!user?.userName) return 'U';
    return user.userName.charAt(0).toUpperCase();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/courses')) return 'Courses';
    if (path.includes('/dashboard/instructors')) return 'Instructors';
    if (path.includes('/dashboard/categories')) return 'Categories';
    if (path.includes('/dashboard')) return 'Dashboard';
    return 'Dashboard';
  };

  const getPageSubtitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/courses')) return 'Manage your courses';
    if (path.includes('/dashboard/instructors')) return 'Manage instructors';
    if (path.includes('/dashboard/categories')) return 'Manage course categories';
    if (path.includes('/dashboard')) return 'Overview';
    return 'Overview';
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/courses')) return 'Dashboard / Courses';
    if (path.includes('/dashboard/instructors')) return 'Dashboard / Instructors';
    if (path.includes('/dashboard/categories')) return 'Dashboard / Categories';
    return 'Dashboard';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const notifications = [
    { id: 1, text: 'New course enrollment', time: '2 hours ago', read: false },
    { id: 2, text: 'Instructor application received', time: '5 hours ago', read: false },
    { id: 3, text: 'System maintenance scheduled', time: '1 day ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} className="sm:w-6 sm:h-6" />
            </button>

            <div className="flex-1 min-w-0">
              {breadcrumb && (
                <nav className="text-xs sm:text-sm text-gray-500 mb-1 truncate">
                  {breadcrumb || getBreadcrumb()}
                </nav>
              )}
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                {title || getPageTitle()}
              </h1>
              <p className="hidden sm:block text-sm sm:text-base text-gray-600 truncate">
                {subtitle || getPageSubtitle()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {actions && (
              <div className="hidden sm:block">
                {actions}
              </div>
            )}

            {actions && (
              <button
                onClick={actions.props?.onClick}
                className="sm:hidden p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                title={actions.props?.children || 'Action'}
              >
                <span className="text-xs font-medium">+</span>
              </button>
            )}

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowDropdown(false);
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-500">
                      {unreadCount} unread
                    </p>
                  </div>

                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 ${!notification.read ? 'bg-blue-50' : ''
                          }`}
                      >
                        <p className="text-sm text-gray-900">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-500 text-center">
                      No notifications
                    </div>
                  )}

                  <div className="px-3 sm:px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1 sm:gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="bg-gray-700 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                  {getInitials()}
                </div>
                <ChevronDown className="w-3 h-3 sm:hidden text-gray-600" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-24">
                    {user?.userName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.roles?.[0] || 'Admin'}
                  </p>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.userName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                    {user?.roles && user.roles.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
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
                      className="w-full px-3 sm:px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;