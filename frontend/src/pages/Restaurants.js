import React, { useState, useEffect, useRef } from "react";
import { getRestaurants } from "../utils/api";
import RestaurantCard from "../components/RestaurantCard";
import SearchFilter from "../components/SearchFilter";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    cuisine: "",
    minRating: 0,
    maxPrice: 5,
    search: "",
    city: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const restaurantsPerPage = 12;

  const controllerRef = useRef(null);

  useEffect(() => {
    fetchRestaurants();
  }, [filters, currentPage]);

  
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      const params = { ...filters, page: currentPage, limit: restaurantsPerPage };
      const data = await getRestaurants(params, controllerRef.current.signal);

      const restaurantsArray = data.restaurants || data.data || [];
      const totalCount = data.total || data.count || 0;

      setRestaurants(restaurantsArray);
      setTotalRestaurants(totalCount);
    } catch (err) {
      if (err.name === "CanceledError") return;
      console.error("Error loading restaurants:", err);
      setError(err.message || "Failed to load restaurants");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      cuisine: "",
      minRating: 0,
      maxPrice: 5,
      search: "",
      city: "",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalRestaurants / restaurantsPerPage)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getDisplayMessage = () => {
    if (loading) return null;
    if (error) return "";

    if (restaurants.length === 0) return "No restaurants found.";

    const start = (currentPage - 1) * restaurantsPerPage + 1;
    const end = Math.min(start + restaurants.length - 1, totalRestaurants);
    return `Showing ${start}–${end} of ${totalRestaurants} restaurants`;
  };

  const displayMessage = getDisplayMessage();
  const totalPages = Math.ceil(totalRestaurants / restaurantsPerPage);

  return (
    <div className="container mt-4">
      
      <div className="row">
        <div className="col-12">
          <h1 className="section-title mb-4">Restaurants</h1>
        </div>
      </div>

      
      <div className="row mb-4">
        <div className="col-12">
          <SearchFilter
            onFilterChange={handleFilterChange}
            currentFilters={filters}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      
      {error && <div className="alert alert-danger">{error}</div>}

      
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted">Loading restaurants...</p>
        </div>
      )}

      
      {!loading && displayMessage && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="text-muted mb-0">{displayMessage}</p>
          {(filters.cuisine ||
            filters.minRating > 0 ||
            filters.maxPrice < 5 ||
            filters.search ||
            filters.city) && (
            <button onClick={handleClearFilters} className="btn btn-outline-secondary btn-sm">
              Clear Filters
            </button>
          )}
        </div>
      )}

      
      {!loading && restaurants.length > 0 && (
        <div className="row">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id || restaurant.restaurantId}
              className="col-lg-4 col-md-6 mb-4"
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      )}

      
      
{!loading && totalPages > 1 && (
  <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
    <button
      className="btn btn-outline-primary btn-sm"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      ← Previous
    </button>

    <span className="text-muted fw-medium">
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
)}

    
    </div>
  );
};

export default Restaurants;
