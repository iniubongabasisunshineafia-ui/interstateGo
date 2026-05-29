import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAllBookings, getAllRoutes, getAllBuses } from '../../utils/api'
import { FaBus, FaRoute, FaTicketAlt, FaMoneyBillWave, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, routesRes, busesRes] = await Promise.all([
          getAllBookings(),
          getAllRoutes(),
          getAllBuses()
        ])

        setStats({
          ...bookingsRes.data.stats,
          totalRoutes: routesRes.data.length,
          totalBuses: busesRes.data.length
        })

        setRecentBookings(bookingsRes.data.bookings.slice(0, 5))

        // build chart data from bookings
        const monthlyData = {}
        bookingsRes.data.bookings.forEach(booking => {
          const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short' })
          if (!monthlyData[month]) {
            monthlyData[month] = { month, bookings: 0, revenue: 0 }
          }
          monthlyData[month].bookings += 1
          if (booking.paymentStatus === 'paid') {
            monthlyData[month].revenue += booking.amountPaid
          }
        })
        setChartData(Object.values(monthlyData))

      } catch (err) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', icon: <FaChartBar size={16} /> },
    { label: 'Routes', path: '/admin/routes', icon: <FaRoute size={16} /> },
    { label: 'Buses', path: '/admin/buses', icon: <FaBus size={16} /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <FaTicketAlt size={16} /> },
    { label: 'Users', path: '/admin/users', icon: <FaUsers size={16} /> }
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="lg" />
    </div>
  )

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>

      {/* sidebar */}
      <div style={{
        width: '240px',
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100
      }}>

        {/* logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #1e293b'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaBus color="#fff" size={16} />
            </div>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#fff'
              }}>
                InterstateGo
              </div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* nav links */}
        <nav style={{
          flex: 1,
          padding: '16px 12px'
        }}>
          {sidebarLinks.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: window.location.pathname === link.path
                  ? 'rgba(29,78,216,0.2)'
                  : 'transparent',
                color: window.location.pathname === link.path
                  ? '#3b82f6'
                  : '#94a3b8',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '4px',
                textAlign: 'left',
                border: window.location.pathname === link.path
                  ? '1px solid rgba(29,78,216,0.3)'
                  : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                if (window.location.pathname !== link.path) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (window.location.pathname !== link.path) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#94a3b8'
                }
              }}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>

        {/* user info and logout */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid #1e293b'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '800',
              color: '#fff',
              flexShrink: 0
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.name}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#64748b'
              }}>
                Administrator
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'transparent',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              border: '1px solid rgba(239,68,68,0.2)'
            }}
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>
        </div>
      </div>

      {/* main content */}
      <div style={{
        marginLeft: '240px',
        flex: 1,
        padding: '32px'
      }}>

        {/* header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '4px'
          }}>
            Dashboard Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Welcome back, {user?.name?.split(' ')[0]}! Here's what's happening today.
          </p>
        </div>

        {/* stats cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {[
            {
              icon: <FaTicketAlt size={22} color="#1d4ed8" />,
              label: 'Total Bookings',
              value: stats?.totalBookings || 0,
              bg: '#eff6ff',
              change: 'All time'
            },
            {
              icon: <FaMoneyBillWave size={22} color="#16a34a" />,
              label: 'Total Revenue',
              value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`,
              bg: '#dcfce7',
              change: 'All time'
            },
            {
              icon: <FaRoute size={22} color="#d97706" />,
              label: 'Active Routes',
              value: stats?.totalRoutes || 0,
              bg: '#fef3c7',
              change: 'Currently active'
            },
            {
              icon: <FaBus size={22} color="#7c3aed" />,
              label: 'Total Buses',
              value: stats?.totalBuses || 0,
              bg: '#ede9fe',
              change: 'In fleet'
            },
            {
              icon: <FaTicketAlt size={22} color="#dc2626" />,
              label: 'Cancellations',
              value: stats?.totalCancellations || 0,
              bg: '#fee2e2',
              change: 'All time'
            },
            {
              icon: <FaMoneyBillWave size={22} color="#0891b2" />,
              label: 'Total Refunds',
              value: `₦${(stats?.totalRefunds || 0).toLocaleString()}`,
              bg: '#cffafe',
              change: 'All time'
            }
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                background: stat.bg,
                borderRadius: '10px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#0f172a',
                marginBottom: '4px'
              }}>
                {stat.value}
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

        {/* chart and recent bookings */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>

          {/* bookings chart */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '20px'
            }}>
              Bookings Overview
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px'
                    }}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="#1d4ed8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '14px'
              }}>
                No booking data yet
              </div>
            )}
          </div>

          {/* revenue chart */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '20px'
            }}>
              Revenue Overview
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px'
                    }}
                    formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '14px'
              }}>
                No revenue data yet
              </div>
            )}
          </div>
        </div>

        {/* recent bookings */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '800',
              color: '#0f172a'
            }}>
              Recent Bookings
            </h3>
            <button
              onClick={() => navigate('/admin/bookings')}
              style={{
                fontSize: '13px',
                color: '#1d4ed8',
                fontWeight: '600',
                background: 'transparent'
              }}
            >
              View All
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#94a3b8',
              fontSize: '14px'
            }}>
              No bookings yet
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    {['Reference', 'Passenger', 'Route', 'Date', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(booking => (
                    <tr
                      key={booking._id}
                      style={{ borderBottom: '1px solid #f8fafc' }}
                    >
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#1d4ed8'
                      }}>
                        {booking.bookingRef}
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: '#0f172a',
                        fontWeight: '500'
                      }}>
                        {booking.user?.name}
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        {booking.route?.from} → {booking.route?.to}
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        {new Date(booking.travelDate).toDateString()}
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#16a34a'
                      }}>
                        ₦{booking.amountPaid?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          background: booking.bookingStatus === 'confirmed'
                            ? '#dcfce7'
                            : booking.bookingStatus === 'completed'
                              ? '#eff6ff'
                              : '#fee2e2',
                          color: booking.bookingStatus === 'confirmed'
                            ? '#16a34a'
                            : booking.bookingStatus === 'completed'
                              ? '#1d4ed8'
                              : '#dc2626',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '50px',
                          textTransform: 'capitalize'
                        }}>
                          {booking.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* quick actions */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '16px'
          }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '12px'
          }}>
            {[
              { label: 'Manage Routes', path: '/admin/routes', color: '#1d4ed8', bg: '#eff6ff' },
              { label: 'Manage Buses', path: '/admin/buses', color: '#16a34a', bg: '#dcfce7' },
              { label: 'View Bookings', path: '/admin/bookings', color: '#d97706', bg: '#fef3c7' },
              { label: 'Manage Users', path: '/admin/users', color: '#7c3aed', bg: '#ede9fe' }
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                style={{
                  padding: '16px',
                  background: action.bg,
                  color: action.color,
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard