import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRightLeft, Search, Shield, Zap, ThumbsUp, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const POPULAR_CITIES = ['New York', 'Boston', 'Los Angeles', 'San Francisco', 'Chicago', 'Washington DC', 'Philadelphia'];

export default function Home() {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useBooking();

  const [from, setFrom] = useState(searchParams.from || 'New York');
  const [to, setTo] = useState(searchParams.to || 'Boston');
  const [date, setDate] = useState(searchParams.date || new Date().toISOString().split('T')[0]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ from, to, date });
    navigate('/buses');
  };

  const handleQuickRoute = (rFrom, rTo) => {
    setFrom(rFrom);
    setTo(rTo);
    setSearchParams({ from: rFrom, to: rTo, date });
    navigate('/buses');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-container">
          <div className="hero-badge">
            <Sparkles size={14} /> Smart & Seamless Bus Bookings
          </div>
          <h1 className="hero-title">
            Travel Comfortably, <br />
            <span>Book Seats in Seconds</span>
          </h1>
          <p className="hero-subtitle">
            Search live schedules from certified operators. Real-time seat layouts, secure checkouts, and guaranteed lowest fares.
          </p>

          {/* Search Box Widget */}
          <div className="search-widget-card">
            <form onSubmit={handleSearch} className="search-form-grid">
              {/* From input */}
              <div className="search-field">
                <label className="field-label">From City</label>
                <div className="field-input-wrap">
                  <MapPin size={20} className="field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Departure City"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    list="from-cities"
                  />
                  <datalist id="from-cities">
                    {POPULAR_CITIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                className="swap-btn"
                onClick={handleSwap}
                title="Swap origin and destination"
                aria-label="Swap cities"
              >
                <ArrowRightLeft size={18} />
              </button>

              {/* To input */}
              <div className="search-field">
                <label className="field-label">To City</label>
                <div className="field-input-wrap">
                  <MapPin size={20} className="field-icon destination" />
                  <input
                    type="text"
                    required
                    placeholder="Destination City"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    list="to-cities"
                  />
                  <datalist id="to-cities">
                    {POPULAR_CITIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>

              {/* Date input */}
              <div className="search-field">
                <label className="field-label">Journey Date</label>
                <div className="field-input-wrap">
                  <Calendar size={20} className="field-icon" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="search-action">
                <button type="submit" className="btn btn-primary search-submit-btn">
                  <Search size={18} />
                  <span>Search Buses</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Counters */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-card">
            <h3>50,000+</h3>
            <p>Happy Passengers</p>
          </div>
          <div className="stat-card">
            <h3>200+</h3>
            <p>Verified Buses</p>
          </div>
          <div className="stat-card">
            <h3>1,500+</h3>
            <p>Daily Routes</p>
          </div>
          <div className="stat-card">
            <h3>4.9 / 5</h3>
            <p>Customer Rating</p>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="routes-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Intercity Routes</h2>
            <p>Select a route to view schedules and reserve seats instantly</p>
          </div>

          <div className="popular-routes-grid">
            <div className="route-card" onClick={() => handleQuickRoute('New York', 'Boston')}>
              <div className="route-cities">
                <span className="route-from">New York</span>
                <span className="route-arrow">➔</span>
                <span className="route-to">Boston</span>
              </div>
              <div className="route-details">
                <span>4h 30m • Daily 12 Trips</span>
                <span className="route-price">From $35</span>
              </div>
            </div>

            <div className="route-card" onClick={() => handleQuickRoute('Los Angeles', 'San Francisco')}>
              <div className="route-cities">
                <span className="route-from">Los Angeles</span>
                <span className="route-arrow">➔</span>
                <span className="route-to">San Francisco</span>
              </div>
              <div className="route-details">
                <span>6h 15m • Daily 8 Trips</span>
                <span className="route-price">From $48</span>
              </div>
            </div>

            <div className="route-card" onClick={() => handleQuickRoute('Chicago', 'Detroit')}>
              <div className="route-cities">
                <span className="route-from">Chicago</span>
                <span className="route-arrow">➔</span>
                <span className="route-to">Detroit</span>
              </div>
              <div className="route-details">
                <span>5h 00m • Daily 10 Trips</span>
                <span className="route-price">From $32</span>
              </div>
            </div>

            <div className="route-card" onClick={() => handleQuickRoute('Washington DC', 'Philadelphia')}>
              <div className="route-cities">
                <span className="route-from">Washington DC</span>
                <span className="route-arrow">➔</span>
                <span className="route-to">Philadelphia</span>
              </div>
              <div className="route-details">
                <span>2h 45m • Daily 14 Trips</span>
                <span className="route-price">From $28</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Reserve With BusGo?</h2>
            <p>Designed for speed, comfort, and transparent pricing</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Zap size={24} />
              </div>
              <h3>Live Seat Selection</h3>
              <p>Pick your preferred window or aisle seat on an interactive graphic seat map before payment.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Shield size={24} />
              </div>
              <h3>100% Verified Fleet</h3>
              <p>Every bus is inspected for AC, sanitized interiors, comfortable push-back recliners, and safety.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Clock size={24} />
              </div>
              <h3>Instant E-Tickets</h3>
              <p>Receive your digital boarding pass and QR code immediately with simple one-click print or download.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
