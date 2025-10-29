import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addFavorite, removeFavorite, getFavorites } from '../utils/api';
import '../styles/RestaurantCard.css';

const RestaurantCard = ({ restaurant, featured = false, trending = false }) => {
  const { currentUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchFavorites = async () => {
    if (!currentUser) return;
    try {
      const res = await getFavorites();
      const favoriteIds = res.favorites?.map(f => f._id || f) || [];
      setIsFavorite(favoriteIds.includes(restaurant._id));
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };
  fetchFavorites();
}, [restaurant._id, currentUser]);


  if (!restaurant) return null;

  const {
    _id,
    name = 'Restaurant Name',
    cuisine,
    description = 'No description available',
    rating = 0,
    priceLevel = 2,
    address = {},
    features = {},
    reviewCount = 0,
    tags = [],
    isActive = true
  } = restaurant;

  const getCuisineArray = () => {
    if (Array.isArray(cuisine)) {
      return cuisine;
    } else if (typeof cuisine === 'string') {
      return [cuisine];
    } else if (cuisine && typeof cuisine === 'object') {
      return [cuisine.name || 'Cuisine not specified'];
    }
    return ['International'];
  };

  const cuisineArray = getCuisineArray();
  const primaryCuisine = cuisineArray[0] || 'International';

  const { street = '', city = '', state = '', zipCode = '' } = address;
  
  const getCuisineThemedImage = () => {
    const cuisineLower = primaryCuisine.toLowerCase();
    
const cuisineImages = {
  'afghani': 'https://www.foodies.pk/wp-content/uploads/2020/04/afghani-cuisine-dishes-1536x1049.jpeg',
  'african': 'https://blackrestaurantweeks.com/wp-content/uploads/2021/10/taste-of-nigera-photo-1.jpeg',
  'american': 'https://www.mashed.com/img/gallery/the-real-origins-of-american-foods/l-intro-1652736662.jpg',
  'andhra': 'https://www.mistay.in/travel-blog/content/images/2020/06/andhra-cuisine-cover-2.jpg',
  'arabian': 'https://s.hdnux.com/photos/01/33/45/14/24007470/3/rawImage.jpg',
  'armenian': 'https://img.freepik.com/premium-photo/traditional-dolma-with-rice-meat-filling_1282123-2627.jpg?w=1380',
  'asian': 'https://mrwabi.com.au/wp-content/uploads/2023/08/Mr-Wabi-Asian-Cuisine.webp',
  'assamese': 'https://3.bp.blogspot.com/-NnwwxB6ApTc/WM_N1UiJDiI/AAAAAAAAElc/hso2koB6IpwxUFuN3DAW3k_9FY7bBqhDACLcB/s1600/Assamese%2BThali.JPG',
  'awadhi': 'https://www.awesomecuisine.com/wp-content/uploads/2025/02/A-table-spread-with-a-variety-of-Awadhi-dishes.jpg',
  'bbq': 'https://images.unsplash.com/photo-1https://siri-cdn.appadvice.com/apptributes/107698953206945330460/1474319807500_barbecue_8961.jpg529193591184-b1d58069ecdd',
  'bakery': 'https://images.ctfassets.net/nh7msa7pcdvp/1kqTk7PpB3zGMxuizpG7TX/b8b1ebdc911743ec808a59df1afdf2ff/Bakery_1000x500.jpg',
  'belgian': 'https://www.willflyforfood.net/wp-content/uploads/2022/06/belgian-food-waffles2.jpg',
  'bengali': 'https://th.bing.com/th/id/R.c10eb6eba9c05a7fe085253346e84418?rik=0Pa857OYzF63LA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-Q09XMt2yzmI%2fTo7ktrG5YWI%2fAAAAAAAAAX0%2foc7DUWelYIc%2fs1600%2fBengali%2bFood.jpg&ehk=834JuY7Wh5LQ1hYyxBmkoydZXzQUJipI%2bBdlYi6iZxo%3d&risl=&pid=ImgRaw&r=0',
  'beverages': 'https://img.pikbest.com/ai/illus_our/20230424/34e5dc28e25df61bc8335ebb651b847e.jpg!bw700',
  'bihari': 'https://www.secondrecipe.com/wp-content/uploads/2021/12/litti-chokha-air-fryer-501x640.jpg',
  'biryani': 'https://assets.cntraveller.in/photos/6218cfdbd84ae9ad8ecff426/master/w_1600%2Cc_limit/sp%2520biryani.jpg',
  'british': 'https://tse3.mm.bing.net/th/id/OIP.qiIYhW-csJCHE7lDcM3FEAHaGB?rs=1&pid=ImgDetMain&o=7&rm=3',
  'burger': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9',
  'burmese': 'https://www.my-travelblog.org/wp-content/uploads/2021/01/shan-traditional-meal-burmese-food.jpg',
  'cafe': 'https://images.squarespace-cdn.com/content/v1/60f976b72612757791a5df66/1d014828-05ea-4ac3-a4ec-c3ea168adeb8/InCommon_0725_LizClayman_0212.jpg',
  'cajun': 'https://demandafrica.com/wp-content/uploads/2018/10/cajun-food-crawfish-plate.jpg',
  'charcoal grill': 'https://www.hungryhuy.com/wp-content/uploads/yakitori-skewers-konro-grill.jpg',
  'chettinad': 'https://images.slurrp.com/prod/articles/gdqx3n1s8ij.webp',
  'chinese': 'https://ik.imagekit.io/shortpedia/Voices/wp-content/uploads/2021/10/chinese-food-1200x900@kohinoorjoy.jpg',
  'continental': 'https://fusionculinaryarts.com/wp-content/uploads/2021/02/cousine_carousel03.jpg',
  'cuisine varies': 'https://images.squarespace-cdn.com/content/v1/611b3a86fb6a226aadffcf79/4e0ddbe1-fda3-4181-869e-0c665b1468d4/types+of+cuisines.jpg?format=1500w',
  'deli': 'https://tse3.mm.bing.net/th/id/OIP.Nr-NYcf4GN6lqez9veYNnAHaHa?w=720&h=720&rs=1&pid=ImgDetMain&o=7&rm=3',
  'desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
  'drinks only': 'https://img.delicious.com.au/CKMUcpx-/w1200/del/2015/11/summer-cocktails-24374-3.jpg',
  'european': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  'fast food': 'https://www.eatthis.com/wp-content/uploads/sites/4/2022/06/fast-food-assortment-soda.jpg?quality=82&strip=1&w=1200',
  'finger food': 'https://alekasgettogether.com/wp-content/uploads/2021/02/easy-finger-food-appetizers-party-1.jpg',
  'french': 'https://images.unsplash.com/phttps://tse1.mm.bing.net/th/id/OIP.tqjivOiNKdkxnHUKYA--0AHaLH?rs=1&pid=ImgDetMain&o=7&rm=3hoto-1505253716362-afaea1d3d1af',
  'german': 'https://www.chefspencil.com/wp-content/uploads/All-Aspects-of-German-Cuisine.jpg',
  'goan': 'https://www.elitehavens.com/magazine/wp-content/uploads/2022/11/Credit_Shores-Threesixtyfive-res.jpg',
  'greek': 'https://ivisa.s3.amazonaws.com/website-assets/blog/best-greek-food.webp',
  'gujarati': 'https://tse4.mm.bing.net/th/id/OIP.HELOABllSOT9CCIqGxpq4gHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
  'healthy food': 'https://www.cookingclassy.com/wp-content/uploads/2019/11/best-salad-8.jpg',
  'hyderabadi': 'https://1.bp.blogspot.com/-eJy7I-M7Q-M/VvznFXFEbxI/AAAAAAAB5fQ/m7dX16cTb5I9UVB5b7gB1u4QX5nGKCfyw/s1600/382649_167583443342083_801037138_n.jpg',
  'ice cream': 'https://thebigmansworld.com/wp-content/uploads/2024/05/strawberry-ice-cream-recipe2.jpg',
  'indian': 'https://tse4.mm.bing.net/th/id/OIP.fn7HURB-a0sY854FLQZXjwHaFi?rs=1&pid=ImgDetMain&o=7&rm=3',
  'indonesian': 'https://wallpaperaccess.com/full/2012861.jpg',
  'iranian': 'https://www.wanderlustmagazine.com/wp-content/uploads/2023/11/persian-rice.jpg',
  'italian': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  'japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
  'juices': 'https://www.waters.com/content/dam/waters/en/Photography/stock/food-and-environment/stock-fruit-juices-smoothies-with-fruit.jpg',
  'kashmiri': 'https://mumbaimessenger.com/wp-content/uploads/2023/07/kash-1-scaled.jpg',
  'kerala': 'https://tse2.mm.bing.net/th/id/OIP.iGasOkwGhu2F9dGP880jqgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
  'korean': 'https://static.thehoneycombers.com/wp-content/uploads/sites/2/2020/10/korean-food-singapore-bibimbap.jpeg',
  'lebanese': 'https://tse3.mm.bing.net/th/id/OIP.01jwnlAUGJJgN2-Ljo-7oAHaFq?rs=1&pid=ImgDetMain&o=7&rm=3',
  'malvani': 'https://alchetron.com/cdn/malvani-cuisine-b01ea008-9336-4d02-8aec-ea37e7be2eb-resize-750.jpeg',
  'mexican': 'https://thumbs.dreamstime.com/b/authentic-mexican-tacos-fiesta-flavor-ai-generated-content-design-background-instagram-facebook-wall-painting-wallpaper-323200348.jpg',
  'middle eastern': 'https://static.vecteezy.com/system/resources/previews/047/327/318/non_2x/exquisite-array-of-middle-eastern-cuisine-featuring-colorful-dishes-and-spices-photo.jpg',
  'mughlai': 'https://tse1.mm.bing.net/th/id/OIP.qaGOOFgTvDEEoE5U7Yq9ugHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
  'north indian': 'https://crispandcurry.com/wp-content/uploads/2024/01/North_Indian_Food.jpeg',
  'oriental': 'https://tb-static.uber.com/prod/image-proc/processed_images/fd0a7ae8fb6d0075b107b309e6d9e1b0/3ac2b39ad528f8c8c5dc77c59abb683d.jpeg',
  'paan': 'https://img.freepik.com/premium-photo/special-meetha-paan-masala-isolated-betel-leaf-top-view_689047-938.jpg?w=2000',
  'parsi': 'https://images.mid-day.com/images/images/2018/mar/Veg-Bhonu.jpg',
  'persian' : 'https://blog.iranroute.com/wp-content/uploads/2019/07/Ghormeh-Sabzi-8-e1563171294127-750x650.jpg',
  'pizza': 'https://i1.wp.com/www.pizzapeopleandsub.com/wp-content/uploads/2017/10/bg-pizza.jpg?fit=1316%2C822',
  'portuguese' : 'https://www.insightvacations.com/wp-content/uploads/2025/01/Large-Traditional-Portuguese-dinner-directly-above-view-1289383655-1024x683.jpg',
  'punjabi': 'https://images.nativeplanet.com/img/2023/11/a-platter-of-traditional-punjabi-dishes-served-in-ludhiana_1700893871869-1200x675-20231125120802.jpg',
  'rajasthani': 'https://tse3.mm.bing.net/th/id/OIP.X9gFZ-c-ZnEO63LTs3r9vQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
  'seafood': 'https://static01.nyt.com/images/2024/02/28/multimedia/LH-seafood-boil-gktl/LH-seafood-boil-gktl-googleFourByThree.jpg',
  'snacks': 'https://www.licious.in/blog/wp-content/uploads/2022/08/shutterstock_2103381338.jpg',
  'south indian': 'https://images.herzindagi.info/image/2020/Apr/south-indian-food-recipes-m.jpg',
  'street food': 'https://vanitascorner.com/wp-content/uploads/2020/10/Vada-Pav.jpg',
  'sushi': 'https://cdn.pixabay.com/photo/2020/04/04/15/07/sushi-5002639_1280.jpg',
  'tandoor': 'https://tse4.mm.bing.net/th/id/OIP.QA9QojQJ9hOFbQBtsa522gHaHa?w=1250&h=1250&rs=1&pid=ImgDetMain&o=7&rm=3',
  'tea': 'https://masalaandchai.com/wp-content/uploads/2021/07/Masala-Chai.jpg',
  'thai': 'https://www.tastingtable.com/img/gallery/the-best-thai-restaurants-in-america/l-intro-1646863588.jpg',
  'tibetan': 'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/toronto/abhishek_sanwa_limbu_LR559Dcst70_unsplash_a3ac66dc-f37f-4a71-ae4c-205bacc1263d.jpg',
  'turkish': 'https://img.freepik.com/premium-photo/turkish-food-kofte-stack-meatballs-with-rice_293953-60.jpg?w=1480',
  'vietnamese': 'https://thefoodwonder.com/wp-content/uploads/2021/08/vietnam-pho-dac-biet.jpg'
};


    for (const [key, url] of Object.entries(cuisineImages)) {
      if (cuisineLower.includes(key)) {
        return `${url}?w=400&h=300&fit=crop`;
      }
    }

    const seed = encodeURIComponent(primaryCuisine.toLowerCase());
    return `https://picsum.photos/seed/${seed}-food/400/300`;
  };

  const imageUrl = getCuisineThemedImage();

  // 🎯 Get cuisine emoji for each cuisine
  const getCuisineEmoji = (cuisineItem) => {
    const cuisineLower = cuisineItem.toLowerCase();
    
    const emojiMap = {
      'american': '🍔', 'burger': '🍔', 'fast food': '🍔', 'bbq': '🍖',
      'steak': '🥩', 'sandwich': '🥪', 'indian': '🍛', 'chinese': '🥢',
      'italian': '🍝', 'mexican': '🌮', 'japanese': '🍣', 'thai': '🍜',
      'french': '🥐', 'mediterranean': '🥗', 'korean': '🥘', 'vietnamese': '🍜',
      'seafood': '🦞', 'desserts': '🍰', 'ice cream': '🍦', 'bakery': '🥖',
      'cafe': '☕', 'street food': '🍢', 'biryani': '🍚', 'sushi': '🍣',
      'kebab': '🍢', 'arabian': '🥙', 'turkish': '🥙', 'middle eastern': '🥙',
      'continental': '🍽️', 'european': '🍽️', 'healthy food': '🥗', 'salad': '🥗',
      'beverages': '🥤', 'coffee': '☕', 'tea': '🍵', 'juices': '🥤',
      'pizza': '🍕', 'pasta': '🍝', 'afghani': '🍛', 'andhra': '🍛',
      'bengali': '🍛', 'bihari': '🍛', 'gujarati': '🍛', 'hyderabadi': '🍛',
      'kashmiri': '🍛', 'kerala': '🍛', 'maharashtrian': '🍛', 'mughlai': '🍛',
      'north indian': '🍛', 'punjabi': '🍛', 'rajasthani': '🍛', 'south indian': '🍛'
    };

    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (cuisineLower.includes(key)) {
        return emoji;
      }
    }

    return '🍽️';
  };

  // ✅ Create cuisine string with emojis for ALL cuisines
  const getCuisineStringWithEmojis = () => {
    return cuisineArray.map(cuisineItem => 
      `${getCuisineEmoji(cuisineItem)} ${cuisineItem}`
    ).join(', ');
  };

  const cuisineStringWithEmojis = getCuisineStringWithEmojis();

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Please login to add favorites');
      return;
    }

    try {
      setLoading(true);
      if (isFavorite) {
        await removeFavorite(_id);
        setIsFavorite(false);
      } else {
        await addFavorite(_id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  const renderPriceLevel = () => '₹'.repeat(priceLevel);

  const getLocationText = () => {
    if (city && street) return `${street}, ${city}`;
    if (city) return city;
    if (state) return state;
    return 'Location not specified';
  };

  const renderFeatures = () => {
    const featureIcons = [];
    
    if (features.delivery) featureIcons.push(<span key="delivery" className="feature" title="Delivery">🚚</span>);
    if (features.takeout) featureIcons.push(<span key="takeout" className="feature" title="Takeout">🥡</span>);
    if (features.reservations) featureIcons.push(<span key="reservations" className="feature" title="Reservations">📅</span>);
    if (features.outdoorSeating) featureIcons.push(<span key="outdoor" className="feature" title="Outdoor Seating">🌳</span>);
    if (features.wifi) featureIcons.push(<span key="wifi" className="feature" title="Free WiFi">📶</span>);
    if (features.parking) featureIcons.push(<span key="parking" className="feature" title="Parking">🅿️</span>);

    return featureIcons;
  };

  const renderTags = () => {
    const tagArray = Array.isArray(tags) ? tags : [];
    return tagArray.slice(0, 3).map(tag => (
      <span key={tag} className="tag" title={tag}>{tag}</span>
    ));
  };

  return (
    <div className={`restaurant-card ${featured ? 'featured' : ''} ${trending ? 'trending' : ''}`}>
      <Link to={`/restaurants/${_id}`} className="card-link">
        <div className="card-image">
          <img 
            src={imageUrl}
            alt={`${name} - ${cuisineArray.join(', ')} restaurant in ${city}`}
            loading="lazy"
            onError={(e) => {
              const seed = encodeURIComponent(primaryCuisine.toLowerCase());
              e.target.src = `https://picsum.photos/seed/${seed}-restaurant/400/300`;
            }}
          />
          
          <div className="card-badges">
            {featured && <span className="badge featured-badge">Featured</span>}
            {trending && <span className="badge trending-badge">Trending</span>}
            {rating >= 4.5 && <span className="badge top-rated-badge">Top Rated</span>}
            {!isActive && <span className="badge closed-badge">Closed</span>}
            {features.delivery && <span className="badge delivery-badge">Delivery</span>}
          </div>

          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''} ${loading ? 'loading' : ''}`}
            onClick={handleFavoriteToggle}
            disabled={loading}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {loading ? '↺' : (isFavorite ? '❤️' : '🤍')}
          </button>
        </div>


<div className="card-content"> <div className="card-header"> <h3 className="restaurant-name">{name}</h3> <div className="rating-section"> <div className="stars">{renderRatingStars()}</div> <span className="rating-number">({rating.toFixed(1)})</span> {reviewCount > 0 && ( <span className="review-count">{reviewCount} review{reviewCount !== 1 ? 's' : ''}</span> )} </div> </div>
{/* 🆕 Separate Rating Section */}
{/* 🆕 Separate Rating Section with color-coded text */}
<div className="rating-section">
  <p
    className={`rating-text ${
      rating >= 4.8
        ? 'outstanding'
        : rating >= 4.5
        ? 'excellent'
        : rating >= 4.0
        ? 'very-good'
        : 'good'
    }`}
  >
    Rated:{' '}
    {rating >= 4.8
      ? 'Outstanding'
      : rating >= 4.5
      ? 'Excellent'
      : rating >= 4.0
      ? 'Very Good'
      : 'Good'}
  </p>

</div>

          {/* ✅ Comma-separated Cuisines with Emojis for ALL */}
          <div className="cuisine-section">
            <div className="cuisine-line">
              <span className="cuisine-text">{cuisineStringWithEmojis}</span>
            </div>
            {renderTags()}
          </div>

          <p className="restaurant-description">
            {description.length > 120 
              ? `${description.substring(0, 120)}...` 
              : description}
          </p>

          <div className="card-footer">
            <div className="location">
              <span className="location-icon">📍</span>
              <span className="location-text">{getLocationText()}</span>
            </div>
            <div className="price-level">{renderPriceLevel()}</div>
          </div>

          {renderFeatures().length > 0 && (
            <div className="features">{renderFeatures()}</div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard;