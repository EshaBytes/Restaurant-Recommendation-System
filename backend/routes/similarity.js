const express = require('express');
const router = express.Router();
const { getSimilarRestaurants } = require('../controllers/similarityController');

router.get('/restaurants/:id/similar', getSimilarRestaurants);

module.exports = router;