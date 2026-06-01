import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getPopularRoutes } from '../utils/api'
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa'
import { CardSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

const Homepage = () => {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [popularRoutes, setPopularRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  const nigerianCities = [
    'Lagos', 'Abuja', 'Port Harcourt', 'Calabar', 'Uyo',
    'Enugu', 'Ibadan', 'Kano', 'Kaduna', 'Benin City'
  ]

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const res = await getPopularRoutes()
        setPopularRoutes(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPopularRoutes()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!from || !to || !date) {
      toast.error('Please fill in all search fields')
      return
    }
    if (from === to) {
      toast.error('Departure and destination cannot be the same')
      return
    }
    navigate(`/search?from=${from}&to=${to}&date=${date}`)
  }

  const handleQuickSearch = (routeFrom, routeTo) => {
    const today = new Date().toISOString().split('T')[0]
    navigate(`/search?from=${routeFrom}&to=${routeTo}&date=${today}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      {/* hero section */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1d4ed8 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* background decorations */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          background: 'rgba(59,130,246,0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '250px',
          height: '250px',
          background: 'rgba(29,78,216,0.15)',
          borderRadius: '50%'
        }} />

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(59,130,246,0.15)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '50px',
            padding: '6px 16px',
            marginBottom: '24px'
          }}>
            <FaBus color="#3b82f6" size={14} />
            <span style={{ color: '#93c5fd', fontSize: '13px', fontWeight: '500' }}>
              Nigeria's #1 Bus Booking Platform
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: '800',
            color: '#fff',
            lineHeight: '1.2',
            marginBottom: '16px'
          }}>
            Travel Across Nigeria
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #3b82f6, #93c5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              With Comfort & Ease
            </span>
          </h1>

          <p style={{
            color: '#94a3b8',
            fontSize: '18px',
            marginBottom: '40px',
            maxWidth: '500px',
            margin: '0 auto 40px'
          }}>
            Book your interstate bus tickets in minutes. Choose your seat, pay securely and travel with confidence.
          </p>

          {/* search form */}
          <form onSubmit={handleSearch} style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '16px',
            alignItems: 'end'
          }}>
            {/* from */}
            <div style={{ textAlign: 'left' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FaMapMarkerAlt color="#1d4ed8" size={11} />
                From
              </label>
              <select
                value={from}
                onChange={e => setFrom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '15px',
                  color: '#0f172a',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select city</option>
                {nigerianCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* to */}
            <div style={{ textAlign: 'left' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FaMapMarkerAlt color="#dc2626" size={11} />
                To
              </label>
              <select
                value={to}
                onChange={e => setTo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '15px',
                  color: '#0f172a',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select city</option>
                {nigerianCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* date */}
            <div style={{ textAlign: 'left' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FaCalendarAlt color="#1d4ed8" size={11} />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '15px',
              color: '#0f172a',
              background: '#fff'
            }}
              />
            </div>

            {/* search button */}
            <button
              type="submit"
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(29,78,216,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              Search <FaArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* stats bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '20px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          textAlign: 'center'
        }}>
          {[
            { number: '14+', label: 'Routes Available' },
            { number: '28+', label: 'Buses Running Daily' },
            { number: '1000+', label: 'Happy Passengers' }
          ].map((stat, i) => (
            <div key={i}>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1d4ed8'
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* popular routes */}
      <div style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Popular Routes
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Most booked routes by our passengers
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {loading ? (
            Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : popularRoutes.length > 0 ? (
            popularRoutes.map(route => (
              <div
                key={route._id}
                onClick={() => handleQuickSearch(route.from, route.to)}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(29,78,216,0.15)'
                  e.currentTarget.style.borderColor = '#bfdbfe'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    background: '#eff6ff',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1d4ed8'
                  }}>
                    ⭐ Popular
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#16a34a'
                  }}>
                    ₦{route.basePrice.toLocaleString()}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#0f172a'
                    }}>
                      {route.from}
                    </div>
                    <div style={{
                      fontSize: '11px',
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
                    <FaArrowRight color="#1d4ed8" size={16} />
                    <span style={{
                      fontSize: '11px',
                      color: '#94a3b8'
                    }}>
                      {route.duration}
                    </span>
                  </div>

                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#0f172a'
                    }}>
                      {route.to}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      marginTop: '2px'
                    }}>
                      {route.toTerminal}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                    <FaClock size={12} />
                    {route.departureTime}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748b',
                    fontSize: '13px'
                  }}>
                    <FaBus size={12} />
                    {route.distance} km
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#64748b', gridColumn: '1/-1' }}>No popular routes yet</p>
          )}
        </div>
      </div>

      {/* why choose us */}
      <div style={{
        background: '#fff',
        padding: '60px 24px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              Why Choose InterstateGo?
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              We make interstate travel simple, safe and comfortable
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                icon: <FaShieldAlt size={28} color="#1d4ed8" />,
                title: 'Safe & Secure',
                desc: 'Your bookings and payments are fully protected'
              },
              {
                icon: <FaClock size={28} color="#1d4ed8" />,
                title: 'Book in Minutes',
                desc: 'Fast and easy booking process from start to finish'
              },
              {
                icon: <FaBus size={28} color="#1d4ed8" />,
                title: 'Choose Your Seat',
                desc: 'Pick exactly where you want to sit on the bus'
              },
              {
                icon: <FaStar size={28} color="#1d4ed8" />,
                title: 'Top Rated Service',
                desc: 'Thousands of happy passengers across Nigeria'
              }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#eff6ff',
                  borderRadius: '16px',
                  width: '70px',
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '8px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  lineHeight: '1.6'
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{
        background: '#0f172a',
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaBus color="#fff" size={14} />
          </div>
          <span style={{
            fontSize: '18px',
            fontWeight: '800',
            color: '#fff'
          }}>
            InterstateGo
          </span>
        </div>
        <p style={{
          color: '#475569',
          fontSize: '14px'
        }}>
          © 2025 InterstateGo. All rights reserved.
        </p>
      </div>

      <style>{`
  @media (max-width: 768px) {
    form {
      grid-template-columns: 1fr !important;
      padding: 16px !important;
    }
    form input, form select, form button {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
  }
`}</style>
      
    </div>
  )
}

export default Homepage