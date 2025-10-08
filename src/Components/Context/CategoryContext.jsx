import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';
const CategoryContext = createContext(null);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategoryContext must be used within CategoryProvider');
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/Category/GetAll?page=1&pageSize=100`);
      setCategories(res.data.data || []);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategoryCount = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Category/Count`);
      return res.data;
    } catch (err) {
      return 0;
    }
  }, []);

  return (
    <CategoryContext.Provider value={{
      categories,
      isLoading,
      error,
      fetchCategories,
      fetchCategoryCount
    }}>
      {children}
    </CategoryContext.Provider>
  );
};