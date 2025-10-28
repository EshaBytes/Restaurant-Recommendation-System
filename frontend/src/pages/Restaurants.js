import React, { useState, useEffect } from "react";
import { getRestaurants } from "../utils/api";
import RestaurantCard from "../components/RestaurantCard";
import SearchFilter from "../components/SearchFilter";

const Restaurants = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    cuisine: "",
    minRating: 0,
    maxPrice: 5,
    search: "",
  });

  // Load all restaurants on component mount
  useEffect(() => {
    loadAllRestaurants();
  }, []);

  // Filter restaurants whenever filters change
  useEffect(() => {
    filterRestaurants();
  }, [filters, allRestaurants]);

  const loadAllRestaurants = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Loading all restaurants...");
      const data = await getRestaurants();
      console.log("API Response:", data);
      
      // Handle different response formats
      const restaurantsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.restaurants)
        ? data.restaurants
        : data && Array.isArray(data.data)
        ? data.data
        : [];

      console.log("Processed restaurants:", restaurantsArray);
      setAllRestaurants(restaurantsArray);
      setFilteredRestaurants(restaurantsArray);
      
    } catch (err) {
      const errorMessage = err.message || "Failed to load restaurants";
      setError(errorMessage);
      console.error("Error loading restaurants:", err);
      setAllRestaurants([]);
      setFilteredRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    if (allRestaurants.length === 0) return;

    let results = [...allRestaurants];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(restaurant => 
        restaurant.name?.toLowerCase().includes(searchTerm) ||
        restaurant.cuisine?.toLowerCase().includes(searchTerm) ||
        restaurant.description?.toLowerCase().includes(searchTerm) ||
        (restaurant.address?.city && restaurant.address.city.toLowerCase().includes(searchTerm)) ||
        (restaurant.zomatoData?.locality && restaurant.zomatoData.locality.toLowerCase().includes(searchTerm))
      );
    }

    // Cuisine filter
    if (filters.cuisine) {
      results = results.filter(restaurant => 
        restaurant.cuisine?.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      results = results.filter(restaurant => 
        (restaurant.rating || 0) >= parseFloat(filters.minRating)
      );
    }

    // Price filter
    if (filters.maxPrice < 5) {
      results = results.filter(restaurant => 
        (restaurant.priceLevel || 2) <= parseInt(filters.maxPrice)
      );
    }

    console.log("Filtered results:", results.length);
    setFilteredRestaurants(results);
  };

  const handleFilterChange = (newFilters) => {
    console.log("Filters changed:", newFilters);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      cuisine: "",
      minRating: 0,
      maxPrice: 5,
      search: "",
    });
  };

  const getDisplayMessage = () => {
    if (loading) return null;

    if (filters.search && filteredRestaurants.length === 0) {
      return `No restaurants found for "${filters.search}". Try a different search term.`;
    }

    if (filteredRestaurants.length === 0 && allRestaurants.length > 0) {
      return "No restaurants match your filters. Try adjusting your criteria.";
    }

    if (filteredRestaurants.length === 0) {
      return "No restaurants found.";
    }

    if (filters.search) {
      return `Found ${filteredRestaurants.length} restaurant${
        filteredRestaurants.length !== 1 ? "s" : ""
      } for "${filters.search}"`;
    }

    if (filters.cuisine || filters.minRating > 0 || filters.maxPrice < 5) {
      return `Showing ${filteredRestaurants.length} of ${allRestaurants.length} restaurant${
        allRestaurants.length !== 1 ? "s" : ""
      }`;
    }

    return `Showing ${filteredRestaurants.length} restaurant${
      filteredRestaurants.length !== 1 ? "s" : ""
    }`;
  };

  const displayMessage = getDisplayMessage();
  const hasActiveFilters = filters.search || filters.cuisine || filters.minRating > 0 || filters.maxPrice < 5;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="section-title mb-4">Restaurants</h1>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="row mb-4">
        <div className="col-12">
          <SearchFilter
            onFilterChange={handleFilterChange}
            currentFilters={filters}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="alert alert-danger d-flex align-items-center"
              role="alert"
            >
              <i className="fas fa-exclamation-triangle me-2"></i>
              <div>{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="row">
          <div className="col-12 text-center py-5">
            <div
              className="spinner-border text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading restaurants...</span>
            </div>
            <p className="mt-3 text-muted">
              Finding the best restaurants for you...
            </p>
          </div>
        </div>
      )}

      {/* Results Message */}
      {!loading && displayMessage && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <p className="text-muted mb-0">{displayMessage}</p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Restaurants Grid */}
      {!loading && filteredRestaurants.length > 0 && (
        <div className="row">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id || restaurant.id}
              className="col-lg-4 col-md-6 mb-4"
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRestaurants.length === 0 && !error && (
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="empty-state">
              <i className="fas fa-utensils fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">
                {allRestaurants.length === 0 ? "No restaurants available" : "No restaurants found"}
              </h4>
              <p className="text-muted">
                {allRestaurants.length === 0 
                  ? "There are no restaurants in the database." 
                  : "Try adjusting your search criteria or filters"
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="btn btn-primary mt-2"
                >
                  Clear All Filters
                </button>
              )}
              {allRestaurants.length === 0 && (
                <button
                  onClick={loadAllRestaurants}
                  className="btn btn-primary mt-2"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;