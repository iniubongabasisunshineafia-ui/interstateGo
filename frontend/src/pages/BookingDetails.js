import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSingleBooking, cancelBooking } from '../utils/api'
import { FaBus, FaArrowRight, FaCalendarAlt, FaChair, FaClock, FaSnowflake, FaUsb, FaWifi, FaArrowLeft, FaTimesCircle } from 'react-icons/fa'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const BookingDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getSingleBooking(id)
        setBooking(res.data)
      } catch (err) {
        toast.error('Failed to load booking details')
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [id])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await cancelBooking(id)
      toast.success('Booking cancelled successfully')
      navigate('/bookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed')
    } finally {
      setCancelling(false)
      setShowCancelModal(false)
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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Spinner size="lg" />
      </div>
    </div>
  )

  if (!booking) return null

  const statusColor = getStatusColor(booking.bookingStatus)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      {/* cancel modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              background: '#fee2e2',
              borderRadius: '50%',
              width: '64px',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <FaTimesCircle color="#dc2626" size={30} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#0f172a',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              Cancel Booking?
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '8px'
            }}>
              Are you sure you want to cancel this booking?
            </p>
            <div style={{
              background: '#fef3c7',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px',
              fontSize: '13px',
              color: '#92400e',
              textAlign: 'center'
            }}>
              Full refund if cancelled 24+ hours before departure.
              50% refund if cancelled less than 24 hours before.
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  padding: '12px',
                  background: '#f1f5f9',
                  color: '#475569',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  padding: '12px',
                  background: cancelling ? '#fca5a5' : '#dc2626',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: cancelling ? 'not-allowed' : 'pointer'
                }}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>

        {/* back button */}
        <button
          onClick={() => navigate('/bookings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            background: 'transparent',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '24px'
          }}
        >
          <FaArrowLeft size={14} />
          Back to Bookings
        </button>

        {/* booking card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>

          {/* header */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            padding: '24px 28px',
            color: '#fff'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '4px'
                }}>
                  Booking Reference
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  letterSpacing: '2px',
                  color: '#3b82f6'
                }}>
                  {booking.bookingRef}
                </div>
              </div>
              <div style={{
                background: statusColor.bg,
                color: statusColor.color,
                fontSize: '12px',
                fontWeight: '700',
                padding: '6px 14px',
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
              justifyContent: 'space-between'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '26px',
                  fontWeight: '800'
                }}>
                  {booking.route?.from}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginTop: '2px',
                  maxWidth: '130px'
                }}>
                  {booking.route?.fromTerminal}
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <FaArrowRight color="#3b82f6" size={20} />
                <span style={{
                  fontSize: '11px',
                  color: '#64748b'
                }}>
                  {booking.route?.duration}
                </span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '26px',
                  fontWeight: '800'
                }}>
                  {booking.route?.to}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginTop: '2px',
                  maxWidth: '130px'
                }}>
                  {booking.route?.toTerminal}
                </div>
              </div>
            </div>
          </div>

          {/* details */}
          <div style={{ padding: '28px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {[
                {
                  icon: <FaCalendarAlt size={16} color="#1d4ed8" />,
                  label: 'Travel Date',
                  value: new Date(booking.travelDate).toDateString()
                },
                {
                  icon: <FaClock size={16} color="#1d4ed8" />,
                  label: 'Departure Time',
                  value: booking.departureTime
                },
                {
                  icon: <FaBus size={16} color="#1d4ed8" />,
                  label: 'Bus',
                  value: booking.bus?.busName
                },
                {
                  icon: <FaChair size={16} color="#1d4ed8" />,
                  label: 'Seat Number',
                  value: `Seat ${booking.seatNumber}`
                }
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#f8fafc',
                  borderRadius: '10px',
                  padding: '14px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px'
                  }}>
                    {item.icon}
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: '500'
                    }}>
                      {item.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#0f172a'
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* amenities */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {booking.bus?.amenities?.ac && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#eff6ff',
                  padding: '6px 14px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  color: '#1d4ed8',
                  fontWeight: '600'
                }}>
                  <FaSnowflake size={12} />
                  AC
                </div>
              )}
              {booking.bus?.amenities?.wifi && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#eff6ff',
                  padding: '6px 14px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  color: '#1d4ed8',
                  fontWeight: '600'
                }}>
                  <FaWifi size={12} />
                  WiFi
                </div>
              )}
              {booking.bus?.amenities?.usb && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#eff6ff',
                  padding: '6px 14px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  color: '#1d4ed8',
                  fontWeight: '600'
                }}>
                  <FaUsb size={12} />
                  USB
                </div>
              )}
            </div>

            {/* payment */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: '13px',
                  color: '#64748b',
                  marginBottom: '4px'
                }}>
                  Amount Paid
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#16a34a'
                }}>
                  ₦{booking.amountPaid?.toLocaleString()}
                </div>
              </div>
              <div style={{
                background: '#dcfce7',
                color: '#16a34a',
                fontSize: '12px',
                fontWeight: '700',
                padding: '6px 14px',
                borderRadius: '50px'
              }}>
                {booking.paymentStatus?.toUpperCase()}
              </div>
            </div>

            {/* QR code */}
            {booking.qrCode && (
              <div style={{
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: '#64748b',
                  marginBottom: '12px'
                }}>
                  Show this QR code at the park for verification
                </p>
                <img
                  src={booking.qrCode}
                  alt="Booking QR Code"
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}
                />
              </div>
            )}

            {/* cancel button */}
            {booking.bookingStatus === 'confirmed' && (
              <button
                onClick={() => setShowCancelModal(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#fff',
                  color: '#dc2626',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  border: '2px solid #fee2e2',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.target.style.background = '#fee2e2'
                }}
                onMouseLeave={e => {
                  e.target.style.background = '#fff'
                }}
              >
                Cancel Booking
              </button>
            )}

            {/* refund info */}
            {booking.bookingStatus === 'cancelled' && booking.refundAmount > 0 && (
              <div style={{
                background: '#dcfce7',
                borderRadius: '10px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#16a34a',
                  marginBottom: '4px'
                }}>
                  Refund Amount
                </div>
                <div style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#16a34a'
                }}>
                  ₦{booking.refundAmount?.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetails