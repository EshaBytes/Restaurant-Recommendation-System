import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, setAuthToken, verifyToken } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setAuthToken(token);
      const parsedUser = JSON.parse(storedUser);

      try {
        const response = await verifyToken();


        const verifiedUser = {
          ...parsedUser,
          ...response.user,
          role: response.user?.role || parsedUser.role || "user",
        };

        setCurrentUser(verifiedUser);
        localStorage.setItem('user', JSON.stringify(verifiedUser));
      } catch (verifyError) {
        console.error('Token verification failed:', verifyError);
        logout();
      }
    }
  } catch (error) {
    console.error('Auth check error:', error);
    logout();
  } finally {
    setLoading(false);
  }
};


  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      console.log('🔄 Attempting login with:', email);
      
      const response = await loginUser({ email, password });
      console.log('✅ Login response:', response);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      const { token, user } = response;
      

      const completeUser = {
        id: user.id || user._id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
        preferences: user.preferences || {
          cuisines: [],
          priceRange: { min: 0, max: 5000 },
          location: "",
          hasTableBooking: false,
          hasOnlineDelivery: false,
          isDeliveringNow: false
        },
        createdAt: user.createdAt || new Date().toISOString()
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(completeUser));
      
      setAuthToken(token);
      setCurrentUser(completeUser);
      
      console.log('✅ Login successful, user data stored');
      
      return { success: true, user: completeUser };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('❌ Login error:', error);
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      setLoading(true);
      console.log('🔄 Attempting registration with:', userData);
      
      const response = await registerUser(userData);
      console.log('✅ Registration response:', response);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      const { token, user } = response;
      

      const completeUser = {
        id: user.id || user._id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
        preferences: user.preferences || {
          cuisines: [],
          priceRange: { min: 0, max: 5000 },
          location: "",
          hasTableBooking: false,
          hasOnlineDelivery: false,
          isDeliveringNow: false
        },
        createdAt: user.createdAt || new Date().toISOString()
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(completeUser));
      
      setAuthToken(token);
      setCurrentUser(completeUser);
      
      console.log('✅ Registration successful, user data stored');
      
      return { success: true, user: completeUser };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('❌ Registration error:', error);
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
      setCurrentUser(null);
      setError('');
      console.log('✅ Logout successful');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const updateUser = (updatedUser) => {
    const defaultPreferences = {
      cuisines: [],
      priceRange: { min: 0, max: 5000 },
      location: "",
      hasTableBooking: false,
      hasOnlineDelivery: false,
      isDeliveringNow: false
    };

    const mergedUser = {
      ...currentUser,
      ...updatedUser,
      preferences: {
        ...defaultPreferences,
        ...currentUser?.preferences,
        ...updatedUser?.preferences
      }
    };
    
    setCurrentUser(mergedUser);
    localStorage.setItem('user', JSON.stringify(mergedUser));
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
    error,
    loading,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};