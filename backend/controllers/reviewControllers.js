const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

// Get reviews for a restaurant
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// Create review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const restaurantId = req.params.restaurantId;

    // Check if user already reviewed this restaurant
    const existingReview = await Review.findOne({
      user: req.userId,
      restaurant: restaurantId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this restaurant'
      });
    }

    // Create review
    const review = new Review({
      user: req.userId,
      restaurant: restaurantId,
      rating,
      comment
    });

    const savedReview = await review.save();

    // Populate user info for response
    await savedReview.populate('user', 'username');

    res.status(201).json({
      success: true,
      review: savedReview
    });

  } catch (error) {
    console.error('Create review error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'username');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to update it'
      });
    }

    res.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      user: req.userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to delete it'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};