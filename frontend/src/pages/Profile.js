import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../utils/api";
import RestaurantCard from "../components/RestaurantCard";
import "../styles/Profile.css";

const Profile = () => {
  const { currentUser, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("preferences");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [profileError, setProfileError] = useState(null);

  // Initialize preferences with fallbacks
  const [preferences, setPreferences] = useState({
    cuisines: currentUser?.preferences?.cuisines || [],
    priceRange: currentUser?.preferences?.priceRange || { min: 0, max: 5000 },
    allergies: currentUser?.preferences?.allergies || [],
    dietaryRestrictions: currentUser?.preferences?.dietaryRestrictions || [],
  });

  const cuisineOptions = [
    "Italian",
    "Chinese",
    "Indian",
    "Mexican",
    "Japanese",
    "Thai",
    "American",
    "French",
    "Mediterranean",
    "Korean",
    "Vietnamese",
    "Spanish",
    "Greek",
    "Lebanese",
    "Turkish",
    "Brazilian",
    "Peruvian",
  ];

  const allergyOptions = [
    "Gluten",
    "Dairy",
    "Nuts",
    "Shellfish",
    "Eggs",
    "Soy",
    "Seafood",
    "Sesame",
    "Mustard",
    "Sulfites",
  ];

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Pescatarian",
    "Keto",
    "Paleo",
    "Low Carb",
    "Gluten-Free",
    "Dairy-Free",
    "Halal",
    "Kosher",
  ];

  // Enhanced debug test function
  const testProfileAPI = async () => {
    try {
      console.log("🔍 === COMPREHENSIVE PROFILE API DEBUG ===");

      // Check localStorage data
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      console.log("📱 FRONTEND DATA:");
      console.log("Stored user ID:", storedUser?.id);
      console.log("Stored user _id:", storedUser?._id);
      console.log("Stored user:", storedUser);
      console.log("Token exists:", !!token);

      // Decode token to see what ID it contains
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          console.log("🔐 TOKEN PAYLOAD:");
          console.log("Full payload:", tokenPayload);
          console.log("Token user ID:", tokenPayload.id);
          console.log("Token userId:", tokenPayload.userId);
          console.log("All token keys:", Object.keys(tokenPayload));
        } catch (tokenError) {
          console.error("Token decode error:", tokenError);
        }
      }

      // Check currentUser from AuthContext
      console.log("🎯 AUTH CONTEXT:");
      console.log("currentUser ID:", currentUser?.id);
      console.log("currentUser _id:", currentUser?._id);
      console.log("currentUser:", currentUser);

      // Make the API call
      console.log("🚀 MAKING API CALL...");
      const response = await getUserProfile();

      console.log("✅ API SUCCESS:");
      console.log("Response:", response);
      console.log("Returned user ID:", response.user?.id);
      console.log("Returned user _id:", response.user?._id);

      setMessage("✅ Profile API working!");
    } catch (error) {
      console.error("❌ API FAILED:");
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.message);

      let userMessage = "Profile API failed: ";
      if (error.response?.data?.message) {
        userMessage += error.response.data.message;
      } else {
        userMessage += error.message;
      }

      setMessage(userMessage);
    }
  };

  const loadUserProfile = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setProfileError(null);
      console.log("🔄 Fetching user profile...");

      const response = await getUserProfile();
      console.log("✅ Profile API response received");

      const userData = response.user || response;

      // Handle missing preferences with fallbacks
      const userWithDefaults = {
        ...userData,
        preferences: userData.preferences || {
          cuisines: [],
          priceRange: { min: 0, max: 5000 },
          allergies: [],
          dietaryRestrictions: [],
        },
      };

      setUserData(userWithDefaults);
      setPreferences(userWithDefaults.preferences);

      // Load favorites separately if needed
      try {
        const favoritesResponse = await getFavorites();
        setFavoriteRestaurants(
          favoritesResponse.favorites?.map((f) => f.restaurant || f) || []
        );
      } catch (favoritesError) {
        console.log("Could not load favorites:", favoritesError);
        setFavoriteRestaurants([]);
      }
    } catch (error) {
      console.error("❌ Error loading profile details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      setProfileError(error.message);

      // Use current user data as fallback with enhanced defaults
      const fallbackUserData = {
        ...currentUser,
        preferences: currentUser?.preferences || {
          cuisines: [],
          priceRange: { min: 0, max: 5000 },
          allergies: [],
          dietaryRestrictions: [],
        },
      };

      setUserData(fallbackUserData);
      setPreferences(fallbackUserData.preferences);
      setMessage(
        "Using basic profile information. Some features may be limited."
      );
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleCuisineToggle = (cuisine) => {
    setPreferences((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
  };

  const handleAllergyToggle = (allergy) => {
    setPreferences((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }));
  };

  const handleDietaryToggle = (diet) => {
    setPreferences((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(diet)
        ? prev.dietaryRestrictions.filter((d) => d !== diet)
        : [...prev.dietaryRestrictions, diet],
    }));
  };

  const handlePriceRangeChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: Math.max(0, parseInt(value) || 0),
      },
    }));
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      setMessage("");

      // Only send preferences to avoid sending entire user object
      const updatedProfile = {
        preferences: preferences,
      };

      const response = await updateUserProfile(updatedProfile);
      const updatedUser = response.user || response;

      // Merge updated user data with existing data
      const mergedUserData = {
        ...userData,
        ...updatedUser,
        preferences: updatedUser.preferences || preferences,
      };

      setUserData(mergedUserData);
      updateUser(mergedUserData); // Update AuthContext
      setMessage("Preferences saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("Failed to save preferences: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const addToFavorites = async (restaurantId) => {
    try {
      await addFavorite(restaurantId);
      // Reload favorites
      const favoritesResponse = await getFavorites();
      setFavoriteRestaurants(
        favoritesResponse.favorites || favoritesResponse.data || []
      );
      setMessage("Added to favorites!");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Error adding favorite:", error);
      setMessage("Failed to add favorite");
    }
  };

  const removeFromFavorites = async (restaurantId) => {
    try {
      await removeFavorite(restaurantId);
      setFavoriteRestaurants((prev) =>
        prev.filter(
          (rest) =>
            rest._id !== restaurantId && rest.restaurantId !== restaurantId
        )
      );
      setMessage("Removed from favorites");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Error removing favorite:", error);
      setMessage("Failed to remove favorite");
    }
  };

  const addMockFavorites = () => {
    const mockRestaurants = [
      {
        _id: 1,
        restaurantId: 1,
        name: "Italian Bistro",
        cuisine: "Italian",
        cuisines: ["Italian"],
        locality: "Downtown",
        city: "New York",
        rating: 4.5,
        aggregateRating: 4.5,
        priceLevel: 3,
        priceRange: 3,
        averageCost: 1500,
        currency: "₹",
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
      },
      {
        _id: 2,
        restaurantId: 2,
        name: "Sushi Palace",
        cuisine: "Japanese",
        cuisines: ["Japanese", "Sushi"],
        locality: "Midtown",
        city: "New York",
        rating: 4.8,
        aggregateRating: 4.8,
        priceLevel: 4,
        priceRange: 4,
        averageCost: 2500,
        currency: "₹",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
      },
    ];
    setFavoriteRestaurants(mockRestaurants);
  };

  // Show error state if profile completely fails to load
  if (profileError && !userData) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Failed to Load Profile</h3>
          <p>{profileError}</p>
          <div className="error-actions">
            <button onClick={loadUserProfile} className="retry-btn">
              Try Again
            </button>
            <button onClick={testProfileAPI} className="test-btn">
              Test Profile API
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                {currentUser?.username?.charAt(0)?.toUpperCase() ||
                  currentUser?.name?.charAt(0)?.toUpperCase() ||
                  currentUser?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
              <div className="user-details">
                <h1 className="user-name">
                  {currentUser?.username ||
                    currentUser?.name ||
                    currentUser?.email ||
                    "User"}
                </h1>
                <p className="user-email">{currentUser?.email}</p>
                <p className="member-since">
                  Member since{" "}
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button
                onClick={testProfileAPI}
                className="test-api-btn"
                title="Test Profile API"
              >
                Test API
              </button>
              <button className="sign-out-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`message-alert ${
              message.includes("Failed") ? "error" : "success"
            }`}
          >
            <span className="alert-icon">
              {message.includes("Failed") ? "⚠️" : "✅"}
            </span>
            {message}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            <span className="tab-icon">⚙️</span>
            Preferences
          </button>
          <button
            className={`tab ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            <span className="tab-icon">❤️</span>
            Favorites
            {favoriteRestaurants.length > 0 && (
              <span className="tab-badge">{favoriteRestaurants.length}</span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="preferences-section">
              <div className="section-header">
                <h2>Your Dining Preferences</h2>
                <p>Customize your food discovery experience</p>
                {profileError && (
                  <div className="profile-warning">
                    <span>
                      ⚠️ Using local preferences. Changes may not persist.
                    </span>
                  </div>
                )}
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
                    {cuisineOptions.map((cuisine) => (
                      <button
                        key={cuisine}
                        className={`preference-chip ${
                          preferences.cuisines.includes(cuisine)
                            ? "selected"
                            : ""
                        }`}
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
                            onChange={(e) =>
                              handlePriceRangeChange("min", e.target.value)
                            }
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
                            onChange={(e) =>
                              handlePriceRangeChange("max", e.target.value)
                            }
                            min={preferences.priceRange.min}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="price-display">
                      ₹{preferences.priceRange.min} - ₹
                      {preferences.priceRange.max}
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
                    {allergyOptions.map((allergy) => (
                      <button
                        key={allergy}
                        className={`preference-chip allergy ${
                          preferences.allergies.includes(allergy)
                            ? "selected"
                            : ""
                        }`}
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
                    {dietaryOptions.map((diet) => (
                      <button
                        key={diet}
                        className={`preference-chip dietary ${
                          preferences.dietaryRestrictions.includes(diet)
                            ? "selected"
                            : ""
                        }`}
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
                    "Save Preferences"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
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
                  {favoriteRestaurants.map((restaurant) => (
                    <div
                      key={restaurant._id || restaurant.restaurantId}
                      className="favorite-card"
                    >
                      <RestaurantCard
                        restaurant={restaurant}
                        isFavorite={true}
                        onFavoriteToggle={() =>
                          removeFromFavorites(
                            restaurant._id || restaurant.restaurantId
                          )
                        }
                      />

                      <button
                        className="remove-favorite-btn"
                        onClick={() =>
                          removeFromFavorites(
                            restaurant._id || restaurant.restaurantId
                          )
                        }
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
                  <p>
                    Start exploring restaurants and add them to your favorites!
                  </p>
                  <button className="demo-btn" onClick={addMockFavorites}>
                    Add Demo Favorites
                  </button>
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
