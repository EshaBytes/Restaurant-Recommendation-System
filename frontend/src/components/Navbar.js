import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiCompass,
  FiUser, 
  FiHeart, 
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch
} from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);

  console.log('🔐 Navbar Auth State:', { 
    currentUser, 
    hasUser: !!currentUser,
    userEmail: currentUser?.email 
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleLogin = () => {
    console.log('Navigating to login...');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    console.log('Navigating to register...');
    navigate('/register');
    setIsMenuOpen(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/restaurants', icon: MdRestaurant, label: 'Restaurants' },
    { path: '/discover', icon: FiCompass, label: 'Discover' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <div className="logo-icon">
            <MdRestaurant />
          </div>
          <span className="logo-text">FoodFinder</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`nav-link ${isActiveLink(link.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="nav-icon" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section - FIXED: Only show one state */}
          <div className="nav-actions">
            {currentUser ? (
              // Logged In State
              <div className="user-section" ref={userMenuRef}>
                <div 
                  className="user-trigger"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-avatar">
                    {currentUser.name?.charAt(0)?.toUpperCase() || 
                     currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">
                    {currentUser.name || 'User'}
                  </span>
                  <div className={`chevron ${isUserMenuOpen ? 'open' : ''}`}>
                    ▼
                  </div>
                </div>

                {isUserMenuOpen && (
                  <div className="dropdown-menu">
                    <button onClick={handleProfile} className="dropdown-item">
                      <FiUser className="dropdown-icon" />
                      <span>Profile</span>
                    </button>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <FiLogOut className="dropdown-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Logged Out State
              <div className="auth-buttons">
                <button onClick={handleLogin} className="auth-btn login-btn">
                  Login
                </button>
                <button onClick={handleSignup} className="auth-btn signup-btn">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-actions">
          {!currentUser && (
            <button onClick={handleLogin} className="mobile-auth-btn">
              Login
            </button>
          )}
          <button 
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="nav-overlay" onClick={() => setIsMenuOpen(false)}></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;