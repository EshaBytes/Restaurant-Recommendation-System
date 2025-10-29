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

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 12;

  // Load all restaurants on mount
  useEffect(() => {
    loadAllRestaurants();
  }, []);

  // Fetch filtered restaurants when filters change
  useEffect(() => {
    fetchFilteredRestaurants();
  }, [filters]);

  // 🔹 Load all restaurants initially
  const loadAllRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRestaurants();
      const restaurantsArray = data.restaurants || data.data || [];

      setAllRestaurants(restaurantsArray);
      setFilteredRestaurants(restaurantsArray);
      setCurrentPage(1); // reset to first page
    } catch (err) {
      console.error("Error loading restaurants:", err);
      setError(err.message || "Failed to load restaurants");
      setAllRestaurants([]);
      setFilteredRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch filtered restaurants directly from backend
  const fetchFilteredRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRestaurants(filters);
      const restaurantsArray = data.restaurants || data.data || [];

      setFilteredRestaurants(restaurantsArray);
      setCurrentPage(1); // reset to first page after filter
    } catch (err) {
      console.error("Error fetching filtered restaurants:", err);
      setError(err.message || "Failed to fetch filtered restaurants");
      setFilteredRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
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

  // 🔹 Pagination Logic
  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ✅ Fixed: Display message logic (accurate count)
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

    const hasActiveFilters =
      (filters.cuisine && filters.cuisine !== "") ||
      filters.minRating > 0 ||
      filters.maxPrice < 5 ||
      (filters.search && filters.search.trim() !== "");

    if (hasActiveFilters) {
      return `Showing ${currentRestaurants.length} of ${filteredRestaurants.length} restaurant${
        filteredRestaurants.length !== 1 ? "s" : ""
      }`;
    }

    return `Showing ${currentRestaurants.length} of ${allRestaurants.length} restaurant${
      allRestaurants.length !== 1 ? "s" : ""
    }`;
  };

  const displayMessage = getDisplayMessage();

  const hasActiveFilters =
    filters.search ||
    filters.cuisine ||
    filters.minRating > 0 ||
    filters.maxPrice < 5;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="section-title mb-4">Restaurants</h1>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <SearchFilter
            onFilterChange={handleFilterChange}
            currentFilters={filters}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Error */}
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

      {/* Loading */}
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
      {!loading && currentRestaurants.length > 0 && (
        <div className="row">
          {currentRestaurants.map((restaurant) => (
            <div
              key={restaurant._id || restaurant.restaurantId}
              className="col-lg-4 col-md-6 mb-4"
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center align-items-center gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            <span className="text-muted">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && currentRestaurants.length === 0 && !error && (
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="empty-state">
              <i className="fas fa-utensils fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">
                {allRestaurants.length === 0
                  ? "No restaurants available"
                  : "No restaurants found"}
              </h4>
              <p className="text-muted">
                {allRestaurants.length === 0
                  ? "There are no restaurants in the database."
                  : "Try adjusting your search criteria or filters"}
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
