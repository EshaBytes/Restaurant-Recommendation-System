class ContentBasedFiltering {
  static async getRecommendations({ userFavorites, allRestaurants, currentRestaurantId, userLocation, preferredCuisine, limit }) {
    
    const targetRestaurant = currentRestaurantId 
      ? allRestaurants.find(r => r._id.toString() === currentRestaurantId)
      : await this.getAverageFavorite(userFavorites, allRestaurants);

    if (!targetRestaurant) {
      return this.getFallbackRecommendations(allRestaurants, limit);
    }
    const targetCity = targetRestaurant.city || targetRestaurant.address?.city || '';
    const targetLocality = targetRestaurant.locality || targetRestaurant.address?.locality || '';

    const similarities = allRestaurants.map(restaurant => {
      if (restaurant._id.toString() === currentRestaurantId) {
        return { restaurant, similarity: -1 };
      }

      const similarity = this.calculateSimilarity(targetRestaurant, restaurant, targetCity, targetLocality);
      return { restaurant, similarity };
    });

    const recommendations = similarities
      .filter(item => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.restaurant);

    return {
      recommendations,
      algorithm: 'content_based',
      reasoning: 'Similar restaurants based on cuisine, price, and location'
    };
  }

  static calculateSimilarity(rest1, rest2, targetCity, targetLocality) {
    let score = 0;
    

    const weights = { 
      location: 0.6,   
      cuisine: 0.3,     
      price: 0.1,       
    };

    const locationSimilarity = this.calculateSimpleLocationSimilarity(rest2, targetCity, targetLocality);
    score += locationSimilarity * weights.location;

    const cuisineMatch = this.calculateCuisineSimilarity(rest1.cuisine, rest2.cuisine);
    score += cuisineMatch * weights.cuisine;

    const priceDiff = Math.abs((rest1.priceLevel || 2) - (rest2.priceLevel || 2));
    const priceSimilarity = 1 - (priceDiff / 4);
    score += priceSimilarity * weights.price;

    return score;
  }

  static calculateSimpleLocationSimilarity(restaurant, targetCity, targetLocality) {
    const restaurantCity = restaurant.city || restaurant.address?.city || '';
    const restaurantLocality = restaurant.locality || restaurant.address?.locality || '';

    if (!restaurantCity || !targetCity) return 0.1;

    if (restaurantCity.toLowerCase() === targetCity.toLowerCase() &&
        restaurantLocality && targetLocality && 
        restaurantLocality.toLowerCase() === targetLocality.toLowerCase()) {
      return 1.0;
    }
    else if (restaurantCity.toLowerCase() === targetCity.toLowerCase()) {
      return 0.8;
    }
    else {
      return 0.1;
    }
  }

  static calculateCuisineSimilarity(cuisines1, cuisines2) {
    if (!cuisines1 || !cuisines2) return 0;
    
    const set1 = new Set(cuisines1);
    const set2 = new Set(cuisines2);
    const intersection = [...set1].filter(x => set2.has(x)).length;
    const union = new Set([...set1, ...set2]).size;
    
    return union > 0 ? intersection / union : 0;
  }

  static async getAverageFavorite(userFavorites, allRestaurants) {
    if (!userFavorites || userFavorites.length === 0) return null;

    return userFavorites[userFavorites.length - 1];
  }

  static getFallbackRecommendations(restaurants, limit) {
    return {
      recommendations: restaurants
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit),
      algorithm: 'fallback_popular',
      reasoning: 'Popular restaurants in your area'
    };
  }
}

class HybridRecommender {
  static async getRecommendations(params) {
    try {
      const { userFavorites, userId, allRestaurants, currentRestaurantId, limit } = params;
      
      if (userFavorites && userFavorites.length > 0) {
        console.log(`🧠 Using location-based recommendations for user ${userId} with ${userFavorites.length} favorites`);
        
        const primaryLocation = this.getPrimaryLocationFromFavorites(userFavorites);
        
        const recommendations = await this.getLocationBasedRecommendations(params, primaryLocation);
        
        return {
          recommendations,
          algorithm: 'location_based',
          reasoning: `Based on your favorites in ${primaryLocation.city}`
        };
      }
      console.log(`🔍 Using current restaurant location for user ${userId}`);
      const recommendations = await this.getCurrentLocationRecommendations(params);
      
      return {
        recommendations,
        algorithm: 'location_focused',
        reasoning: 'Restaurants in the same area'
      };
      
    } catch (error) {
      console.error('Hybrid recommendation error:', error);
      return ContentBasedFiltering.getFallbackRecommendations(params.allRestaurants, params.limit);
    }
  }

  static getPrimaryLocationFromFavorites(userFavorites) {
    const locationCount = {};
    
    userFavorites.forEach(favorite => {
      const city = favorite.city || favorite.address?.city;
      const locality = favorite.locality || favorite.address?.locality;
      
      if (city) {
        const locationKey = city.toLowerCase();
        locationCount[locationKey] = (locationCount[locationKey] || 0) + 1;
      }
    });

    let primaryCity = '';
    let maxCount = 0;

    for (const [city, count] of Object.entries(locationCount)) {
      if (count > maxCount) {
        maxCount = count;
        primaryCity = city;
      }
    }

    return { city: primaryCity };
  }

  static async getLocationBasedRecommendations({ allRestaurants, limit }, primaryLocation) {
    try {
      if (!primaryLocation.city) {
        return ContentBasedFiltering.getFallbackRecommendations(allRestaurants, limit);
      }

      const locationBasedRestaurants = allRestaurants.filter(restaurant => {
        const restaurantCity = restaurant.city || restaurant.address?.city || '';
        return restaurantCity.toLowerCase() === primaryLocation.city.toLowerCase();
      });

      const recommendations = locationBasedRestaurants
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);

      return recommendations;
      
    } catch (error) {
      console.error('Location-based recommendations error:', error);
      return [];
    }
  }

  static async getCurrentLocationRecommendations({ allRestaurants, currentRestaurantId, limit }) {
    if (!currentRestaurantId) {
      return ContentBasedFiltering.getFallbackRecommendations(allRestaurants, limit);
    }

    const currentRestaurant = allRestaurants.find(r => r._id.toString() === currentRestaurantId);
    if (!currentRestaurant) {
      return ContentBasedFiltering.getFallbackRecommendations(allRestaurants, limit);
    }

    const currentCity = currentRestaurant.city || currentRestaurant.address?.city || '';

    if (!currentCity) {
      return ContentBasedFiltering.getFallbackRecommendations(allRestaurants, limit);
    }

    const sameCityRestaurants = allRestaurants.filter(restaurant => {
      if (restaurant._id.toString() === currentRestaurantId) return false;
      
      const restaurantCity = restaurant.city || restaurant.address?.city || '';
      return restaurantCity.toLowerCase() === currentCity.toLowerCase();
    });

    const recommendations = sameCityRestaurants
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);

    return recommendations;
  }
}

module.exports = {
  ContentBasedFiltering,
  HybridRecommender,
  HYBRID: HybridRecommender
};