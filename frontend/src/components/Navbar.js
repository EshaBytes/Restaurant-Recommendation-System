import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiCompass,
  FiUser,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
} from "react-icons/fi";
import "../styles/Navbar.css";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef(null);
  const userTriggerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userTriggerRef.current &&
        !userTriggerRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    navigate("/register");
    setIsMenuOpen(false);
  };

  const handleProfile = () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    setTimeout(() => {
      navigate("/profile");
    }, 100);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen((prev) => !prev);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", icon: "/icons/home.png", label: "Home" },
    {
      path: "/restaurants",
      icon: "/icons/restaurant.png",
      label: "Restaurants",
    },
    { path: "/discover", icon: "/icons/discover.png", label: "Discover" },
  ];


  const getUserDisplayName = () => {
    if (!currentUser) return "User";
    return (
      currentUser.username || currentUser.name || currentUser.email || "User"
    );
  };


  const getUserAvatarInitial = () => {
    if (!currentUser) return "U";
    const initial =
      currentUser.username?.charAt(0)?.toUpperCase() ||
      currentUser.name?.charAt(0)?.toUpperCase() ||
      currentUser.email?.charAt(0)?.toUpperCase() ||
      "U";
    return initial;
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">

        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <div className="logo-icon">
            <img src="logo.png" alt="খা.AI Logo" />
          </div>
          <span className="logo-text">খা.AI</span>
        </Link>


        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActiveLink(link.path) ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={link.icon} alt={link.label} className="nav-icon-img" />
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </div>


        <div className="nav-actions">
          {currentUser ? (
            <div className="user-section">
              <div
                ref={userTriggerRef}
                className="user-trigger"
                onClick={toggleUserMenu}
              >
                <div className="user-avatar">{getUserAvatarInitial()}</div>
                <span className="user-name">{getUserDisplayName()}</span>
                <div className={`chevron ${isUserMenuOpen ? "open" : ""}`}>
                  ▼
                </div>
              </div>

              <div
                ref={userMenuRef}
                className={`dropdown-menu ${isUserMenuOpen ? "show" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                {currentUser?.role === "admin" ? (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsMenuOpen(false);
                      navigate("/admin/dashboard");
                    }}
                    className="dropdown-item"
                  >
                    <FiUser className="dropdown-icon" />
                    <span>Dashboard</span>
                  </button>
                ) : (
                  <button onClick={handleProfile} className="dropdown-item">
                    <FiUser className="dropdown-icon" />
                    <span>Profile</span>
                  </button>
                )}

                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <FiLogOut className="dropdown-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
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
    </nav>
  );
};

export default Navbar;
