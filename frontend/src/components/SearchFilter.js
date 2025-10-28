import React, { useState, useEffect } from 'react';

const SearchFilter = ({ onFilterChange, currentFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: '',
    maxPrice: '',
    search: ''
  });

  // Sync with parent component's filters if provided
  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      cuisine: '',
      minRating: '',
      maxPrice: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const hasActiveFilters = filters.cuisine || filters.minRating || filters.maxPrice || filters.search;

  // Common cuisines from your dataset
  const cuisineOptions = [
    'Italian', 'Japanese', 'Indian', 'Chinese', 'Mexican', 
    'American', 'Thai', 'French', 'Mediterranean', 'Korean',
    'Vietnamese', 'Spanish', 'Greek', 'Lebanese', 'Turkish'
  ];

  return (
    <div className="filter-section mb-4 p-4 bg-light rounded">
      <div className="row align-items-end">
        {/* Search Input */}
        <div className="col-md-4 mb-3">
          <label className="form-label fw-semibold">Search Restaurants</label>
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search by name, cuisine, or location..."
              value={filters.search}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Cuisine Filter */}
        <div className="col-md-3 mb-3">
          <label className="form-label fw-semibold">Cuisine Type</label>
          <select 
            name="cuisine" 
            className="form-select" 
            value={filters.cuisine} 
            onChange={handleChange}
          >
            <option value="">All Cuisines</option>
            {cuisineOptions.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="col-md-2 mb-3">
          <label className="form-label fw-semibold">Min Rating</label>
          <select 
            name="minRating" 
            className="form-select" 
            value={filters.minRating} 
            onChange={handleChange}
          >
            <option value="">Any Rating</option>
            <option value="4.5">⭐ 4.5+</option>
            <option value="4">⭐ 4.0+</option>
            <option value="3">⭐ 3.0+</option>
            <option value="2">⭐ 2.0+</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="col-md-2 mb-3">
          <label className="form-label fw-semibold">Max Price</label>
          <select 
            name="maxPrice" 
            className="form-select" 
            value={filters.maxPrice} 
            onChange={handleChange}
          >
            <option value="">Any Price</option>
            <option value="1">💲 Budget</option>
            <option value="2">💲💲 Moderate</option>
            <option value="3">💲💲💲 Expensive</option>
            <option value="4">💲💲💲💲 Luxury</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="col-md-1 mb-3">
          <label className="form-label d-block">&nbsp;</label>
          <button
            onClick={handleClear}
            disabled={!hasActiveFilters}
            className="btn btn-outline-secondary w-100"
            title="Clear all filters"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <small className="text-muted">Active filters:</small>
              {filters.search && (
                <span className="badge bg-primary">
                  Search: "{filters.search}" ✕
                </span>
              )}
              {filters.cuisine && (
                <span className="badge bg-success">
                  Cuisine: {filters.cuisine} ✕
                </span>
              )}
              {filters.minRating && (
                <span className="badge bg-warning text-dark">
                  Rating: {filters.minRating}+ ✕
                </span>
              )}
              {filters.maxPrice && (
                <span className="badge bg-info">
                  Max: {'💲'.repeat(parseInt(filters.maxPrice))} ✕
                </span>
              )}
              <button
                onClick={handleClear}
                className="btn btn-sm btn-outline-danger"
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