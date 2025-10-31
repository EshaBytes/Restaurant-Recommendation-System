import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  getFavorites,
  removeFavorite,
} from "../utils/api";
import RestaurantCard from "../components/RestaurantCard";
import "../styles/Profile.css";
import { toast } from "react-toastify";

const cuisineOptions = [
  "Italian", "Chinese", "Indian", "Mexican", "Japanese",
  "Thai", "American", "French", "Mediterranean", "Korean",
  "Vietnamese", "Spanish", "Greek", "Lebanese", "Turkish",
  "Brazilian", "Peruvian",
];

const Profile = () => {
  const { currentUser, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("preferences");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);

  const [preferences, setPreferences] = useState({
    cuisines: [],
    priceRange: { min: 0, max: 1000 }, 
    location: "",
    hasTableBooking: false,
    hasOnlineDelivery: false,
    isDeliveringNow: false,
  });


  const loadUserProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const response = await getUserProfile();
      const userData = response.user || response;

      const mergedUser = {
        ...userData,
        preferences: {
          cuisines: Array.isArray(userData?.preferences?.cuisines)
            ? userData.preferences.cuisines
            : [],
          priceRange: userData?.preferences?.priceRange || { min: 0, max: 1000 },
          location: userData?.preferences?.location || "",
          hasTableBooking: !!userData?.preferences?.hasTableBooking,
          hasOnlineDelivery: !!userData?.preferences?.hasOnlineDelivery,
          isDeliveringNow: !!userData?.preferences?.isDeliveringNow,
        },
      };

      setUserData(mergedUser);
      setPreferences(mergedUser.preferences);

 
      const favoritesResponse = await getFavorites();
      setFavoriteRestaurants(
        favoritesResponse?.favorites?.map((f) => f.restaurant || f) || []
      );
    } catch (error) {
      console.error("❌ Error loading profile:", error);
      toast.error("Failed to load profile.");
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

 
  const handlePriceRangeChange = (field, value) => {
    const numValue = Math.max(0, parseInt(value) || 0); 
    
    setPreferences((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: numValue,
      },
    }));
  };


  const handleCheckboxChange = (field) => {
    setPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
  };


  const handleLocationChange = (e) => {
    setPreferences((prev) => ({ ...prev, location: e.target.value }));
  };


  const savePreferences = async () => {
    try {
      setSaving(true);

      const updatedProfile = {
        username: currentUser?.username,
        email: currentUser?.email,
        preferences: {
          cuisines: preferences.cuisines || [],
          priceRange: {
            min: Number(preferences.priceRange.min) || 0,
            max: Number(preferences.priceRange.max) || 1000,
          },
          location: preferences.location || "",
          hasTableBooking: preferences.hasTableBooking || false,
          hasOnlineDelivery: preferences.hasOnlineDelivery || false,
          isDeliveringNow: preferences.isDeliveringNow || false,
        },
      };

      const response = await updateUserProfile(updatedProfile);
      const updatedUser = response.user || response;

      const mergedUser = {
        ...userData,
        ...updatedUser,
        preferences: updatedUser.preferences || updatedProfile.preferences,
      };

      setUserData(mergedUser);
      updateUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      toast.success("Preferences saved successfully! ✅");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <div className="user-info-card">
            <div className="avatar-section">
              <div className="avatar-large">
                {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="user-details">
                <h1>{currentUser?.username || "User"}</h1>
                <p>{currentUser?.email}</p>
                <p className="user-role">Role: {currentUser?.role || "user"}</p>
              </div>
            </div>
            <button
              className="sign-out-btn"
              onClick={() => {
                logout();
                toast.info("You have been signed out.");
              }}
            >
              Sign Out
            </button>
          </div>
        </div>


        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            ⚙️ Preferences
          </button>
          <button
            className={`tab ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            ❤️ Favorites
          </button>
        </div>


        {activeTab === "preferences" && (
          <div className="preferences-section">
            <div className="preferences-grid">

              <div className="preference-card">
                <h3>Favorite Cuisines</h3>
                <div className="chips-grid">
                  {cuisineOptions.map((cuisine) => (
                    <button
                      key={cuisine}
                      className={`preference-chip ${
                        preferences.cuisines.includes(cuisine) ? "selected" : ""
                      }`}
                      onClick={() => handleCuisineToggle(cuisine)}
                    >
                      {cuisine}
                      {preferences.cuisines.includes(cuisine) && " ✓"}
                    </button>
                  ))}
                </div>
                <div className="selected-count">
                  {preferences.cuisines.length} of {cuisineOptions.length} cuisines selected
                </div>
              </div>


              <div className="preference-card">
                <h3>Budget Range (₹)</h3>
                <div className="price-range-container">
                  <div className="price-input-group">
                    <label>Min Price:</label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={preferences.priceRange.min}
                      onChange={(e) =>
                        handlePriceRangeChange("min", e.target.value)
                      }
                    />
                    <span>₹</span>
                  </div>
                  
                  <div className="price-input-group">
                    <label>Max Price:</label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={preferences.priceRange.max}
                      onChange={(e) =>
                        handlePriceRangeChange("max", e.target.value)
                      }
                    />
                    <span>₹</span>
                  </div>
                </div>
              </div>


              <div className="preference-card">
                <h3>Preferred Location</h3>
                <input
                  type="text"
                  placeholder="Enter your city or area"
                  value={preferences.location}
                  onChange={handleLocationChange}
                />
              </div>


              <div className="preference-card">
                <h3>Additional Preferences</h3>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.hasTableBooking}
                      onChange={() => handleCheckboxChange("hasTableBooking")}
                    />
                    Has Table Booking
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.hasOnlineDelivery}
                      onChange={() =>
                        handleCheckboxChange("hasOnlineDelivery")
                      }
                    />
                    Has Online Delivery
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.isDeliveringNow}
                      onChange={() => handleCheckboxChange("isDeliveringNow")}
                    />
                    Is Delivering Now
                  </label>
                </div>
              </div>


              <div className="save-section">
                <button
                  className="save-preferences-btn"
                  onClick={savePreferences}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          </div>
        )}


        {activeTab === "favorites" && (
          <div className="favorites-section">
            <h2>Your Favorite Restaurants</h2>
            {favoriteRestaurants.length > 0 ? (
              <div className="favorites-grid">
                {favoriteRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    isFavorite={true}
                    onFavoriteToggle={() => {
                      removeFavorite(
                        restaurant._id || restaurant.restaurantId
                      );
                      setFavoriteRestaurants(prev => 
                        prev.filter(r => r._id !== restaurant._id)
                      );
                      toast.info("Removed from favorites.");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-favorites">
                <h3>No favorites yet</h3>
                <p>Start exploring restaurants and add them to your favorites!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;