import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth'; // Removed unused updateProfile
import { updateUserPreferences, getUserProfile } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import '../styles/Profile.css';

const Profile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('preferences');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    cuisines: [],
    priceRange: { min: 0, max: 5000 },
    allergies: [],
    dietaryRestrictions: []
  });

  // Available options
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

  // Load user profile function
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile(user.uid);
      setUserData(profile);
      setPreferences(profile.preferences || preferences);
      setFavoriteRestaurants(profile.favoriteRestaurants || []);
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Added proper dependency array

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
        [field]: parseInt(value) || 0
      }
    }));
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      await updateUserPreferences(user.uid, preferences);
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
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const removeFavorite = (restaurantId) => {
    setFavoriteRestaurants(prev => 
      prev.filter(rest => rest.restaurantId !== restaurantId)
    );
  };

  // Add mock favorite restaurants for demo
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
        currency: "₹"
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
        currency: "₹"
      }
    ];
    setFavoriteRestaurants(mockRestaurants);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-info">
          <div className="avatar">
            {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h1>{user?.displayName || user?.email || 'User'}</h1>
            <p>{user?.email}</p>
            <p className="member-since">
              Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>
        <button className="sign-out-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
        <button 
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites ({favoriteRestaurants.length})
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Search History
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'preferences' && (
          <div className="preferences-section">
            <h2>Your Dining Preferences</h2>
            
            {/* Cuisine Preferences */}
            <div className="preference-group">
              <h3>Favorite Cuisines</h3>
              <p className="preference-description">
                Select your favorite types of food to get better recommendations
              </p>
              <div className="cuisine-grid">
                {cuisineOptions.map(cuisine => (
                  <button
                    key={cuisine}
                    className={`cuisine-chip ${preferences.cuisines.includes(cuisine) ? 'selected' : ''}`}
                    onClick={() => handleCuisineToggle(cuisine)}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="preference-group">
              <h3>Price Range</h3>
              <p className="preference-description">
                Set your preferred spending range per person
              </p>
              <div className="price-range-inputs">
                <div className="price-input">
                  <label>Minimum</label>
                  <input
                    type="number"
                    value={preferences.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    min="0"
                  />
                </div>
                <div className="price-input">
                  <label>Maximum</label>
                  <input
                    type="number"
                    value={preferences.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              <div className="price-display">
                Budget: ₹{preferences.priceRange.min} - ₹{preferences.priceRange.max}
              </div>
            </div>

            {/* Allergies */}
            <div className="preference-group">
              <h3>Allergies</h3>
              <p className="preference-description">
                Select any food allergies to avoid recommendations with these ingredients
              </p>
              <div className="allergy-grid">
                {allergyOptions.map(allergy => (
                  <button
                    key={allergy}
                    className={`allergy-chip ${preferences.allergies.includes(allergy) ? 'selected' : ''}`}
                    onClick={() => handleAllergyToggle(allergy)}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="preference-group">
              <h3>Dietary Preferences</h3>
              <p className="preference-description">
                Select any dietary restrictions or preferences
              </p>
              <div className="dietary-grid">
                {dietaryOptions.map(diet => (
                  <button
                    key={diet}
                    className={`dietary-chip ${preferences.dietaryRestrictions.includes(diet) ? 'selected' : ''}`}
                    onClick={() => handleDietaryToggle(diet)}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="save-preferences-btn"
              onClick={savePreferences}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-section">
            <div className="favorites-header">
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
                  <div key={restaurant.restaurantId} className="favorite-item">
                    <RestaurantCard restaurant={restaurant} />
                    <button 
                      className="remove-favorite"
                      onClick={() => removeFavorite(restaurant.restaurantId)}
                    >
                      Remove
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

        {activeTab === 'history' && (
          <div className="history-section">
            <h2>Search History</h2>
            {userData?.searchHistory?.length > 0 ? (
              <div className="history-list">
                {userData.searchHistory.slice(0, 20).map((search, index) => (
                  <div key={index} className="history-item">
                    <span className="search-query">"{search.query}"</span>
                    <span className="search-date">
                      {new Date(search.timestamp).toLocaleDateString()}
                    </span>
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
  );
};

export default Profile;