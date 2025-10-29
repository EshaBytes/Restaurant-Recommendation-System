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

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        setAuthToken(token);
        
        // Verify token with backend
        try {
          const response = await verifyToken();
          setCurrentUser(response.user);
        } catch (verifyError) {
          console.error('Token verification failed:', verifyError);
          // Token is invalid, clear storage
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
      
      // Validate response structure
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      const { token, user } = response;
      
      // Create complete user object with preferences
      const completeUser = {
        id: user.id || user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences || {
          cuisines: [],
          priceRange: { min: 0, max: 5000 },
          allergies: [],
          dietaryRestrictions: []
        },
        createdAt: user.createdAt || new Date().toISOString()
      };
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(completeUser));
      
      // Set auth token for future requests
      setAuthToken(token);
      setCurrentUser(completeUser);
      
      // ✅ REMOVED: Don't redirect here - let the login component handle it
      console.log('✅ Login successful, user data stored');
      
      return { success: true, user: completeUser };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('❌ Login error:', error);
      
      return { 
        success: false, 
        message: errorMessage 
      };
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
      
      // Validate response structure
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      const { token, user } = response;
      
      // Create complete user object with preferences
      const completeUser = {
        id: user.id || user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences || {
          cuisines: [],
          priceRange: { min: 0, max: 5000 },
          allergies: [],
          dietaryRestrictions: []
        },
        createdAt: user.createdAt || new Date().toISOString()
      };
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(completeUser));
      
      // Set auth token for future requests
      setAuthToken(token);
      setCurrentUser(completeUser);
      
      // ✅ REMOVED: Don't redirect here - let the register component handle it
      console.log('✅ Registration successful, user data stored');
      
      return { success: true, user: completeUser };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('❌ Registration error:', error);
      
      return { 
        success: false, 
        message: errorMessage 
      };
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
      
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const updateUser = (updatedUser) => {
    const mergedUser = {
      ...currentUser,
      ...updatedUser,
      preferences: {
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