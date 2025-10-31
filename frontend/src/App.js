import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favourites";
import Discover from "./pages/Discover";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          
          <Navbar />

          <main>
            <Routes>
              
              <Route path="/" element={<Home />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurants/:id" element={<RestaurantDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discover"
                element={
                  <ProtectedRoute>
                    <Discover />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />

              
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          
          <ToastContainer
            position="top-center"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
