// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { data, Link } from "react-router-dom";

import { categories } from "../data/dummyCategories";
import DestinationCard from "../components/DestinationCard";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import {
  Search,
  Info,
  Navigation,
  Heart,
  MapPin,
  Globe,
} from "lucide-react";
import "./HomePage.css";




const whyChooseUsData = [
  {
    icon: Info,
    title: "Detailed Information",
    description:
      "Get comprehensive details about each destination including timings, entry fees, and ratings.",
  },
  {
    icon: Navigation,
    title: "Easy Navigation",
    description:
      "Get directions to your favorite destinations with integrated maps and location services.",
  },
  {
    icon: Heart,
    title: "Personal Wishlist",
    description:
      "Save your favorite destinations and create your personalized travel wishlist.",
  },
];

const HomePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Fetch destinations once
  useEffect(() => {
    const fetchDestinations = async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("id, name, description, category, location, timings, entry_fee, rating, images");

      if (error) {
        console.error("Error fetching destinations:", error);
        return;
      }

      setDestinations(data);

      // 👉 Derive top 6 by rating
      const popular = (data || [])
        .filter((d) => d.rating != null)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);

      setPopularDestinations(popular);
    };

    fetchDestinations();
  }, []);

  // ✅ Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term) {
      const filtered = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.location.toLowerCase().includes(term) ||
          d.category.toLowerCase().includes(term)
      );
      setFilteredDestinations(filtered);
    } else {
      setFilteredDestinations([]); // fallback to popular
    }
  };

  // ✅ Handle category selection
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);

    if (categoryName === "All") {
      setFilteredDestinations([]); // fallback to popular
    } else {
      const filtered = destinations.filter(
        (d) => d.category.toLowerCase() === categoryName.toLowerCase()
      );
      setFilteredDestinations(filtered);
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Your Next <br />
            <span className="highlight">Adventure</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Uncover the unexplored charm of Bihar — a perfect blend of history, spirituality, and nature.
            Travel beyond destinations, into the heart of India’s timeless heritage.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/destinations" className="btn primary">
              Explore Destinations
            </Link>
            <Link to="/about" className="btn secondary">
              Learn More
            </Link>
          </motion.div>
          {/* Stats Section */}
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="stat-box">
              <h3>{destinations.length}+</h3>
              <p>Amazing Destinations</p>
            </div>
            <div className="stat-box">
              <h3>38+</h3>
              <p>Districts Explored</p>
            </div>
            <div className="stat-box">
              <h3>4.8★</h3>
              <p>Average Rating</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <h2>Find Your Perfect Destination</h2>
          <p>Search by name, city, or category to uncover your next Bihar adventure</p>

          <div className="search-bar">
            <div className="search-input-container">
              <Search className="search-icon" size={24} />
              <input
                type="text"
                placeholder="Search destinations, locations, or categories..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button className="search-btn">Search</button>
          </div>

          {searchTerm && (
            <div className="search-results">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((d) => (
                  <Link
                    key={d.id}
                    to={`/destinations/${d.id}`}
                    className="result-item"
                    onClick={() => setSearchTerm("")}
                  >
                    <div className="result-name">{d.name}</div>
                    <div className="result-location">
                      <MapPin size={14} /> {d.location} • {d.category}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-results">No results found</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="categories">
            {categories.map(({ name, icon }) => (
              <button
                key={name}
                className={`category-btn ${selectedCategory === name ? "active" : ""}`}
                onClick={() => handleCategoryClick(name)}
              >
                <span className="category-emoji">{icon}</span>
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>
              {selectedCategory === "All"
                ? "Popular Destinations"
                : `${selectedCategory} Destinations`}
            </h2>
            <p>Discover Bihar’s most loved destinations, from historic wonders to hidden gems</p>
          </div>

          {selectedCategory === "All" ? (
            <div className="destinations-grid">
              {popularDestinations.length > 0 ? (
                popularDestinations.map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))
              ) : (
                <p>⚠️ No popular destinations found. Add ratings in Supabase.</p>
              )}
            </div>
          ) : filteredDestinations.length > 0 ? (
            <div className="destinations-grid">
              {filteredDestinations
                .sort((a, b) => b.rating - a.rating)
                .map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No destinations found</h3>
              <p>Try browsing other categories or view all destinations</p>
              <Link to="/destinations" className="browse-all-btn">
                Browse All Destinations
              </Link>
            </div>
          )}
        </div>
      </section>


      {/* Why Choose ViharVista */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose <span className="highlight">ViharVista?</span></h2>
            <p>
              Your ultimate companion for discovering Bihar’s most captivating destinations, 
              from historic marvels to hidden natural gems.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌄</div>
              <h3>Bihar Exploration</h3>
              <p>
                Discover Bihar’s best destinations, from historic temples and monuments to serene natural escapes waiting to be explored.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>User-Friendly Interface</h3>
              <p>
                Intuitive design that makes browsing, searching, and planning your
                trips effortless and enjoyable.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Personal Wishlist</h3>
              <p>
                Save your favorite destinations and create your personal travel
                bucket list for future adventures.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Interactive Maps</h3>
              <p>
                Get precise directions and explore locations with integrated Google
                Maps for seamless navigation.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Direct Booking</h3>
              <p>
                Access official booking sites directly for authentic information and
                secure reservations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Verified Reviews</h3>
              <p>
                Trust authentic ratings and detailed information about timings, entry
                fees, and visitor experiences.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of travelers who have discovered their dream destinations with ViharVista</p>
        <div className="cta-buttons">
          <Link to="/destinations" className="btn highlight">
            <span>🌍</span>
            Explore Now
          </Link>
          <Link to="/signup" className="btn secondary">
            <span>📝</span>
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Footer */}



    </div>
  );
};

export default HomePage;
