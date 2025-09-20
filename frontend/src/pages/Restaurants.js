import React, { useState, useEffect } from 'react';
import { getRestaurants } from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';
import SearchFilter from '../components/SearchFilter';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getRestaurants(filters);
        setRestaurants(Array.isArray(data.restaurants) ? data.restaurants : []);
        setError('');
      } catch (err) {
        setError('Failed to load restaurants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [filters]); // ✅ only filters as dependency

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="section-title">Restaurants</h1>
      
      <SearchFilter onFilterChange={handleFilterChange} />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="row">
        {restaurants.length === 0 ? (
          <div className="col-12 text-center">
            <p>No restaurants found. Try adjusting your filters.</p>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <div key={restaurant._id} className="col-md-4">
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Restaurants;
