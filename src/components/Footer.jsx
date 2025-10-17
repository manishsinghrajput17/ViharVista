import React from 'react'
import { Link } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Footer.css'

function Footer() {
  const {role}= useAuth();
  return (
    <div>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand & About */}
            <div className="footer-column">
              <h4 className="footer-title brand-title">
                <Globe className="footer-icon" size={24} />
                ViharVista
              </h4>
              <p className="footer-text">
                Discover Bihar’s amazing destinations and create unforgettable memories.
              </p>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li>
                  {role === "admin" ? (
                    <Link to="/admin-dashboard" className="footer-link">Manage Destinations</Link>
                  ) : (
                    <Link to="/destinations" className="footer-link">Destinations</Link>
                  )}
                </li>

                <li><Link to="/about" className="footer-link">About</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-column">
              <h4 className="footer-title">Contact</h4>
              <p className="footer-text">Email: hello@ViharVista.com</p>
              <p className="footer-text">Support: support@ViharVista.com</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p>© 2025 ViharVista. Built with React & Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer