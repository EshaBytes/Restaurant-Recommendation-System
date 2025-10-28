import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests for debugging
    console.log(`API ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response ${response.status} ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`API Error ${status}:`, data);
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('storage')); // Notify other components
          break;
          
        case 403:
          console.error('Forbidden:', data.message);
          break;
          
        case 404:
          console.error('Resource not found:', data.message);
          // Don't throw error for 404 on search endpoint - fallback to client-side search
          if (error.config.url?.includes('/restaurants/search')) {
            return Promise.resolve({ data: { restaurants: [] } });
          }
          break;
          
        case 500:
          console.error('Server error:', data.message);
          break;
          
        default:
          console.error('API error:', data.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: No response received from', error.config.url);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Restaurant API functions
export const getRestaurants = async (filters = {}) => {
  try {
    console.log('Fetching restaurants with filters:', filters);
    
    // Clean filters - remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => 
        value !== '' && value !== null && value !== undefined
      )
    );
    
    const response = await api.get('/restaurants', { params: cleanFilters });
    return response.data;
  } catch (error) {
    console.error('Error in getRestaurants:', error);
    throw error.response?.data || { message: 'Failed to fetch restaurants' };
  }
};

export const getRestaurant = async (id) => {
  try {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in getRestaurant:', error);
    throw error.response?.data || { message: 'Failed to fetch restaurant' };
  }
};

export const searchRestaurants = async (query, filters = {}) => {
  try {
    console.log('Searching restaurants with query:', query, 'filters:', filters);
    
    // First try the search endpoint
    try {
      const response = await api.get('/restaurants/search', { 
        params: { q: query, ...filters } 
      });
      return response.data;
    } catch (searchError) {
      // If search endpoint doesn't exist (404), fall back to regular endpoint with search param
      if (searchError.response?.status === 404) {
        console.log('Search endpoint not found, falling back to regular endpoint');
        const response = await api.get('/restaurants', { 
          params: { search: query, ...filters } 
        });
        return response.data;
      }
      throw searchError;
    }
  } catch (error) {
    console.error('Error in searchRestaurants:', error);
    
    // If all else fails, return empty results for client-side filtering
    if (error.response?.status === 404) {
      return { restaurants: [] };
    }
    
    throw error.response?.data || { message: 'Search failed' };
  }
};

export const getRestaurantReviews = async (restaurantId) => {
  try {
    const response = await api.get(`/restaurants/${restaurantId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error in getRestaurantReviews:', error);
    throw error.response?.data || { message: 'Failed to fetch reviews' };
  }
};

// Review API functions
export const createReview = async (restaurantId, reviewData) => {
  try {
    const response = await api.post(`/restaurants/${restaurantId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error in createReview:', error);
    throw error.response?.data || { message: 'Failed to create review' };
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error in updateReview:', error);
    throw error.response?.data || { message: 'Failed to update review' };
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteReview:', error);
    throw error.response?.data || { message: 'Failed to delete review' };
  }
};

// User API functions
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Auth API functions
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Favorite API functions
export const getFavorites = async () => {
  try {
    const response = await api.get('/users/favorites');
    return response.data;
  } catch (error) {
    console.error('Error in getFavorites:', error);
    throw error.response?.data || { message: 'Failed to fetch favorites' };
  }
};

export const addFavorite = async (restaurantId) => {
  try {
    const response = await api.post('/users/favorites', { restaurantId });
    return response.data;
  } catch (error) {
    console.error('Error in addFavorite:', error);
    throw error.response?.data || { message: 'Failed to add favorite' };
  }
};

export const removeFavorite = async (restaurantId) => {
  try {
    const response = await api.delete(`/users/favorites/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error('Error in removeFavorite:', error);
    throw error.response?.data || { message: 'Failed to remove favorite' };
  }
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth token set');
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('Auth token removed');
  }
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// Test API connection
export const testAPIConnection = async () => {
  try {
    const response = await api.get('/');
    console.log('API Connection Test:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Connection Test Failed:', error);
    return { success: false, error: error.message };
  }
};

export default api;