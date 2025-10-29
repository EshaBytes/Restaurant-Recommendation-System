const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  cuisine: {
    type: [String],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  priceLevel: {
    type: Number,
    min: 1,
    max: 4,
    default: 2
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  image: {
    type: String,
    default: 'default-restaurant.jpg'
  },
  website: String,
  phone: String,
  zomatoData: {
    restaurantId: String,
    countryCode: String,
    locality: String,
    localityVerbose: String,
    cuisines: [String],
    averageCostForTwo: Number,
    currency: String,
    hasTableBooking: Boolean,
    hasOnlineDelivery: Boolean,
    isDeliveringNow: Boolean,
    switchToOrderMenu: Boolean,
    ratingColor: String,
    ratingText: String,
    votes: Number
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
restaurantSchema.index({ location: '2dsphere' });

// Text index for better search performance
restaurantSchema.index({ 
  name: 'text', 
  cuisine: 'text', 
  description: 'text' 
});

module.exports = mongoose.model('Restaurant', restaurantSchema);