const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

const getPriceLevelFromMoney = (amount) => {
  const money = Number(amount);
  if (Number.isNaN(money)) return undefined;
  if (money <= 500) return 1;
  if (money <= 1000) return 2;
  if (money <= 2000) return 3;
  return 4;
};

exports.getRestaurants = async (req, res) => {
  try {
    const {
      cuisine,
      minRating,
      maxPrice,
      search,
      city,
      page = 1,
      limit = 12,
      q,
    } = req.query;

    const searchTerm = search || q;
    const filter = {};
    const orConditions = [];

    if (cuisine && cuisine !== "all") {
      const cuisineArray = Array.isArray(cuisine) ? cuisine : [cuisine];
      filter.cuisine = { $in: cuisineArray.map((c) => new RegExp(c, "i")) };
    }

    if (city && city !== "all") {
      const regex = new RegExp(city, "i");
      orConditions.push(
        { "address.city": regex },
        { "zomatoData.locality": regex },
        { city: regex }
      );
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      const priceValue = parseInt(maxPrice);
      const priceLevel =
        priceValue > 100 ? getPriceLevelFromMoney(priceValue) : priceValue;


      if (priceLevel === 2) filter.priceLevel = { $in: [1, 2] };
      else filter.priceLevel = { $lte: priceLevel };
    }

    if (searchTerm) {
      const regex = new RegExp(searchTerm, "i");
      orConditions.push(
        { name: regex },
        { description: regex },
        { cuisines: { $in: [regex] } },
        { cuisine: { $in: [regex] } },
        { "address.city": regex },
        { "zomatoData.locality": regex },
        { "zomatoData.cuisines": { $in: [regex] } }
      );
    }

    if (orConditions.length > 0) filter.$or = orConditions;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(parseInt(limit) || 12, 50);
    const skip = (pageNum - 1) * limitNum;

    const [restaurants, totalRestaurants] = await Promise.all([
      Restaurant.find(filter)
        .skip(skip)
        .limit(limitNum)
        .sort({ rating: -1, createdAt: -1 }),
      Restaurant.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      count: restaurants.length,
      total: totalRestaurants,
      page: pageNum,
      pages: Math.ceil(totalRestaurants / limitNum),
      restaurants: restaurants.map(transformRestaurant),
    });
  } catch (error) {
    console.error("❌ Get restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching restaurants",
      error: error.message,
    });
  }
};

const transformRestaurant = (restaurant) => ({
  ...restaurant.toObject(),
  restaurantId: restaurant._id,
  cuisines: restaurant.cuisines || restaurant.cuisine || [],
  aggregateRating: restaurant.rating,
  priceRange: restaurant.priceLevel,
  averageCost: restaurant.zomatoData?.averageCostForTwo || 0,
  currency: restaurant.zomatoData?.currency || "₹",
  locality:
    restaurant.address?.locality || restaurant.zomatoData?.locality || "",
  city: restaurant.address?.city || restaurant.city || "",
});

exports.searchRestaurants = async (req, res) => {
  try {
    req.query.q = req.query.q || "";
    return exports.getRestaurants(req, res);
  } catch (error) {
    console.error("❌ Search restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching restaurants",
    });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    res.json({ success: true, restaurant: transformRestaurant(restaurant) });
  } catch (error) {
    console.error("❌ Get restaurant error:", error);
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching restaurant",
    });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const {
      name,
      cuisine,
      address,
      description,
      latitude,
      longitude,
      city,
      rating,
      image,
    } = req.body;

    if (!name || !cuisine || !address || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, cuisine, address, and description.",
      });
    }

    const location = {
      type: "Point",
      coordinates: longitude && latitude ? [longitude, latitude] : [0, 0],
    };

    const restaurant = await Restaurant.create({
      name,
      cuisine: Array.isArray(cuisine) ? cuisine : [cuisine],
      description,
      rating: rating || 0,
      image,
      location,
      createdBy: req.user?.id || null,
      address: {
        street: address || "",
        city: city || "",
        state: "",
        zipCode: "",
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Restaurant created", restaurant });
  } catch (error) {
    console.error("❌ Create restaurant error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during restaurant creation",
    });
  }
};


exports.updateRestaurant = async (req, res) => {
  try {
    let { cuisines, cuisine, city, address, ...data } = req.body;

    if (typeof cuisines === "string")
      cuisines = cuisines.split(",").map((c) => c.trim());
    if (typeof cuisine === "string")
      cuisine = cuisine.split(",").map((c) => c.trim());

    const addressUpdate = {
      ...(typeof address === "object" ? address : { street: address || "" }),
      city: city || "",
    };

    const updateData = {
      ...data,
      cuisine: cuisines || cuisine,
      address: addressUpdate,
    };

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    res.json({ success: true, restaurant });
  } catch (error) {
    console.error("❌ Update restaurant error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    res.json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("❌ Delete restaurant error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting restaurant",
    });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("preferences");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const userPreferences = user.preferences || {};
    const filter = {};

    if (userPreferences.cuisines?.length) {
      filter.cuisine = {
        $in: userPreferences.cuisines.map((c) => new RegExp(c, "i")),
      };
    }

    if (userPreferences.priceRange) {
      const { min, max } = userPreferences.priceRange;
      const minLevel = getPriceLevelFromMoney(min);
      const maxLevel = getPriceLevelFromMoney(max);
      filter.priceLevel = { $gte: minLevel || 1, $lte: maxLevel || 4 };
    }

    if (userPreferences.location?.trim()) {
      const regex = new RegExp(userPreferences.location, "i");
      filter.$or = [
        { "address.city": regex },
        { "zomatoData.locality": regex },
        { city: regex },
      ];
    }

    if (userPreferences.hasOnlineDelivery)
      filter["zomatoData.hasOnlineDelivery"] = true;
    if (userPreferences.isDeliveringNow)
      filter["zomatoData.isDeliveringNow"] = true;
    if (userPreferences.hasTableBooking)
      filter["zomatoData.hasTableBooking"] = true;

    const pageNum = parseInt(req.query.page) || 1;
    const limitNum = parseInt(req.query.limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const recommendations = await Restaurant.find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Restaurant.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      recommendations: recommendations.map(transformRestaurant),
      preferencesUsed: userPreferences,
    });
  } catch (error) {
    console.error("❌ Get recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recommendations",
    });
  }
};

exports.getCities = async (req, res) => {
  try {
    const cities = await Restaurant.distinct("address.city", {
      "address.city": { $ne: null },
    });

    const cleanCities = cities
      .filter((c) => c && c.trim() !== "")
      .map((c) => c.trim())
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json(cleanCities);
  } catch (error) {
    console.error("❌ Error fetching cities:", error);
    res.status(500).json({ message: "Server error fetching cities" });
  }
};

exports.getAllRestaurantsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { cuisine: { $regex: search, $options: "i" } },
            { "address.city": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Restaurant.countDocuments(filter);
    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      restaurants: restaurants.map(transformRestaurant),
    });
  } catch (error) {
    console.error("❌ Admin get restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching restaurants for admin",
    });
  }
};

exports.adminSearchRestaurants = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "")
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });

    const regex = new RegExp(query, "i");
    const restaurants = await Restaurant.find({
      $or: [
        { name: regex },
        { cuisine: regex },
        { cuisines: { $in: [regex] } },
        { "address.city": regex },
        { city: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({
      success: true,
      count: restaurants.length,
      restaurants: restaurants.map(transformRestaurant),
    });
  } catch (error) {
    console.error("❌ Admin search restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching restaurants (admin)",
    });
  }
};
