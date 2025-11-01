# 🍽️ খা.AI / Kha.AI — Restaurant Recommendation App  


---

## 🧠 Overview  
**Kha.AI** is a smart restaurant recommendation web app that helps users discover the best restaurants in their city based on cuisine, price, and rating.  
Users can also **favorite restaurants**, view details, and explore personalized recommendations — all through a clean and responsive interface.

---

## ✨ Features  
✅ Browse restaurants by cuisine, city, and price range  
✅ Search by name, location, or cuisine  
✅ Add or remove restaurants from favorites ❤️  
✅ View paginated and filterable restaurant lists  
✅ Authentication with secure user sessions  
✅ Admin dashboard for restaurant management  
✅ Fully responsive design for mobile and desktop  

---

## 🧩 Tech Stack  

### **Frontend**
- ⚛️ React (Create React App)
- 💅 React Bootstrap (UI Components)
- 🔄 Axios (API requests)
- 🔐 React Router for navigation

### **Backend**
- 🟢 Node.js + Express.js (REST API)
- 🍃 MongoDB + Mongoose (Database)
- 🔒 JWT Authentication

---

## 📂 Folder Structure  
<pre> <code>restaurant-recommendation-app/
├── backend/
│ ├── config/
│ │ ├── database.js
│ ├── controllers/
│ │ ├── adminController.js
│ │ ├── authController.js
│ │ ├── mlController.js
│ │ ├── restaurantController.js
│ │ ├── reviewController.js
│ │ ├── similarityController.js
│ │ ├── userController.js
│ ├── data/
│ │ ├── restaurants.csv
│ ├── middleware/
│ │ ├── admin.js
│ │ ├── admin.js
│ ├── ml/
│ │ ├── recommendationEngine.js
│ ├── routes/
│ │ ├── admin.js
│ │ ├── auth.js
│ │ ├── mlRecommendation.js
│ │ ├── restaurants.js
│ │ ├── review.js
│ │ ├── similarity.js
│ │ ├── users.js
│ ├── models/
│ │ ├── Restaurant.js
│ │ ├── Review.js
│ │ ├── User.js
│ │ ├── UserBehavior.js
│ ├── .env
│ ├── seed.csv
│ ├── server.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Navbar.js
│ │ │ ├── ProtectedRoute.js
│ │ │ ├── RestaurantCard.js
│ │ │ ├── SearchFilter.js
│ │ ├── pages/
│ │ │ ├── AuthContext.js
│ │ ├── pages/
│ │ │ ├── AdminDashboard.js
│ │ │ ├── Discover.js
│ │ │ ├── Favorites.js
│ │ │ ├── Home.js
│ │ │ ├── Login.js
│ │ │ ├── Profile.js
│ │ │ ├── Register.js
│ │ │ ├── RestaurantDetails.js
│ │ │ ├── Restaurants.js
│ │ ├── utils/
│ │ │ ├── api.js
│ │ ├── App.js
│ │ ├── index.js
│
└── README.md</code> </pre>


## ⚙️ Installation & Setup  

### **1. Clone the repository**
```bash
git clone https://github.com/EshaBytes/restaurant-recommendation-app.git
cd restaurant-recommendation-app
```

## **2. Install Dependencies 
Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd ../frontend
npm install
```

## **3. Environment Variables
Create a .env file inside the /backend folder and add:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 🚀 Run the App
Run backend
```bash
cd backend
npm run dev
```

Run frontend
```bash
cd frontend
npm start
```
## 🖥️ Screenshots
Home page
<img width="1920" height="1080" alt="Screenshot (554)" src="https://github.com/user-attachments/assets/abe317f6-bbf8-44b7-88fa-f5a782435e9e" />

Login
<img width="1920" height="1080" alt="Screenshot (555)" src="https://github.com/user-attachments/assets/6ffcc989-8dfa-4de0-ae1e-283a040cf3e6" />

Sign Up
<img width="1920" height="1080" alt="Screenshot (541)" src="https://github.com/user-attachments/assets/b56bc0a8-f22b-4965-823b-6113841cd6df" />

Profile/Preferences
<img width="1920" height="1080" alt="Screenshot (557)" src="https://github.com/user-attachments/assets/0e9d985f-5e17-4e26-8361-8ddeb2444dfc" />

Profile/Favorites
<img width="1920" height="1080" alt="Screenshot (558)" src="https://github.com/user-attachments/assets/b9846923-7b76-435b-a714-1412e3a6060f" />

Restaurants
<img width="1920" height="1080" alt="Screenshot (561)" src="https://github.com/user-attachments/assets/080f01d6-ff5a-499f-91de-9c35761ace5d" />

Restaurant Details
<img width="1920" height="1080" alt="Screenshot (562)" src="https://github.com/user-attachments/assets/6224231e-2e9f-464e-b6df-d4f104e3a0bd" />
<img width="1920" height="1080" alt="Screenshot (563)" src="https://github.com/user-attachments/assets/64345d9e-ad49-43a3-a4d8-93007bf3c72d" />

Discover
<img width="1920" height="1080" alt="Screenshot (564)" src="https://github.com/user-attachments/assets/38dcec71-2249-481b-a45a-988258d62575" />
<img width="1920" height="1080" alt="Screenshot (565)" src="https://github.com/user-attachments/assets/ec6537b0-6e73-4ed6-a09e-5df4f116b855" />

Admin Dashboard
<img width="1920" height="1080" alt="Screenshot (566)" src="https://github.com/user-attachments/assets/4ddfe27a-e138-415f-9df1-11250dc95495" />

