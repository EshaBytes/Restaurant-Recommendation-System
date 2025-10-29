const User = require("../models/User");

// Get user profile - FIXED with debug logging
exports.getUserProfile = async (req, res) => {
  try {
    console.log("🔍 === BACKEND PROFILE REQUEST ===");
    console.log("Request user object:", req.user);
    console.log("req.user.id:", req.user?.id);
    console.log("req.user._id:", req.user?._id);

    if (!req.user || !req.user.id) {
      console.log("❌ req.user or req.user.id is missing");
      return res.status(400).json({
        success: false,
        message: "User authentication required",
      });
    }

    console.log("📝 Querying database for user ID:", req.user.id);
    const user = await User.findById(req.user.id).select("-password");

    console.log("💾 DATABASE RESULT:", user ? "User found" : "User NOT found");

    if (!user) {
      console.log("❌ DATABASE: No user found with ID:", req.user.id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ DATABASE: User found successfully");
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences || {
          cuisines: [],
          priceRange: { min: 0, max: 5000 },
          allergies: [],
          dietaryRestrictions: [],
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

// Update user profile - FIXED
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, preferences } = req.body;

    // Check if username or email already exists (excluding current user)
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user.id }, // CHANGED from req.userId to req.user.id
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id }, // CHANGED from req.userId to req.user.id
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already taken",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, // CHANGED from req.userId to req.user.id
      { username, email, preferences },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user profile",
    });
  }
};

// Get user's favorite restaurants - FIXED
exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites"); // CHANGED from req.userId to req.user.id

    res.json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Get user favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching favorites",
    });
  }
};

// Add restaurant to favorites - FIXED
exports.addToFavorites = async (req, res) => {
  try {
    const { restaurantId } = req.body;

    const user = await User.findById(req.user.id); // CHANGED from req.userId to req.user.id

    // Check if already in favorites
    if (user.favorites.includes(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already in favorites",
      });
    }

    user.favorites.push(restaurantId);
    await user.save();

    await user.populate("favorites");

    res.json({
      success: true,
      message: "Added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding to favorites",
    });
  }
};

// Remove restaurant from favorites - FIXED
exports.removeFromFavorites = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const user = await User.findById(req.user.id); // CHANGED from req.userId to req.user.id

    // Remove from favorites
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== restaurantId
    );

    await user.save();

    await user.populate("favorites");

    res.json({
      success: true,
      message: "Removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing from favorites",
    });
  }
};

const Restaurant = require("../models/Restaurant");

// Add favorite restaurant (new version)
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware
    const { restaurantId } = req.body; // ✅ FIXED (frontend sends in body)
    console.log("📩 Add Favorite Request:", { userId, restaurantId });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!user.favorites.some((f) => f.toString() === restaurantId)) {
      user.favorites.push(restaurantId);
      await user.save();
    }

    const populated = await user.populate({
      path: "favorites",
      options: { sort: { rating: -1 } },
    });

    res.json({ success: true, favorites: populated.favorites });
  } catch (err) {
    console.error("Add favorite error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove favorite restaurant (new version)
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { restaurantId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.favorites = user.favorites.filter(
      (f) => f.toString() !== restaurantId
    );
    await user.save();

    const populated = await user.populate("favorites");

    res.json({ success: true, favorites: populated.favorites });
  } catch (err) {
    console.error("Remove favorite error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all favorite restaurants (new version)
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("favorites");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
