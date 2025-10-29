const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// GET all reviews for a restaurant
router.get('/:restaurantId', getReviews);

// POST a new review (only logged-in users)
router.post('/:restaurantId', protect, createReview);

// PUT and DELETE for review editing/deleting
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
