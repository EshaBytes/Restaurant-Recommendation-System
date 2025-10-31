const { HYBRID } = require('../ml/recommendationEngine');
const UserBehavior = require('../models/UserBehavior');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

exports.getMLRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentRestaurantId, latitude, longitude, cuisine, limit = 6 } = req.query;

    const user = await User.findById(userId).populate('favorites');
    const userFavorites = user?.favorites || [];
    
    console.log(`🧠 Generating recommendations for user ${userId} with ${userFavorites.length} favorites`);

    const allRestaurants = await Restaurant.find().limit(1000); 
    const recommendations = await HYBRID.getRecommendations({
      userId,
      userFavorites,
      allRestaurants,
      currentRestaurantId,
      userLocation: latitude && longitude ? { 
        latitude: parseFloat(latitude), 
        longitude: parseFloat(longitude) 
      } : null,
      preferredCuisine: cuisine,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      recommendations: recommendations.recommendations || [],
      algorithm: recommendations.algorithm,
      reasoning: recommendations.reasoning,
      userFavoritesCount: userFavorites.length
    });

  } catch (error) {
    console.error('ML Recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
};

exports.trackUserBehavior = async (req, res) => {
  try {
    const behaviorData = {
      userId: req.user.id,
      ...req.body
    };

    await UserBehavior.create(behaviorData);
    
    res.json({ success: true, message: 'Behavior tracked successfully' });
  } catch (error) {
    console.error('Behavior tracking error:', error);
    res.status(500).json({ success: false, error: 'Failed to track behavior' });
  }
};

exports.getUserBehavior = async (req, res) => {
  try {
    const { userId } = req.params;
    const behavior = await UserBehavior.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json({ success: true, behavior });
  } catch (error) {
    console.error('Get behavior error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch behavior' });
  }
};