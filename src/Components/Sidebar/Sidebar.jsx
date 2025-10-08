import {
  X,
  CheckSquare,
  Home,
  Folder,
  User,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Logo from "../Layout/Logo";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    setSidebarOpen(false);

    navigate('/', { replace: true });
  };

  const menuItems = [
    { id: 1, name: "Dashboard", icon: <Home size={20} />, path: "/dashboard", action: null },
    { id: 2, name: "Instructors", icon: <User size={20} />, path: "/dashboard/instructors", action: null },
    { id: 3, name: "Courses", icon: <Folder size={20} />, path: "/dashboard/courses", action: null },
    { id: 5, name: "Logout", icon: <LogOut size={20} />, path: null, action: handleLogout },
  ];

  const handleMenuClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.div
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-white shadow-lg fixed h-full z-40 md:hidden"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            item.path ? (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-red-100 hover:text-red-600 transition w-full text-left"
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            )
          ))}
        </nav>
      </motion.div>

      <div className="hidden md:flex md:flex-col w-64 bg-white shadow-lg min-h-screen fixed left-0 top-0">
        <div className="flex items-center gap-2 p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        <nav className="mt-6 mb-6 flex-1">
          {menuItems.map((item) => (
            item.path ? (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-red-100 hover:text-red-600 transition w-full text-left"
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            )
          ))}
        </nav>
      </div>
    </>
  );
}