import React, { useState, useEffect, useRef } from 'react';
import { getCities } from '../utils/api';

const SearchFilter = ({ onFilterChange, currentFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: '',
    maxPrice: '',
    search: '',
    city: ''
  });

  const [cities, setCities] = useState([]); 
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const isInitialMount = useRef(true);

 
  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await getCities();
        if (Array.isArray(data)) {
          setCities(data);
        } else {
          console.warn('⚠️ Unexpected city data:', data);
        }
      } catch (error) {
        console.error('❌ Error loading cities:', error);
      }
    };
    loadCities();
  }, []);

 
  useEffect(() => {
    if (!currentFilters) return;

 
    if (
      JSON.stringify(filters) !== JSON.stringify(currentFilters) &&
      !isInitialMount.current
    ) {
      setFilters(currentFilters);
    }

    isInitialMount.current = false;
  }, [currentFilters]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };

    setFilters(newFilters);

    setHasActiveFilters(
      Object.values(newFilters).some(
        (v) => typeof v === 'string' && v.trim() !== ''
      )
    );
    onFilterChange(newFilters);
  };


  const handleClear = () => {
    const clearedFilters = {
      cuisine: '',
      minRating: '',
      maxPrice: '',
      search: '',
      city: ''
    };
    setFilters(clearedFilters);
    setHasActiveFilters(false);
    onFilterChange(clearedFilters);
    if (onClearFilters) onClearFilters();
  };


  const removeFilter = (filterName) => {
    const newFilters = { ...filters, [filterName]: '' };
    setFilters(newFilters);

    setHasActiveFilters(
      Object.values(newFilters).some(
        (v) => typeof v === 'string' && v.trim() !== ''
      )
    );
    onFilterChange(newFilters);
  };


  const cuisineOptions = [
    'Afghani', 'African', 'American', 'Andhra', 'Arabian', 'Armenian', 'Asian',
    'Assamese', 'Awadhi', 'BBQ', 'Bakery', 'Belgian', 'Bengali', 'Beverages',
    'Bihari', 'Biryani', 'Burger', 'Cafe', 'Charcoal Grill', 'Chinese', 'Coffee',
    'Continental', 'Desserts', 'European', 'Fast Food', 'Finger Food', 'French',
    'German', 'Goan', 'Greek', 'Gujarati', 'Healthy Food', 'Hyderabadi',
    'Ice Cream', 'Indian', 'International', 'Italian', 'Japanese', 'Juices',
    'Kashmiri', 'Kebab', 'Kerala', 'Korean', 'Lebanese', 'Lucknowi',
    'Maharashtrian', 'Malaysian', 'Mediterranean', 'Mexican', 'Middle Eastern',
    'Mithai', 'Modern Indian', 'Momos', 'Mughlai', 'Nepalese', 'North Eastern',
    'North Indian', 'Oriental', 'Paan', 'Pakistani', 'Pasta', 'Pizza',
    'Portuguese', 'Punjabi', 'Rajasthani', 'Rolls', 'Salad', 'Sandwich',
    'Seafood', 'South American', 'South Indian', 'Spanish', 'Sri Lankan', 'Steak',
    'Street Food', 'Sushi', 'Tea', 'Tex-Mex', 'Thai', 'Tibetan', 'Turkish', 'Vietnamese'
  ].sort();

  return (
    <div className="filter-section mb-4 p-4 bg-light rounded">
      <div className="row align-items-end">
  
        <div className="col-md-3 mb-3">
          <label className="form-label fw-semibold">Search Restaurants</label>
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search by name..."
              value={filters.search}
              onChange={handleChange}
            />
            {filters.search && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => removeFilter('search')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>


        <div className="col-md-3 mb-3">
          <label className="form-label fw-semibold">Cuisine Type</label>
          <select
            name="cuisine"
            className="form-select"
            value={filters.cuisine}
            onChange={handleChange}
          >
            <option value="">All Cuisines</option>
            {cuisineOptions.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>


        <div className="col-md-3 mb-3">
          <label className="form-label fw-semibold">City</label>
          <select
            name="city"
            className="form-select"
            value={filters.city}
            onChange={handleChange}
          >
            <option value="">All Cities</option>
            {cities.length > 0 ? (
              cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))
            ) : (
              <option disabled>Loading cities...</option>
            )}
          </select>
        </div>


        <div className="col-md-1 mb-3">
          <label className="form-label fw-semibold">Min Rating</label>
          <select
            name="minRating"
            className="form-select"
            value={filters.minRating}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="4.5">4.5+</option>
            <option value="4">4.0+</option>
            <option value="3">3.0+</option>
            <option value="2">2.0+</option>
          </select>
        </div>


        <div className="col-md-1 mb-3">
          <label className="form-label fw-semibold">Max Price</label>
          <select
            name="maxPrice"
            className="form-select"
            value={filters.maxPrice}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="1">₹</option>
            <option value="2">₹₹</option>
            <option value="3">₹₹₹</option>
            <option value="4">₹₹₹₹</option>
          </select>
        </div>


        <div className="col-md-1 mb-3">
          <label className="form-label d-block">&nbsp;</label>
          <button
            onClick={handleClear}
            disabled={!hasActiveFilters}
            className="btn btn-outline-secondary w-100"
            title="Clear all filters"
            type="button"
          >
            🗑️
          </button>
        </div>
      </div>


      {hasActiveFilters && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <small className="text-muted">Active filters:</small>

              {filters.search && (
                <span
                  className="badge bg-primary cursor-pointer"
                  onClick={() => removeFilter('search')}
                >
                  Search: "{filters.search}" ✕
                </span>
              )}
              {filters.cuisine && (
                <span
                  className="badge bg-success cursor-pointer"
                  onClick={() => removeFilter('cuisine')}
                >
                  Cuisine: {filters.cuisine} ✕
                </span>
              )}
              {filters.city && (
                <span
                  className="badge bg-dark cursor-pointer"
                  onClick={() => removeFilter('city')}
                >
                  City: {filters.city} ✕
                </span>
              )}
              {filters.minRating && (
                <span
                  className="badge bg-warning text-dark cursor-pointer"
                  onClick={() => removeFilter('minRating')}
                >
                  Rating: {filters.minRating}+ ✕
                </span>
              )}
              {filters.maxPrice && (
                <span
                  className="badge bg-info cursor-pointer"
                  onClick={() => removeFilter('maxPrice')}
                >
                  Max: {'₹'.repeat(parseInt(filters.maxPrice))} ✕
                </span>
              )}

              <button
                onClick={handleClear}
                className="btn btn-sm btn-outline-danger"
                type="button"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
