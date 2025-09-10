const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const dotenv = require('dotenv');
dotenv.config();

const sampleRestaurants = [
  {
    name: "La Bella Italia",
    description: "Authentic Italian cuisine with a modern twist. Famous for our wood-fired pizzas and homemade pasta.",
    cuisine: "Italian",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    location: {
      type: "Point",
      coordinates: [-74.0059, 40.7128]
    },
    priceLevel: 3,
    rating: 4.5,
    image: "italian-restaurant.jpg",
    phone: "+1 (212) 555-1234",
    website: "https://labellaitalia.com",
    hours: {
      Monday: "11:00 AM - 10:00 PM",
      Tuesday: "11:00 AM - 10:00 PM",
      Wednesday: "11:00 AM - 10:00 PM",
      Thursday: "11:00 AM - 11:00 PM",
      Friday: "11:00 AM - 11:00 PM",
      Saturday: "10:00 AM - 11:00 PM",
      Sunday: "10:00 AM - 9:00 PM"
    }
  },
  {
    name: "Tokyo Sushi Bar",
    description: "Fresh sushi and sashimi prepared by master chefs. Experience authentic Japanese flavors.",
    cuisine: "Japanese",
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001"
    },
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522]
    },
    priceLevel: 4,
    rating: 4.9,
    image: "sushi-restaurant.jpg",
    phone: "+1 (310) 555-5678",
    website: "https://tokyosushibar.com",
    hours: {
      Monday: "Closed",
      Tuesday: "5:00 PM - 10:00 PM",
      Wednesday: "5:00 PM - 10:00 PM",
      Thursday: "5:00 PM - 10:00 PM",
      Friday: "5:00 PM - 11:00 PM",
      Saturday: "5:00 PM - 11:00 PM",
      Sunday: "5:00 PM - 9:00 PM"
    }
  },
  {
    name: "Spice Garden",
    description: "Aromatic Indian cuisine with regional specialties. Vegan and gluten-free options available.",
    cuisine: "Indian",
    address: {
      street: "789 Spice Road",
      city: "Chicago",
      state: "IL",
      zipCode: "60601"
    },
    location: {
      type: "Point",
      coordinates: [-87.6298, 41.8781]
    },
    priceLevel: 2,
    rating: 4.2,
    image: "indian-restaurant.jpg",
    phone: "+1 (312) 555-9012",
    website: "https://spicegarden.com",
    hours: {
      Monday: "12:00 PM - 10:00 PM",
      Tuesday: "12:00 PM - 10:00 PM",
      Wednesday: "12:00 PM - 10:00 PM",
      Thursday: "12:00 PM - 10:00 PM",
      Friday: "12:00 PM - 11:00 PM",
      Saturday: "12:00 PM - 11:00 PM",
      Sunday: "12:00 PM - 9:00 PM"
    }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-app');
    await Restaurant.deleteMany({});
    await Restaurant.insertMany(sampleRestaurants);
    console.log('Sample data inserted successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();