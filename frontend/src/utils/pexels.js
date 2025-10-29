import axios from 'axios';

const PEXELS_URL = 'https://api.pexels.com/v1/search';
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

/**
 * Fetch cuisine-related food image
 * @param {string} cuisine - e.g., "Indian", "Italian", "Chinese"
 */
export const fetchCuisineImage = async (cuisine = 'food') => {
  try {
    const res = await axios.get(PEXELS_URL, {
      params: {
        query: `${cuisine} food`,
        per_page: 1,
        orientation: 'landscape',
      },
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (res.data.photos && res.data.photos.length > 0) {
      const photo = res.data.photos[0];
      return {
        imageUrl: photo.src.medium,
        photographerName: photo.photographer,
        photographerLink: photo.photographer_url,
        pexelsLink: photo.url,
      };
    }

    return { imageUrl: '/default-restaurant.jpg' };
  } catch (err) {
    console.error('Pexels API error:', err.message);
    return { imageUrl: '/default-restaurant.jpg' };
  }
};
