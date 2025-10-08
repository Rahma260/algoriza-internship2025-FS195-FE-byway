import axios from 'axios';

const API_BASE_URL = '/api/Auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(loginData) {
    try {
      const response = await api.post('/login', loginData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async register(registerData) {
    try {
      const response = await api.post('/register', registerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

};