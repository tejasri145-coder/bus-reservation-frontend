import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, Calendar, User, Ticket, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import LoginModal from './LoginModal';

export default function Navbar() {
  const location = useLocation();
  const { myBookings, user, logoutUser } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="navbar no-print">
        <div className="container nav-content">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-wrap">
              <Bus size={22} className="logo-icon" />
            </div>
            <span className="brand-name">Bus<span>Go</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/buses" className={`nav-link ${isActive('/buses') ? 'active' : ''}`}>
              Search Buses
            </Link>
            <Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}>
              <Ticket size={16} />
              My Bookings
              {myBookings.length > 0 && (
                <span className="nav-badge">{myBookings.length}</span>
              )}
            </Link>
          </nav>

          {/* User Auth Profile */}
          <div className="nav-actions">
            {user.isLoggedIn ? (
              <div className="user-profile-menu">
                <div className="user-avatar">
                  <User size={16} />
                </div>
                <span className="user-name">{user.name}</span>
                <button
                  onClick={logoutUser}
                  className="btn-icon"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="btn btn-primary btn-sm"
              >
                <LogIn size={16} />
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown">
            <Link
              to="/"
              className={`mobile-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/buses"
              className={`mobile-link ${isActive('/buses') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Search Buses
            </Link>
            <Link
              to="/my-bookings"
              className={`mobile-link ${isActive('/my-bookings') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Bookings ({myBookings.length})
            </Link>
            <div className="mobile-auth-section">
              {user.isLoggedIn ? (
                <button
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} /> Logout ({user.name})
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogIn size={16} /> Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login / Auth Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
