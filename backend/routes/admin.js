const express = require("express");
const router = express.Router();
const {
  getAdminDashboard,
  getAllRestaurants,
} = require("../controllers/adminController");
const {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");
const { protect, adminOnly } = require("../middleware/auth");


router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/restaurants", protect, adminOnly, getAllRestaurants);


router.post("/restaurants", protect, adminOnly, createRestaurant);
router.put("/restaurants/:id", protect, adminOnly, updateRestaurant);
router.delete("/restaurants/:id", protect, adminOnly, deleteRestaurant);

module.exports = router;
