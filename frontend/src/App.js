import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

// pages
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import SearchResults from './pages/SearchResults'
import SeatSelection from './pages/SeatSelection'
import Booking from './pages/Booking'
import BookingHistory from './pages/BookingHistory'
import BookingDetails from './pages/BookingDetails'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminRoutes from './pages/admin/Routes'
import AdminBuses from './pages/admin/Buses'
import AdminBookings from './pages/admin/Bookings'
import AdminUsers from './pages/admin/Users'

// protected route
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px'
            },
            success: {
              iconTheme: {
                primary: '#16a34a',
                secondary: '#fff'
              }
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#fff'
              }
            }
          }}
        />
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/search" element={<SearchResults />} />

          {/* passenger protected routes */}
          <Route path="/buses/:routeId" element={<PrivateRoute><SeatSelection /></PrivateRoute>} />
          <Route path="/booking/:busId" element={<PrivateRoute><Booking /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
          <Route path="/bookings/:id" element={<PrivateRoute><BookingDetails /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* admin protected routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/routes" element={<AdminRoute><AdminRoutes /></AdminRoute>} />
          <Route path="/admin/buses" element={<AdminRoute><AdminBuses /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App