const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews from the same user
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRatings = async function(restaurantId) {
  const stats = await this.aggregate([
    {
      $match: { restaurant: restaurantId }
    },
    {
      $group: {
        _id: '$restaurant',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Restaurant').findByIdAndUpdate(restaurantId, {
      rating: stats[0].avgRating
    });
  } else {
    await mongoose.model('Restaurant').findByIdAndUpdate(restaurantId, {
      rating: 0
    });
  }
};

// Update restaurant rating after saving a review
reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.restaurant);
});

module.exports = mongoose.model('Review', reviewSchema);