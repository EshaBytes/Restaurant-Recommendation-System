const express = require('express');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// Get all restaurants with optional filtering
router.get('/', async (req, res) => {
  try {
    const { cuisine, minRating, maxPrice, search } = req.query;
    let filter = {};

    if (cuisine && cuisine !== 'all') {
      filter.cuisine = new RegExp(cuisine, 'i');
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      filter.priceLevel = { $lte: parseInt(maxPrice) };
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { cuisine: new RegExp(search, 'i') }
      ];
    }

    const restaurants = await Restaurant.find(filter);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new restaurant (protected route - add auth later)
router.post('/', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    const savedRestaurant = await restaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;