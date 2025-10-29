const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

// @desc    Get all reviews for a specific restaurant
// @route   GET /api/reviews/:restaurantId
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// @desc    Create a review for a specific restaurant
// @route   POST /api/reviews/:restaurantId
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant)
      return res.status(404).json({ success: false, message: 'Restaurant not found' });

    const review = new Review({
      user: req.user.id,
      restaurant: req.params.restaurantId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    // Ensure the logged-in user owns the review
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Unauthorized' });

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Unauthorized' });

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
