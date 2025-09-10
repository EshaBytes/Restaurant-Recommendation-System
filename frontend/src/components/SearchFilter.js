import React, { useState } from 'react';

const SearchFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: '',
    maxPrice: '',
    search: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-section mb-4">
      <div className="row">
        <div className="col-md-3 mb-3">
          <label className="form-label">Cuisine</label>
          <select 
            name="cuisine" 
            className="form-select" 
            value={filters.cuisine} 
            onChange={handleChange}
          >
            <option value="">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Chinese">Chinese</option>
            <option value="Indian">Indian</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Min Rating</label>
          <select 
            name="minRating" 
            className="form-select" 
            value={filters.minRating} 
            onChange={handleChange}
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Max Price</label>
          <select 
            name="maxPrice" 
            className="form-select" 
            value={filters.maxPrice} 
            onChange={handleChange}
          >
            <option value="">Any Price</option>
            <option value="1">$ (Budget)</option>
            <option value="2">$$ (Moderate)</option>
            <option value="3">$$$ (Expensive)</option>
            <option value="4">$$$$ (Luxury)</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Search</label>
          <input
            type="text"
            name="search"
            className="form-control"
            placeholder="Search restaurants..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;