const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');


router.get('/restaurant/:restaurantId', getReviews);


router.post('/restaurant/:restaurantId', protect, createReview);


router.put('/:reviewId', protect, updateReview);


router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
