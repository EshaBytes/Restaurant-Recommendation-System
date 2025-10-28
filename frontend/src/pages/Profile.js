import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('preferences');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  
  const [preferences, setPreferences] = useState({
    cuisines: [],
    priceRange: { min: 0, max: 5000 },
    allergies: [],
    dietaryRestrictions: []
  });

  const cuisineOptions = [
    'Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 
    'American', 'French', 'Mediterranean', 'Korean', 'Vietnamese',
    'Spanish', 'Greek', 'Lebanese', 'Turkish', 'Brazilian', 'Peruvian'
  ];

  const allergyOptions = [
    'Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 
    'Seafood', 'Sesame', 'Mustard', 'Sulfites'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo',
    'Low Carb', 'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher'
  ];

  const loadUserProfile = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserData(profile);
      setPreferences(profile.preferences || preferences);
      setFavoriteRestaurants(profile.favoriteRestaurants || []);
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleCuisineToggle = (cuisine) => {
    setPreferences(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine]
    }));
  };

  const handleAllergyToggle = (allergy) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const handleDietaryToggle = (diet) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(diet)
        ? prev.dietaryRestrictions.filter(d => d !== diet)
        : [...prev.dietaryRestrictions, diet]
    }));
  };

  const handlePriceRangeChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: Math.max(0, parseInt(value) || 0)
      }
    }));
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      setMessage('');
      
      const updatedProfile = {
        ...userData,
        preferences: preferences
      };
      
      await updateUserProfile(updatedProfile);
      setUserData(updatedProfile);
      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const removeFavorite = (restaurantId) => {
    setFavoriteRestaurants(prev => 
      prev.filter(rest => rest.restaurantId !== restaurantId)
    );
  };

  const addMockFavorites = () => {
    const mockRestaurants = [
      {
        restaurantId: 1,
        name: "Italian Bistro",
        cuisines: ["Italian"],
        locality: "Downtown",
        city: "New York",
        aggregateRating: 4.5,
        priceRange: 3,
        averageCost: 1500,
        currency: "₹",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"
      },
      {
        restaurantId: 2,
        name: "Sushi Palace",
        cuisines: ["Japanese", "Sushi"],
        locality: "Midtown",
        city: "New York",
        aggregateRating: 4.8,
        priceRange: 4,
        averageCost: 2500,
        currency: "₹",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"
      },
      {
        restaurantId: 3,
        name: "Spice Garden",
        cuisines: ["Indian", "Asian"],
        locality: "East Side",
        city: "New York",
        aggregateRating: 4.6,
        priceRange: 3,
        averageCost: 1200,
        currency: "₹",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400"
      }
    ];
    setFavoriteRestaurants(mockRestaurants);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="user-info-card">
            <div className="avatar-section">
              <div className="avatar-large">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 
                 currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <h1 className="user-name">{currentUser?.name || currentUser?.email || 'User'}</h1>
                <p className="user-email">{currentUser?.email}</p>
                <p className="member-since">
                  Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`message-alert ${message.includes('Failed') ? 'error' : 'success'}`}>
            <span className="alert-icon">{message.includes('Failed') ? '⚠️' : '✅'}</span>
            {message}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <span className="tab-icon">⚙️</span>
            Preferences
          </button>
          <button 
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <span className="tab-icon">❤️</span>
            Favorites
            {favoriteRestaurants.length > 0 && (
              <span className="tab-badge">{favoriteRestaurants.length}</span>
            )}
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="tab-icon">🔍</span>
            History
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="preferences-section">
              <div className="section-header">
                <h2>Your Dining Preferences</h2>
                <p>Customize your food discovery experience</p>
              </div>

              <div className="preferences-grid">
                {/* Cuisine Preferences */}
                <div className="preference-card">
                  <div className="preference-header">
                    <h3>Favorite Cuisines</h3>
                    <span className="selection-count">
                      {preferences.cuisines.length} selected
                    </span>
                  </div>
                  <p className="preference-description">
                    Select your favorite types of food
                  </p>
                  <div className="chips-grid">
                    {cuisineOptions.map(cuisine => (
                      <button
                        key={cuisine}
                        className={`preference-chip ${preferences.cuisines.includes(cuisine) ? 'selected' : ''}`}
                        onClick={() => handleCuisineToggle(cuisine)}
                      >
                        {cuisine}
                        {preferences.cuisines.includes(cuisine) && (
                          <span className="check-mark">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="preference-card">
                  <div className="preference-header">
                    <h3>Price Range</h3>
                  </div>
                  <p className="preference-description">
                    Set your preferred spending range per person
                  </p>
                  <div className="price-range-container">
                    <div className="price-inputs">
                      <div className="price-input-group">
                        <label>Min</label>
                        <div className="input-with-symbol">
                          <span className="currency-symbol">₹</span>
                          <input
                            type="number"
                            value={preferences.priceRange.min}
                            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                            min="0"
                            max={preferences.priceRange.max}
                          />
                        </div>
                      </div>
                      <div className="price-separator">-</div>
                      <div className="price-input-group">
                        <label>Max</label>
                        <div className="input-with-symbol">
                          <span className="currency-symbol">₹</span>
                          <input
                            type="number"
                            value={preferences.priceRange.max}
                            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                            min={preferences.priceRange.min}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="price-display">
                      ₹{preferences.priceRange.min} - ₹{preferences.priceRange.max}
                    </div>
                  </div>
                </div>

                {/* Allergies */}
                <div className="preference-card">
                  <div className="preference-header">
                    <h3>Allergies</h3>
                    <span className="selection-count">
                      {preferences.allergies.length} selected
                    </span>
                  </div>
                  <p className="preference-description">
                    Select any food allergies
                  </p>
                  <div className="chips-grid">
                    {allergyOptions.map(allergy => (
                      <button
                        key={allergy}
                        className={`preference-chip allergy ${preferences.allergies.includes(allergy) ? 'selected' : ''}`}
                        onClick={() => handleAllergyToggle(allergy)}
                      >
                        {allergy}
                        {preferences.allergies.includes(allergy) && (
                          <span className="check-mark">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div className="preference-card">
                  <div className="preference-header">
                    <h3>Dietary Preferences</h3>
                    <span className="selection-count">
                      {preferences.dietaryRestrictions.length} selected
                    </span>
                  </div>
                  <p className="preference-description">
                    Select any dietary restrictions
                  </p>
                  <div className="chips-grid">
                    {dietaryOptions.map(diet => (
                      <button
                        key={diet}
                        className={`preference-chip dietary ${preferences.dietaryRestrictions.includes(diet) ? 'selected' : ''}`}
                        onClick={() => handleDietaryToggle(diet)}
                      >
                        {diet}
                        {preferences.dietaryRestrictions.includes(diet) && (
                          <span className="check-mark">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="save-section">
                <button 
                  className="save-preferences-btn"
                  onClick={savePreferences}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="btn-spinner"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Preferences'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="favorites-section">
              <div className="section-header">
                <h2>Your Favorite Restaurants</h2>
                {favoriteRestaurants.length === 0 && (
                  <button className="demo-btn" onClick={addMockFavorites}>
                    Add Demo Favorites
                  </button>
                )}
              </div>

              {favoriteRestaurants.length > 0 ? (
                <div className="favorites-grid">
                  {favoriteRestaurants.map(restaurant => (
                    <div key={restaurant.restaurantId} className="favorite-card">
                      <RestaurantCard restaurant={restaurant} />
                      <button 
                        className="remove-favorite-btn"
                        onClick={() => removeFavorite(restaurant.restaurantId)}
                        title="Remove from favorites"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">❤️</div>
                  <h3>No favorites yet</h3>
                  <p>Start exploring restaurants and add them to your favorites!</p>
                  <button className="demo-btn" onClick={addMockFavorites}>
                    Add Demo Favorites
                  </button>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="history-section">
              <div className="section-header">
                <h2>Search History</h2>
              </div>

              {userData?.searchHistory?.length > 0 ? (
                <div className="history-list">
                  {userData.searchHistory.slice(0, 10).map((search, index) => (
                    <div key={index} className="history-item">
                      <div className="search-info">
                        <span className="search-query">"{search.query}"</span>
                        <span className="search-date">
                          {new Date(search.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="search-meta">
                        {search.resultsCount && (
                          <span className="results-count">{search.resultsCount} results</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No search history</h3>
                  <p>Your recent searches will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;