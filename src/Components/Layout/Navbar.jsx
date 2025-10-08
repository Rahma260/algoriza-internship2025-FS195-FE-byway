import Logo from "./Logo";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import "./Layout.css";
import { useAuth } from '../Context/AuthContext';
import { useShoppingContext } from '../Hooks/UseShoppingContext';
import { useEffect } from "react";
import { LogOut } from "lucide-react"
import { Link } from "react-router-dom";
export default function Navbar() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { cart, setCurrentPage, fetchCart } = useShoppingContext();
  const handleLogout = () => {
    logout();
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  const handleCartClick = () => {
    setCurrentPage('cart');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);


  if (loading) {
    return (
      <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <Logo />
        <SearchBar />
        <div className="w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Logo />
      <SearchBar />

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <button
              onClick={handleCartClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              {cart?.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}

            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut />
          </button>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            {getInitial(user?.userName)}
          </div>
        </div>
      ) : (
        <AuthButtons />
      )}
    </nav>
  );
}