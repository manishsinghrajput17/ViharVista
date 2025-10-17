// src/pages/DestinationDetailsPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { fetchDestinationById } from "../api/destinations";
import { Heart, Clock, Ticket, Star, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import "./DestinationDetailsPage.css";

const DestinationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [destination, setDestination] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchDestinationById(id);
      setDestination(data);
      if (data?.images?.length) setMainImage(data.images[0]);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="destination-details">Loading...</div>;
  if (!destination) return <div className="destination-details"><h1>Destination Not Found</h1></div>;

  const favorite = isFavorite(destination.id);

  const handleFavoriteClick = () => {
    if (!user) return alert("Please log in to add to favorites.");
    if (user.role === "admin") return; // Admin cannot modify favorites
    favorite ? removeFavorite(destination.id) : addFavorite(destination); // Pass full object
  };

  const handleOfficialLink = () => {
    if (destination.official_link) window.open(destination.official_link, "_blank");
  };

  return (
    <div className="destination-details">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={18} /> Back to Destinations
      </button>

      <div className="card-wrapper">
        {/* Left: Images */}
        <div className="image-section">
          <img src={mainImage} alt={destination.name} className="main-photo" />
          <div className="thumbnail-list">
            {destination.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={`thumbnail-item ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="info-section">
          <div className="info-header">
            <div className="title-wrapper">
              <h1>{destination.name}</h1>
              <span className="category-badge">{destination.category}</span>
            </div>

            {user && (
              <button className="favorite-icon"
                onClick={handleFavoriteClick}
                disabled={user.role === "admin"} // visually disable for admin
                style={{ cursor: user.role === "admin" ? "not-allowed" : "pointer" }}
                title={user.role === "admin" ? "Admins cannot modify favorites" : ""}
              >
                <Heart color={user.role === "admin" ? "gray" : favorite ? "red" : "black"} size={20} />
              </button>
            )}
          </div>

          <div className="detail-grid">
            <div className="detail-card accent-purple"><MapPin size={20} /><p>{destination.location}</p></div>
            <div className="detail-card accent-yellow"><Star size={20} /><p>{destination.rating} / 5</p></div>
            <div className="detail-card accent-blue"><Clock size={20} /><p>{destination.timings}</p></div>
            <div className="detail-card accent-green"><Ticket size={20} /><p>{destination.entry_fee}</p></div>
          </div>

          <h2>About the Destination</h2>
          <p>{destination.description}</p>

          <div className="button-row">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button direction-button"
            >
              <MapPin size={18} /> Get Directions
            </a>
            {destination.official_link && (
              <button onClick={handleOfficialLink} className="action-button official-button">
                <ExternalLink size={18} /> Visit Official Site
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailsPage;

