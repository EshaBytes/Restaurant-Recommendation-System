const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: 'Restaurant description not available.'
  },
  cuisine: {
    type: String,
    default: 'International'
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 !isNaN(coords[0]) && !isNaN(coords[1]) &&
                 coords[0] !== 0 && coords[1] !== 0;
        },
        message: 'Invalid coordinates'
      }
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
  website: { type: String, default: '' },
  phone: { type: String, default: '' },
  hours: {
    Monday: { type: String, default: 'Closed' },
    Tuesday: { type: String, default: 'Closed' },
    Wednesday: { type: String, default: 'Closed' },
    Thursday: { type: String, default: 'Closed' },
    Friday: { type: String, default: 'Closed' },
    Saturday: { type: String, default: 'Closed' },
    Sunday: { type: String, default: 'Closed' }
  },
  // Zomato-specific data
  zomatoData: {
    restaurantId: { type: String, default: '' },
    countryCode: { type: String, default: '' },
    locality: { type: String, default: '' },
    localityVerbose: { type: String, default: '' },
    cuisines: [{ type: String }],
    averageCostForTwo: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    hasTableBooking: { type: Boolean, default: false },
    hasOnlineDelivery: { type: Boolean, default: false },
    isDeliveringNow: { type: Boolean, default: false },
    switchToOrderMenu: { type: Boolean, default: false },
    ratingColor: { type: String, default: '' },
    ratingText: { type: String, default: '' },
    votes: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);