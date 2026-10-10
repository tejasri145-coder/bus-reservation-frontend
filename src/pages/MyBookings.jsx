import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Bus, Trash2, Printer, Search, CheckCircle2, XCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function MyBookings() {
  const navigate = useNavigate();
  const { myBookings, cancelBooking, setCurrentBooking } = useBooking();
  const [filter, setFilter] = useState('ALL');

  const filtered = myBookings.filter(b => {
    if (filter === 'CONFIRMED') return b.status === 'CONFIRMED';
    if (filter === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  const handleViewTicket = (booking) => {
    setCurrentBooking(booking);
    navigate('/confirmation');
  };

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action will release your reserved seats.')) {
      cancelBooking(bookingId);
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="page-header-flex">
          <div>
            <h1>My Bookings</h1>
            <p>View your upcoming trips, download tickets, or manage reservations.</p>
          </div>

          <div className="filter-tabs">
            {['ALL', 'CONFIRMED', 'CANCELLED'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-bookings-card">
            <Ticket size={50} className="empty-icon" />
            <h3>No Bookings Found</h3>
            <p>You do not have any {filter.toLowerCase()} reservations at the moment.</p>
            <button onClick={() => navigate('/buses')} className="btn btn-primary" style={{ marginTop: 16 }}>
              Book a Bus Now
            </button>
          </div>
        ) : (
          <div className="bookings-list-grid">
            {filtered.map(booking => {
              const isCancelled = booking.status === 'CANCELLED';

              return (
                <div key={booking.bookingId} className={`my-booking-card ${isCancelled ? 'cancelled' : ''}`}>
                  <div className="booking-card-header">
                    <div>
                      <span className="booking-ref-label">Booking ID</span>
                      <h3 className="booking-ref-value">{booking.bookingId}</h3>
                    </div>

                    <span className={`badge ${isCancelled ? 'badge-danger' : 'badge-success'}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-card-body">
                    <div className="booking-route-row">
                      <div className="city-info">
                        <span className="city-name">{booking.searchParams?.from}</span>
                        <span className="stop-name">{booking.passengers?.boardingPoint || 'Central Terminal'}</span>
                      </div>
                      <span className="route-arrow-icon">➔</span>
                      <div className="city-info right">
                        <span className="city-name">{booking.searchParams?.to}</span>
                        <span className="stop-name">{booking.passengers?.droppingPoint || 'Express Hub'}</span>
                      </div>
                    </div>

                    <div className="booking-meta-row">
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>Date: <strong>{booking.searchParams?.date}</strong></span>
                      </div>
                      <div className="meta-item">
                        <Bus size={16} />
                        <span>Bus: <strong>{booking.bus?.operatorName} (#{booking.bus?.busNumber})</strong></span>
                      </div>
                      <div className="meta-item">
                        <Ticket size={16} />
                        <span>Seats: <strong>{booking.seats?.join(', ')}</strong></span>
                      </div>
                      <div className="meta-item">
                        <User size={16} />
                        <span>Passenger: <strong>{booking.passengers?.primaryPassenger?.name}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-card-footer">
                    <div className="footer-amount">
                      <span className="amount-label">Paid Amount</span>
                      <span className="amount-value">${booking.totalAmount?.toFixed(2)}</span>
                    </div>

                    <div className="footer-buttons">
                      <button
                        onClick={() => handleViewTicket(booking)}
                        className="btn btn-outline btn-sm"
                      >
                        <Printer size={15} /> View / Print
                      </button>

                      {!isCancelled && (
                        <button
                          onClick={() => handleCancel(booking.bookingId)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 size={15} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
