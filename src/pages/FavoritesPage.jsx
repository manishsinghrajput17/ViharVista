// src/pages/FavoritesPage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import DestinationCard from "../components/DestinationCard";
import { motion } from "framer-motion";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();

  if (!user) {
    return (
      <div className="favorites-page-container not-logged-in">
        <div className="favorites-header">
          <h1 className="page-title">My Favorites</h1>
          <p className="page-subtitle">
            Create your personal wishlists here and save destinations you love.
          </p>
        </div>

        <div className="login-required-card">
          <h3>Start Your Journey ✨</h3>
          <p>
            Sign in to unlock your personal favorites, build custom wishlists, 
            and plan your dream adventures with TravelExplorer.
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="cta-login-btn">Login</Link>
            <Link to="/signup" className="cta-signup-btn">Sign Up Free</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page-container">
      <div className="favorites-header">
        <h1 className="page-title">Favorites</h1>
        <p className="page-subtitle">
          Create your personal wishlists here and save destinations you love.
        </p>
      </div>

      {favorites.length === 0 ? (
        <p className="message">You have not added any destinations to your favorites yet.</p>
      ) : (
        <motion.div
          className="favorites-grid"
          variants={{
            hidden: { opacity: 1 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {favorites.map((fav) => (
            <motion.div
              key={fav.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <DestinationCard destination={fav} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage;
