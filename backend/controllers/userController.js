const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile'
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if username or email already exists (excluding current user)
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.userId }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.userId }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already taken'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user profile'
    });
  }
};

// Get user's favorite restaurants
exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    
    res.json({
      success: true,
      favorites: user.favorites
    });

  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching favorites'
    });
  }
};

// Add restaurant to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { restaurantId } = req.body;

    const user = await User.findById(req.userId);
    
    // Check if already in favorites
    if (user.favorites.includes(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant already in favorites'
      });
    }

    user.favorites.push(restaurantId);
    await user.save();

    await user.populate('favorites');

    res.json({
      success: true,
      message: 'Added to favorites',
      favorites: user.favorites
    });

  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to favorites'
    });
  }
};

// Remove restaurant from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const user = await User.findById(req.userId);
    
    // Remove from favorites
    user.favorites = user.favorites.filter(
      fav => fav.toString() !== restaurantId
    );
    
    await user.save();

    await user.populate('favorites');

    res.json({
      success: true,
      message: 'Removed from favorites',
      favorites: user.favorites
    });

  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from favorites'
    });
  }
};