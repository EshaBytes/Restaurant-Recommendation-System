const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/userController');

// ✅ Test route to verify user token
router.get('/test', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// ✅ Favorites routes
router.get('/favorites', protect, getFavorites);

// ✅ 1️⃣ Add this to match frontend POST /api/users/favorites (body: { restaurantId })
router.post('/favorites', protect, addFavorite);

// ✅ 2️⃣ Keep your existing route for URL param version
router.post('/favorites/:restaurantId', protect, addFavorite);
router.delete('/favorites/:restaurantId', protect, removeFavorite);

module.exports = router;
