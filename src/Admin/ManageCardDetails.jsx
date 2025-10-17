// src/admin/ManageCardDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Ticket, Heart } from "lucide-react";
import { supabase } from "../supabaseClient";
import styles from "./ManageCardDetails.module.css";

const ManageCardDetails = ({ destination }) => {
  const navigate = useNavigate();

  // ✅ State for favorite count & loading
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch favorite count for this destination
  useEffect(() => {
    let mounted = true;

    const fetchFavoriteCount = async () => {
      try {
        const { count, error } = await supabase
          .from("favorites")
          .select("destination_id", { count: "exact", head: true })
          .eq("destination_id", destination.id);

        if (error) throw error;
        if (mounted) setFavoriteCount(count || 0);
      } catch (err) {
        console.error("Error fetching favorite count:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFavoriteCount();

    return () => { mounted = false; };
  }, [destination.id]);

  const handleView = () => navigate(`/destinations/${destination.id}`);
  const handleManage = () => navigate(`/admin/edit-destination/${destination.id}`);

  return (
    <motion.div
      className={styles.manageCard}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}

      <div className={styles.cardImageContainer}>
        <img
          src={destination.images?.[0] || "/placeholder.jpg"}
          alt={destination.name}
          className={styles.cardImage}
        />
        <div className={styles.categoryTag}>{destination.category}</div>
        <div className={styles.ratingBadge}>
          <Star size={14} className="star-icon"/>
          <span>{destination.rating}</span>
        </div>

        {/* ✅ Favorite count badge - top right */}
        <div className={styles.favoriteBadge}>
          <Heart size={16} />
          <span>{loading ? "..." : favoriteCount}</span>
        </div>
      </div>


      {/* Content */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{destination.name}</h3>
        <div className={styles.location}>
          <MapPin size={17} className="location-icon"/>
          <span>{destination.location}</span>
        </div>
        <p className={styles.description}>
          {destination.description?.length > 100
            ? `${destination.description.substring(0, 100)}...`
            : destination.description}
        </p>

        {/* Hours & Price */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <div className={`${styles.detailIcon} ${styles.purple}`}>
              <Clock size={17} />
            </div>
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Hours</span>
              <span className={styles.detailText}>
                {destination.timings?.split(" ")[0] || "N/A"}
              </span>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={`${styles.detailIcon} ${styles.green}`}>
              <Ticket size={17} />
            </div>
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Price</span>
              <span className={styles.detailText}>{destination.entry_fee || "Free"}</span>
            </div>
          </div>

        </div>

        {/* Admin Buttons */}
        <div className={styles.cardActions}>
          <button className={styles.viewBtn} onClick={handleView}>
            View
          </button>
          <button className={styles.manageBtn} onClick={handleManage}>
            Manage
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageCardDetails;
