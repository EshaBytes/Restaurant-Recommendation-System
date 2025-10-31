const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMLRecommendations, trackUserBehavior, getUserBehavior } = require('../controllers/mlController');

router.get('/:userId/recommendations', protect, getMLRecommendations);
router.post('/track-behavior', protect, trackUserBehavior);
router.get('/:userId/behavior', protect, getUserBehavior);

module.exports = router;