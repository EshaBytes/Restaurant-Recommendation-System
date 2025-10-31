import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getRestaurant,
  getRestaurantReviews,
  createReview,
  getMLRecommendations,
  getSimilarRestaurants,
  trackUserBehavior
} from "../utils/api";
import { useAuth } from "../context/AuthContext";
import RestaurantCard from "../components/RestaurantCard";

const RestaurantDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  
 
  const [similarRestaurants, setSimilarRestaurants] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState("");

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

 
  useEffect(() => {
    if (restaurant && currentUser) {
      trackUserBehavior({
        userId: currentUser.id,
        restaurantId: restaurant._id || restaurant.id,
        actionType: 'view',
        metadata: {
          duration: 0,
          source: 'restaurant_detail',
          device: navigator.userAgent
        }
      });
    }
  }, [restaurant, currentUser]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      setError("");

      const [restaurantResponse, reviewsResponse] = await Promise.all([
        getRestaurant(id),
        getRestaurantReviews(id).catch((err) => {
          console.log("Reviews not available:", err);
          return { reviews: [] };
        }),
      ]);

      const restaurantData = restaurantResponse.restaurant || restaurantResponse.data;
      setRestaurant(restaurantData);
      setReviews(reviewsResponse.reviews || []);
      

      await loadRecommendations(restaurantData);
      
    } catch (error) {
      console.error("Error loading restaurant:", error);
      setError("Failed to load restaurant details");
    } finally {
      setLoading(false);
    }
  };


  const loadRecommendations = async (restaurantData) => {
    try {
      setRecommendationsLoading(true);
      setRecommendationsError("");

      let recommendations = [];

      if (currentUser) {

        try {
          const mlResponse = await getMLRecommendations(currentUser.id, {
            currentRestaurantId: id,
            cuisine: Array.isArray(restaurantData.cuisine) ? restaurantData.cuisine[0] : restaurantData.cuisine,
            limit: 6
          });
          
          if (mlResponse.success && mlResponse.recommendations.length > 0) {
            recommendations = mlResponse.recommendations;
            console.log("🧠 Using ML recommendations based on user favorites");
          } else {
            throw new Error('No ML recommendations available');
          }
        } catch (mlError) {
          console.log("ML recommendations failed, falling back to similar restaurants:", mlError);

          const similarResponse = await getSimilarRestaurants(id, {
            cuisine: Array.isArray(restaurantData.cuisine) ? restaurantData.cuisine[0] : restaurantData.cuisine,
            limit: 6
          });
          
          if (similarResponse.success) {
            recommendations = similarResponse.restaurants || [];
            console.log("🔍 Using similar restaurants as fallback");
          }
        }
      } else {

        const similarResponse = await getSimilarRestaurants(id, {
          cuisine: Array.isArray(restaurantData.cuisine) ? restaurantData.cuisine[0] : restaurantData.cuisine,
          limit: 6
        });
        
        if (similarResponse.success) {
          recommendations = similarResponse.restaurants || [];
          console.log("🔍 Using similar restaurants for guest user");
        }
      }

      setSimilarRestaurants(recommendations);
      
    } catch (error) {
      console.error("Error loading recommendations:", error);
      setRecommendationsError("Failed to load recommendations");
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Please log in to submit a review");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createReview(id, reviewForm);
      setReviewForm({ rating: 5, comment: "" });


      const reviewsResponse = await getRestaurantReviews(id);
      setReviews(reviewsResponse.reviews || []);

      setError("Review submitted successfully!");
      setTimeout(() => setError(""), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Restaurant not found or failed to load.
        </div>
      </div>
    );
  }


  const cuisineType = Array.isArray(restaurant.cuisine)
    ? restaurant.cuisine[0].toLowerCase()
    : "";

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
  'bbq': 'https://siri-cdn.appadvice.com/apptributes/107698953206945330460/1474319807500_barbecue_8961.jpg',
  'bakery': 'https://images.ctfassets.net/nh7msa7pcdvp/1kqTk7PpB3zGMxuizpG7TX/b8b1ebdc911743ec808a59df1afdf2ff/Bakery_1000x500.jpg',
  'belgian': 'https://www.willflyforfood.net/wp-content/uploads/2022/06/belgian-food-waffles2.jpg',
  'bengali': 'https://th.bing.com/th/id/R.c10eb6eba9c05a7fe085253346e84418?rik=0Pa857OYzF63LA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-Q09XMt2yzmI%2fTo7ktrG5YWI%2fAAAAAAAAAX0%2foc7DUWelYIc%2fs1600%2fBengali%2bFood.jpg&ehk=834JuY7Wh5LQ1hYyxBmkoydZXzQUJipI%2bBdlYi6iZxo%3d&risl=&pid=ImgRaw&r=0',
  'beverages': 'https://img.pikbest.com/ai/illus_our/20230424/34e5dc28e25df61bc8335ebb651b847e.jpg!bw700',
  'bihari': 'https://www.secondrecipe.com/wp-content/uploads/2021/12/litti-chokha-air-fryer-501x640.jpg',
  'biryani': 'https://assets.cntraveller.in/photos/6218cfdbd84ae9ad8ecff426/master/w_1600%2Cc_limit/sp%2520biryani.jpg',
  'british': 'https://tse3.mm.bing.net/th/id/OIP.qiIYhW-csJCHE7lDcM3FEAHaGB?rs=1&pid=ImgDetMain&o=7&rm=3',
  'burger': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9',
  'burmese': 'https://www.my-travelblog.org/wp-content/uploads/2021/01/shan-traditional-meal-burmese-food.jpg',
  'cafe': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
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
  'french': 'https://tse1.mm.bing.net/th/id/OIP.tqjivOiNKdkxnHUKYA--0AHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
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
  'lucknowi': 'https://www.bakingo.com/blog/wp-content/uploads/2023/02/tunday-kebab.jpg',
  'maharashtrian': 'https://curlytales.com/wp-content/uploads/2019/11/images-9-7.jpg',
  'malaysian': 'https://images.augustman.com/wp-content/uploads/2020/04/10115416/travel.earth_.jpg',
  'malvani': 'https://alchetron.com/cdn/malvani-cuisine-b01ea008-9336-4d02-8aec-ea37e7be2eb-resize-750.jpeg',
  'malwani': 'https://i.pinimg.com/originals/e7/46/53/e74653bdeb96213a5f9fb39ea1d33747.jpg',
  'mangalorean': 'https://www.storiesbysoumya.com/wp-content/uploads/2021/03/Mangalore-non-veg-platter-min.jpg',
  'mediterranean': 'https://eatwhatweeat.com/wp-content/uploads/2022/03/mediterranean-food-diet-lovely-mediterranean-diet-why-was-a-study-showing-its-benefits-of-mediterranean-food-diet.jpg',
  'mexican': 'https://thumbs.dreamstime.com/b/authentic-mexican-tacos-fiesta-flavor-ai-generated-content-design-background-instagram-facebook-wall-painting-wallpaper-323200348.jpg',
  'middle eastern': 'https://static.vecteezy.com/system/resources/previews/047/327/318/non_2x/exquisite-array-of-middle-eastern-cuisine-featuring-colorful-dishes-and-spices-photo.jpg',
  'mithai': 'https://thumbs.dreamstime.com/b/delicious-mix-sweets-mithai-tray-milk-made-indian-pakistani-festivals-344617176.jpg',
  'modern indian': 'https://th.bing.com/th/id/R.daf7312e4c8f3e23f3cec846a72a46ba?rik=C376GICentgDGw&riu=http%3a%2f%2fwww.thebigchilli.com%2fuploads%2f1%2f2%2f2%2f0%2f12204015%2fdscf6422-resize_orig.jpg&ehk=urqMIgwmDNqhd9a%2fgJG2V12o5bh810zQ6WbrLJbzcQ0%3d&risl=&pid=ImgRaw&r=0',
  'moroccan': 'https://tse2.mm.bing.net/th/id/OIP.AeoG4fBMZaxfRS853nYGywHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
  'mughlai': 'https://tse1.mm.bing.net/th/id/OIP.qaGOOFgTvDEEoE5U7Yq9ugHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
  'naga': 'https://assets.cntraveller.in/photos/6336e3cc969e60ec08d35f01/16:9/w_1024%2Cc_limit/Naga%2520cuisine.png',
  'nepalese': 'https://travelnepalguides.com/wp-content/uploads/2023/12/Dal-Bhat-Tarkari-1536x1222.jpg',
  'north eastern': 'https://www.swantour.com/blogs/wp-content/uploads/2019/01/foods-in-north-east-india.jpg',
  'north indian': 'https://crispandcurry.com/wp-content/uploads/2024/01/North_Indian_Food.jpeg',
  'oriental': 'https://tb-static.uber.com/prod/image-proc/processed_images/fd0a7ae8fb6d0075b107b309e6d9e1b0/3ac2b39ad528f8c8c5dc77c59abb683d.jpeg',
  'oriya': 'https://b.zmtcdn.com/data/reviews_photos/fa8/9842e5a0636fca9a716d8df9d5e21fa8_1583667398.jpg',
  'paan': 'https://img.freepik.com/premium-photo/special-meetha-paan-masala-isolated-betel-leaf-top-view_689047-938.jpg?w=2000',
  'pakistani': 'https://as1.ftcdn.net/v2/jpg/03/58/47/36/1000_F_358473694_nfXuR3UlvJMOfQy6JYyXLxBkTioikZGN.jpg',
  'parsi': 'https://images.mid-day.com/images/images/2018/mar/Veg-Bhonu.jpg',
  'persian': 'https://tse4.mm.bing.net/th/id/OIP.FHSMB34P9Qs3YWWjuSHIqgHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
  'pizza': 'https://i1.wp.com/www.pizzapeopleandsub.com/wp-content/uploads/2017/10/bg-pizza.jpg?fit=1316%2C822',
  'portuguese': 'https://www.portugalist.com/wp-content/uploads/Robalo-grilled-fish-1024x768.jpg',
  'punjabi': 'https://images.nativeplanet.com/img/2023/11/a-platter-of-traditional-punjabi-dishes-served-in-ludhiana_1700893871869-1200x675-20231125120802.jpg',
  'rajasthani': 'https://tse3.mm.bing.net/th/id/OIP.X9gFZ-c-ZnEO63LTs3r9vQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
  'raw meats': 'https://static.vecteezy.com/system/resources/previews/030/761/058/large_2x/a-variety-of-raw-meats-beef-pork-lamb-and-chicken-captured-on-a-deep-dark-background-generative-ai-photo.jpg',
  'salad': 'https://www.chelseasmessyapron.com/wp-content/uploads/2022/08/Salad-Recipe-1.jpeg',
  'sandwich': 'https://www.southernliving.com/thmb/UW4kKKL-_M3WgP7pkL6Pb6lwcgM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ham_Sandwich_011-1-49227336bc074513aaf8fdbde440eafe.jpg',
  'seafood': 'https://www.simplyrecipes.com/thmb/mKoBS7zlF02Cnkdvfq7by5eJvJA=/2000x1334/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2018__07__Seafood-Paella-HORIZONTAL-ce4d8fe93ec045c0a868ec065f49800a.jpg',
  'snacks': 'https://www.licious.in/blog/wp-content/uploads/2022/08/shutterstock_2103381338.jpg',
  'south american': 'https://res.cloudinary.com/rainforest-cruises/images/c_fill,g_auto/f_auto,q_auto/w_1120,h_747/v1625773497/Best-Food-In-SA-Bandeja-Paisa/Best-Food-In-SA-Bandeja-Paisa.jpg',
  'south indian': 'https://images.herzindagi.info/image/2020/Apr/south-indian-food-recipes-m.jpg',
  'spanish': 'https://europedishes.com/wp-content/uploads/2021/11/173-scaled.jpg',
  'sri lankan': 'https://www.bespokesrilankatravel.co.uk/wp-content/uploads/2019/03/Sri-Lankan-Food.jpg',
  'steak': 'https://tse3.mm.bing.net/th/id/OIP.U7ISNB3SKX4Xmc25CuHemAHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
  'street food': 'https://vanitascorner.com/wp-content/uploads/2020/10/Vada-Pav.jpg',
  'sushi': 'https://cdn.pixabay.com/photo/2020/04/04/15/07/sushi-5002639_1280.jpg',
  'tandoor': 'https://tse4.mm.bing.net/th/id/OIP.QA9QojQJ9hOFbQBtsa522gHaHa?w=1250&h=1250&rs=1&pid=ImgDetMain&o=7&rm=3',
  'tea': 'https://masalaandchai.com/wp-content/uploads/2021/07/Masala-Chai.jpg',
  'tex-mex': 'https://www.atyourbusiness.com/blog/wp-content/uploads/2021/12/texmex-768x512.jpg',
  'thai': 'https://www.tastingtable.com/img/gallery/the-best-thai-restaurants-in-america/l-intro-1646863588.jpg',
  'tibetan': 'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/toronto/abhishek_sanwa_limbu_LR559Dcst70_unsplash_a3ac66dc-f37f-4a71-ae4c-205bacc1263d.jpg',
  'turkish': 'https://img.freepik.com/premium-photo/turkish-food-kofte-stack-meatballs-with-rice_293953-60.jpg?w=1480',
  'vietnamese': 'https://thefoodwonder.com/wp-content/uploads/2021/08/vietnam-pho-dac-biet.jpg'
};

  const getCuisineThemedImage = () => {
    const match = Object.keys(cuisineImages).find((key) =>
      cuisineType.includes(key)
    );
    return match ? cuisineImages[match] : "/default-restaurant.jpg";
  };

  return (
    <div className="container mt-4">

      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <img
                    src={restaurant.image || getCuisineThemedImage()}
                    alt={restaurant.name}
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "300px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                    onError={(e) => {
                      e.target.src = getCuisineThemedImage();
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h1 className="card-title mb-0">{restaurant.name}</h1>
                    <div className="text-warning d-flex align-items-center">
                      {"⭐".repeat(
                        Math.floor(
                          restaurant.rating || restaurant.aggregateRating || 0
                        )
                      )}
                      <span className="text-muted ms-1">
                        ({restaurant.rating || restaurant.aggregateRating})
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="restaurant-cuisines">
                      {Array.isArray(restaurant.cuisine)
                        ? restaurant.cuisine.join(", ")
                        : restaurant.cuisine}
                    </span>
                  </div>

                  <p className="card-text">{restaurant.description}</p>

                  <div className="restaurant-details">
                    <p>
                      <strong>📍 Location:</strong>{" "}
                      {restaurant.locality || restaurant.address?.locality},{" "}
                      {restaurant.city || restaurant.address?.city}
                    </p>
                    <p>
                      <strong>💰 Price Level:</strong>{" "}
                      {"₹".repeat(
                        restaurant.priceLevel || restaurant.priceRange || 2
                      )}
                    </p>

                    {restaurant.zomatoData?.averageCostForTwo && (
                      <p>
                        <strong>Average Cost for Two:</strong>{" "}
                        {restaurant.zomatoData.currency}{" "}
                        {restaurant.zomatoData.averageCostForTwo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Reviews ({reviews.length})</h3>
            </div>
            <div className="card-body">
              {currentUser && (
                <form onSubmit={handleReviewSubmit} className="mb-4">
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <select
                      className="form-select"
                      value={reviewForm.rating}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          rating: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value={5}>⭐️⭐️⭐️⭐️⭐️ (5)</option>
                      <option value={4}>⭐️⭐️⭐️⭐️ (4)</option>
                      <option value={3}>⭐️⭐️⭐️ (3)</option>
                      <option value={2}>⭐️⭐️ (2)</option>
                      <option value={1}>⭐️ (1)</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comment</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}

              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>{review.user?.username || "Anonymous"}</strong>
                      <span className="text-warning">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="mb-1">{review.comment}</p>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>


          <div className="card mt-4">
            <div className="card-header">
              <h4>
                {currentUser ? "You May Also Like ❤️" : "Similar Restaurants 🔍"}
              </h4>
              <small className="text-muted">
                {currentUser 
                  ? "Based on your favorites and preferences" 
                  : "Restaurants with similar cuisine and style"
                }
              </small>
            </div>
            <div className="card-body">
              {recommendationsLoading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading recommendations...</span>
                  </div>
                  <span className="ms-2">Finding great restaurants for you...</span>
                </div>
              ) : recommendationsError ? (
                <div className="alert alert-warning">
                  <p className="mb-0">{recommendationsError}</p>
                </div>
              ) : similarRestaurants.length > 0 ? (
                <div className="row">
                  {similarRestaurants.map((similarRestaurant) => (
                    <div key={similarRestaurant._id || similarRestaurant.id} className="col-md-6 mb-3">
                      <RestaurantCard 
                        restaurant={similarRestaurant} 
                        compact={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">
                    No recommendations available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Restaurant Info</h4>
            </div>
            <div className="card-body">
              {restaurant.address && (
                <>
                  <h5>Address</h5>
                  <p>
                    <a
                      href={`https://www.google.com/maps?q=${encodeURIComponent(
                        `${restaurant.name || ""}, ${
                          restaurant.address.street || ""
                        }, ${restaurant.address.locality || ""}, ${
                          restaurant.address.city || ""
                        }, ${restaurant.address.state || ""} ${
                          restaurant.address.zipCode || ""
                        }`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#007bff",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.textDecoration = "underline")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.textDecoration = "none")
                      }
                    >
                      📍{" "}
                      {restaurant.address.street && (
                        <>
                          {restaurant.address.street}
                          <br />
                        </>
                      )}
                      {restaurant.address.locality && (
                        <>
                          {restaurant.address.locality}
                          <br />
                        </>
                      )}
                      {restaurant.address.city && (
                        <>
                          {restaurant.address.city}
                          <br />
                        </>
                      )}
                      {restaurant.address.state && (
                        <>
                          {restaurant.address.state}
                          <br />
                        </>
                      )}
                      {restaurant.address.zipCode && restaurant.address.zipCode}
                    </a>
                  </p>
                </>
              )}

              {restaurant.phone && (
                <>
                  <h5>Contact</h5>
                  <p>📞 {restaurant.phone}</p>
                </>
              )}

              {restaurant.website && (
                <>
                  <h5>Website</h5>
                  <p>
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {restaurant.website}
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>


      {error && (
        <div className="row mt-3">
          <div className="col-12">
            <div
              className={`alert ${
                error.includes("successfully")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;