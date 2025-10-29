const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getRecommendations
} = require('../controllers/restaurantController'); // Make sure filename matches
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getRestaurants);
router.get('/search', searchRestaurants);
router.get('/recommendations', getRecommendations);
router.get('/:id', getRestaurant);

// Protected routes
router.post('/', protect, createRestaurant);
router.put('/:id', protect, updateRestaurant);
router.delete('/:id', protect, deleteRestaurant);

module.exports = router;