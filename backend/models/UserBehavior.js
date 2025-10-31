const mongoose = require('mongoose');

const userBehaviorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  actionType: { 
    type: String, 
    enum: ['view', 'click', 'favorite', 'review', 'search', 'share'],
    required: true 
  },
  rating: { type: Number, min: 1, max: 5 },
  searchQuery: String,
  timestamp: { type: Date, default: Date.now },
  metadata: {
    duration: Number,
    source: String,
    device: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  }
});

userBehaviorSchema.index({ userId: 1, timestamp: -1 });
userBehaviorSchema.index({ restaurantId: 1 });

module.exports = mongoose.model('UserBehavior', userBehaviorSchema);