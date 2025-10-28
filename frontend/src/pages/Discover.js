import React, { useState, useEffect } from 'react';
import { searchRestaurants, getRecommendations } from '../utils/api';
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
      
      // Mock data for trending restaurants
      const mockTrending = [
        {
          restaurantId: 1,
          name: "Burger Junction",
          cuisines: ["American", "Burgers"],
          locality: "West Village",
          city: "New York",
          aggregateRating: 4.4,
          priceRange: 2,
          averageCost: 1200,
          currency: "₹",
          trending: true,
          image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400"
        },
        {
          restaurantId: 2,
          name: "Taco Fiesta",
          cuisines: ["Mexican", "Latin American"],
          locality: "Downtown",
          city: "New York",
          aggregateRating: 4.7,
          priceRange: 2,
          averageCost: 900,
          currency: "₹",
          trending: true,
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
        },
        {
          restaurantId: 3,
          name: "Sushi Zen",
          cuisines: ["Japanese", "Sushi"],
          locality: "Midtown",
          city: "New York",
          aggregateRating: 4.8,
          priceRange: 4,
          averageCost: 2800,
          currency: "₹",
          trending: true,
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"
        },
        {
          restaurantId: 4,
          name: "Spice Garden",
          cuisines: ["Indian", "Asian"],
          locality: "East Side",
          city: "New York",
          aggregateRating: 4.6,
          priceRange: 3,
          averageCost: 1500,
          currency: "₹",
          trending: true,
          image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400"
        }
      ];

      // Mock data for featured restaurants
      const mockFeatured = [
        {
          restaurantId: 5,
          name: "Gusto Italiano",
          cuisines: ["Italian", "Mediterranean"],
          locality: "Downtown",
          city: "New York",
          aggregateRating: 4.8,
          priceRange: 4,
          averageCost: 2500,
          currency: "₹",
          featured: true,
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"
        },
        {
          restaurantId: 6,
          name: "Sakura Sushi",
          cuisines: ["Japanese", "Sushi"],
          locality: "Midtown",
          city: "New York",
          aggregateRating: 4.9,
          priceRange: 5,
          averageCost: 3500,
          currency: "₹",
          featured: true,
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"
        },
        {
          restaurantId: 7,
          name: "Spice Route",
          cuisines: ["Indian", "Asian"],
          locality: "East Side",
          city: "New York",
          aggregateRating: 4.6,
          priceRange: 3,
          averageCost: 1800,
          currency: "₹",
          featured: true,
          image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400"
        }
      ];

      setFeaturedRestaurants(mockFeatured);
      setTrendingRestaurants(mockTrending);
      setCuisineCategories(cuisineOptions);
      
    } catch (error) {
      console.error('Error loading discover data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByCuisine = (cuisineId) => {
    setSelectedCuisine(cuisineId);
    // In a real app, this would filter the restaurants
  };

  if (loading) {
    return (
      <div className="discover-container">
        <div className="loading">Discovering amazing restaurants...</div>
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
          <div className="restaurants-grid">
            {featuredRestaurants.map(restaurant => (
              <RestaurantCard 
                key={restaurant.restaurantId} 
                restaurant={restaurant}
                featured={true}
              />
            ))}
          </div>
        </section>

        {/* Trending Now Section - Fixed */}
        <section className="trending-section">
          <div className="section-header">
            <h2>Trending Now</h2>
            <p>Currently popular spots loved by food enthusiasts</p>
          </div>
          <div className="trending-grid">
            {trendingRestaurants.map(restaurant => (
              <RestaurantCard 
                key={restaurant.restaurantId} 
                restaurant={restaurant}
                trending={true}
              />
            ))}
          </div>
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