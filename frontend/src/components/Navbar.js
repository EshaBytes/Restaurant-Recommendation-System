import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiCompass,
  FiUser, 
  FiHeart, 
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX,
  FiMapPin
} from 'react-icons/fi';
import { 
  MdRestaurant
} from 'react-icons/md';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <div className="logo-icon">
            <MdRestaurant />
          </div>
          <span className="logo-text">FoodFinder</span>
        </Link>

        {/* Navigation Links */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <FiHome className="nav-icon" />
              <span className="nav-text">Home</span>
            </Link>
            <Link 
              to="/discover" 
              className={`nav-link ${isActiveLink('/discover') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <FiCompass className="nav-icon" />
              <span className="nav-text">Discover</span>
            </Link>
            <Link 
              to="/restaurants" 
              className={`nav-link ${isActiveLink('/restaurants') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <MdRestaurant className="nav-icon" />
              <span className="nav-text">Restaurants</span>
            </Link>
            <Link 
              to="/nearby" 
              className={`nav-link ${isActiveLink('/nearby') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <FiMapPin className="nav-icon" />
              <span className="nav-text">Nearby</span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="nav-actions">
            {currentUser ? (
              <div className="user-section">
                <Link 
                  to="/profile" 
                  className="profile-btn"
                  onClick={closeMenu}
                >
                  <div className="user-avatar">
                    {currentUser.displayName?.charAt(0)?.toUpperCase() || 
                     currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">
                    {currentUser.displayName || 'Profile'}
                  </span>
                </Link>
                <div className="dropdown-menu">
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <FiUser className="dropdown-icon" />
                    <span>My Profile</span>
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <FiHeart className="dropdown-icon" />
                    <span>Favorites</span>
                  </Link>
                  <Link 
                    to="/reservations" 
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <FiCalendar className="dropdown-icon" />
                    <span>Reservations</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    <FiLogOut className="dropdown-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="auth-btn login-btn"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="auth-btn signup-btn"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="nav-overlay" onClick={closeMenu}></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;