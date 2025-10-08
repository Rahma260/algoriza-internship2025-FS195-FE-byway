import { useContext } from 'react';
import { ShoppingContext } from '../Context/ShoppingContext';

export const useShoppingContext = () => {
  const context = useContext(ShoppingContext);

  if (!context) {
    throw new Error('useShoppingContext must be used within a ShoppingProvider');
  }

  return context;
};