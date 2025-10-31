const Restaurant = require("../models/Restaurant");

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalRestaurants = await Restaurant.countDocuments();
    res.status(200).json({
      success: true,
      message: "Admin dashboard loaded successfully",
      totalRestaurants,
    });
  } catch (error) {
    console.error("Error loading admin dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Server error while loading admin dashboard",
    });
  }
};


exports.getAllRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    const total = await Restaurant.countDocuments();
    const restaurants = await Restaurant.find().skip(skip).limit(limit);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalRestaurants: total,
      restaurants,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err });
  }
};

