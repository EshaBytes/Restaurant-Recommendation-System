import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const renderPriceLevel = (level) => {
    return '$'.repeat(level);
  };

  return (
    <div className="restaurant-card card">
      <img 
        src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'} 
        className="restaurant-img card-img-top" 
        alt={restaurant.name} 
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{restaurant.name}</h5>
          <span className="badge bg-primary">{restaurant.cuisine}</span>
        </div>
        <div className="rating mb-2">
          {renderRatingStars(restaurant.rating)}
          <span className="ms-1">{restaurant.rating.toFixed(1)}</span>
        </div>
        <p className="card-text">{restaurant.description.substring(0, 100)}...</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="price-level">{renderPriceLevel(restaurant.priceLevel)}</span>
          <span><i className="fas fa-map-marker-alt me-1"></i> {restaurant.address.city}</span>
        </div>
      </div>
      <div className="card-footer bg-white">
        <Link to={`/restaurants/${restaurant._id}`} className="btn btn-outline-primary w-100">
          View Details
        </Link>
      </div>
    </div>
  );
};

// Make sure this export is correct
export default RestaurantCard;