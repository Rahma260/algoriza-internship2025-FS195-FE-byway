import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../Hooks/UseAuthApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const userId = localStorage.getItem('userId');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            ...parsedUser,
            userId: userId || parsedUser.userId || parsedUser.id
          });
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (loginData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.login(loginData);

      if (response.isAuthenticated) {
        const userData = {
          userId: response.userId || response.id,
          userName: response.userName,
          email: response.email || loginData.email,
          roles: response.roles
        };

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('userName', userData.userName);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userRole', userData.roles?.[1] || 'Student');

        setUser(userData);
      }

      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.register(registerData);
      if (response.isAuthenticated) {
        const userData = {
          userId: response.userId || response.id,
          userName: response.userName,
          email: response.email || registerData.email,
          roles: response.roles
        };

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('userName', userData.userName);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userRole', userData.roles?.[0] || 'Student');

        setUser(userData);
      }

      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};