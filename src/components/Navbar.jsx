// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaMapMarkerAlt, FaInfoCircle, FaHome, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { user,role, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
       <div className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="brand">
          ViharVista
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <FaHome /> Home
        </Link>
        {/* <Link to="/destinations" className="nav-link">
          <FaMapMarkerAlt /> Destinations
        </Link> */}
        {/* 👇 Show Manage Destinations for admin, Destinations for user */}
        {role === "admin" ? (
          
            <Link to="/admin-dashboard" className="nav-link"><FaMapMarkerAlt/> Manage Destinations</Link>
        
        ) : (
          
            <Link to="/destinations" className="nav-link"><FaMapMarkerAlt/>Destinations</Link>
        
        )}
        {role !== "admin" && (
        <Link to="/favorites" className="nav-link">
          <FaHeart /> Favorites ({favorites.length})
        </Link>
        )}
        <Link to="/about" className="nav-link">
          <FaInfoCircle /> About
        </Link>
      </div>

      <div className="navbar-auth">
        {user ? (
          <>
            <span className="user-email"> {user.email}
      {role === "admin" && <span className="admin-badge">Admin</span>}
    </span>
            <button onClick={handleLogout} className="btn logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
         
            <Link to="/login" className="btn login-btn">Login</Link>
            <Link to="/signup" className="btn signup-btn">Sign Up</Link>
          </>
        )}
      </div>
      </div>
    </nav>
  );
};

export default Navbar;

