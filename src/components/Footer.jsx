import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, ShieldCheck, Clock, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer no-print">
      <div className="container">
        {/* Features bar */}
        <div className="footer-highlights">
          <div className="highlight-item">
            <ShieldCheck size={28} className="highlight-icon" />
            <div>
              <h4>100% Secure Payments</h4>
              <p>Encrypted checkouts & verified operators</p>
            </div>
          </div>
          <div className="highlight-item">
            <Clock size={28} className="highlight-icon" />
            <div>
              <h4>Instant Seat Confirmation</h4>
              <p>Zero delay real-time seat lock</p>
            </div>
          </div>
          <div className="highlight-item">
            <Headphones size={28} className="highlight-icon" />
            <div>
              <h4>24/7 Customer Care</h4>
              <p>Friendly support anytime, anywhere</p>
            </div>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand-logo" style={{ marginBottom: 12 }}>
              <div className="logo-icon-wrap">
                <Bus size={20} className="logo-icon" />
              </div>
              <span className="brand-name">Bus<span>Go</span></span>
            </div>
            <p className="footer-desc">
              Your trusted partner for hassle-free bus reservations across top routes nationwide. Book luxury AC, sleepers, and express coaches in seconds.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/buses">Search Available Buses</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Popular Routes</h4>
            <ul className="footer-links">
              <li><Link to="/buses">New York ➔ Boston</Link></li>
              <li><Link to="/buses">Los Angeles ➔ San Francisco</Link></li>
              <li><Link to="/buses">Chicago ➔ Detroit</Link></li>
              <li><Link to="/buses">Seattle ➔ Portland</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Support</h4>
            <p className="footer-contact-info">
              Helpline: +1 (800) 555-BUSGO<br />
              Email: support@busgo.com<br />
              Hours: Mon - Sun, 24 Hours
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BusGo Reservations. Connected to Spring Boot + MySQL Backend.</p>
        </div>
      </div>
    </footer>
  );
}
