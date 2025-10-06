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


// // src/pages/HomePage.jsx
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { destinations } from '../data/DummyDestinations';
// import DestinationCard from '../components/DestinationCard';
// import { motion } from 'framer-motion';
// import { FaSearch } from 'react-icons/fa';
// import './HomePage.css';
// import { categories } from '../data/dummyCategories';

// const popularDestinations = destinations.slice(0, 3);
// const whyChooseUsData = [
//   { icon: '📍', title: 'Detailed Information', description: 'Get comprehensive details about each destination including timings, entry fees, and ratings.' },
//   { icon: '🗺️', title: 'Easy Navigation', description: 'Get directions to your favorite destinations with integrated maps and location services.' },
//   { icon: '🧡', title: 'Personal Wishlist', description: 'Save your favorite destinations and create your personalized travel wishlist.' }
// ];

// const HomePage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredDestinations, setFilteredDestinations] = useState([]);

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     setFilteredDestinations(
//       destinations.filter(d =>
//         d.name.toLowerCase().includes(term) ||
//         d.location.toLowerCase().includes(term) ||
//         d.category.toLowerCase().includes(term)
//       )
//     );
//   };

//   return (
//     <div className="homepage">
//       {/* Hero Section */}
//       <motion.section
//         className="hero-section"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         <div className="hero-content">
//           <h1>Discover Your Next <br /> Adventure</h1>
//           <p>Explore breathtaking destinations around the world. From iconic landmarks to hidden gems, find your perfect getaway with detailed information, stunning photos, and direct booking links.</p>
//           <div className="hero-buttons">
//             <Link to="/destinations" className="explore-btn">Explore Destinations</Link>
//             <Link to="/about" className="learn-more-btn">Learn More</Link>
//           </div>
//         </div>
//         <div className="hero-stats">
//           <div className="stat-card"><h3>8+</h3><p>Amazing Destinations</p></div>
//           <div className="stat-card"><h3>50+</h3><p>Countries Covered</p></div>
//           <div className="stat-card"><h3>4.8⭐</h3><p>Average Rating</p></div>
//         </div>
//       </motion.section>

//       {/* Search Section */}
//       <section className="search-section">
//         <h2>Find Your Perfect Destination</h2>
//         <p>Search by name, location, or category to discover your next adventure</p>
//         <div className="search-input-container">
//           <FaSearch className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search destinations, locations, or categories..."
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <button className="search-btn">Search</button>
//         </div>
//         {searchTerm && (
//           <div className="search-results-overlay">
//             {filteredDestinations.length > 0 ? (
//               filteredDestinations.map(d => (
//                 <Link to={`/destinations/${d.id}`} key={d.id} className="search-result-item">
//                   {d.name}, {d.location}
//                 </Link>
//               ))
//             ) : (
//               <p>No results found.</p>
//             )}
//           </div>
//         )}
//       </section>

//       {/* Popular Destinations Section */}
//       <section className="popular-destinations-section">
//         <h2>Popular Destinations</h2>
//         <p>Discover the most loved destinations by travelers around the world</p>
//         <motion.div
//           className="popular-destinations-grid"
//           variants={{
//             hidden: { opacity: 1 },
//             visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
//           }}
//           initial="hidden"
//           animate="visible"
//         >
//           {popularDestinations.map((d) => (
//             <motion.div
//               key={d.id}
//               variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
//             >
//               <DestinationCard destination={d} />
//             </motion.div>
//           ))}
//         </motion.div>
//         <div style={{ marginTop: '2rem' }}>
//           <Link to="/destinations" className="explore-btn">View All Destinations</Link>
//         </div>
//       </section>

//       {/* Explore by Category Section */}
//       <section className="category-section">
//         <h2>Explore by Category</h2>
//         <p>Find your perfect adventure based on your interests</p>
//         <div className="category-grid">
//           {categories.map((cat, index) => (
//             <div key={index} className="category-card">
//               <img src={cat.icon} alt={cat.name} className="category-icon" />
//               <p>{cat.name}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Why Choose Us Section */}
//       <section className="why-choose-us-section">
//         <h2>Why Choose TravelExplorer?</h2>
//         <p>Everything you need to plan your perfect journey</p>
//         <div className="why-choose-us-grid">
//           {whyChooseUsData.map((item, index) => (
//             <div key={index} className="why-card">
//               <div className="why-card-icon">{item.icon}</div>
//               <h3>{item.title}</h3>
//               <p>{item.description}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Call to Action Section */}
//       <section className="cta-section">
//         <h2>Ready to Start Your Journey?</h2>
//         <p>Join thousands of travelers who have discovered their dream destinations with TravelExplorer</p>
//         <div className="cta-buttons">
//           <Link to="/destinations" className="cta-explore-btn">Explore Now</Link>
//           <Link to="/signup" className="cta-signup-btn">Sign Up Free</Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="app-footer">
//         <div className="footer-content">
//           <div className="footer-section brand-info">
//             <h4>TravelExplorer</h4>
//             <p>Discover amazing destinations around the world</p>
//           </div>
//           <div className="footer-section quick-links">
//             <h4>Quick Links</h4>
//             <ul>
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/destinations">Destinations</Link></li>
//               <li><Link to="/about">About</Link></li>
//             </ul>
//           </div>
//           <div className="footer-section contact-info">
//             <h4>Contact</h4>
//             <p>Email: hello@travelexplorer.com</p>
//             <p>Support: support@travelexplorer.com</p>
//           </div>
//         </div>
//         <div className="footer-bottom">
//           <p>© 2024 TravelExplorer. Built with React & Vite.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;
