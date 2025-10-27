import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
          <div className="logo-icon">🍽️</div>
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
              <span className="nav-icon">🏠</span>
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className={`nav-link ${isActiveLink('/restaurants') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">🔍</span>
              Discover
            </Link>
            <Link 
              to="/trending" 
              className={`nav-link ${isActiveLink('/trending') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">📈</span>
              Trending
            </Link>
            <Link 
              to="/deals" 
              className={`nav-link ${isActiveLink('/deals') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">🎯</span>
              Deals
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
                    👤 My Profile
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    ❤️ Favorites
                  </Link>
                  <Link 
                    to="/reservations" 
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    📅 Reservations
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    🚪 Logout
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
          <span></span>
          <span></span>
          <span></span>
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