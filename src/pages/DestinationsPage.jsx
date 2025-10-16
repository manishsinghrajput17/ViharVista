// src/pages/DestinationsPage.jsx
import React, { useState, useEffect } from "react";
import DestinationCard from "../components/DestinationCard";
import { categories } from "../data/dummyCategories"; // keep categories (static)
import { supabase } from "../supabaseClient"; // direct supabase import
import "./DestinationsPage.css";
import { Search } from "lucide-react";
const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch from Supabase
  useEffect(() => {
  let mounted = true;

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase.from("destinations").select("*");
      if (error) throw error;
      if (!mounted) return;
      setDestinations(data);
      setFiltered(data);
    } catch (err) {
      if (!mounted) return;
      console.error("Error fetching destinations:", err.message);
      setError("Failed to load destinations.");
    } finally {
      if (mounted) setLoading(false);
    }
  };

  fetchDestinations();

  return () => {
    mounted = false;
  };
}, []);


  // ✅ Apply filters/search/sorting
  useEffect(() => {
    let results = [...destinations];

    // filter by category
    if (selectedCategory !== "All") {
      results = results.filter((d) => d.category === selectedCategory);
    }

    // search
    if (searchTerm.trim()) {
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // sort
    if (sortBy === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "category") {
      results.sort((a, b) => a.category.localeCompare(b.category));
    }

    setFiltered(results);
  }, [destinations, searchTerm, selectedCategory, sortBy]);

  // ✅ Loading & error handling
  if (loading) {
    return (
      <div className="destinations-page">
        <h2>Loading destinations...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="destinations-page">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="destinations-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Explore Amazing Destinations</h1>
        <p>
          Step into Bihar’s hidden treasures and embark on journeys you’ll never forget.
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-container">
          <Search className="search-icon" size={24} />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="search-btn"
          onClick={() => setSearchTerm(searchTerm)}
        >
          Search
        </button>
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map(({ name, icon }) => (
          <button
            key={name}
            className={`category-btn ${
              selectedCategory === name ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(name)}
          >
            <span className="category-emoji">{icon}</span>
            {name}
          </button>
        ))}
      </div>

      {/* Header Row (title + sort) */}
      <div className="results-header">
        <h2 className="results-title">
          {selectedCategory === "All" ? "All Destinations" : selectedCategory}
        </h2>

        <div className="sort-options">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="results-count">
        Showing <strong>{filtered.length}</strong>{" "}
        {filtered.length === 1 ? "destination" : "destinations"}
      </p>

      {/* Grid / No Results */}
      {filtered.length > 0 ? (
        <div className="destinations-grid">
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No destinations found!</p>
          <span className="no-results category-emoji">😞</span>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
