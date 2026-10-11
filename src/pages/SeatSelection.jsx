import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { fetchBookedSeats } from '../services/api';

export default function SeatSelection() {
  const navigate = useNavigate();
  const { selectedBus, selectedSeats, toggleSeat, searchParams } = useBooking();

  if (!selectedBus) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>No bus selected</h2>
        <p style={{ margin: '12px 0 20px', color: '#64748b' }}>Please select a bus from the schedules first.</p>
        <button onClick={() => navigate('/buses')} className="btn btn-primary">
          Browse Buses
        </button>
      </div>
    );
  }

  // Generate seats based on bus totalSeats (e.g. 30 or 40)
  const totalSeats = selectedBus.totalSeats || 30;
  
  // Real booked seats from Spring Boot MySQL backend
  const [bookedSeatNumbers, setBookedSeatNumbers] = useState([3, 7, 14, 18, 22]);

  useEffect(() => {
    async function loadBookedSeats() {
      if (selectedBus) {
        try {
          const tripId = selectedBus.tripId || 1;
          const date = searchParams.date || new Date().toISOString().split('T')[0];
          const backendBooked = await fetchBookedSeats(tripId, date);
          if (Array.isArray(backendBooked) && backendBooked.length > 0) {
            setBookedSeatNumbers(backendBooked.map(Number));
          }
        } catch (err) {
          console.warn('Using default seat layout:', err);
        }
      }
    }
    loadBookedSeats();
  }, [selectedBus, searchParams.date]);

  const farePerSeat = selectedBus.fare || 35.0;
  const subtotal = selectedSeats.length * farePerSeat;
  const tax = selectedSeats.length > 0 ? 2.50 : 0.0;
  const total = subtotal + tax;

  return (
    <div className="seat-selection-page">
      {/* Top Header Summary */}
      <div className="search-recap-bar">
        <div className="container recap-content">
          <div className="recap-info">
            <button onClick={() => navigate('/buses')} className="back-btn" title="Back to buses">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2>{selectedBus.operatorName} (#{selectedBus.busNumber})</h2>
              <span className="recap-date">
                {searchParams.from} ➔ {searchParams.to} • {searchParams.date} • {selectedBus.busType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container seat-layout-container">
        {/* Seat Map Column */}
        <div className="seat-map-wrapper">
          <div className="seat-map-card">
            <div className="seat-map-header">
              <h3>Select Your Seats</h3>
              <p>Click on an available seat to reserve. Maximum 6 seats per booking.</p>
            </div>

            {/* Seat Legend */}
            <div className="seat-legend">
              <div className="legend-item">
                <span className="legend-box available"></span>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <span className="legend-box selected"></span>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <span className="legend-box booked"></span>
                <span>Booked</span>
              </div>
            </div>

            {/* Bus Body Layout */}
            <div className="bus-cabin">
              {/* Front Dashboard */}
              <div className="cabin-front">
                <div className="driver-zone">
                  <span className="steering-wheel" title="Driver Cabin">🚌 Front / Driver</span>
                </div>
                <div className="cabin-door">Entry Door</div>
              </div>

              {/* Grid of seats (2x2 layout with aisle) */}
              <div className="cabin-seating-grid">
                {Array.from({ length: Math.ceil(totalSeats / 4) }).map((_, rowIdx) => {
                  const s1 = rowIdx * 4 + 1;
                  const s2 = rowIdx * 4 + 2;
                  const s3 = rowIdx * 4 + 3;
                  const s4 = rowIdx * 4 + 4;

                  return (
                    <div key={rowIdx} className="seat-row">
                      {/* Left Pair */}
                      <div className="seat-pair">
                        {[s1, s2].map(seatNum => {
                          if (seatNum > totalSeats) return null;
                          const isBooked = bookedSeatNumbers.includes(seatNum);
                          const isSelected = selectedSeats.includes(String(seatNum));

                          return (
                            <button
                              key={seatNum}
                              type="button"
                              disabled={isBooked}
                              onClick={() => toggleSeat(String(seatNum))}
                              className={`seat-btn ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                              title={isBooked ? `Seat ${seatNum} is already booked` : `Seat ${seatNum} - $${farePerSeat}`}
                            >
                              <span className="seat-number">{seatNum}</span>
                              {isSelected && <Check size={12} className="seat-check" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Middle Aisle */}
                      <div className="cabin-aisle">
                        <span className="aisle-marker">{rowIdx + 1}</span>
                      </div>

                      {/* Right Pair */}
                      <div className="seat-pair">
                        {[s3, s4].map(seatNum => {
                          if (seatNum > totalSeats) return null;
                          const isBooked = bookedSeatNumbers.includes(seatNum);
                          const isSelected = selectedSeats.includes(String(seatNum));

                          return (
                            <button
                              key={seatNum}
                              type="button"
                              disabled={isBooked}
                              onClick={() => toggleSeat(String(seatNum))}
                              className={`seat-btn ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                              title={isBooked ? `Seat ${seatNum} is already booked` : `Seat ${seatNum} - $${farePerSeat}`}
                            >
                              <span className="seat-number">{seatNum}</span>
                              {isSelected && <Check size={12} className="seat-check" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rear of bus */}
              <div className="cabin-rear">
                <span>Rear of Bus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price & Selection Summary Sidebar */}
        <aside className="seat-summary-sidebar">
          <div className="summary-card">
            <h3>Booking Summary</h3>

            {/* Selected seats display */}
            <div className="summary-block">
              <span className="summary-label">Selected Seats ({selectedSeats.length})</span>
              {selectedSeats.length === 0 ? (
                <p className="no-seats-text">No seats selected yet. Click on the seats to your left.</p>
              ) : (
                <div className="selected-tags-wrap">
                  {selectedSeats.map(s => (
                    <span key={s} className="seat-tag">
                      Seat #{s}
                      <button onClick={() => toggleSeat(s)} title="Remove seat">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Fare Breakdown */}
            <div className="fare-breakdown">
              <div className="breakdown-row">
                <span>Base Fare ({selectedSeats.length} × ${farePerSeat.toFixed(2)})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="breakdown-row">
                <span>Taxes & Service Fee</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="breakdown-divider"></div>
              <div className="breakdown-row total-row">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Continue CTA */}
            <button
              disabled={selectedSeats.length === 0}
              onClick={() => navigate('/passenger-details')}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 20 }}
            >
              Continue to Passenger Details
            </button>

            <div className="security-notice">
              <ShieldCheck size={16} />
              <span>Seats held for 10 minutes upon checkout</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
