import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Globe,
  Map,
  Shield,
  Search,
  Users,
  Star,
  MapPin,
  Rocket,
  Flower,
 
} from "lucide-react";
import { motion } from "framer-motion";
import "./AboutPage.css";

const AboutPage = () => {
  const features = [
    {
      icon: Flower,
      title: "Bihar Destinations",
      description:
        "Discover amazing places across Bihar, from iconic temples and historic sites to hidden natural gems waiting to be explored.",
      color: "blue",
    },
    {
      icon: Map,
      title: "Location Services",
      description:
        "Get precise directions and location information to help you navigate to your chosen destinations.",
      color: "green",
    },
    {
      icon: Heart,
      title: "Personal Wishlist",
      description:
        "Save your favorite Bihar destinations and create your personal travel bucket list for future adventures.",
      color: "red",
    },
    {
      icon: Shield,
      title: "Official Booking",
      description:
        "Direct links to official websites if avalailble, for authentic information and secure booking options.",
      color: "purple",
    },
    {
      icon: Users,
      title: "User-Friendly",
      description:
        "Clean, intuitive interface designed for easy browsing and seamless user experience.",
      color: "orange",
    },
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Find destinations quickly with advanced search and filtering tailored to Bihar’s cities, categories, and attractions.",
      color: "teal",
    },
  ];

  const techStack = [
    { name: "React", description: "Modern UI library", icon: "⚛️" },
    { name: "TypeScript", description: "Type-safe JavaScript", icon: "📘" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework", icon: "🎨" },
    { name: "Framer Motion", description: "Motion library for React", icon: "🎭" },
    { name: "Leaflet", description: "Interactive maps", icon: "🗺️" },
    { name: "Vite", description: "Fast frontend tooling", icon: "⚡" },
  ];

  const stats = [
    { icon: MapPin, number: "50+", label: "Destinations Covered" },
    { icon: Users, number: "5K+", label: "Happy Travelers" },
    { icon: Star, number: "4.8", label: "Average Rating" },
    { icon: Globe, number: "38+", label: "Districts" },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <motion.section
        className="about-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="about-hero-icon">
              <Rocket size={48} />
            </div>
          </motion.div>
          <motion.h1
            className="about-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            About ViharVista
          </motion.h1>
          <motion.p
            className="about-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your gateway to discovering Bihar’s most amazing destinations, 
            from historic landmarks and vibrant cultural sites to serene natural gems and hidden local treasures waiting to be explored.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={i}
                className="stat-card"
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <div className="stat-icon">
                  <IconComp size={28} />
                </div>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Mission */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <div className="mission-box">
          <p>
            ViharVista is dedicated to helping travelers discover and explore the incredible destinations of Bihar. 
            We believe that exploring Bihar’s rich history, vibrant culture, and stunning landscapes enriches lives, 
            broadens perspectives, and creates unforgettable memories.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>What We Offer</h2>
        <div className="features-grid">
          {features.map((feature, i) => {
            const IconComp = feature.icon;
            return (
              <motion.div key={i} className="feature-card">
                <div className={`feature-icon ${feature.color}`}>
                  <IconComp size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-section">
        <h2>Technology Stack</h2>
        <div className="tech-grid">
          {techStack.map((tech, i) => (
            <motion.div key={i} className="tech-card">
              <div className="tech-icon">{tech.icon}</div>
              <h3>{tech.name}</h3>
              <p>{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section">
        <h2>Get in Touch</h2>
        <p>Have questions or feedback? We'd love to hear from you!</p>
        <div className="contact-grid">
          <div className="contact-card">
            <h3>General Inquiries</h3>
            <a href="mailto:hello@travelexplorer.com">
              hello@ViharVista.com
            </a>
          </div>
          <div className="contact-card">
            <h3>Customer Support</h3>
            <a href="mailto:support@travelexplorer.com">
              support@ViharVista.com
            </a>
          </div>
        </div>
        <Link to="/destinations" className="contact-btn">
          Start Exploring
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
