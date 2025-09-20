const Restaurant = require('../models/Restaurant');

// Get all restaurants with filtering
exports.getRestaurants = async (req, res) => {
  try {
    const { cuisine, minRating, maxPrice, search, page = 1, limit = 10 } = req.query;
    
    let filter = {};

    // Build filter object
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

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ rating: -1, createdAt: -1 });

    const total = await Restaurant.countDocuments(filter);

    res.json({
      success: true,
      count: restaurants.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      restaurants
    });

  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurants'
    });
  }
};

// Get single restaurant
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      restaurant
    });

  } catch (error) {
    console.error('Get restaurant error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurant'
    });
  }
};

// Create restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    const savedRestaurant = await restaurant.save();

    res.status(201).json({
      success: true,
      restaurant: savedRestaurant
    });

  } catch (error) {
    console.error('Create restaurant error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating restaurant'
    });
  }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      restaurant
    });

  } catch (error) {
    console.error('Update restaurant error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating restaurant'
    });
  }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });

  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting restaurant'
    });
  }
};