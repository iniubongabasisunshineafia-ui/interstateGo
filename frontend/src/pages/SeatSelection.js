import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getBusesByRoute, getSingleRoute } from '../utils/api'
import { FaBus, FaArrowRight, FaClock, FaSnowflake, FaUsb, FaWifi, FaArrowLeft } from 'react-icons/fa'
import { CardSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

const SeatSelection = () => {
  const { routeId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const date = searchParams.get('date')

  const [route, setRoute] = useState(null)
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBus, setSelectedBus] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routeRes, busesRes] = await Promise.all([
          getSingleRoute(routeId),
          getBusesByRoute(routeId)
        ])
        setRoute(routeRes.data)
        setBuses(busesRes.data)
      } catch (err) {
        toast.error('Failed to load buses')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [routeId])

  const handleSelectBus = (bus) => {
    if (bus.isFull) {
      toast.error('This bus is fully booked')
      return
    }
    setSelectedBus(bus)
    setSelectedSeat(null)
  }

  const handleSelectSeat = (seat) => {
    if (!seat.isAvailable) {
      toast.error('This seat is already taken')
      return
    }
    setSelectedSeat(seat.seatNumber)
  }

  const handleProceed = () => {
    if (!selectedSeat) {
      toast.error('Please select a seat first')
      return
    }
    navigate(`/booking/${selectedBus._id}?seat=${selectedSeat}&date=${date}`)
  }

  // group seats into rows of 2
  const groupSeatsIntoRows = (seats) => {
    const rows = []
    for (let i = 0; i < seats.length; i += 2) {
      rows.push(seats.slice(i, i + 2))
    }
    return rows
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>

        {/* back button */}
        <button
          onClick={() => navigate(-1)}
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
          Back to Search
        </button>

        {/* route header */}
        {route && (
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            color: '#fff'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '800'
                  }}>
                    {route.from}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginTop: '2px'
                  }}>
                    {route.fromTerminal}
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
                    {route.duration}
                  </span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '800'
                  }}>
                    {route.to}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginTop: '2px'
                  }}>
                    {route.toTerminal}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '10px',
                padding: '10px 16px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#94a3b8',
                  marginBottom: '4px'
                }}>
                  Travel Date
                </div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#fff'
                }}>
                 {date && date !== 'undefined' ? new Date(date).toDateString() : 'Not selected'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedBus ? '1fr 1fr' : '1fr',
          gap: '24px',
          alignItems: 'start'
        }}>

          {/* bus list */}
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '16px'
            }}>
              Available Buses
            </h2>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Array(2).fill(0).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : buses.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <FaBus size={40} color="#cbd5e1" />
                <p style={{
                  color: '#64748b',
                  marginTop: '12px'
                }}>
                  No buses available for this route
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {buses.map(bus => (
                  <div
                    key={bus._id}
                    onClick={() => handleSelectBus(bus)}
                    style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '20px',
                      border: `2px solid ${selectedBus?._id === bus._id
                        ? '#1d4ed8'
                        : bus.isFull
                          ? '#fee2e2'
                          : '#e2e8f0'}`,
                      cursor: bus.isFull ? 'not-allowed' : 'pointer',
                      opacity: bus.isFull ? 0.7 : 1,
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* full badge */}
                    {bus.isFull && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '50px'
                      }}>
                        FULL
                      </div>
                    )}

                    {/* selected indicator */}
                    {selectedBus?._id === bus._id && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '50px'
                      }}>
                        SELECTED
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        background: '#eff6ff',
                        borderRadius: '10px',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaBus color="#1d4ed8" size={20} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#0f172a'
                        }}>
                          {bus.busName}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          Toyota {bus.busType === 'coaster' ? 'Coaster' : 'Hiace'} •{' '}
                          {bus.totalSeats} seats
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#64748b',
                        fontSize: '13px'
                      }}>
                        <FaClock size={12} color="#1d4ed8" />
                        {bus.departureTime}
                      </div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#16a34a'
                      }}>
                        ₦{bus.price?.toLocaleString()}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      {/* amenities */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        {bus.amenities?.ac && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#3b82f6'
                          }}>
                            <FaSnowflake size={12} />
                            AC
                          </div>
                        )}
                        {bus.amenities?.wifi && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#3b82f6'
                          }}>
                            <FaWifi size={12} />
                            WiFi
                          </div>
                        )}
                        {bus.amenities?.usb && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#64748b'
                          }}>
                            <FaUsb size={12} />
                            USB
                          </div>
                        )}
                      </div>

                      {/* seats left */}
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: bus.availableSeats <= 5 ? '#dc2626' : '#16a34a'
                      }}>
                        {bus.isFull
                          ? 'Fully Booked'
                          : bus.urgencyMessage
                            ? bus.urgencyMessage
                            : `${bus.availableSeats} seats available`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* seat map */}
          {selectedBus && (
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              position: 'sticky',
              top: '90px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#0f172a',
                marginBottom: '20px'
              }}>
                Select Your Seat
              </h3>

              {/* seat legend */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                {[
                  { color: '#eff6ff', border: '#bfdbfe', text: 'Available' },
                  { color: '#fee2e2', border: '#fca5a5', text: 'Taken' },
                  { color: '#1d4ed8', border: '#1d4ed8', text: 'Selected' }
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      background: item.color,
                      border: `2px solid ${item.border}`
                    }} />
                    {item.text}
                  </div>
                ))}
              </div>

              {/* bus visual */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0'
              }}>

                {/* driver section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '2px dashed #e2e8f0'
                }}>
                  <div style={{
                    background: '#1e293b',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    🚗 DRIVER
                  </div>
                  <div style={{
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#94a3b8'
                  }}>
                    🚪 DOOR
                  </div>
                </div>

                {/* seats grid */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '380px',
                  overflowY: 'auto'
                }}>
                  {groupSeatsIntoRows(selectedBus.seats).map((row, rowIndex) => (
                    <div key={rowIndex} style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center'
                    }}>
                      {row.map(seat => (
                        <button
                          key={seat._id}
                          onClick={() => handleSelectSeat(seat)}
                          disabled={!seat.isAvailable}
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '8px',
                            border: `2px solid ${selectedSeat === seat.seatNumber
                              ? '#1d4ed8'
                              : seat.isAvailable
                                ? '#bfdbfe'
                                : '#fca5a5'}`,
                            background: selectedSeat === seat.seatNumber
                              ? '#1d4ed8'
                              : seat.isAvailable
                                ? '#eff6ff'
                                : '#fee2e2',
                            color: selectedSeat === seat.seatNumber
                              ? '#fff'
                              : seat.isAvailable
                                ? '#1d4ed8'
                                : '#dc2626',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: seat.isAvailable ? 'pointer' : 'not-allowed',
                            transition: 'all 0.15s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px'
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>💺</span>
                          <span>{seat.seatNumber}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* selected seat info */}
              {selectedSeat && (
                <div style={{
                  background: '#eff6ff',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      Selected Seat
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#1d4ed8'
                    }}>
                      Seat {selectedSeat}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      Price
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#16a34a'
                    }}>
                      ₦{selectedBus.price?.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* proceed button */}
              <button
                onClick={handleProceed}
                disabled={!selectedSeat}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: selectedSeat
                    ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)'
                    : '#e2e8f0',
                  color: selectedSeat ? '#fff' : '#94a3b8',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  marginTop: '16px',
                  cursor: selectedSeat ? 'pointer' : 'not-allowed',
                  boxShadow: selectedSeat
                    ? '0 4px 15px rgba(29,78,216,0.4)'
                    : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {selectedSeat ? 'Proceed to Booking' : 'Select a Seat to Continue'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default SeatSelection