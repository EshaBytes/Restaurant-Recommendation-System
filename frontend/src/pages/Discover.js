import React, { useState, useEffect } from 'react';
import { getRestaurants, getRecommendations } from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';
import '../styles/Discover.css';

const Discover = ({ user }) => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [cuisineCategories, setCuisineCategories] = useState([]);
  const [trendingRestaurants, setTrendingRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('all');

  const cuisineOptions = [
    { id: 'italian', name: 'Italian', icon: '🍝' },
    { id: 'chinese', name: 'Chinese', icon: '🥢' },
    { id: 'indian', name: 'Indian', icon: '🍛' },
    { id: 'mexican', name: 'Mexican', icon: '🌮' },
    { id: 'japanese', name: 'Japanese', icon: '🍣' },
    { id: 'thai', name: 'Thai', icon: '🍜' },
    { id: 'american', name: 'American', icon: '🍔' },
    { id: 'mediterranean', name: 'Mediterranean', icon: '🥗' }
  ];

  useEffect(() => {
    loadDiscoverData();
  }, []);

  const loadDiscoverData = async () => {
    try {
      setLoading(true);
      
      // Use real API calls instead of mock data
      const [recommendationsResponse, featuredResponse] = await Promise.all([
        getRecommendations().catch(err => {
          console.log('Recommendations endpoint not available, using fallback');
          return getRestaurants({ limit: 8, sort: 'rating' });
        }),
        getRestaurants({ minRating: 4.0, limit: 6 })
      ]);
      
      // Handle different response formats
      const trending = recommendationsResponse.recommendations || recommendationsResponse.restaurants || recommendationsResponse.data || [];
      const featured = featuredResponse.restaurants || featuredResponse.data || [];
      
      setFeaturedRestaurants(featured);
      setTrendingRestaurants(trending);
      setCuisineCategories(cuisineOptions);
      
    } catch (error) {
      console.error('Error loading discover data:', error);
      // Fallback to empty arrays
      setFeaturedRestaurants([]);
      setTrendingRestaurants([]);
      setCuisineCategories(cuisineOptions);
    } finally {
      setLoading(false);
    }
  };

  const filterByCuisine = (cuisineId) => {
    setSelectedCuisine(cuisineId);
    // In a real app, this would filter the restaurants
    // For now, we'll just show a message
    console.log(`Filtering by cuisine: ${cuisineId}`);
  };

  if (loading) {
    return (
      <div className="discover-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          Discovering amazing restaurants...
        </div>
      </div>
    );
  }

  return (
    <div className="discover-page">
      <div className="discover-container">
        {/* Hero Section */}
        <section className="discover-hero">
          <div className="hero-content">
            <h1>Discover Culinary Delights</h1>
            <p>Explore handpicked restaurants, trending spots, and hidden gems in your city</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Restaurants</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Cuisines</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cuisine Categories */}
        <section className="cuisine-section">
          <h2>Explore by Cuisine</h2>
          <div className="cuisine-grid">
            {cuisineCategories.map(cuisine => (
              <button
                key={cuisine.id}
                className={`cuisine-card ${selectedCuisine === cuisine.id ? 'active' : ''}`}
                onClick={() => filterByCuisine(cuisine.id)}
              >
                <span className="cuisine-icon">{cuisine.icon}</span>
                <span className="cuisine-name">{cuisine.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Restaurants */}
        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Restaurants</h2>
            <p>Handpicked selections for an exceptional dining experience</p>
          </div>
          {featuredRestaurants.length > 0 ? (
            <div className="restaurants-grid">
              {featuredRestaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant._id || restaurant.restaurantId} 
                  restaurant={restaurant}
                  featured={true}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No featured restaurants available at the moment.</p>
            </div>
          )}
        </section>

        {/* Trending Now Section */}
        <section className="trending-section">
          <div className="section-header">
            <h2>Trending Now</h2>
            <p>Currently popular spots loved by food enthusiasts</p>
          </div>
          {trendingRestaurants.length > 0 ? (
            <div className="trending-grid">
              {trendingRestaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant._id || restaurant.restaurantId} 
                  restaurant={restaurant}
                  trending={true}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No trending restaurants available at the moment.</p>
            </div>
          )}
        </section>

        {/* Quick Filters */}
        <section className="filters-section">
          <h2>Quick Filters</h2>
          <div className="filters-grid">
            <div className="filter-card">
              <div className="filter-icon">💰</div>
              <h3>Budget Friendly</h3>
              <p>Great food that won't break the bank</p>
            </div>
            <div className="filter-card">
              <div className="filter-icon">⭐</div>
              <h3>Top Rated</h3>
              <p>Highest rated restaurants in town</p>
            </div>
            <div className="filter-card">
              <div className="filter-icon">🚚</div>
              <h3>Delivery</h3>
              <p>Fast delivery to your doorstep</p>
            </div>
            <div className="filter-card">
              <div className="filter-icon">💝</div>
              <h3>Romantic</h3>
              <p>Perfect spots for date night</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Discover;