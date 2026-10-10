import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Calendar, ShieldCheck, CheckCircle2, Bus } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function PassengerDetails() {
  const navigate = useNavigate();
  const { selectedBus, selectedSeats, searchParams, user, confirmBooking } = useBooking();

  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [boardingPoint, setBoardingPoint] = useState('Main Central Bus Terminal');
  const [droppingPoint, setDroppingPoint] = useState('City Center Express Hub');
  const [loading, setLoading] = useState(false);

  if (!selectedBus || selectedSeats.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>No seats selected</h2>
        <p style={{ margin: '12px 0 20px', color: '#64748b' }}>Please select seats before filling passenger details.</p>
        <button onClick={() => navigate('/buses')} className="btn btn-primary">
          Back to Buses
        </button>
      </div>
    );
  }

  const farePerSeat = selectedBus.fare || 35.0;
  const subtotal = selectedSeats.length * farePerSeat;
  const tax = 2.50;
  const total = subtotal + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const passengerInfo = {
      primaryPassenger: { name, age, gender, phone, email },
      boardingPoint,
      droppingPoint
    };

    setTimeout(() => {
      confirmBooking(passengerInfo);
      setLoading(false);
      navigate('/confirmation');
    }, 600);
  };

  return (
    <div className="passenger-details-page">
      <div className="search-recap-bar">
        <div className="container recap-content">
          <div className="recap-info">
            <button onClick={() => navigate('/seats')} className="back-btn" title="Back to seat selection">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2>Passenger & Journey Information</h2>
              <span className="recap-date">
                {selectedBus.operatorName} • Seats: {selectedSeats.join(', ')} • Total: ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container passenger-layout-container">
        {/* Form Column */}
        <div className="passenger-form-wrapper">
          <form onSubmit={handleSubmit} className="passenger-form-card">
            <div className="form-section-title">
              <User size={20} />
              <h3>Primary Passenger Details</h3>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2-sub">
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="110"
                    placeholder="Age"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Phone Number *</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address (For E-Ticket) *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="ticket@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: 24 }}>
              <Bus size={20} />
              <h3>Pickup & Drop-off Points</h3>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Boarding Point in {searchParams.from || 'Origin'} *</label>
                <select value={boardingPoint} onChange={e => setBoardingPoint(e.target.value)}>
                  <option value="Main Central Bus Terminal">Main Central Bus Terminal (08:30 AM)</option>
                  <option value="North Plaza Interchange">North Plaza Interchange (08:50 AM)</option>
                  <option value="Airport Junction Stop">Airport Junction Stop (09:15 AM)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Dropping Point in {searchParams.to || 'Destination'} *</label>
                <select value={droppingPoint} onChange={e => setDroppingPoint(e.target.value)}>
                  <option value="City Center Express Hub">City Center Express Hub (01:00 PM)</option>
                  <option value="Metro Station East">Metro Station East (01:25 PM)</option>
                  <option value="South Highway Toll Gate">South Highway Toll Gate (01:45 PM)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 28, padding: '14px' }}
            >
              {loading ? 'Processing Reservation...' : `Confirm Booking & Pay $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Sidebar Summary */}
        <aside className="passenger-summary-sidebar">
          <div className="summary-card">
            <h3>Trip Overview</h3>

            <div className="trip-overview-item">
              <span className="overview-label">Bus Operator</span>
              <strong>{selectedBus.operatorName} (#{selectedBus.busNumber})</strong>
            </div>

            <div className="trip-overview-item">
              <span className="overview-label">Route</span>
              <strong>{searchParams.from} ➔ {searchParams.to}</strong>
            </div>

            <div className="trip-overview-item">
              <span className="overview-label">Date of Journey</span>
              <strong>{searchParams.date}</strong>
            </div>

            <div className="trip-overview-item">
              <span className="overview-label">Selected Seats</span>
              <div className="selected-tags-wrap" style={{ marginTop: 4 }}>
                {selectedSeats.map(s => (
                  <span key={s} className="seat-tag">Seat #{s}</span>
                ))}
              </div>
            </div>

            <div className="fare-breakdown" style={{ marginTop: 20 }}>
              <div className="breakdown-row">
                <span>Base Fare ({selectedSeats.length} Seats)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="breakdown-row">
                <span>Taxes & Fees</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="breakdown-divider"></div>
              <div className="breakdown-row total-row">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-notice" style={{ marginTop: 20 }}>
              <ShieldCheck size={16} />
              <span>Free cancellation up to 4 hours before departure</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
