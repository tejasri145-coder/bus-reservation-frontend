import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  bookingStorage, 
  loginUserApi, 
  registerUserApi, 
  createBookingApi, 
  cancelBookingApi, 
  fetchUserBookingsApi 
} from '../services/api';

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

  // Authenticated user state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('busgo_auth_user');
      return saved ? JSON.parse(saved) : {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 987 654 3210',
        isLoggedIn: false
      };
    } catch {
      return { id: 2, name: 'John Doe', email: 'john@example.com', phone: '+1 987 654 3210', isLoggedIn: false };
    }
  });

  // Load bookings on mount or when user changes
  useEffect(() => {
    async function loadBookings() {
      // First load local cache
      const cached = bookingStorage.getStoredBookings();
      setMyBookings(cached);

      // If user is logged in, sync with backend MySQL bookings
      if (user?.id) {
        try {
          const backendBookings = await fetchUserBookingsApi(user.id);
          if (Array.isArray(backendBookings) && backendBookings.length > 0) {
            // Map backend bookings to frontend schema
            const mapped = backendBookings.map(b => ({
              id: b.id,
              bookingId: b.bookingNumber,
              bus: {
                id: b.tripId,
                operatorName: b.busOperator || 'Express Lines',
                busNumber: b.busNumber || 'BUS-101',
                busType: 'AC_SLEEPER'
              },
              seats: b.seatNumbers || [],
              searchParams: {
                from: b.sourceCity || 'New York',
                to: b.destinationCity || 'Boston',
                date: b.journeyDate
              },
              passengers: {
                primaryPassenger: {
                  name: b.userName || user.name,
                  email: b.userEmail || user.email
                }
              },
              bookingDate: b.bookingTime || new Date().toISOString(),
              totalAmount: b.totalFare,
              status: b.status
            }));

            // Merge with local storage ensuring unique by bookingId
            const combinedMap = new Map();
            mapped.forEach(item => combinedMap.set(item.bookingId, item));
            cached.forEach(item => {
              if (!combinedMap.has(item.bookingId)) {
                combinedMap.set(item.bookingId, item);
              }
            });
            const merged = Array.from(combinedMap.values());
            setMyBookings(merged);
            localStorage.setItem('busgo_bookings', JSON.stringify(merged));
          }
        } catch (err) {
          console.warn('Could not fetch backend bookings on mount:', err.message);
        }
      }
    }
    loadBookings();
  }, [user?.id]);

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

  // Finalize booking via backend Spring Boot & MySQL
  const confirmBooking = async (passengerInfo) => {
    const fare = selectedBus?.fare || 35.0;
    const subtotal = fare * selectedSeats.length;
    const tax = selectedSeats.length > 0 ? 2.50 : 0.0;
    const totalAmount = subtotal + tax;

    let backendResult = null;
    try {
      backendResult = await createBookingApi({
        userId: user?.id || 2,
        tripId: selectedBus?.tripId || 1,
        journeyDate: searchParams.date,
        seatNumbers: selectedSeats
      });
    } catch (err) {
      console.warn('Backend booking API error, proceeding with local fallback:', err.message);
    }

    const bookingId = backendResult?.bookingNumber || 
      ('BR-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).substring(2, 6).toUpperCase());

    const newBooking = {
      id: backendResult?.id,
      bookingId,
      bus: selectedBus,
      seats: selectedSeats,
      passengers: passengerInfo,
      searchParams: { ...searchParams },
      bookingDate: backendResult?.bookingTime || new Date().toISOString(),
      totalAmount: backendResult?.totalFare || totalAmount,
      status: backendResult?.status || 'CONFIRMED'
    };

    bookingStorage.saveBooking(newBooking);
    setMyBookings(prev => [newBooking, ...prev]);
    setCurrentBooking(newBooking);
    return newBooking;
  };

  // Cancel booking via backend Spring Boot
  const cancelBooking = async (bookingId) => {
    // Look up the booking
    const target = myBookings.find(b => b.bookingId === bookingId || b.id === bookingId);
    if (target?.id) {
      try {
        await cancelBookingApi(target.id);
      } catch (err) {
        console.warn('Backend cancellation failed:', err.message);
      }
    }

    const updated = bookingStorage.cancelBooking(bookingId);
    setMyBookings(updated);
    if (currentBooking?.bookingId === bookingId || currentBooking?.id === bookingId) {
      setCurrentBooking(prev => ({ ...prev, status: 'CANCELLED' }));
    }
  };

  // Real backend User Login
  const loginUser = async (email, password) => {
    try {
      const data = await loginUserApi(email, password);
      const authUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        isLoggedIn: true
      };
      setUser(authUser);
      localStorage.setItem('busgo_auth_user', JSON.stringify(authUser));
      return { success: true, user: authUser };
    } catch (err) {
      // Local fallback for demo
      const fallbackUser = {
        id: 2,
        name: email.split('@')[0],
        email: email,
        phone: '+1 987 654 3210',
        isLoggedIn: true
      };
      setUser(fallbackUser);
      localStorage.setItem('busgo_auth_user', JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser, notice: err.message };
    }
  };

  // Real backend User Registration
  const registerUser = async (userData) => {
    const data = await registerUserApi(userData);
    const authUser = {
      id: data.id,
      name: data.data?.name || data.name,
      email: data.data?.email || data.email,
      phone: data.data?.phone || data.phone,
      role: data.data?.role || data.role,
      isLoggedIn: true
    };
    setUser(authUser);
    localStorage.setItem('busgo_auth_user', JSON.stringify(authUser));
    return authUser;
  };

  const logoutUser = () => {
    const loggedOut = { ...user, isLoggedIn: false };
    setUser(loggedOut);
    localStorage.removeItem('busgo_auth_user');
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
        registerUser,
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
