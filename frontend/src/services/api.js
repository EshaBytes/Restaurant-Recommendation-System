const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Mock functions for development (replace with real API calls)
export const updateUserPreferences = async (userId, preferences) => {
  console.log('Updating preferences for user:', userId, preferences);
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Preferences saved!' });
    }, 1000);
  });
};

export const getUserProfile = async (userId) => {
  console.log('Fetching profile for user:', userId);
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        uid: userId,
        email: 'user@example.com',
        displayName: 'Demo User',
        preferences: {
          cuisines: ['Italian', 'Chinese'],
          priceRange: { min: 100, max: 2000 },
          allergies: ['Nuts'],
          dietaryRestrictions: ['Vegetarian']
        },
        favoriteRestaurants: [],
        searchHistory: [
          { query: 'pizza', timestamp: new Date('2024-01-15') },
          { query: 'sushi', timestamp: new Date('2024-01-14') }
        ],
        createdAt: new Date('2024-01-01')
      });
    }, 500);
  });
};

export const searchRestaurants = async (query, filters = {}) => {
  // Mock implementation
  return { restaurants: [] };
};

export const getRestaurant = async (id) => {
  // Mock implementation
  return {};
};