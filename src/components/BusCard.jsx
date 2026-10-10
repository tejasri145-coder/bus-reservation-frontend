import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Star, Wifi, Zap, Wind, ShieldCheck, ArrowRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function BusCard({ bus }) {
  const navigate = useNavigate();
  const { setSelectedBus, clearSelectedSeats, searchParams } = useBooking();

  const handleSelectSeats = () => {
    setSelectedBus(bus);
    clearSelectedSeats();
    navigate('/seats');
  };

  const formatBusType = (type) => {
    if (!type) return 'Standard Coach';
    return type.replace(/_/g, ' ');
  };

  return (
    <div className="bus-card">
      <div className="bus-card-left">
        <div className="operator-header">
          <div>
            <h3 className="operator-name">{bus.operatorName}</h3>
            <div className="bus-meta-badges">
              <span className="bus-number-badge">#{bus.busNumber}</span>
              <span className={`bus-type-badge ${bus.busType?.includes('SLEEPER') ? 'sleeper' : 'seater'}`}>
                {formatBusType(bus.busType)}
              </span>
              {bus.active ? (
                <span className="badge badge-success">Active</span>
              ) : (
                <span className="badge badge-danger">Inactive</span>
              )}
            </div>
          </div>
          <div className="rating-badge">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{bus.rating || 4.8}</span>
          </div>
        </div>

        {/* Departure -> Arrival Timeline */}
        <div className="trip-timeline">
          <div className="time-block">
            <span className="time">{bus.departureTime || '08:30 AM'}</span>
            <span className="city">{searchParams.from || 'Source'}</span>
          </div>

          <div className="duration-divider">
            <span className="duration-text">{bus.duration || '4h 30m'}</span>
            <div className="timeline-line">
              <span className="timeline-dot start"></span>
              <span className="timeline-bar"></span>
              <ArrowRight size={14} className="timeline-arrow" />
              <span className="timeline-dot end"></span>
            </div>
          </div>

          <div className="time-block right">
            <span className="time">{bus.arrivalTime || '01:00 PM'}</span>
            <span className="city">{searchParams.to || 'Destination'}</span>
          </div>
        </div>

        {/* Amenities preview */}
        <div className="amenities-preview">
          <span className="amenity-tag"><Wifi size={13} /> Free Wi-Fi</span>
          <span className="amenity-tag"><Zap size={13} /> Charging Ports</span>
          <span className="amenity-tag"><Wind size={13} /> AC Climate</span>
          <span className="amenity-tag"><ShieldCheck size={13} /> Sanitized</span>
        </div>
      </div>

      <div className="bus-card-right">
        <div className="fare-section">
          <span className="fare-label">Starting from</span>
          <div className="fare-price">
            <span className="currency">$</span>
            <span className="amount">{bus.fare ? bus.fare.toFixed(2) : '35.00'}</span>
          </div>
          <span className="fare-sub">per seat</span>
        </div>

        <div className="seats-avail-info">
          <span className="avail-count">{bus.totalSeats} Total Seats</span>
        </div>

        <button
          onClick={handleSelectSeats}
          className="btn btn-primary btn-select-seats"
        >
          View Seats / Book
        </button>
      </div>
    </div>
  );
}
