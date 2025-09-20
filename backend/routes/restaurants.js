const express = require('express');
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurant);

// Protected routes (require authentication)
router.post('/', protect, createRestaurant);
router.put('/:id', protect, updateRestaurant);
router.delete('/:id', protect, deleteRestaurant);

module.exports = router;