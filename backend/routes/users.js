const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/userController');
const User = require('../models/User');


router.get('/test', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, updateUserProfile);

router.get('/favorites', protect, getFavorites);

router.post('/favorites/:restaurantId', protect, addFavorite);

router.delete('/favorites/:restaurantId', protect, removeFavorite);

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
