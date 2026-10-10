// API client for communicating with the Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Fallback buses in case backend is loading or unavailable
const FALLBACK_BUSES = [
  {
    id: 1,
    busNumber: 'BUS-101',
    operatorName: 'Express Lines Travels',
    busType: 'AC_SEATER',
    totalSeats: 40,
    active: true,
    fare: 35.0,
    departureTime: '08:30 AM',
    arrivalTime: '01:00 PM',
    duration: '4h 30m',
    rating: 4.8
  },
  {
    id: 2,
    busNumber: 'BUS-202',
    operatorName: 'City Rider Travels',
    busType: 'AC_SLEEPER',
    totalSeats: 30,
    active: true,
    fare: 48.0,
    departureTime: '10:00 PM',
    arrivalTime: '06:15 AM',
    duration: '8h 15m',
    rating: 4.9
  },
  {
    id: 3,
    busNumber: 'BUS-303',
    operatorName: 'Royal Voyager',
    busType: 'NON_AC_SEATER',
    totalSeats: 44,
    active: true,
    fare: 24.0,
    departureTime: '06:00 AM',
    arrivalTime: '11:30 AM',
    duration: '5h 30m',
    rating: 4.5
  },
  {
    id: 4,
    busNumber: 'BUS-404',
    operatorName: 'Highway Star Cruiser',
    busType: 'AC_SLEEPER',
    totalSeats: 28,
    active: true,
    fare: 52.0,
    departureTime: '11:15 PM',
    arrivalTime: '07:00 AM',
    duration: '7h 45m',
    rating: 4.7
  }
];

export async function fetchBuses() {
  try {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/api/bus`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    } catch (directErr) {
      // If direct call encounters CORS or network error, fallback to proxied relative route
      response = await fetch('/api/bus', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    }

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Normalize data: ensure each bus has fare and timing properties
    if (Array.isArray(data) && data.length > 0) {
      return data.map((bus, idx) => ({
        ...bus,
        fare: bus.fare || (bus.busType?.includes('SLEEPER') ? 48.0 : 35.0) + (idx * 3),
        departureTime: bus.departureTime || (idx % 2 === 0 ? '08:30 AM' : '10:15 PM'),
        arrivalTime: bus.arrivalTime || (idx % 2 === 0 ? '01:00 PM' : '06:30 AM'),
        duration: bus.duration || (idx % 2 === 0 ? '4h 30m' : '8h 15m'),
        rating: bus.rating || 4.7
      }));
    }

    return data;
  } catch (err) {
    console.warn('Backend API request failed, using cached/fallback bus data:', err.message);
    // If backend isn't responding, return fallback so frontend remains fully interactive
    return FALLBACK_BUSES;
  }
}

// LocalStorage helpers for bookings persistence
export const bookingStorage = {
  getStoredBookings() {
    try {
      const data = localStorage.getItem('busgo_bookings');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBooking(booking) {
    const list = this.getStoredBookings();
    list.unshift(booking);
    localStorage.setItem('busgo_bookings', JSON.stringify(list));
    return booking;
  },

  cancelBooking(bookingId) {
    const list = this.getStoredBookings();
    const updated = list.map(b => b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b);
    localStorage.setItem('busgo_bookings', JSON.stringify(updated));
    return updated;
  }
};
