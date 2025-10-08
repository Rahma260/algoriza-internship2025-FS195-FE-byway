import React, { createContext, useState, useCallback, useMemo, useContext } from 'react';
import { useShoppingAPI } from '../Hooks/UseShoppingAPI';
export const ShoppingContext = createContext(null);

export const useShoppingContext = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShoppingContext must be used within a ShoppingProvider');
  }
  return context;
};

export const ShoppingProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('courses');

  const shoppingAPI = useShoppingAPI();

  const navigateTo = useCallback((page) => {
    setCurrentPage(page);

    if (page === 'cart' || page === 'checkout') {
      shoppingAPI.fetchCart().catch(console.error);
    }
  }, [shoppingAPI]);

  const value = useMemo(() => ({
    ...shoppingAPI,
    currentPage,
    setCurrentPage: navigateTo,
  }), [shoppingAPI, currentPage, navigateTo]);

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
};