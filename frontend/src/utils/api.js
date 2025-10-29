import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token for requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ======================== AUTH ========================
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Login failed. Please try again.';
    throw new Error(message);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Registration failed. Please try again.';
    throw new Error(message);
  }
};

export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data;
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

// ======================== USER PROFILE ========================
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user profile';
    throw new Error(message);
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    throw new Error(message);
  }
};

// ======================== RESTAURANTS ========================
// ✅ Filters match backend query params exactly
export const getRestaurants = async (filters = {}) => {
  try {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.cuisine) params.cuisine = filters.cuisine;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    console.log("📡 Sending filters to backend:", params);

    const response = await api.get('/restaurants', { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch restaurants';
    throw new Error(message);
  }
};

export const getRestaurant = async (restaurantId) => {
  try {
    const response = await api.get(`/restaurants/${restaurantId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to fetch restaurant details';
    throw new Error(message);
  }
};

export const getRecommendations = async () => {
  try {
    const response = await api.get('/restaurants/recommendations');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to fetch recommendations';
    throw new Error(message);
  }
};

// ======================== REVIEWS ========================
// ✅ Updated review routes to match backend structure
export const getRestaurantReviews = async (restaurantId) => {
  try {
    const response = await api.get(`/reviews/${restaurantId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch reviews';
    throw new Error(message);
  }
};

export const createReview = async (restaurantId, reviewData) => {
  try {
    const response = await api.post(`/reviews/${restaurantId}`, reviewData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create review';
    throw new Error(message);
  }
};

// ======================== FAVORITES ========================
export const getFavorites = async () => {
  try {
    const response = await api.get('/users/favorites');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch favorites';
    throw new Error(message);
  }
};

export const addFavorite = async (restaurantId) => {
  try {
    const response = await api.post('/users/favorites', { restaurantId });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add favorite';
    throw new Error(message);
  }
};

export const removeFavorite = async (restaurantId) => {
  try {
    const response = await api.delete(`/users/favorites/${restaurantId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to remove favorite';
    throw new Error(message);
  }
};

// ======================== SEARCH ========================
export const searchRestaurants = async (query, filters = {}) => {
  try {
    const response = await api.get('/restaurants/search', { 
      params: { query, ...filters } 
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Search failed';
    throw new Error(message);
  }
};

// ======================== TEST CONNECTION ========================
export const testAPIConnection = async () => {
  try {
    const response = await api.get('/api/test');
    return response.data;
  } catch (error) {
    console.error('API Connection Test Failed:', error);
    throw new Error('API connection test failed');
  }
};

export default api;
