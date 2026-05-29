import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAllRoutes, createRoute, updateRoute, deleteRoute, deactivateRoute } from '../../utils/api'
import { FaBus, FaRoute, FaTicketAlt, FaUsers, FaChartBar, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const AdminRoutes = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    from: '', to: '', fromTerminal: '', toTerminal: '',
    distance: '', duration: '', departureTime: '',
    basePrice: '', isPopular: false
  })

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', icon: <FaChartBar size={16} /> },
    { label: 'Routes', path: '/admin/routes', icon: <FaRoute size={16} /> },
    { label: 'Buses', path: '/admin/buses', icon: <FaBus size={16} /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <FaTicketAlt size={16} /> },
    { label: 'Users', path: '/admin/users', icon: <FaUsers size={16} /> }
  ]

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      const res = await getAllRoutes()
      setRoutes(res.data)
    } catch (err) {
      toast.error('Failed to load routes')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (route = null) => {
    if (route) {
      setEditingRoute(route)
      setForm({
        from: route.from,
        to: route.to,
        fromTerminal: route.fromTerminal,
        toTerminal: route.toTerminal,
        distance: route.distance,
        duration: route.duration,
        departureTime: route.departureTime,
        basePrice: route.basePrice,
        isPopular: route.isPopular
      })
    } else {
      setEditingRoute(null)
      setForm({
        from: '', to: '', fromTerminal: '', toTerminal: '',
        distance: '', duration: '', departureTime: '',
        basePrice: '', isPopular: false
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.from || !form.to || !form.fromTerminal || !form.toTerminal ||
      !form.distance || !form.duration || !form.departureTime || !form.basePrice) {
      toast.error('Please fill in all fields')
      return
    }
    setSaving(true)
    try {
      if (editingRoute) {
        await updateRoute(editingRoute._id, form)
        toast.success('Route updated successfully!')
      } else {
        await createRoute(form)
        toast.success('Route created successfully!')
      }
      setShowModal(false)
      fetchRoutes()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save route')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return
    try {
      await deleteRoute(id)
      toast.success('Route deleted successfully!')
      fetchRoutes()
    } catch (err) {
      toast.error('Failed to delete route')
    }
  }

  const handleDeactivate = async (id) => {
    try {
      const res = await deactivateRoute(id)
      toast.success(res.data.message)
      fetchRoutes()
    } catch (err) {
      toast.error('Failed to update route status')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '14px',
    color: '#0f172a'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

      {/* sidebar */}
      <div style={{
        width: '240px',
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100
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

      {/* modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '560px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>
              {editingRoute ? 'Edit Route' : 'Add New Route'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>From City</label>
                <input style={inputStyle} value={form.from}
                  onChange={e => setForm({ ...form, from: e.target.value })}
                  placeholder="e.g Lagos"
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>To City</label>
                <input style={inputStyle} value={form.to}
                  onChange={e => setForm({ ...form, to: e.target.value })}
                  placeholder="e.g Abuja"
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>From Terminal</label>
                <input style={inputStyle} value={form.fromTerminal}
                  onChange={e => setForm({ ...form, fromTerminal: e.target.value })}
                  placeholder="e.g Jibowu Park, Lagos"
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>To Terminal</label>
                <input style={inputStyle} value={form.toTerminal}
                  onChange={e => setForm({ ...form, toTerminal: e.target.value })}
                  placeholder="e.g Utako Park, Abuja"
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Distance (KM)</label>
                <input style={inputStyle} type="number" value={form.distance}
                  onChange={e => setForm({ ...form, distance: e.target.value })}
                  placeholder="e.g 755"
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Duration</label>
                <input style={inputStyle} value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g 8 hours 30 mins"
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Departure Time</label>
                <input style={inputStyle} value={form.departureTime}
                  onChange={e => setForm({ ...form, departureTime: e.target.value })}
                  placeholder="e.g 7:00 AM"
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Base Price (₦)</label>
                <input style={inputStyle} type="number" value={form.basePrice}
                  onChange={e => setForm({ ...form, basePrice: e.target.value })}
                  placeholder="e.g 12000"
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginTop: '16px', padding: '14px',
              background: '#f8fafc', borderRadius: '10px'
            }}>
              <input type="checkbox" id="isPopular"
                checked={form.isPopular}
                onChange={e => setForm({ ...form, isPopular: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="isPopular" style={{
                fontSize: '14px', fontWeight: '600',
                color: '#374151', cursor: 'pointer'
              }}>
                Mark as Popular Route (shows on homepage)
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '12px', background: '#f1f5f9', color: '#475569',
                borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
              }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{
                padding: '12px',
                background: saving ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}>
                {saving ? 'Saving...' : editingRoute ? 'Update Route' : 'Add Route'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* main content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
              Routes Management
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {routes.length} routes in the system
            </p>
          </div>
          <button onClick={() => handleOpenModal()} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
            boxShadow: '0 4px 12px rgba(29,78,216,0.3)', cursor: 'pointer'
          }}>
            <FaPlus size={13} /> Add Route
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Spinner size="lg" />
          </div>
        ) : (
          <div style={{
            background: '#fff', borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    {['Route', 'Terminals', 'Distance', 'Duration', 'Departure', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        fontSize: '12px', fontWeight: '700', color: '#64748b',
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                        whiteSpace: 'nowrap'
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {routes.map(route => (
                    <tr key={route._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                          {route.from} → {route.to}
                        </div>
                        {route.isPopular && (
                          <span style={{
                            fontSize: '11px', background: '#eff6ff',
                            color: '#1d4ed8', padding: '2px 8px',
                            borderRadius: '50px', fontWeight: '700'
                          }}>
                            ⭐ Popular
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{route.fromTerminal}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{route.toTerminal}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                        {route.distance} km
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                        {route.duration}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                        {route.departureTime}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>
                        ₦{route.basePrice?.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: route.isActive ? '#dcfce7' : '#fee2e2',
                          color: route.isActive ? '#16a34a' : '#dc2626',
                          fontSize: '11px', fontWeight: '700',
                          padding: '3px 10px', borderRadius: '50px'
                        }}>
                          {route.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleOpenModal(route)} style={{
                            padding: '6px 10px', background: '#eff6ff',
                            color: '#1d4ed8', borderRadius: '6px',
                            fontSize: '12px', cursor: 'pointer', border: 'none'
                          }}>
                            <FaEdit size={12} />
                          </button>
                          <button onClick={() => handleDeactivate(route._id)} style={{
                            padding: '6px 10px',
                            background: route.isActive ? '#fef3c7' : '#dcfce7',
                            color: route.isActive ? '#d97706' : '#16a34a',
                            borderRadius: '6px', fontSize: '12px',
                            cursor: 'pointer', border: 'none'
                          }}>
                            {route.isActive ? <FaToggleOn size={12} /> : <FaToggleOff size={12} />}
                          </button>
                          <button onClick={() => handleDelete(route._id)} style={{
                            padding: '6px 10px', background: '#fee2e2',
                            color: '#dc2626', borderRadius: '6px',
                            fontSize: '12px', cursor: 'pointer', border: 'none'
                          }}>
                            <FaTrash size={12} />
                          </button>
                        </div>
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

export default AdminRoutes