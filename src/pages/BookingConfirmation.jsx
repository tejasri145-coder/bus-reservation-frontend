import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Printer, ArrowRight, Download, Calendar, MapPin, Bus, User, Phone, Mail, Ticket } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { currentBooking } = useBooking();

  if (!currentBooking) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>No booking found</h2>
        <p style={{ margin: '12px 0 20px', color: '#64748b' }}>Please search and select a bus to make a booking.</p>
        <button onClick={() => navigate('/buses')} className="btn btn-primary">
          Browse Buses
        </button>
      </div>
    );
  }

  const { bookingId, bus, seats, passengers, searchParams, bookingDate, totalAmount } = currentBooking;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="confirmation-page">
      <div className="container print-only-container">
        {/* Success Header banner */}
        <div className="confirmation-banner no-print">
          <div className="success-icon-wrap">
            <CheckCircle2 size={40} className="success-check-icon" />
          </div>
          <h1>Booking Confirmed Successfully!</h1>
          <p>
            Your ticket has been booked and confirmed with <strong>{bus?.operatorName}</strong>.
            A copy of this e-ticket has been sent to <strong>{passengers?.primaryPassenger?.email}</strong>.
          </p>
        </div>

        {/* Digital Ticket / Boarding Pass Card */}
        <div className="boarding-pass-card">
          <div className="pass-top-bar">
            <div className="pass-brand">
              <Bus size={24} />
              <span>BusGo Boarding Pass</span>
            </div>
            <div className="pass-booking-ref">
              <span className="ref-label">Booking Reference:</span>
              <span className="ref-code">{bookingId}</span>
            </div>
          </div>

          <div className="pass-body-grid">
            {/* Route & Timing Block */}
            <div className="pass-section route-section">
              <div className="pass-city">
                <span className="city-label">ORIGIN</span>
                <h3>{searchParams?.from || 'Origin'}</h3>
                <span className="sub-point">{passengers?.boardingPoint || 'Central Terminal'}</span>
              </div>

              <div className="pass-trip-arrow">
                <span className="trip-time">{bus?.departureTime || '08:30 AM'}</span>
                <span className="trip-line">➔</span>
                <span className="trip-duration">{bus?.duration || '4h 30m'}</span>
              </div>

              <div className="pass-city right">
                <span className="city-label">DESTINATION</span>
                <h3>{searchParams?.to || 'Destination'}</h3>
                <span className="sub-point">{passengers?.droppingPoint || 'Express Hub'}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="pass-meta-grid">
              <div className="meta-box">
                <span className="meta-label">DATE OF JOURNEY</span>
                <strong>{searchParams?.date}</strong>
              </div>
              <div className="meta-box">
                <span className="meta-label">BUS OPERATOR</span>
                <strong>{bus?.operatorName} (#{bus?.busNumber})</strong>
              </div>
              <div className="meta-box">
                <span className="meta-label">BUS CATEGORY</span>
                <strong>{bus?.busType?.replace(/_/g, ' ')}</strong>
              </div>
              <div className="meta-box highlight">
                <span className="meta-label">SEAT NUMBER(S)</span>
                <strong className="seat-highlight-text">{seats?.join(', ')}</strong>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="pass-passenger-section">
              <div className="meta-box">
                <span className="meta-label">PRIMARY PASSENGER</span>
                <strong>{passengers?.primaryPassenger?.name} ({passengers?.primaryPassenger?.age} yrs, {passengers?.primaryPassenger?.gender})</strong>
              </div>
              <div className="meta-box">
                <span className="meta-label">CONTACT PHONE</span>
                <strong>{passengers?.primaryPassenger?.phone}</strong>
              </div>
              <div className="meta-box">
                <span className="meta-label">REGISTERED EMAIL</span>
                <strong>{passengers?.primaryPassenger?.email}</strong>
              </div>
              <div className="meta-box">
                <span className="meta-label">TOTAL FARE PAID</span>
                <strong className="fare-highlight-text">${totalAmount ? totalAmount.toFixed(2) : '37.50'}</strong>
              </div>
            </div>
          </div>

          {/* Ticket Footer / Stub */}
          <div className="pass-footer-stub">
            <div className="qr-simulation">
              <div className="qr-box">
                <Ticket size={36} color="#4f46e5" />
              </div>
              <div className="qr-text">
                <p>Present this digital boarding pass at the bus terminal during boarding.</p>
                <small>Issued on: {new Date(bookingDate).toLocaleString()}</small>
              </div>
            </div>

            <div className="status-stamp">
              CONFIRMED
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions no-print">
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={18} /> Print / Download Ticket
          </button>
          <button onClick={() => navigate('/my-bookings')} className="btn btn-outline">
            View All My Bookings
          </button>
          <button onClick={() => navigate('/')} className="btn btn-outline">
            Book Another Journey
          </button>
        </div>
      </div>
    </div>
  );
}
