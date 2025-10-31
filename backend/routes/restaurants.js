const express = require('express');
const router = express.Router();

const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getRecommendations,
  getCities,
} = require('../controllers/restaurantController');

const { protect, adminOnly } = require('../middleware/auth');


router.get('/', getRestaurants);

router.get('/search', searchRestaurants);

router.get('/cities', getCities);

router.get('/recommendations', protect, getRecommendations);

router.get('/:id', getRestaurant);

router.get('/admin/search', protect, adminOnly, searchRestaurants);

router.post('/', protect, adminOnly, createRestaurant);

router.put('/:id', protect, adminOnly, updateRestaurant);

router.delete('/:id', protect, adminOnly, deleteRestaurant);

module.exports = router;
