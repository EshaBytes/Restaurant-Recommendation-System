import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  if (!restaurant) {
    return null;
  }

  // Safely extract restaurant data with fallbacks
  const {
    _id,
    name = 'Restaurant Name',
    cuisine = 'Cuisine not specified',
    rating = 0,
    priceLevel = 2,
    image,
    address = {},
    description = 'No description available',
    zomatoData = {}
  } = restaurant;

  // Generate star rating display
  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">⭐</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">⭐</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return (
      <div className="rating-display">
        {stars}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Generate price indicator
  const renderPriceLevel = () => {
    return '💲'.repeat(priceLevel) + '💲'.repeat(4 - priceLevel).replace(/💲/g, '⚪');
  };

  // Get location text
  const getLocationText = () => {
    if (address.city && address.locality) {
      return `${address.locality}, ${address.city}`;
    }
    if (zomatoData.locality) {
      return zomatoData.locality;
    }
    if (address.city) {
      return address.city;
    }
    return 'Location not specified';
  };

  return (
    <div className="restaurant-card">
      <Link to={`/restaurants/${_id}`} className="card-link">
        {/* Restaurant Image */}
        <div className="card-image-container">
          <img 
            src={image || '/default-restaurant.jpg'} 
            alt={name}
            className="restaurant-image"
            onError={(e) => {
              e.target.src = '/default-restaurant.jpg';
            }}
          />
          <div className="card-overlay">
            <div className="price-badge">
              {renderPriceLevel()}
            </div>
            {zomatoData.hasOnlineDelivery && (
              <div className="delivery-badge">
                🚗 Delivery
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="card-content">
          <div className="card-header">
            <h3 className="restaurant-name">{name}</h3>
            <div className="cuisine-badge">
              {cuisine}
            </div>
          </div>

          <div className="card-body">
            <p className="restaurant-description">
              {description.length > 100 
                ? `${description.substring(0, 100)}...` 
                : description
              }
            </p>

            <div className="restaurant-location">
              📍 {getLocationText()}
            </div>

            {zomatoData.averageCostForTwo && (
              <div className="cost-for-two">
                Avg. Cost for Two: {zomatoData.currency} {zomatoData.averageCostForTwo}
              </div>
            )}
          </div>

          <div className="card-footer">
            <div className="rating-section">
              {renderRating()}
              {zomatoData.votes > 0 && (
                <span className="vote-count">({zomatoData.votes} votes)</span>
              )}
            </div>

            <div className="features">
              {zomatoData.hasTableBooking && (
                <span className="feature-tag">📅 Book Table</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard;