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
restaurant-recommendation-app/
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
└── README.md


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

Backend

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

Run backend
```bash
cd frontend
npm start
```
## 🖥️ Screenshots
<img width="1920" height="1080" alt="Screenshot (555)" src="https://github.com/user-attachments/assets/5b99c81c-a872-44de-8235-42582e608f4c" />
<img width="1920" height="1080" alt="Screenshot (556)" src="https://github.com/user-attachments/assets/180e396d-47fe-488c-b9eb-ae209d4fe6b9" />
<img width="1920" height="1080" alt="Screenshot (557)" src="https://github.com/user-attachments/assets/88605554-caae-4fcd-863d-58c96e719f09" />
<img width="1920" height="1080" alt="Screenshot (558)" src="https://github.com/user-attachments/assets/1fe0dfb7-244a-4513-a815-20a943f1582a" />
<img width="1920" height="1080" alt="Screenshot (559)" src="https://github.com/user-attachments/assets/19c89029-576a-40cf-8833-67af87606e9f" />
<img width="1920" height="1080" alt="Screenshot (560)" src="https://github.com/user-attachments/assets/184041e8-9a4a-4a0f-b421-d6be44442e45" />
<img width="1920" height="1080" alt="Screenshot (561)" src="https://github.com/user-attachments/assets/9781cf3b-26e7-4ebf-b57a-fd25a99c91d6" />
<img width="1920" height="1080" alt="Screenshot (562)" src="https://github.com/user-attachments/assets/ad3b805e-8050-481a-b27c-0ca0f08f4f80" />
<img width="1920" height="1080" alt="Screenshot (563)" src="https://github.com/user-attachments/assets/9dd0aff6-ed1d-4fd4-8188-657fcfdd1012" />
<img width="1920" height="1080" alt="Screenshot (564)" src="https://github.com/user-attachments/assets/01d86605-cd72-4071-8848-880106d0d201" />
<img width="1920" height="1080" alt="Screenshot (565)" src="https://github.com/user-attachments/assets/4030287f-6afc-4464-8473-dc120ef4fe40" />
<img width="1920" height="1080" alt="Screenshot (554)" src="https://github.com/user-attachments/assets/900ab2c5-66ce-4d4c-9a85-44cc64f93e5f" />

