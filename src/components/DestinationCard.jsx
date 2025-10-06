// src/components/DestinationCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { Heart, Clock, Ticket, Star, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import "./DestinationCard.css";

const DestinationCard = ({ destination }) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const favorite = isFavorite(destination.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/signup");
      return;
    }

    if (favorite) {
      removeFavorite(destination.id);
    } else {
      addFavorite(destination);
    }
  };

  return (
    <motion.div
      className="destination-card"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="card-image-container">
        <img
          src={destination.images[0]}
          alt={destination.name}
          className="card-image"
        />

        {/* Category */}
        <div className="category-tag">{destination.category}</div>

        {/* Favorite */}
        <button onClick={handleFavoriteClick} className="favorite-btn">
          <Heart
            size={20}
            className={favorite ? "heart-icon active" : "heart-icon"}
          />
        </button>

        {/* Rating */}
        <div className="rating-badge">
          <Star size={14} className="star-icon" />
          <span>{destination.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="card-content">
        <h3 className="card-title">{destination.name}</h3>

        <div className="location">
          <MapPin size={14} className="location-icon" />
          <span>{destination.location}</span>
        </div>

        <p className="description">
          {destination.description.length > 100
            ? `${destination.description.substring(0, 100)}...`
            : destination.description}
        </p>

        {/* Hours & Price */}
        <div className="details-grid">
  {/* Hours */}
  <div className="detail-item">
    <div className="detail-icon purple">
      <Clock size={16} />
    </div>
    <div className="detail-info">
      <span className="detail-label">Hours</span>
      <span className="detail-text">{destination.timings.split(" ")[0]}</span>
    </div>
  </div>

  {/* Price */}
  <div className="detail-item">
    <div className="detail-icon green">
      <Ticket size={16} />
    </div>
    <div className="detail-info">
      <span className="detail-label">Price</span>
      <span className="detail-text">{destination.entry_fee}</span>
    </div>
  </div>
</div>


        {/* Footer */}
        <div className="card-footer">
          <Link to={`/destinations/${destination.id}`} className="details-btn">
            View Details
          </Link>
          <a
            href={destination.official_link}
            target="_blank"
            rel="noopener noreferrer"
            className="external-btn"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;



