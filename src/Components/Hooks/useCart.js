import { useCallback } from 'react';

export const useCart = (cart, fetchCart, setCurrentPage) => {
  const navigateToCheckout = useCallback(() => {
    setCurrentPage('checkout');
  }, [setCurrentPage]);

  const continueShopping = useCallback(() => {
    setCurrentPage('courses');
  }, [setCurrentPage]);

  return {
    cart,
    fetchCart,
    navigateToCheckout,
    continueShopping
  };
};