import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBookings, adminCancelBooking, completeBooking } from '../../utils/api'
import { FaBus, FaRoute, FaTicketAlt, FaUsers, FaChartBar, FaSignOutAlt, FaCheck, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const AdminBookings = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [cancelModal, setCancelModal] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [processing, setProcessing] = useState(false)

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', icon: <FaChartBar size={16} /> },
    { label: 'Routes', path: '/admin/routes', icon: <FaRoute size={16} /> },
    { label: 'Buses', path: '/admin/buses', icon: <FaBus size={16} /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <FaTicketAlt size={16} /> },
    { label: 'Users', path: '/admin/users', icon: <FaUsers size={16} /> }
  ]

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus])

  const fetchBookings = async () => {
    try {
      const params = {}
      if (filterStatus) params.status = filterStatus
      const res = await getAllBookings(params)
      setBookings(res.data.bookings)
      setStats(res.data.stats)
    } catch (err) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this booking as completed?')) return
    try {
      await completeBooking(id)
      toast.success('Booking marked as completed!')
      fetchBookings()
    } catch (err) {
      toast.error('Failed to complete booking')
    }
  }

  const handleAdminCancel = async () => {
    if (!cancelReason) {
      toast.error('Please provide a reason for cancellation')
      return
    }
    setProcessing(true)
    try {
      await adminCancelBooking(cancelModal, { reason: cancelReason })
      toast.success('Booking cancelled and passenger notified!')
      setCancelModal(null)
      setCancelReason('')
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#dcfce7', color: '#16a34a' }
      case 'completed': return { bg: '#eff6ff', color: '#1d4ed8' }
      case 'cancelled': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#f1f5f9', color: '#64748b' }
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

      {/* sidebar */}
      <div style={{
        width: '240px', background: '#0f172a',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              borderRadius: '10px', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FaBus color="#fff" size={16} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>InterstateGo</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {sidebarLinks.map(link => (
            <button key={link.path} onClick={() => navigate(link.path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '10px',
              background: window.location.pathname === link.path ? 'rgba(29,78,216,0.2)' : 'transparent',
              color: window.location.pathname === link.path ? '#3b82f6' : '#94a3b8',
              fontSize: '14px', fontWeight: '600', marginBottom: '4px', textAlign: 'left',
              border: window.location.pathname === link.path ? '1px solid rgba(29,78,216,0.3)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {link.icon}{link.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid #1e293b' }}>
          <button onClick={() => { logout(); navigate('/') }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', borderRadius: '8px', background: 'transparent',
            color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            border: '1px solid rgba(239,68,68,0.2)'
          }}>
            <FaSignOutAlt size={14} />Logout
          </button>
        </div>
      </div>

      {/* cancel modal */}
      {cancelModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '420px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Cancel Booking
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              Please provide a reason for cancelling this booking. The passenger will be notified and given a full refund.
            </p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="e.g Route temporarily suspended due to road repairs"
              rows={4}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a',
                resize: 'none', marginBottom: '20px'
              }}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => { setCancelModal(null); setCancelReason('') }} style={{
                padding: '12px', background: '#f1f5f9', color: '#475569',
                borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
              }}>
                Go Back
              </button>
              <button onClick={handleAdminCancel} disabled={processing} style={{
                padding: '12px',
                background: processing ? '#fca5a5' : '#dc2626',
                color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                cursor: processing ? 'not-allowed' : 'pointer'
              }}>
                {processing ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* main content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>

        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '24px',
          flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
              Bookings Management
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {bookings.length} bookings found
            </p>
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: '8px',
              border: '2px solid #e2e8f0', fontSize: '14px',
              color: '#0f172a', background: '#fff'
            }}
          >
            <option value="">All Bookings</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* stats */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px', marginBottom: '24px'
          }}>
            {[
              { label: 'Total Bookings', value: stats.totalBookings, color: '#1d4ed8', bg: '#eff6ff' },
              { label: 'Total Revenue', value: `₦${stats.totalRevenue?.toLocaleString()}`, color: '#16a34a', bg: '#dcfce7' },
              { label: 'Cancellations', value: stats.totalCancellations, color: '#dc2626', bg: '#fee2e2' },
              { label: 'Total Refunds', value: `₦${stats.totalRefunds?.toLocaleString()}`, color: '#d97706', bg: '#fef3c7' }
            ].map((stat, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '12px', padding: '16px',
                border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: stat.color, marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* bookings table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Spinner size="lg" />
          </div>
        ) : (
          <div style={{
            background: '#fff', borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    {['Reference', 'Passenger', 'Route', 'Date', 'Bus', 'Seat', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        fontSize: '12px', fontWeight: '700', color: '#64748b',
                        textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => {
                    const statusColor = getStatusColor(booking.bookingStatus)
                    return (
                      <tr key={booking._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#1d4ed8' }}>
                          {booking.bookingRef}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                            {booking.user?.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {booking.user?.email}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {booking.route?.from} → {booking.route?.to}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {new Date(booking.travelDate).toDateString()}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                          {booking.bus?.busName}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                          {booking.seatNumber}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: '#16a34a' }}>
                          ₦{booking.amountPaid?.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: statusColor.bg, color: statusColor.color,
                            fontSize: '11px', fontWeight: '700',
                            padding: '3px 10px', borderRadius: '50px', textTransform: 'capitalize'
                          }}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {booking.bookingStatus === 'confirmed' && (
                              <>
                                <button onClick={() => handleComplete(booking._id)} style={{
                                  padding: '6px 10px', background: '#dcfce7',
                                  color: '#16a34a', borderRadius: '6px',
                                  fontSize: '12px', cursor: 'pointer', border: 'none'
                                }} title="Mark as completed">
                                  <FaCheck size={12} />
                                </button>
                                <button onClick={() => setCancelModal(booking._id)} style={{
                                  padding: '6px 10px', background: '#fee2e2',
                                  color: '#dc2626', borderRadius: '6px',
                                  fontSize: '12px', cursor: 'pointer', border: 'none'
                                }} title="Cancel booking">
                                  <FaTimes size={12} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBookings