const Restaurant = require('../models/Restaurant');

// ===============================
// Get all restaurants with filtering (updated search fix)
// ===============================
exports.getRestaurants = async (req, res) => {
  try {
    const { cuisine, minRating, maxPrice, search, page = 1, limit = 8652, q } = req.query;
    let filter = {};

    // Support both 'search' and 'q' parameters
    const searchTerm = search || q;

    // ===== Filter by cuisine (multi-cuisine support) =====
    if (cuisine && cuisine !== 'all') {
      filter.cuisine = { $in: [new RegExp(cuisine, 'i')] };
    }

    // ===== Filter by rating =====
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // ===== Filter by price =====
    if (maxPrice) {
      filter.priceLevel = { $lte: parseInt(maxPrice) };
    }

    // ===== Improved general search (supports cuisines, menu items, and locality) =====
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { cuisines: { $in: [regex] } },
        { cuisine: { $in: [regex] } },
        { 'address.city': regex },
        { 'address.locality': regex },
        { 'zomatoData.locality': regex },
        { 'zomatoData.cuisines': { $in: [regex] } },
        { 'menuItems.name': regex },
        { 'menuItems.description': regex }
      ];
    }

    // ===== Pagination =====
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // ===== Query the database =====
    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ rating: -1, createdAt: -1 });

    const total = await Restaurant.countDocuments(filter);

    // ===== Transform data for frontend =====
    const transformedRestaurants = restaurants.map(restaurant => ({
      ...restaurant.toObject(),
      restaurantId: restaurant._id,
      cuisines: restaurant.cuisines || restaurant.cuisine || [],
      aggregateRating: restaurant.rating,
      priceRange: restaurant.priceLevel,
      averageCost: restaurant.zomatoData?.averageCostForTwo || 0,
      currency: restaurant.zomatoData?.currency || '₹',
      locality: restaurant.address?.locality || restaurant.zomatoData?.locality || '',
      city: restaurant.address?.city || ''
    }));

    res.json({
      success: true,
      count: restaurants.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      restaurants: transformedRestaurants,
      data: transformedRestaurants
    });

  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurants'
    });
  }
};

// ===============================
// Search restaurants (frontend compatibility)
// ===============================
exports.searchRestaurants = async (req, res) => {
  try {
    req.query.q = req.query.q || '';
    return exports.getRestaurants(req, res);
  } catch (error) {
    console.error('Search restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching restaurants'
    });
  }
};

// ===============================
// Get single restaurant
// ===============================
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const transformedRestaurant = {
      ...restaurant.toObject(),
      restaurantId: restaurant._id,
      cuisines: restaurant.cuisines || restaurant.cuisine || [],
      aggregateRating: restaurant.rating,
      priceRange: restaurant.priceLevel,
      averageCost: restaurant.zomatoData?.averageCostForTwo || 0,
      currency: restaurant.zomatoData?.currency || '₹',
      locality: restaurant.address?.locality || restaurant.zomatoData?.locality || '',
      city: restaurant.address?.city || ''
    };

    res.json({
      success: true,
      restaurant: transformedRestaurant,
      data: transformedRestaurant
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

// ===============================
// Create restaurant
// ===============================
exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, cuisine, cuisines, address, location, priceLevel, rating, image, website, phone } = req.body;

    const restaurant = new Restaurant({
      name,
      description,
      cuisine: Array.isArray(cuisine) ? cuisine : [cuisine],
      cuisines: Array.isArray(cuisines) ? cuisines : (cuisines ? [cuisines] : []),
      address,
      location,
      priceLevel,
      rating,
      image,
      website,
      phone
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Create restaurant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Update restaurant
// ===============================
exports.updateRestaurant = async (req, res) => {
  try {
    let { cuisines, cuisine, ...data } = req.body;

    if (typeof cuisines === "string") {
      cuisines = cuisines.split(",").map(c => c.trim());
    }

    if (typeof cuisine === "string") {
      cuisine = cuisine.split(",").map(c => c.trim());
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { ...data, cuisines, cuisine },
      { new: true, runValidators: true }
    );

    res.json(restaurant);
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(400).json({ message: error.message });
  }
};

// ===============================
// Delete restaurant
// ===============================
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

// ===============================
// Get recommendations
// ===============================
exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await Restaurant.find()
      .sort({ rating: -1 })
      .limit(8);

    const transformedRecommendations = recommendations.map(restaurant => ({
      ...restaurant.toObject(),
      restaurantId: restaurant._id,
      cuisines: restaurant.cuisines || restaurant.cuisine || [],
      aggregateRating: restaurant.rating,
      priceRange: restaurant.priceLevel
    }));

    res.json({
      success: true,
      recommendations: transformedRecommendations,
      data: transformedRecommendations
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recommendations'
    });
  }
};


