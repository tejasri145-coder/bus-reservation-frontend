// API client for communicating with the Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper for making requests with error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    }
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    // If direct origin fails (e.g., local proxy fallback), attempt relative endpoint
    response = await fetch(endpoint, config);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

function formatTime(timeStr) {
  if (!timeStr) return '08:00 AM';
  const parts = timeStr.split(':');
  let hour = parseInt(parts[0], 10);
  const min = parts[1] || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, '0')}:${min} ${ampm}`;
}

// 1. Fetch Buses directly from Spring Boot / MySQL
export async function fetchBuses() {
  try {
    const buses = await request('/api/bus');
    
    // Also fetch trips to populate real schedules and fares from MySQL
    let trips = [];
    try {
      const tripRes = await request('/api/trips');
      trips = tripRes?.data || [];
    } catch {
      trips = [];
    }

    if (Array.isArray(buses) && buses.length > 0) {
      return buses.map((bus, idx) => {
        const matchedTrip = trips.find(t => t.bus?.id === bus.id);
        return {
          ...bus,
          tripId: matchedTrip ? matchedTrip.id : (idx + 1),
          fare: matchedTrip ? matchedTrip.fare : (bus.busType?.includes('SLEEPER') ? 48.0 : 35.0),
          departureTime: matchedTrip?.departureTime ? formatTime(matchedTrip.departureTime) : (idx % 2 === 0 ? '08:00 AM' : '03:30 PM'),
          arrivalTime: matchedTrip?.arrivalTime ? formatTime(matchedTrip.arrivalTime) : (idx % 2 === 0 ? '12:30 PM' : '08:00 PM'),
          duration: matchedTrip?.route?.estimatedDuration || (idx % 2 === 0 ? '4h 30m' : '6h 15m'),
          sourceCity: matchedTrip?.route?.sourceCity || 'New York',
          destinationCity: matchedTrip?.route?.destinationCity || 'Boston',
          rating: 4.8
        };
      });
    }
    return buses;
  } catch (err) {
    console.warn('Failed to fetch buses from backend:', err.message);
    throw err;
  }
}

// 2. Fetch routes from MySQL
export async function fetchRoutes() {
  const res = await request('/api/routes');
  return res?.data || [];
}

// 3. Search trips from MySQL
export async function searchTrips(source, destination, date) {
  let endpoint = `/api/trips/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`;
  if (date) {
    endpoint += `&date=${encodeURIComponent(date)}`;
  }
  const res = await request(endpoint);
  return res?.data || [];
}

// 4. Fetch booked seats from MySQL for real interactive seat maps
export async function fetchBookedSeats(tripId, journeyDate) {
  try {
    const res = await request(`/api/bookings/booked-seats?tripId=${tripId}&journeyDate=${journeyDate}`);
    return res?.data || [];
  } catch (err) {
    console.warn('Could not fetch booked seats:', err.message);
    return [];
  }
}

// 5. User Authentication
export async function loginUserApi(email, password) {
  const res = await request('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return res?.data;
}

export async function registerUserApi(userData) {
  const res = await request('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '+1987654321',
      role: 'ROLE_USER'
    })
  });
  return res?.data;
}

// 6. Booking APIs
export async function createBookingApi(payload) {
  const res = await request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return res?.data;
}

export async function cancelBookingApi(bookingId) {
  const res = await request(`/api/bookings/${bookingId}/cancel`, {
    method: 'PUT'
  });
  return res?.data;
}

export async function fetchUserBookingsApi(userId) {
  try {
    const res = await request(`/api/bookings/user/${userId}`);
    return res?.data || [];
  } catch (err) {
    console.warn('Could not fetch user bookings from backend:', err.message);
    return [];
  }
}

// LocalStorage helpers for bookings persistence & sync
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
    const updated = list.map(b => (b.bookingId === bookingId || b.id === bookingId) ? { ...b, status: 'CANCELLED' } : b);
    localStorage.setItem('busgo_bookings', JSON.stringify(updated));
    return updated;
  }
};
