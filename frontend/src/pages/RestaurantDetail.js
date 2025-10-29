import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getRestaurant,
  getRestaurantReviews,
  createReview,
} from "../utils/api";
import { useAuth } from "../context/AuthContext";
import RestaurantCard from "../components/RestaurantCard";

const RestaurantDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      setError("");

      const [restaurantResponse, reviewsResponse] = await Promise.all([
        getRestaurant(id),
        getRestaurantReviews(id).catch((err) => {
          console.log("Reviews not available:", err);
          return { reviews: [] };
        }),
      ]);

      setRestaurant(restaurantResponse.restaurant || restaurantResponse.data);
      setReviews(reviewsResponse.reviews || []);
    } catch (error) {
      console.error("Error loading restaurant:", error);
      setError("Failed to load restaurant details");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Please log in to submit a review");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createReview(id, reviewForm);
      setReviewForm({ rating: 5, comment: "" });

      // Reload reviews
      const reviewsResponse = await getRestaurantReviews(id);
      setReviews(reviewsResponse.reviews || []);

      setError("Review submitted successfully!");
      setTimeout(() => setError(""), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Restaurant not found or failed to load.
        </div>
      </div>
    );
  }

  // ✅ Extract first cuisine type safely
  // ✅ Cuisine is an array (e.g. ["Indian", "Mughlai"])
  const cuisineType = Array.isArray(restaurant.cuisine)
    ? restaurant.cuisine[0].toLowerCase() // take first cuisine
    : ""; // fallback in case it's not an array

  // ✅ Function to return a cuisine-based fallback image

const cuisineImages = {
  'afghani': 'https://medmunch.com/wp-content/uploads/2020/09/Chopan-Kabob.jpeg',
  'african': 'https://in-sight.symrise.com/fileadmin/_processed_/4/d/csm_africanfoods_3bd303f9cd.jpg',
  'american': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9',
  'andhra': 'https://www.mistay.in/travel-blog/content/images/2020/06/andhra-cuisine-cover-2.jpg',
  'arabian': 'https://images.unsplash.com/photo-1604156788856-63f211d39c7b',
  'armenian': 'https://images.unsplash.com/photo-1613470208709-b3d1d2d3f74b',
  'asian': 'https://images.unsplash.com/photo-1521389508051-d7ffb5dc8e8d',
  'assamese': 'https://images.unsplash.com/photo-1623878711043-8d8c54717b87',
  'awadhi': 'https://images.unsplash.com/photo-1590080875831-3b4f8143d869',
  'bbq': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd',
  'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
  'belgian': 'https://images.unsplash.com/photo-1613470208709-b3d1d2d3f74b',
  'bengali': 'https://images.unsplash.com/photo-1589307004391-8d7d8cfb7f60',
  'beverages': 'https://images.unsplash.com/photo-1589391886645-d51941baf7a0',
  'bihari': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'biryani': 'https://images.unsplash.com/photo-1601050690597-2f4ad12b6e7a',
  'british': 'https://images.unsplash.com/photo-1529042410759-befb1204b468',
  'burger': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9',
  'burmese': 'https://images.unsplash.com/photo-1601074281890-fcd5d99a7e88',
  'cafe': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
  'cajun': 'https://images.unsplash.com/photo-1605478571966-8b8d42ebcdb9',
  'charcoal grill': 'https://images.unsplash.com/photo-1600891964092-4316c288032e',
  'chettinad': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'chinese': 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
  'continental': 'https://images.unsplash.com/photo-1589307004391-8d7d8cfb7f60',
  'cuisine varies': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  'deli': 'https://images.unsplash.com/photo-1601050690597-2f4ad12b6e7a',
  'desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
  'drinks only': 'https://images.unsplash.com/photo-1589391886645-d51941baf7a0',
  'european': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  'fast food': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9',
  'finger food': 'https://images.unsplash.com/photo-1583336663277-620dc1996580',
  'french': 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
  'german': 'https://images.unsplash.com/photo-1604156788856-63f211d39c7b',
  'goan': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'greek': 'https://images.unsplash.com/photo-1529042410759-befb1204b468',
  'gujarati': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'healthy food': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
  'hyderabadi': 'https://images.unsplash.com/photo-1601050690597-2f4ad12b6e7a',
  'ice cream': 'https://images.unsplash.com/photo-1570197571499-166b36435e9e',
  'indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  'indonesian': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43',
  'iranian': 'https://images.unsplash.com/photo-1613470208709-b3d1d2d3f74b',
  'italian': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  'japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
  'juices': 'https://images.unsplash.com/photo-1589391886645-d51941baf7a0',
  'kashmiri': 'https://images.unsplash.com/photo-1601050690597-2f4ad12b6e7a',
  'kerala': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'korean': 'https://images.unsplash.com/photo-1635363638580-c2809d049eee',
  'lebanese': 'https://images.unsplash.com/photo-1601074281890-fcd5d99a7e88',
  'malvani': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'mexican': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
  'middle eastern': 'https://images.unsplash.com/photo-1601074281890-fcd5d99a7e88',
  'mughlai': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'north indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  'oriental': 'https://images.unsplash.com/photo-1521389508051-d7ffb5dc8e8d',
  'paan': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'parsi': 'https://images.unsplash.com/photo-1601050690597-2f4ad12b6e7a',
  'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  'punjabi': 'https://images.unsplash.com/photo-1601050690597-2f4ad12b6e7a',
  'rajasthani': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'seafood': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
  'snacks': 'https://images.unsplash.com/photo-1583336663277-620dc1996580',
  'south indian': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'street food': 'https://images.unsplash.com/photo-1601050690597-2f4ad12b6e7a',
  'sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
  'tandoor': 'https://images.unsplash.com/photo-1600891964092-4316c288032e',
  'tea': 'https://images.unsplash.com/photo-1605478571966-8b8d42ebcdb9',
  'thai': 'https://images.unsplash.com/photo-1559314809-0f155d88cb58',
  'tibetan': 'https://images.unsplash.com/photo-1626082927389-bb83f1a0b7ef',
  'turkish': 'https://images.unsplash.com/photo-1601074281890-fcd5d99a7e88',
  'vietnamese': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43'
};
  const getCuisineThemedImage = () => {
    const match = Object.keys(cuisineImages).find((key) =>
      cuisineType.includes(key)
    );
    return match ? cuisineImages[match] : "/default-restaurant.jpg";
  };

  return (
    <div className="container mt-4">
      {/* Restaurant Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <img
                    src={restaurant.image || getCuisineThemedImage()}
                    alt={restaurant.name}
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "300px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                    onError={(e) => {
                      e.target.src = getCuisineThemedImage();
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <h1 className="card-title">{restaurant.name}</h1>
                  <div className="mb-3">
                    <span className="badge bg-primary me-2">
                      {restaurant.cuisine}
                    </span>
                    <span className="text-warning">
                      {"⭐".repeat(
                        Math.floor(
                          restaurant.rating || restaurant.aggregateRating || 0
                        )
                      )}
                      ({restaurant.rating || restaurant.aggregateRating})
                    </span>
                  </div>
                  <p className="card-text">{restaurant.description}</p>

                  <div className="restaurant-details">
                    <p>
                      <strong>📍 Location:</strong>{" "}
                      {restaurant.locality || restaurant.address?.locality},{" "}
                      {restaurant.city || restaurant.address?.city}
                    </p>
                    <p>
                      <strong>💰 Price Level:</strong>{" "}
                      {"💲".repeat(
                        restaurant.priceLevel || restaurant.priceRange || 2
                      )}
                    </p>
                    {restaurant.zomatoData?.averageCostForTwo && (
                      <p>
                        <strong>Average Cost for Two:</strong>{" "}
                        {restaurant.zomatoData.currency}{" "}
                        {restaurant.zomatoData.averageCostForTwo}
                      </p>
                    )}
                    {restaurant.zomatoData?.hasOnlineDelivery && (
                      <span className="badge bg-success me-2">
                        🚗 Delivery Available
                      </span>
                    )}
                    {restaurant.zomatoData?.hasTableBooking && (
                      <span className="badge bg-info">📅 Table Booking</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Reviews ({reviews.length})</h3>
            </div>
            <div className="card-body">
              {/* Review Form */}
              {currentUser && (
                <form onSubmit={handleReviewSubmit} className="mb-4">
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <select
                      className="form-select"
                      value={reviewForm.rating}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          rating: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value={5}>⭐️⭐️⭐️⭐️⭐️ (5)</option>
                      <option value={4}>⭐️⭐️⭐️⭐️ (4)</option>
                      <option value={3}>⭐️⭐️⭐️ (3)</option>
                      <option value={2}>⭐️⭐️ (2)</option>
                      <option value={1}>⭐️ (1)</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comment</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>{review.user?.username || "Anonymous"}</strong>
                      <span className="text-warning">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="mb-1">{review.comment}</p>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Restaurant Info</h4>
            </div>
            <div className="card-body">
              {restaurant.address && (
                <>
                  <h5>Address</h5>
                  <p>
                    {restaurant.address.street && (
                      <>
                        {restaurant.address.street}
                        <br />
                      </>
                    )}
                    {restaurant.address.locality && (
                      <>
                        {restaurant.address.locality}
                        <br />
                      </>
                    )}
                    {restaurant.address.city && (
                      <>
                        {restaurant.address.city}
                        <br />
                      </>
                    )}
                    {restaurant.address.state && (
                      <>
                        {restaurant.address.state}
                        <br />
                      </>
                    )}
                    {restaurant.address.zipCode && restaurant.address.zipCode}
                  </p>
                </>
              )}

              {restaurant.phone && (
                <>
                  <h5>Contact</h5>
                  <p>📞 {restaurant.phone}</p>
                </>
              )}

              {restaurant.website && (
                <>
                  <h5>Website</h5>
                  <p>
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {restaurant.website}
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="row mt-3">
          <div className="col-12">
            <div
              className={`alert ${
                error.includes("successfully")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
