const Restaurant = require('../models/Restaurant');

exports.getSimilarRestaurants = async (req, res) => {
  try {
    const { id } = req.params;
    const { cuisine, limit = 6 } = req.query;

    const currentRestaurant = await Restaurant.findById(id);
    if (!currentRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    let query = { _id: { $ne: id } };
    
    const targetCuisine = cuisine || (currentRestaurant.cuisine && currentRestaurant.cuisine[0]);
    if (targetCuisine) {
      query.cuisine = { $in: [targetCuisine] };
    }

    const priceRange = currentRestaurant.priceLevel || 2;
    query.priceLevel = { $gte: Math.max(1, priceRange - 1), $lte: Math.min(4, priceRange + 1) };

    const rating = currentRestaurant.rating || 3;
    query.rating = { $gte: Math.max(0, rating - 1), $lte: Math.min(5, rating + 1) };

    const similarRestaurants = await Restaurant.find(query)
      .limit(parseInt(limit))
      .sort({ rating: -1, priceLevel: 1 });

    res.json({
      success: true,
      restaurants: similarRestaurants,
      count: similarRestaurants.length,
      basedOn: {
        cuisine: targetCuisine,
        priceLevel: priceRange,
        rating: rating
      }
    });

  } catch (error) {
    console.error('Similar restaurants error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to find similar restaurants',
      message: error.message 
    });
  }
};