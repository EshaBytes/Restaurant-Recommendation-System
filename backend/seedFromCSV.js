const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const Restaurant = require("./models/Restaurant");
require("dotenv").config();

const seedFromCSV = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant-app");
    console.log("✅ Connected to MongoDB");

    const countBefore = await Restaurant.countDocuments();
    console.log(`📊 Restaurants before seeding: ${countBefore}`);

    const restaurants = [];
    let rowCount = 0;
    let validCount = 0;
    let invalidCount = 0;

    console.log("📖 Reading CSV file...");

    fs.createReadStream("./data/restaurants.csv")
      .pipe(csv())
      .on("data", (row) => {
        rowCount++;
        try {
          const name = row["Restaurant Name"]?.trim();
          const longitude = parseFloat(row.Longitude);
          const latitude = parseFloat(row.Latitude);

          // Skip invalid entries
          if (!name || isNaN(longitude) || isNaN(latitude)) {
            invalidCount++;
            return;
          }

          // ✅ Parse cuisines as array
          const cuisineArray = row.Cuisines
            ? row.Cuisines.split(",").map((c) => c.trim()).filter((c) => c)
            : ["International"];

          const primaryCuisine = cuisineArray[0];
          const locality = row.Locality || row.City || "";
          const ratingText = row["Rating text"] || "";
          const description = `Located in ${locality}. ${primaryCuisine} cuisine.${ratingText ? ` Rated: ${ratingText}.` : ""}`.trim();

          const priceRange = parseInt(row["Price range"]) || 2;
          const priceLevel = priceRange >= 1 && priceRange <= 4 ? priceRange : 2;
          const rating = parseFloat(row["Aggregate rating"]) || 0;

          // ✅ Store cuisine as an array (final)
          const restaurant = {
            name,
            description,
            cuisine: cuisineArray, // <-- array only
            address: {
              street: row.Address || "",
              city: row.City || "",
              state: "",
              zipCode: "",
            },
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            priceLevel,
            rating,
            image: "default-restaurant.jpg",
            phone: "",
            website: "",
            zomatoData: {
              restaurantId: row["Restaurant ID"] || "",
              countryCode: row["Country Code"] || "",
              locality: row.Locality || "",
              localityVerbose: row["Locality Verbose"] || "",
              cuisines: cuisineArray,
              averageCostForTwo: parseInt(row["Average Cost for two"]) || 0,
              currency: row.Currency || "USD",
              hasTableBooking: row["Has Table booking"] === "Yes",
              hasOnlineDelivery: row["Has Online delivery"] === "Yes",
              isDeliveringNow: row["Is delivering now"] === "Yes",
              switchToOrderMenu: row["Switch to order menu"] === "Yes",
              ratingColor: row["Rating color"] || "",
              ratingText,
              votes: parseInt(row.Votes) || 0,
            },
          };

          restaurants.push(restaurant);
          validCount++;

          if (rowCount % 1000 === 0) {
            console.log(`📊 Processed ${rowCount} rows... (${validCount} valid, ${invalidCount} invalid)`);
          }
        } catch (error) {
          invalidCount++;
          if (rowCount % 1000 === 0) {
            console.log(`⚠️ Row ${rowCount} caused error:`, error.message);
          }
        }
      })
      .on("end", async () => {
        try {
          console.log(`\n📈 CSV Processing Complete:`);
          console.log(`- Total rows processed: ${rowCount}`);
          console.log(`- Valid: ${validCount}`);
          console.log(`- Invalid: ${invalidCount}`);

          if (restaurants.length === 0) {
            console.log("❌ No valid restaurants to insert");
            process.exit(1);
          }

          console.log(`🚀 Inserting ${restaurants.length} restaurants...`);
          const result = await Restaurant.insertMany(restaurants, { ordered: false });
          console.log(`✅ Inserted ${result.length} restaurants`);

          // Ensure geospatial index exists
          await Restaurant.syncIndexes();
          console.log("📍 Geospatial index created");

          const countAfter = await Restaurant.countDocuments();
          console.log(`🎉 Seeding Complete! Total in DB: ${countAfter}`);

          const sample = await Restaurant.find().limit(3);
          console.log("\n📋 Sample Restaurants:");
          sample.forEach((r, i) => {
            console.log(` ${i + 1}. ${r.name} - ${r.cuisine?.join(", ")} (${r.rating}⭐)`);
          });

          process.exit(0);
        } catch (error) {
          console.error("❌ Error inserting data:", error);
          process.exit(1);
        }
      })
      .on("error", (error) => {
        console.error("❌ Error reading CSV:", error);
        process.exit(1);
      });
  } catch (error) {
    console.error("❌ Connection error:", error);
    process.exit(1);
  }
};

seedFromCSV();
