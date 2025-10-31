import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please log in again.');
      window.location.href = '/login';
    } else if (error.code === 'ECONNABORTED') {
    } else if (!error.response) {
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    toast.success('Login successful! 🎉');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Login failed. Please try again.';
    toast.error(message);
    throw new Error(message);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    toast.success('Registration successful! 🎉');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Registration failed. Please try again.';
    toast.error(message);
    throw new Error(message);
  }
};

export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data;
  } catch {
    throw new Error('Token verification failed');
  }
};

export const logoutUser = () => {
  setAuthToken(null);
  localStorage.removeItem('user');
  toast.info('Logged out successfully 👋');
  window.location.href = '/login';
};

export const getMLRecommendations = async (userId, filters = {}) => {
  try {
    const params = {};

    if (filters.currentRestaurantId) params.currentRestaurantId = filters.currentRestaurantId;
    if (filters.latitude && filters.longitude) {
      params.latitude = filters.latitude;
      params.longitude = filters.longitude;
    }
    if (filters.cuisine) params.cuisine = filters.cuisine;
    if (filters.limit) params.limit = parseInt(filters.limit);
    
    console.log("🧠 Fetching ML recommendations for user:", userId, params);
    
    const response = await api.get(`/ml/${userId}/recommendations`, { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get recommendations';
    console.error('ML Recommendations error:', error);
    throw new Error(message);
  }
};

export const getSimilarRestaurants = async (restaurantId, filters = {}) => {
  try {
    const params = {};
    if (filters.cuisine) params.cuisine = filters.cuisine;
    if (filters.limit) params.limit = parseInt(filters.limit);
    
    console.log("🔍 Fetching similar restaurants for:", restaurantId);
    
    const response = await api.get(`/similarity/restaurants/${restaurantId}/similar`, { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get similar restaurants';
    console.error('Similar restaurants error:', error);
    throw new Error(message);
  }
};

export const trackUserBehavior = async (behaviorData) => {
  try {
    const response = await api.post('/ml/track-behavior', behaviorData);
    return response.data;
  } catch (error) {
    console.error('Behavior tracking error:', error);
    return { success: false };
  }
};

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
    toast.success('Profile updated successfully! ✅');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    toast.error(message);
    throw new Error(message);
  }
};

export const getRestaurants = async (filters = {}) => {
  try {
    const params = {};

    if (filters.search?.trim()) params.search = filters.search.trim();
    
    if (filters.cuisine) {
      if (Array.isArray(filters.cuisine) && filters.cuisine.length > 0) {
        params.cuisine = filters.cuisine;
      } else if (typeof filters.cuisine === 'string' && filters.cuisine.trim()) {
        params.cuisine = filters.cuisine.trim();
      }
    }
    
    if (filters.minRating) params.minRating = parseFloat(filters.minRating);
    if (filters.maxPrice) params.maxPrice = parseInt(filters.maxPrice);
    if (filters.city && filters.city !== 'all') params.city = filters.city;
    if (filters.hasOnlineDelivery !== undefined) params.hasOnlineDelivery = filters.hasOnlineDelivery;
    if (filters.hasTableBooking !== undefined) params.hasTableBooking = filters.hasTableBooking;
    if (filters.isDeliveringNow !== undefined) params.isDeliveringNow = filters.isDeliveringNow;
    
    if (filters.page) params.page = parseInt(filters.page);
    if (filters.limit) params.limit = parseInt(filters.limit);

    console.log("📡 Fetching restaurants with filters:", params);

    const response = await api.get('/restaurants', { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch restaurants';
    console.error('API Error - getRestaurants:', error.response?.data || error.message);
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

export const getRecommendations = async (filters = {}) => {
  try {
    const params = {};
    if (filters.page) params.page = parseInt(filters.page);
    if (filters.limit) params.limit = parseInt(filters.limit);
    if (filters.extraCuisine) params.extraCuisine = filters.extraCuisine;
    if (filters.budget) params.budget = filters.budget;

    const response = await api.get('/restaurants/recommendations', { params });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to fetch recommendations';
    throw new Error(message);
  }
};

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
    toast.success('Review added successfully! ⭐');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create review';
    toast.error(message);
    throw new Error(message);
  }
};

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
    const response = await api.post('/users/favorites/${restaurantId}', { restaurantId });
    toast.success('Added to favorites ❤️');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add favorite';
    toast.error(message);
    throw new Error(message);
  }
};

export const removeFavorite = async (restaurantId) => {
  try {
    const response = await api.delete(`/users/favorites/${restaurantId}`);
    toast.info('Removed from favorites 💔');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to remove favorite';
    toast.error(message);
    throw new Error(message);
  }
};

export const searchRestaurants = async (query, filters = {}) => {
  try {
    const cleanQuery = query?.trim() || '';
    const params = { q: cleanQuery, ...filters };
    
    if (filters.cuisine) params.cuisine = filters.cuisine;
    if (filters.city) params.city = filters.city;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    
    console.log("🔍 Searching restaurants with:", params);
    
    const response = await api.get('/restaurants/search', { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Search failed';
    throw new Error(message);
  }
};

export const getCities = async () => {
  try {
    const response = await api.get('/restaurants/cities');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch cities';
    throw new Error(message);
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unhealthy', error: error.message };
  }
};