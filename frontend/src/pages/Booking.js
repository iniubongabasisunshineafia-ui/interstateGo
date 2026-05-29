import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSingleBus, createBooking } from '../utils/api'
import { FaArrowRight, FaCheck, FaLock } from 'react-icons/fa'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const Booking = () => {
  const { busId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const seat = searchParams.get('seat')
  const date = searchParams.get('date')

  const [bus, setBus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [completedBooking, setCompletedBooking] = useState(null)

  const [card, setCard] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: ''
  })

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await getSingleBus(busId)
        setBus(res.data)
      } catch (err) {
        toast.error('Failed to load bus details')
      } finally {
        setLoading(false)
      }
    }
    fetchBus()
  }, [busId])

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(' ') : cleaned
  }

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target
    if (name === 'cardNumber') {
      setCard({ ...card, cardNumber: formatCardNumber(value) })
    } else if (name === 'cardExpiry') {
      setCard({ ...card, cardExpiry: formatExpiry(value) })
    } else if (name === 'cardCVV') {
      setCard({ ...card, cardCVV: value.replace(/\D/g, '').slice(0, 3) })
    } else {
      setCard({ ...card, [name]: value })
    }
  }

  const handlePayment = async () => {
    if (!card.cardName || !card.cardNumber || !card.cardExpiry || !card.cardCVV) {
      toast.error('Please fill in all payment details')
      return
    }

    if (card.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16 digit card number')
      return
    }

    if (card.cardCVV.length !== 3) {
      toast.error('Please enter a valid 3 digit CVV')
      return
    }

    setBookingLoading(true)
    try {
      const res = await createBooking({
        busId,
        seatNumber: seat,
        travelDate: date,
        cardNumber: card.cardNumber.replace(/\s/g, ''),
        cardExpiry: card.cardExpiry,
        cardCVV: card.cardCVV
      })
      setCompletedBooking(res.data)
      setStep(3)
      toast.success('Booking successful!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed, please try again')
    } finally {
      setBookingLoading(false)
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

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>

        {/* steps indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          gap: '0'
        }}>
          {[
            { number: 1, label: 'Review' },
            { number: 2, label: 'Payment' },
            { number: 3, label: 'Confirmed' }
          ].map((s, i) => (
            <React.Fragment key={s.number}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step >= s.number
                    ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)'
                    : '#e2e8f0',
                  color: step >= s.number ? '#fff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: step >= s.number
                    ? '0 4px 12px rgba(29,78,216,0.3)'
                    : 'none',
                  transition: 'all 0.3s'
                }}>
                  {step > s.number ? <FaCheck size={14} /> : s.number}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: step >= s.number ? '#1d4ed8' : '#94a3b8'
                }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: step > s.number
                    ? '#1d4ed8'
                    : '#e2e8f0',
                  margin: '0 8px',
                  marginBottom: '22px',
                  transition: 'background 0.3s'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* step 1 - review booking */}
        {step === 1 && bus && (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '24px'
            }}>
              Review Your Booking
            </h2>

            {/* route summary */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              color: '#fff'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '800'
                  }}>
                    {bus.route?.from}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#94a3b8'
                  }}>
                    {bus.route?.fromTerminal}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FaArrowRight color="#3b82f6" size={18} />
                  <span style={{
                    fontSize: '11px',
                    color: '#64748b'
                  }}>
                    {bus.route?.duration}
                  </span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '800'
                  }}>
                    {bus.route?.to}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#94a3b8'
                  }}>
                    {bus.route?.toTerminal}
                  </div>
                </div>
              </div>
            </div>

            {/* booking details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0'
            }}>
              {[
                { label: 'Travel Date', value: date ? new Date(date).toDateString() : 'N/A' },
                { label: 'Bus', value: `${bus.busName} (Toyota ${bus.busType === 'coaster' ? 'Coaster' : 'Hiace'})` },
                { label: 'Departure Time', value: bus.departureTime },
                { label: 'Seat Number', value: seat },
                {
                  label: 'Amenities', value: [
                    bus.amenities?.ac && 'AC',
                    bus.amenities?.wifi && 'WiFi',
                    bus.amenities?.usb && 'USB'
                  ].filter(Boolean).join(', ')
                }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}

              {/* total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                marginTop: '8px'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0f172a'
                }}>
                  Total Amount
                </span>
                <span style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#16a34a'
                }}>
                  ₦{bus.price?.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(29,78,216,0.4)',
                marginTop: '8px'
              }}
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* step 2 - payment */}
        {step === 2 && (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#0f172a'
              }}>
                Payment Details
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#16a34a',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                <FaLock size={12} />
                Secure Payment
              </div>
            </div>

            {/* amount */}
            <div style={{
              background: '#eff6ff',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Amount to Pay
              </span>
              <span style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1d4ed8'
              }}>
                ₦{bus?.price?.toLocaleString()}
              </span>
            </div>

            {/* fake card form */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>

              {/* card number */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={card.cardNumber}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    letterSpacing: '2px',
                    color: '#0f172a'
                  }}
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* card name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={card.cardName}
                  onChange={handleCardChange}
                  placeholder="Name on card"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '15px',
                    color: '#0f172a'
                  }}
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* expiry and cvv */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={card.cardExpiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#0f172a'
                    }}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cardCVV"
                    value={card.cardCVV}
                    onChange={handleCardChange}
                    placeholder="•••"
                    maxLength={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#0f172a'
                    }}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>
            </div>

            {/* disclaimer */}
            <div style={{
              background: '#fef3c7',
              borderRadius: '8px',
              padding: '12px 16px',
              marginTop: '20px',
              fontSize: '13px',
              color: '#92400e'
            }}>
              ⚠️ This is a simulated payment. No real money will be charged.
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '24px'
            }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '14px',
                  background: '#f1f5f9',
                  color: '#475569',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700'
                }}
              >
                Go Back
              </button>
              <button
                onClick={handlePayment}
                disabled={bookingLoading}
                style={{
                  padding: '14px',
                  background: bookingLoading
                    ? '#93c5fd'
                    : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  boxShadow: bookingLoading
                    ? 'none'
                    : '0 4px 15px rgba(29,78,216,0.4)',
                  cursor: bookingLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {bookingLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FaLock size={13} />
                    Pay ₦{bus?.price?.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* step 3 - confirmation */}
        {step === 3 && completedBooking && (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '40px 32px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#dcfce7',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <FaCheck color="#16a34a" size={36} />
            </div>

            <h2 style={{
              fontSize: '26px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              Booking Confirmed!
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '15px',
              marginBottom: '32px'
            }}>
              Your ticket has been sent to your email. Check your inbox!
            </p>

            {/* booking reference */}
            <div style={{
              background: '#eff6ff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '13px',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                Booking Reference
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1d4ed8',
                letterSpacing: '2px'
              }}>
                {completedBooking.bookingRef}
              </div>
            </div>

            {/* details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              textAlign: 'left',
              marginBottom: '32px'
            }}>
              {[
                { label: 'Route', value: `${bus?.route?.from} → ${bus?.route?.to}` },
                { label: 'Date', value: date ? new Date(date).toDateString() : 'N/A' },
                { label: 'Departure', value: bus?.departureTime },
                { label: 'Seat', value: seat },
                { label: 'Amount Paid', value: `₦${bus?.price?.toLocaleString()}` }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <button
                onClick={() => navigate('/bookings')}
                style={{
                  padding: '14px',
                  background: '#f1f5f9',
                  color: '#475569',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}
              >
                My Bookings
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '14px',
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: '0 4px 15px rgba(29,78,216,0.4)'
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Booking