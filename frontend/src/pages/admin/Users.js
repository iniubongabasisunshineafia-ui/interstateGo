import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { FaBus, FaRoute, FaTicketAlt, FaUsers, FaChartBar, FaSignOutAlt, FaSearch } from 'react-icons/fa'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', icon: <FaChartBar size={16} /> },
    { label: 'Routes', path: '/admin/routes', icon: <FaRoute size={16} /> },
    { label: 'Buses', path: '/admin/buses', icon: <FaBus size={16} /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <FaTicketAlt size={16} /> },
    { label: 'Users', path: '/admin/users', icon: <FaUsers size={16} /> }
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/auth/users')
      setUsers(res.data)
    } catch (err) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone?.includes(search)
  )

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

      {/* main content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>

        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '32px',
          flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
              Users Management
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {users.length} registered users
            </p>
          </div>

          {/* search */}
          <div style={{ position: 'relative' }}>
            <FaSearch style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: '#94a3b8'
            }} size={14} />
            <input
              type="text"
              placeholder="Search by name, email or phone"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '10px 14px 10px 36px',
                borderRadius: '8px', border: '2px solid #e2e8f0',
                fontSize: '14px', color: '#0f172a', width: '280px'
              }}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
        </div>

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
                    {['User', 'Email', 'Phone', 'Role', 'Verified', 'Joined'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        fontSize: '12px', fontWeight: '700', color: '#64748b',
                        textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: '800', color: '#fff', flexShrink: 0
                          }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                            {user.name}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                        {user.phone}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: user.role === 'admin' ? '#fee2e2' : '#eff6ff',
                          color: user.role === 'admin' ? '#dc2626' : '#1d4ed8',
                          fontSize: '11px', fontWeight: '700',
                          padding: '3px 10px', borderRadius: '50px',
                          textTransform: 'capitalize'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: user.isVerified ? '#dcfce7' : '#fef3c7',
                          color: user.isVerified ? '#16a34a' : '#d97706',
                          fontSize: '11px', fontWeight: '700',
                          padding: '3px 10px', borderRadius: '50px'
                        }}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                        {new Date(user.createdAt).toDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers