import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getMyBookings } from '../utils/api'
import { FaBus, FaArrowRight, FaTicketAlt, FaCalendarAlt, FaChair } from 'react-icons/fa'
import { CardSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

const BookingHistory = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState({ upcoming: [], completed: [], cancelled: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyBookings()
        setBookings(res.data)
      } catch (err) {
        toast.error('Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', count: bookings.upcoming.length },
    { key: 'completed', label: 'Completed', count: bookings.completed.length },
    { key: 'cancelled', label: 'Cancelled', count: bookings.cancelled.length }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#dcfce7', color: '#16a34a' }
      case 'completed': return { bg: '#eff6ff', color: '#1d4ed8' }
      case 'cancelled': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#f1f5f9', color: '#64748b' }
    }
  }

  const currentBookings = bookings[activeTab]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>

        {/* header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            My Bookings
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            View and manage all your bus bookings
          </p>
        </div>

        {/* tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                background: activeTab === tab.key ? '#fff' : 'transparent',
                color: activeTab === tab.key ? '#1d4ed8' : '#64748b',
                boxShadow: activeTab === tab.key
                  ? '0 1px 3px rgba(0,0,0,0.1)'
                  : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              {tab.label}
              <span style={{
                background: activeTab === tab.key ? '#eff6ff' : '#e2e8f0',
                color: activeTab === tab.key ? '#1d4ed8' : '#94a3b8',
                fontSize: '12px',
                fontWeight: '700',
                padding: '1px 7px',
                borderRadius: '50px'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* bookings list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : currentBookings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <FaTicketAlt size={48} color="#cbd5e1" />
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '16px 0 8px'
            }}>
              No {activeTab} bookings
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '15px',
              marginBottom: '24px'
            }}>
              {activeTab === 'upcoming'
                ? "You don't have any upcoming trips. Book one now!"
                : `No ${activeTab} bookings found`}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => navigate('/search')}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  boxShadow: '0 4px 15px rgba(29,78,216,0.3)'
                }}
              >
                Book a Trip
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentBookings.map(booking => {
              const statusColor = getStatusColor(booking.bookingStatus)
              return (
                <div
                  key={booking._id}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/bookings/${booking._id}`)}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(29,78,216,0.12)'
                    e.currentTarget.style.borderColor = '#bfdbfe'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
                    e.currentTarget.style.borderColor = '#e2e8f0'
                  }}
                >
                  {/* top row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#1d4ed8',
                      letterSpacing: '1px'
                    }}>
                      {booking.bookingRef}
                    </div>
                    <div style={{
                      background: statusColor.bg,
                      color: statusColor.color,
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      textTransform: 'capitalize'
                    }}>
                      {booking.bookingStatus}
                    </div>
                  </div>

                  {/* route */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#0f172a'
                    }}>
                      {booking.route?.from}
                    </div>
                    <FaArrowRight color="#1d4ed8" size={16} />
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#0f172a'
                    }}>
                      {booking.route?.to}
                    </div>
                  </div>

                  {/* details */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                    paddingTop: '16px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#64748b',
                      fontSize: '13px'
                    }}>
                      <FaCalendarAlt size={12} color="#1d4ed8" />
                      {new Date(booking.travelDate).toDateString()}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#64748b',
                      fontSize: '13px'
                    }}>
                      <FaBus size={12} color="#1d4ed8" />
                      {booking.bus?.busName}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#64748b',
                      fontSize: '13px'
                    }}>
                      <FaChair size={12} color="#1d4ed8" />
                      Seat {booking.seatNumber}
                    </div>
                    <div style={{
                      marginLeft: 'auto',
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#16a34a'
                    }}>
                      ₦{booking.amountPaid?.toLocaleString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingHistory