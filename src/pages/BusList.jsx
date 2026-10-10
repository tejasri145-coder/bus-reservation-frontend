import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowLeft, RefreshCw, AlertCircle, Bus as BusIcon, SlidersHorizontal } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { fetchBuses } from '../services/api';
import BusCard from '../components/BusCard';

export default function BusList() {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useBooking();

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');

  const loadBuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBuses();
      setBuses(data);
    } catch (err) {
      setError('Unable to fetch bus schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  // Filter and sort computation
  const filteredBuses = buses.filter(bus => {
    if (selectedType === 'ALL') return true;
    return bus.busType === selectedType;
  }).sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return (a.fare || 0) - (b.fare || 0);
    if (sortBy === 'PRICE_HIGH') return (b.fare || 0) - (a.fare || 0);
    if (sortBy === 'SEATS') return (b.totalSeats || 0) - (a.totalSeats || 0);
    return 0;
  });

  return (
    <div className="bus-list-page">
      {/* Top Search Recap Bar */}
      <div className="search-recap-bar">
        <div className="container recap-content">
          <div className="recap-info">
            <button onClick={() => navigate('/')} className="back-btn" title="Back to search">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2>{searchParams.from || 'Origin'} ➔ {searchParams.to || 'Destination'}</h2>
              <span className="recap-date">
                Date: {searchParams.date || 'Today'} • {filteredBuses.length} Buses Available
              </span>
            </div>
          </div>

          <button onClick={() => navigate('/')} className="btn btn-outline btn-sm">
            Modify Search
          </button>
        </div>
      </div>

      <div className="container list-layout-container">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <SlidersHorizontal size={18} />
              <h3>Filters & Sorting</h3>
            </div>

            {/* Bus Type Filter */}
            <div className="filter-group">
              <label className="filter-label">Bus Category</label>
              <div className="filter-options">
                {[
                  { label: 'All Buses', val: 'ALL' },
                  { label: 'AC Sleeper', val: 'AC_SLEEPER' },
                  { label: 'AC Seater', val: 'AC_SEATER' },
                  { label: 'Non-AC Seater', val: 'NON_AC_SEATER' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    className={`filter-pill ${selectedType === opt.val ? 'active' : ''}`}
                    onClick={() => setSelectedType(opt.val)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="DEFAULT">Recommended</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
                <option value="SEATS">Most Seats Available</option>
              </select>
            </div>

            <button
              className="btn btn-outline btn-sm"
              style={{ width: '100%', marginTop: 12 }}
              onClick={() => { setSelectedType('ALL'); setSortBy('DEFAULT'); }}
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main List */}
        <main className="bus-results-main">
          {loading ? (
            <div className="loading-state">
              <RefreshCw size={32} className="spin-icon" />
              <p>Fetching real-time bus schedules from Spring Boot backend...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={36} color="#ef4444" />
              <h3>Unable to load buses</h3>
              <p>{error}</p>
              <button onClick={loadBuses} className="btn btn-primary" style={{ marginTop: 12 }}>
                <RefreshCw size={16} /> Try Again
              </button>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div className="empty-state">
              <BusIcon size={44} className="empty-icon" />
              <h3>No Buses Found</h3>
              <p>No buses matched your selected filter criteria. Try resetting filters or choosing another date.</p>
              <button
                onClick={() => setSelectedType('ALL')}
                className="btn btn-primary"
                style={{ marginTop: 16 }}
              >
                Show All Buses
              </button>
            </div>
          ) : (
            <div className="bus-cards-list">
              {filteredBuses.map(bus => (
                <BusCard key={bus.id} bus={bus} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
