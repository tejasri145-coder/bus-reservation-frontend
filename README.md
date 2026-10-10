# BusGo - Bus Reservation System Frontend

A modern, responsive, and feature-rich bus reservation web application built with **React**, **Vite**, **React Router**, and **Vanilla CSS**.

---

## 🚀 Tech Stack

- **Framework**: React 18
- **Bundler / Dev Server**: Vite 5
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Modern CSS design system with CSS custom properties, glassmorphism, responsive cards, and print styles)
- **Backend API**: Connected to Spring Boot on `http://localhost:8080`

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── BusCard.jsx         # Card displaying bus details, route, fare & action
│   │   ├── Footer.jsx          # Professional footer with highlights & quick links
│   │   ├── LoginModal.jsx      # Modal for signing in / registration
│   │   └── Navbar.jsx          # Responsive navbar with booking counter badge
│   ├── context/
│   │   └── BookingContext.jsx  # Global booking workflow & user state
│   ├── pages/
│   │   ├── Home.jsx            # Hero banner, route search form, popular routes
│   │   ├── BusList.jsx         # Live bus listing (fetched from GET /api/bus) & filters
│   │   ├── SeatSelection.jsx   # Graphic bus seat layout (2x2) with live price calculator
│   │   ├── PassengerDetails.jsx# Passenger details form & trip review
│   │   ├── BookingConfirmation.jsx # Digital boarding pass / printable e-ticket
│   │   └── MyBookings.jsx      # View saved bookings, cancel trips & reprint tickets
│   ├── services/
│   │   └── api.js              # Backend client for GET /api/bus & LocalStorage
│   ├── App.jsx                 # Route configurations
│   ├── index.css               # Global theme tokens, component styles & @media print
│   └── main.jsx                # React root mount
├── .env                        # VITE_API_URL=http://localhost:8080
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ or v20+ installed
- **Spring Boot Backend**: Running on `http://localhost:8080`

### 2. Install Dependencies (Already installed)
```bash
cd frontend
npm install
```

### 3. Start the Development Server
```bash
cd frontend
npm run dev
```
> On Windows PowerShell, if running scripts is disabled by execution policy, run:
> ```powershell
> npm.cmd run dev
> ```

The application will launch on:
**http://localhost:5173**

---

## 🔗 Backend Integration

The frontend connects to the Spring Boot backend using:
- `VITE_API_URL=http://localhost:8080`
- Real-time bus data is fetched from `GET http://localhost:8080/api/bus`.
- If the backend is loading or unavailable, graceful fallbacks ensure the UI remains fully functional.
