import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAllRoutes } from '../utils/api'
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowRight, FaUsb, FaSnowflake } from 'react-icons/fa'
import { CardSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const date = searchParams.get('date')

  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('default')

  const nigerianCities = [
    'Lagos', 'Abuja', 'Port Harcourt', 'Calabar', 'Uyo',
    'Enugu', 'Ibadan', 'Kano', 'Kaduna', 'Benin City'
  ]

  const [searchForm, setSearchForm] = useState({
    from: from || '',
    to: to || '',
    date: date || ''
  })

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true)
      try {
        const params = {}
        if (from) params.from = from
        if (to) params.to = to
        if (sortBy === 'price_asc') params.sort = 'price_asc'

        const res = await getAllRoutes(params)
        setRoutes(res.data)
      } catch (err) {
        toast.error('Failed to load routes')
      } finally {
        setLoading(false)
      }
    }
    fetchRoutes()
  }, [from, to, sortBy])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchForm.from || !searchForm.to || !searchForm.date) {
      toast.error('Please fill in all fields')
      return
    }
    navigate(`/search?from=${searchForm.from}&to=${searchForm.to}&date=${searchForm.date}`)
  }

  const [showDateModal, setShowDateModal] = useState(false)
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  const [modalDate, setModalDate] = useState('')

  const handleSelectRoute = (routeId) => {
    if (!date) {
      setSelectedRouteId(routeId)
      setShowDateModal(true)
      return
    }
    navigate(`/buses/${routeId}?date=${date}`)
  }

  const handleModalProceed = () => {
    if (!modalDate) {
      toast.error('Please select a date')
      return
    }
    setShowDateModal(false)
    navigate(`/buses/${selectedRouteId}?date=${modalDate}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* date picker modal */}
      {showDateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '380px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#eff6ff', borderRadius: '50%',
              width: '64px', height: '64px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <FaCalendarAlt color="#1d4ed8" size={28} />
            </div>
            <h3 style={{
              fontSize: '20px', fontWeight: '800',
              color: '#0f172a', marginBottom: '8px'
            }}>
              Pick a Travel Date
            </h3>
            <p style={{
              color: '#64748b', fontSize: '14px', marginBottom: '24px'
            }}>
              Please select the date you want to travel before choosing a bus
            </p>
            <input
              type="date"
              value={modalDate}
              onChange={e => setModalDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%', padding: '12px 16px',
                borderRadius: '10px', border: '2px solid #e2e8f0',
                fontSize: '15px', color: '#0f172a',
                marginBottom: '20px'
              }}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setShowDateModal(false)}
                style={{
                  padding: '12px', background: '#f1f5f9',
                  color: '#475569', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleModalProceed}
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  color: '#fff', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(29,78,216,0.3)'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <Navbar />

      {/* search bar */}
      <div style={{
        background: '#0f172a',
        padding: '24px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <form onSubmit={handleSearch} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '12px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#94a3b8',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FaMapMarkerAlt color="#3b82f6" size={10} />
                From
              </label>
              <select
                value={searchForm.from}
                onChange={e => setSearchForm({ ...searchForm, from: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                <option value="">Select city</option>
                {nigerianCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#94a3b8',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FaMapMarkerAlt color="#ef4444" size={10} />
                To
              </label>
              <select
                value={searchForm.to}
                onChange={e => setSearchForm({ ...searchForm, to: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                <option value="">Select city</option>
                {nigerianCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#94a3b8',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FaCalendarAlt color="#3b82f6" size={10} />
                Date
              </label>
              <input
                type="date"
                value={searchForm.date}
                onChange={e => setSearchForm({ ...searchForm, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                whiteSpace: 'nowrap'
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* results */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>

        {/* header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '4px'
            }}>
              {from && to ? `${from} → ${to}` : 'All Routes'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {date ? new Date(date).toDateString() : ''} •{' '}
              {loading ? '...' : `${routes.length} route${routes.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '14px',
              color: '#0f172a',
              background: '#fff',
              fontWeight: '500'
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="price_asc">Sort: Price Low to High</option>
          </select>
        </div>

        {/* route cards */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : routes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <FaBus size={48} color="#cbd5e1" />
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '16px 0 8px'
            }}>
              No routes found
            </h3>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              Try searching for a different route or date
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {routes.map(route => (
              <div
                key={route._id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(29,78,216,0.12)'
                  e.currentTarget.style.borderColor = '#bfdbfe'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>

                  {/* route info */}
                  <div className="route-info" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flex: 1
                  }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div className="city-text" style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        color: '#0f172a'
                      }}>
                        {route.from}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                        marginTop: '2px',
                        maxWidth: '140px'
                      }}>
                        {route.fromTerminal}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      flex: 1
                    }}>
                      <div style={{
                        width: '100%',
                        height: '2px',
                        background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)',
                        borderRadius: '1px',
                        position: 'relative'
                      }}>
                        <FaArrowRight
                          color="#1d4ed8"
                          size={14}
                          style={{
                            position: 'absolute',
                            right: '-7px',
                            top: '-6px'
                          }}
                        />
                      </div>
                      <span style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <FaClock size={10} />
                        {route.duration}
                      </span>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div className="city-text" style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        color: '#0f172a'
                      }}>
                        {route.to}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                        marginTop: '2px',
                        maxWidth: '140px'
                      }}>
                        {route.toTerminal}
                      </div>
                    </div>
                  </div>

                  {/* price and button */}
                  <div className="price-container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '12px'
                  }}>
                    <div>
                      <div className="price-label" style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        textAlign: 'right',
                        marginBottom: '2px'
                      }}>
                        From
                      </div>
                      <div style={{
                        fontSize: '26px',
                        fontWeight: '800',
                        color: '#16a34a'
                      }}>
                        ₦{route.basePrice.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectRoute(route._id)}
                      style={{
                        padding: '10px 24px',
                        background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(29,78,216,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      Select Bus <FaArrowRight size={12} />
                    </button>
                  </div>
                </div>

                {/* route details footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748b',
                    fontSize: '13px'
                  }}>
                    <FaClock size={12} color="#1d4ed8" />
                    Departs: {route.departureTime}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748b',
                    fontSize: '13px'
                  }}>
                    <FaBus size={12} color="#1d4ed8" />
                    {route.distance} km
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginLeft: 'auto'
                  }}>
                    <FaSnowflake size={13} color="#3b82f6" title="AC" />
                    <FaUsb size={13} color="#64748b" title="USB" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          form { grid-template-columns: 1fr !important; }
          .route-info { gap: 10px !important; width: 100%; }
          .city-text { font-size: 16px !important; }
          .price-container {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100%;
            border-top: 1px dashed #e2e8f0;
            padding-top: 16px;
            margin-top: 4px;
          }
          .price-label { text-align: left !important; }
        }
      `}</style>
    </div>
  )
}

export default SearchResults