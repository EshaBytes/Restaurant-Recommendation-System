const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    console.log("🔍 === BACKEND PROFILE REQUEST ===");
    console.log("req.user.id:", req.user?.id);

    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: "User authentication required",
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences || {
          cuisines: [],
          priceRange: { min: 0, max: 5000 },
          location: "",
          hasTableBooking: false,
          hasOnlineDelivery: false,
          isDeliveringNow: false,
        },
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("💥 Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user profile",
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, preferences } = req.body;

    const updatedPreferences = {
      cuisines: preferences?.cuisines || [],
      priceRange: preferences?.priceRange || { min: 0, max: 5000 },
      location: preferences?.location || "",
      hasTableBooking:
        typeof preferences?.hasTableBooking === "boolean"
          ? preferences.hasTableBooking
          : false,
      hasOnlineDelivery:
        typeof preferences?.hasOnlineDelivery === "boolean"
          ? preferences.hasOnlineDelivery
          : false,
      isDeliveringNow:
        typeof preferences?.isDeliveringNow === "boolean"
          ? preferences.isDeliveringNow
          : false,
    };

    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user.id },
      });
      if (existingUser)
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
    }

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });
      if (existingUser)
        return res.status(400).json({
          success: false,
          message: "Email already taken",
        });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, preferences: updatedPreferences },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("💥 Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user profile",
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, favorites: user.favorites || [] });
  } catch (err) {
    console.error("💥 Get favorites error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Ensure favorites is a valid array
    if (!Array.isArray(user.favorites)) user.favorites = [];

    // 🧼 Remove null/undefined values to prevent crashes
    user.favorites = user.favorites.filter(Boolean);

    // ✅ Safe comparison with null check
    if (user.favorites.some((f) => f && f.toString() === restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already in favorites",
      });
    }

    user.favorites.push(restaurantId);
    await user.save();

    const populatedUser = await user.populate({
      path: "favorites",
      options: { sort: { rating: -1 } },
    });

    res.json({
      success: true,
      message: "Added to favorites",
      favorites: populatedUser.favorites,
    });
  } catch (err) {
    console.error("💥 Add favorite error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.removeFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!Array.isArray(user.favorites)) user.favorites = [];

    user.favorites = user.favorites.filter(
      (f) => f.toString() !== restaurantId
    );

    await user.save();

    const populatedUser = await user.populate("favorites");

    res.json({
      success: true,
      message: "Removed from favorites",
      favorites: populatedUser.favorites,
    });
  } catch (err) {
    console.error("💥 Remove favorite error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
