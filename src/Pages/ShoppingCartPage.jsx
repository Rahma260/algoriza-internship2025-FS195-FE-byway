import React, { useEffect } from 'react';
import { useShoppingContext } from '../Components/Hooks/UseShoppingContext';
import { CartItem } from '../Components/Shopping/CartItem';
import { OrderSummary } from '../Components/Shopping/OrderSummary';
import { LoadingSpinner } from '../Components/Common/LoadingSpinner';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
export const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { cart, isLoading, removeFromCart, fetchCart } = useShoppingContext();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/courses');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className='mt-2 text-lg font-semibold'>All Development Courses</p>
        </div>
        <div className="border-t border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 text-sm text-gray-500 font-medium">
              <button
                onClick={() => navigate('/courses')}
                className="text-gray-900 hover:text-black font-semibold"
              >
                Courses
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-semibold">Shopping Cart</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-400 cursor-not-allowed">Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="w-full lg:w-2/3 space-y-4 mb-8 lg:mb-0">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{cart.itemCount} Courses in cart</h2>
              {isLoading ? (
                <LoadingSpinner message="Loading cart..." />
              ) : cart.items?.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 divide-y divide-gray-200">
                  {cart.items.map(item => (
                    <CartItem key={item.courseId} item={item} onRemove={removeFromCart} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center text-gray-500">
                  Your cart is empty.
                  <button
                    onClick={handleContinueShopping}
                    className="ml-2 text-black hover:underline font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/3">
              <OrderSummary
                summary={cart}
                items={cart.items}
                checkoutAction={handleCheckout}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};