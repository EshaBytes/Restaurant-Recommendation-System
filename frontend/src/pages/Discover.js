import React, { useState, useEffect } from 'react';
import { getRestaurants } from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';
import { useAuth } from '../context/AuthContext';
import '../styles/Discover.css';

const PAGE_LIMIT = 21;

const cuisineOptions = [
  { id: 'italian', name: 'Italian', icon: '🍝' },
  { id: 'chinese', name: 'Chinese', icon: '🥢' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'mexican', name: 'Mexican', icon: '🌮' },
  { id: 'japanese', name: 'Japanese', icon: '🍣' },
  { id: 'thai', name: 'Thai', icon: '🍜' },
  { id: 'american', name: 'American', icon: '🍔' },
  { id: 'mediterranean', name: 'Mediterranean', icon: '🥗' },
  { id: 'french', name: 'French', icon: '🥐' },
  { id: 'korean', name: 'Korean', icon: '🍲' },
];

const Discover = () => {
  const { currentUser } = useAuth();
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState('recommended');
  const [page, setPage] = useState(1);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedBudgetLevel, setSelectedBudgetLevel] = useState(null);


  const totalPages = Math.ceil(totalRestaurants / PAGE_LIMIT);


  useEffect(() => {
    const prefs = currentUser?.preferences || {};
    if (prefs.cuisines?.length > 0) {
      setSelectedCuisines(prefs.cuisines);
    }
    loadPersonalizedRecommendations(1);

  }, [currentUser]);


  const priceLevelFromMax = (maxAmount) => {
    const m = Number(maxAmount);
    if (Number.isNaN(m)) return undefined;
    if (m <= 500) return 1;
    if (m <= 1000) return 2;
    if (m <= 2000) return 3;
    return 4;
  };


  const buildFilters = (options = {}) => {
    const {
      usePreferences = true,
      additionalCuisines = [],
      maxPrice = null,
      minRating = null,
      hasOnlineDelivery = null,
      page = 1,
      limit = PAGE_LIMIT
    } = options;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const prefs = currentUser?.preferences || {};
    

    let finalCuisines = [];
    
    if (options.forceCuisines) {

      finalCuisines = [...additionalCuisines];
    } else if (usePreferences && Array.isArray(prefs.cuisines) && prefs.cuisines.length > 0) {

      finalCuisines = [...prefs.cuisines];
      

      if (additionalCuisines.length > 0) {
        finalCuisines = [...finalCuisines, ...additionalCuisines];
      }
    } else if (additionalCuisines.length > 0) {

      finalCuisines = [...additionalCuisines];
    }
    

    if (finalCuisines.length > 0) {
      filters.cuisine = [...new Set(finalCuisines)];
    }


    if (maxPrice !== null) {
      filters.maxPrice = maxPrice;
    } else if (usePreferences && prefs.priceRange) {
      if (prefs.priceRange.max) {
        filters.maxPrice = prefs.priceRange.max;
      } else if (prefs.priceRange.level) {
        filters.maxPrice = prefs.priceRange.level;
      }
    }

    if (usePreferences) {
      if (prefs.location?.trim()) filters.city = prefs.location.trim();
      if (prefs.minRating) filters.minRating = prefs.minRating;
      if (prefs.hasOnlineDelivery) filters.hasOnlineDelivery = true;
      if (prefs.hasTableBooking) filters.hasTableBooking = true;
      if (prefs.isDeliveringNow) filters.isDeliveringNow = true;
    }


    if (minRating !== null) filters.minRating = minRating;
    if (hasOnlineDelivery !== null) filters.hasOnlineDelivery = hasOnlineDelivery;

    console.log('🔍 Final filters:', filters);
    return filters;
  };


  const loadWithFilters = async (filters) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getRestaurants(filters);
      const restaurants = res.restaurants || res.data || [];
      const total = res.total ?? res.totalResults ?? restaurants.length;

      setRecommendedRestaurants(restaurants);
      setTotalRestaurants(typeof total === 'number' ? total : restaurants.length);
      setPage(filters.page || 1);
    } catch (err) {
      console.error('loadWithFilters error:', err);
      setError('Failed to load restaurants.');
      setRecommendedRestaurants([]);
      setTotalRestaurants(0);
    } finally {
      setLoading(false);
    }
  };

  const loadPersonalizedRecommendations = async (newPage = 1) => {
    setActiveFilter('recommended');
    setSelectedCuisines(currentUser?.preferences?.cuisines || []);
    setSelectedBudgetLevel(null);
    
    const filters = buildFilters({ 
      usePreferences: true,
      page: newPage 
    });
    await loadWithFilters(filters);
  };


  const loadWithCombinedFilters = async (customOptions = {}, newPage = 1) => {
    const filters = buildFilters({ 
      usePreferences: true,
      ...customOptions,
      page: newPage 
    });
    await loadWithFilters(filters);
  };


  const loadWithSelectedCuisinesOnly = async (cuisines, newPage = 1, additionalFilters = {}) => {
    const filters = buildFilters({ 
      usePreferences: false, 
      additionalCuisines: cuisines,
      forceCuisines: true, 
      ...additionalFilters, 
      page: newPage 
    });
    await loadWithFilters(filters);
  };


  const loadWithNoCuisines = async (newPage = 1) => {
    const filters = {
      page: newPage,
      limit: PAGE_LIMIT,
      cuisine: []
    };
    await loadWithFilters(filters);
  };


  const applyQuickFilter = async (filterType, pageNum = 1) => {
    setActiveFilter(filterType);

    if (filterType === 'budget') {
      setSelectedBudgetLevel(2);

      if (selectedCuisines.length > 0) {
        return loadWithSelectedCuisinesOnly(selectedCuisines, pageNum, { maxPrice: 2 });
      } else {
        return loadWithCombinedFilters({ maxPrice: 2 }, pageNum);
      }
    }

    if (filterType === 'topRated') {
      setSelectedBudgetLevel(null);

      if (selectedCuisines.length > 0) {
        return loadWithSelectedCuisinesOnly(selectedCuisines, pageNum, { minRating: 4.0 });
      } else {
        return loadWithCombinedFilters({ minRating: 4.0 }, pageNum);
      }
    }

    if (filterType === 'delivery') {
      setSelectedBudgetLevel(null);

      if (selectedCuisines.length > 0) {
        return loadWithSelectedCuisinesOnly(selectedCuisines, pageNum, { hasOnlineDelivery: true });
      } else {
        return loadWithCombinedFilters({ hasOnlineDelivery: true }, pageNum);
      }
    }

    return loadPersonalizedRecommendations(pageNum);
  };


  const toggleCuisineSelection = async (cuisineName) => {
    const newSelectedCuisines = selectedCuisines.includes(cuisineName) 
      ? selectedCuisines.filter((c) => c !== cuisineName)
      : [...selectedCuisines, cuisineName];

    setSelectedCuisines(newSelectedCuisines);
    setSelectedBudgetLevel(null);

    if (newSelectedCuisines.length === 0) {
      setActiveFilter('noSelection');
      await loadWithNoCuisines(1);
    } else {
      setActiveFilter('cuisine');

      await loadWithSelectedCuisinesOnly(newSelectedCuisines, 1);
    }
  };

  const handleSelectAllCuisines = () => {
    setSelectedCuisines(currentUser?.preferences?.cuisines || []);
    setActiveFilter('recommended');
    loadPersonalizedRecommendations(1);
  };


  const handleNextPage = () => {
    const newPage = page + 1;
    if (page * PAGE_LIMIT >= totalRestaurants) return;

    if (activeFilter === 'noSelection') {
      return loadWithNoCuisines(newPage);
    }
    if (activeFilter === 'budget') {
      if (selectedCuisines.length > 0) {
        return loadWithSelectedCuisinesOnly(selectedCuisines, newPage, { maxPrice: 2 });
      } else {
        return loadWithCombinedFilters({ maxPrice: 2 }, newPage);
      }
    }
    if (activeFilter === 'topRated') {
      if (selectedCuisines.length > 0) {
        return loadWithSelectedCuisinesOnly(selectedCuisines, newPage, { minRating: 4.0 });
      } else {
        return loadWithCombinedFilters({ minRating: 4.0 }, newPage);
      }
    }
    if (activeFilter === 'delivery') {
      if (selectedCuisines.length > 0) {
        return loadWithSelectedCuisinesOnly(selectedCuisines, newPage, { hasOnlineDelivery: true });
      } else {
        return loadWithCombinedFilters({ hasOnlineDelivery: true }, newPage);
      }
    }
    if (activeFilter === 'cuisine') {
      if (selectedCuisines.length === 0) {
        return loadWithNoCuisines(newPage);
      }

      return loadWithSelectedCuisinesOnly(selectedCuisines, newPage);
    }
    
    return loadPersonalizedRecommendations(newPage);
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    const newPage = page - 1;

    if (activeFilter === 'noSelection') {
      return loadWithNoCuisines(newPage);
    }
    if (activeFilter === 'budget') {
      if (selectedCuisines.length > 0) {
        return loadWithSelectedCuisinesOnly(selectedCuisines, newPage, { maxPrice: 2 });
      } else {
        return loadWithCombinedFilters({ maxPrice: 2 }, newPage);
      }
    }
    if (activeFilter === 'topRated') {
      if (selectedCuisines.length > 0) {
        return loadWithSelectedCuisinesOnly(selectedCuisines, newPage, { minRating: 4.0 });
      } else {
        return loadWithCombinedFilters({ minRating: 4.0 }, newPage);
      }
    }
    if (activeFilter === 'delivery') {
      if (selectedCuisines.length > 0) {
        return loadWithSelectedCuisinesOnly(selectedCuisines, newPage, { hasOnlineDelivery: true });
      } else {
        return loadWithCombinedFilters({ hasOnlineDelivery: true }, newPage);
      }
    }
    if (activeFilter === 'cuisine') {
      if (selectedCuisines.length === 0) {
        return loadWithNoCuisines(newPage);
      }

      return loadWithSelectedCuisinesOnly(selectedCuisines, newPage);
    }
    
    return loadPersonalizedRecommendations(newPage);
  };


  const getActivePreferencesText = () => {
    const prefs = currentUser?.preferences || {};
    
    if (activeFilter === 'noSelection') {
      return 'No cuisines selected. Please select at least one cuisine to see recommendations.';
    }

    if (activeFilter === 'recommended') {
      if (!prefs) return 'Showing popular restaurants near you';

      const activeFilters = [];
      if (prefs.cuisines?.length) activeFilters.push(`${prefs.cuisines.length} cuisines`);
      if (prefs.priceRange) {
        if (prefs.priceRange.min && prefs.priceRange.max) {
          activeFilters.push(`₹${prefs.priceRange.min}-${prefs.priceRange.max}`);
        } else if (prefs.priceRange.level) {
          activeFilters.push(`Price level: ${prefs.priceRange.level}`);
        }
      }
      if (prefs.location) activeFilters.push(`in ${prefs.location}`);
      if (prefs.hasOnlineDelivery) activeFilters.push('delivery available');
      if (prefs.hasTableBooking) activeFilters.push('table booking');

      return activeFilters.length > 0
        ? `Recommended based on your preferences: ${activeFilters.join(', ')}`
        : 'Showing popular restaurants near you';
    }

    if (activeFilter === 'cuisine') {
      if (selectedCuisines.length === 0) {
        return 'No cuisines selected. Please select at least one cuisine to see recommendations.';
      }
      

      return `Showing restaurants matching: ${selectedCuisines.join(', ')}`;
    }

    if (activeFilter === 'budget') {
      if (selectedCuisines.length > 0) {
        return `Showing budget-friendly ${selectedCuisines.join(', ')} restaurants (price level 1-2)`;
      }
      return 'Showing budget-friendly restaurants (price level 1-2) matching your preferences';
    }

    if (activeFilter === 'topRated') {
      if (selectedCuisines.length > 0) {
        return `Showing top-rated ${selectedCuisines.join(', ')} restaurants (4.0+ stars)`;
      }
      return 'Showing top-rated restaurants (4.0+ stars) matching your preferences';
    }

    if (activeFilter === 'delivery') {
      if (selectedCuisines.length > 0) {
        return `Showing ${selectedCuisines.join(', ')} restaurants with delivery available`;
      }
      return 'Showing restaurants with delivery available matching your preferences';
    }

    return 'Showing restaurants';
  };


  if (loading) {
    return (
      <div className="discover-container">
        <div className="loading">
          <div className="loading-spinner" />
          Finding restaurants that match your preferences...
        </div>
      </div>
    );
  }

  return (
    <div className="discover-page">
      <div className="discover-container">

        <section className="discover-hero">
          <div className="hero-content">
            <h1>Personalized Recommendations</h1>
            <p className="preferences-text">{getActivePreferencesText()}</p>

            {currentUser?.preferences && activeFilter !== 'noSelection' && activeFilter === 'recommended' && (
              <div className="preference-badges">
                {currentUser.preferences.cuisines?.map((c, i) => (
                  <span key={i} className="preference-badge">{c}</span>
                ))}
                {currentUser.preferences.location && (
                  <span className="preference-badge">📍 {currentUser.preferences.location}</span>
                )}
                {currentUser.preferences.hasOnlineDelivery && (
                  <span className="preference-badge">🚚 Delivery</span>
                )}
                {currentUser.preferences.hasTableBooking && (
                  <span className="preference-badge">🪑 Table Booking</span>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="filters-section">
          <h2>Quick Filters</h2>
          <div className="filters-grid">
            <button
              className={`filter-card ${activeFilter === 'recommended' ? 'active' : ''}`}
              onClick={() => loadPersonalizedRecommendations(1)}
            >
              <div className="filter-icon">🎯</div>
              <h3>For You</h3>
              <p>Matches your preferences</p>
            </button>

            <button
              className={`filter-card ${activeFilter === 'budget' ? 'active' : ''}`}
              onClick={() => applyQuickFilter('budget')}
            >
              <div className="filter-icon">💰</div>
              <h3>Budget Friendly</h3>
              <p>Price levels 1 & 2</p>
            </button>

            <button
              className={`filter-card ${activeFilter === 'topRated' ? 'active' : ''}`}
              onClick={() => applyQuickFilter('topRated')}
            >
              <div className="filter-icon">⭐</div>
              <h3>Top Rated</h3>
              <p>4.0+ stars</p>
            </button>

            <button
              className={`filter-card ${activeFilter === 'delivery' ? 'active' : ''}`}
              onClick={() => applyQuickFilter('delivery')}
            >
              <div className="filter-icon">🚚</div>
              <h3>Delivery Available</h3>
              <p>Restaurants that deliver</p>
            </button>
          </div>
        </section>


        <section className="cuisine-section">
          <h2>Filter by Cuisine</h2>
          <div className="cuisine-grid">
            <button
              className={`cuisine-card ${selectedCuisines.length === currentUser?.preferences?.cuisines?.length && activeFilter === 'recommended' ? 'active' : ''}`}
              onClick={handleSelectAllCuisines}
            >
              <span className="cuisine-icon">🍽️</span>
              <span className="cuisine-name">All</span>
            </button>

            {cuisineOptions.map((cuisine) => {
              const isPreferred = currentUser?.preferences?.cuisines?.includes(cuisine.name);
              const isSelected = selectedCuisines.includes(cuisine.name);
              
              let cardClass = 'cuisine-card';
              if (isSelected) cardClass += ' selected';
              else if (isPreferred && activeFilter === 'recommended') cardClass += ' preferred';

              return (
                <button
                  key={cuisine.id}
                  className={cardClass}
                  onClick={() => toggleCuisineSelection(cuisine.name)}
                >
                  <span className="cuisine-icon">{cuisine.icon}</span>
                  <span className="cuisine-name">{cuisine.name}</span>
                  
                  {isSelected && <span className="selection-indicator">✅</span>}
                  {isPreferred && !isSelected && activeFilter === 'recommended' && <span className="preference-indicator">⭐</span>}
                </button>
              );
            })}
          </div>
        </section>


        <section className="recommended-section">
          <div className="section-header">
            <h2>
              {activeFilter === 'noSelection'
                ? 'No Cuisines Selected'
                : activeFilter === 'recommended'
                ? 'Recommended For You'
                : activeFilter === 'budget'
                ? 'Budget Friendly Picks'
                : activeFilter === 'topRated'
                ? 'Top Rated Matches'
                : activeFilter === 'delivery'
                ? 'Available for Delivery'
                : activeFilter === 'cuisine'
                ? 'Custom Cuisine Selection'
                : 'All Restaurants'}
            </h2>
            <p>
              {activeFilter === 'noSelection' 
                ? 'Please select at least one cuisine'
                : `${recommendedRestaurants.length} of ${totalRestaurants} restaurants match your criteria`}
            </p>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          {activeFilter === 'noSelection' ? (
            <div className="empty-state">
              <h3>No cuisines selected</h3>
              <p>Please select at least one cuisine from the options above to see restaurant recommendations.</p>
              <button className="reset-filters-btn" onClick={handleSelectAllCuisines}>
                Show All My Preferences
              </button>
            </div>
          ) : recommendedRestaurants.length > 0 ? (
            <div className="restaurants-grid">
              {recommendedRestaurants.map((r) => (
                <RestaurantCard key={r._id || r.restaurantId} restaurant={r} featured />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No restaurants match your current filters</h3>
              <p>Try adjusting your preferences or filters to see more results.</p>
              <button className="reset-filters-btn" onClick={() => loadPersonalizedRecommendations(1)}>
                Show All Recommendations
              </button>
            </div>
          )}

          {totalRestaurants > PAGE_LIMIT && activeFilter !== 'noSelection' && (
            <div className="pagination">
              <button disabled={page === 1} onClick={handlePrevPage}>
                ◀ Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page * PAGE_LIMIT >= totalRestaurants} onClick={handleNextPage}>
                Next ▶
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Discover;