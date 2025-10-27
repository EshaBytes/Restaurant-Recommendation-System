const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

const seedFromCSV = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-app');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants');

    const restaurants = [];
    let rowCount = 0;
    let validCount = 0;
    let invalidCount = 0;

    // Read and parse CSV file
    fs.createReadStream('./data/restaurants.csv')
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        
        try {
          // Validate required fields
          const name = row['Restaurant Name'] || row['Restaurant Name'] || 'Unnamed Restaurant';
          const longitude = parseFloat(row.Longitude);
          const latitude = parseFloat(row.Latitude);
          
          // Skip if missing critical data
          if (!name || isNaN(longitude) || isNaN(latitude)) {
            invalidCount++;
            return;
          }

          // Extract first cuisine (in case of multiple cuisines)
          const cuisines = row.Cuisines ? row.Cuisines.split(',').map(c => c.trim()) : ['International'];
          const primaryCuisine = cuisines.length > 0 ? cuisines[0] : 'International';
          
          // Generate description from available data
          const description = `Located in ${row.Locality || row.City || 'unknown location'}. ${primaryCuisine} cuisine. ${row['Rating text'] ? `Rated: ${row['Rating text']}` : ''}`.trim();

          // Map Zomato data to your schema
          const restaurant = {
            name: name,
            description: description,
            cuisine: primaryCuisine,
            address: {
              street: row.Address || '',
              city: row.City || '',
              state: '', // Not in your CSV
              zipCode: '' // Not in your CSV
            },
            location: {
              type: 'Point',
              coordinates: [longitude, latitude] // [longitude, latitude]
            },
            priceLevel: parseInt(row['Price range']) || 2,
            rating: parseFloat(row['Aggregate rating']) || 0,
            image: 'default-restaurant.jpg',
            phone: '',
            website: ''
          };

          // Add additional fields from Zomato data
          restaurant.zomatoData = {
            restaurantId: row['Restaurant ID'] || '',
            countryCode: row['Country Code'] || '',
            locality: row.Locality || '',
            localityVerbose: row['Locality Verbose'] || '',
            cuisines: cuisines,
            averageCostForTwo: parseInt(row['Average Cost for two']) || 0,
            currency: row.Currency || 'USD',
            hasTableBooking: row['Has Table booking'] === 'Yes',
            hasOnlineDelivery: row['Has Online delivery'] === 'Yes',
            isDeliveringNow: row['Is delivering now'] === 'Yes',
            switchToOrderMenu: row['Switch to order menu'] === 'Yes',
            ratingColor: row['Rating color'] || '',
            ratingText: row['Rating text'] || '',
            votes: parseInt(row.Votes) || 0
          };

          restaurants.push(restaurant);
          validCount++;

          // Log progress every 1000 rows
          if (rowCount % 1000 === 0) {
            console.log(`Processed ${rowCount} rows... (${validCount} valid, ${invalidCount} invalid)`);
          }
        } catch (error) {
          invalidCount++;
          console.log(`Error processing row ${rowCount}:`, error.message);
        }
      })
      .on('end', async () => {
        try {
          console.log(`\nCSV processing complete:`);
          console.log(`- Total rows: ${rowCount}`);
          console.log(`- Valid restaurants: ${validCount}`);
          console.log(`- Invalid rows: ${invalidCount}`);
          
          if (restaurants.length === 0) {
            console.log('No valid restaurants to insert. Check your CSV file.');
            process.exit(1);
          }

          // Insert in batches to avoid memory issues
          const batchSize = 500;
          let insertedCount = 0;
          
          for (let i = 0; i < restaurants.length; i += batchSize) {
            const batch = restaurants.slice(i, i + batchSize);
            try {
              await Restaurant.insertMany(batch, { ordered: false });
              insertedCount += batch.length;
              console.log(`Inserted batch ${Math.ceil((i + batchSize) / batchSize)}/${Math.ceil(restaurants.length / batchSize)} - Total: ${insertedCount}`);
            } catch (batchError) {
              console.log(`Some errors in batch ${Math.ceil((i + batchSize) / batchSize)}, but continuing...`);
              // Continue with next batch even if some documents fail
            }
          }
          
          console.log(`\n✅ Successfully inserted ${insertedCount} restaurants from CSV`);
          
          // Create geospatial index
          await Restaurant.syncIndexes();
          console.log('📍 Geospatial index created');
          
          process.exit(0);
        } catch (error) {
          console.error('Error inserting data:', error);
          process.exit(1);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        process.exit(1);
      });

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

seedFromCSV();