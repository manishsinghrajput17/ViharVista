// src/admin/ManageDestinationsPage.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ManageCardDetails from "./ManageCardDetails";
import { categories } from "../data/dummyCategories";
import styles from "./ManageDestinations.module.css";

export const ManageDestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase.from("destinations").select("*");
        if (error) throw error;
        setDestinations(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load destinations");
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Filter, search, sort
  useEffect(() => {
    let results = [...destinations];

    if (selectedCategory !== "All") {
      results = results.filter((d) => d.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "name") results.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "rating") results.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "category") results.sort((a, b) => a.category.localeCompare(b.category));

    setFiltered(results);
  }, [destinations, searchTerm, selectedCategory, sortBy]);

  if (loading) return <h2 className={styles.loading}>Loading destinations...</h2>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.manageDestinationsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1>Manage Destinations</h1>
        <p>Update, Add, or Delete Bihar’s most beautiful travel spots.</p>
      </div>

      {/* Search + Add Button */}
      <div className={styles.searchAddContainer}>
        <div className={styles.searchInputContainer}>
          <Search className={styles.searchIcon} size={22} />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className={styles.addBtn}
          onClick={() => navigate("/admin/add-destination")}
        >
          ➕ Add New Destination
        </button>
      </div>

      {/* Categories */}
      <div className={styles.categories}>
        {categories.map(({ name, icon }) => (
          <button
            key={name}
            className={`${styles.categoryBtn} ${
              selectedCategory === name ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory(name)}
          >
            <span className={styles.categoryEmoji}>{icon}</span>
            {name}
          </button>
        ))}
      </div>

      {/* Sort + Info */}
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>
          {selectedCategory === "All" ? "All Destinations" : selectedCategory}
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      <p className={styles.resultsCount}>
        Showing <strong>{filtered.length}</strong> destinations
      </p>

      {/* Destinations Grid */}
      {filtered.length > 0 ? (
        <div className={styles.destinationsGrid}>
          {filtered.map((dest) => (
            <ManageCardDetails key={dest.id} destination={dest} />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>No destinations found!</p>
        </div>
      )}
    </div>
  );
};

