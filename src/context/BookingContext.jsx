import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookingStorage } from '../services/api';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // Search parameters
  const [searchParams, setSearchParams] = useState({
    from: 'New York',
    to: 'Boston',
    date: new Date().toISOString().split('T')[0]
  });

  // Active booking flow state
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);

  // Stored bookings
  const [myBookings, setMyBookings] = useState([]);

  // Mock authenticated user state
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    isLoggedIn: false
  });

  // Load existing bookings on mount
  useEffect(() => {
    setMyBookings(bookingStorage.getStoredBookings());
  }, []);

  // Seat toggle function
  const toggleSeat = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      }
      if (prev.length >= 6) {
        alert('You can select a maximum of 6 seats per booking.');
        return prev;
      }
      return [...prev, seatNumber].sort();
    });
  };

  const clearSelectedSeats = () => setSelectedSeats([]);

  // Finalize booking
  const confirmBooking = (passengerInfo) => {
    const bookingId = 'BR-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const fare = selectedBus?.fare || 35.0;
    const subtotal = fare * selectedSeats.length;
    const tax = selectedSeats.length > 0 ? 2.50 : 0.0;
    const totalAmount = subtotal + tax;

    const newBooking = {
      bookingId,
      bus: selectedBus,
      seats: selectedSeats,
      passengers: passengerInfo,
      searchParams: { ...searchParams },
      bookingDate: new Date().toISOString(),
      totalAmount: totalAmount,
      status: 'CONFIRMED'
    };

    bookingStorage.saveBooking(newBooking);
    setMyBookings(prev => [newBooking, ...prev]);
    setCurrentBooking(newBooking);
    return newBooking;
  };

  // Cancel booking
  const cancelBooking = (bookingId) => {
    const updated = bookingStorage.cancelBooking(bookingId);
    setMyBookings(updated);
    if (currentBooking?.bookingId === bookingId) {
      setCurrentBooking(prev => ({ ...prev, status: 'CANCELLED' }));
    }
  };

  const loginUser = (name, email) => {
    setUser({
      name: name || 'Demo Passenger',
      email: email || 'passenger@example.com',
      phone: '+1 234 567 8900',
      isLoggedIn: true
    });
  };

  const logoutUser = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        setSearchParams,
        selectedBus,
        setSelectedBus,
        selectedSeats,
        toggleSeat,
        clearSelectedSeats,
        passengers,
        setPassengers,
        currentBooking,
        setCurrentBooking,
        myBookings,
        confirmBooking,
        cancelBooking,
        user,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
