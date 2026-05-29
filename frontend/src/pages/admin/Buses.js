import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBuses, getAllRoutes, createBus, updateBus, deleteBus, deactivateBus, resetBusSeats } from '../../utils/api'
import { FaBus, FaRoute, FaTicketAlt, FaUsers, FaChartBar, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaRedo, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const AdminBuses = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [buses, setBuses] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filterRoute, setFilterRoute] = useState('')

  const [form, setForm] = useState({
    busName: '', busNumber: '', busType: 'coaster',
    routeId: '', departureTime: '',
    amenities: { ac: true, wifi: false, usb: false }
  })

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', icon: <FaChartBar size={16} /> },
    { label: 'Routes', path: '/admin/routes', icon: <FaRoute size={16} /> },
    { label: 'Buses', path: '/admin/buses', icon: <FaBus size={16} /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <FaTicketAlt size={16} /> },
    { label: 'Users', path: '/admin/users', icon: <FaUsers size={16} /> }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [busesRes, routesRes] = await Promise.all([
        getAllBuses(),
        getAllRoutes()
      ])
      setBuses(busesRes.data)
      setRoutes(routesRes.data)
    } catch (err) {
      toast.error('Failed to load buses')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (bus = null) => {
    if (bus) {
      setEditingBus(bus)
      setForm({
        busName: bus.busName,
        busNumber: bus.busNumber,
        busType: bus.busType,
        routeId: bus.route?._id || bus.route,
        departureTime: bus.departureTime,
        amenities: bus.amenities
      })
    } else {
      setEditingBus(null)
      setForm({
        busName: '', busNumber: '', busType: 'coaster',
        routeId: '', departureTime: '',
        amenities: { ac: true, wifi: false, usb: false }
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.busName || !form.busNumber || !form.routeId || !form.departureTime) {
      toast.error('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      if (editingBus) {
        await updateBus(editingBus._id, form)
        toast.success('Bus updated successfully!')
      } else {
        await createBus(form)
        toast.success('Bus added successfully!')
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bus')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return
    try {
      await deleteBus(id)
      toast.success('Bus deleted!')
      fetchData()
    } catch (err) {
      toast.error('Failed to delete bus')
    }
  }

  const handleDeactivate = async (id) => {
    try {
      const res = await deactivateBus(id)
      toast.success(res.data.message)
      fetchData()
    } catch (err) {
      toast.error('Failed to update bus status')
    }
  }

  const handleResetSeats = async (id) => {
    if (!window.confirm('Reset all seats on this bus? This marks all seats as available.')) return
    try {
      await resetBusSeats(id)
      toast.success('Seats reset successfully!')
      fetchData()
    } catch (err) {
      toast.error('Failed to reset seats')
    }
  }

  const filteredBuses = filterRoute
    ? buses.filter(b => {
      const routeId = b.route?._id || b.route
      return routeId === filterRoute
    })
    : buses

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '2px solid #e2e8f0', fontSize: '14px', color: '#0f172a'
  }

  const labelStyle = {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#374151', marginBottom: '6px'
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

      {/* modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '520px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>
              {editingBus ? 'Edit Bus' : 'Add New Bus'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Bus Name</label>
                <input style={inputStyle} value={form.busName}
                  onChange={e => setForm({ ...form, busName: e.target.value })}
                  placeholder="e.g InterstateGo Coaster 1"
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Bus Number</label>
                  <input style={inputStyle} value={form.busNumber}
                    onChange={e => setForm({ ...form, busNumber: e.target.value })}
                    placeholder="e.g BUS-029"
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={labelStyle}>Bus Type</label>
                  <select style={inputStyle} value={form.busType}
                    onChange={e => setForm({ ...form, busType: e.target.value })}>
                    <option value="coaster">Toyota Coaster (30 seats)</option>
                    <option value="hiace">Toyota Hiace (16 seats)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Route</label>
                <select style={inputStyle} value={form.routeId}
                  onChange={e => setForm({ ...form, routeId: e.target.value })}>
                  <option value="">Select a route</option>
                  {routes.map(route => (
                    <option key={route._id} value={route._id}>
                      {route.from} → {route.to}
                    </option>
                  ))}
                </select>
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
                <label style={labelStyle}>Amenities</label>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {['ac', 'wifi', 'usb'].map(amenity => (
                    <label key={amenity} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '14px', fontWeight: '600', color: '#374151', cursor: 'pointer'
                    }}>
                      <input type="checkbox"
                        checked={form.amenities[amenity]}
                        onChange={e => setForm({
                          ...form,
                          amenities: { ...form.amenities, [amenity]: e.target.checked }
                        })}
                        style={{ width: '16px', height: '16px' }} />
                      {amenity.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '12px', background: '#f1f5f9', color: '#475569',
                borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{
                padding: '12px',
                background: saving ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}>
                {saving ? 'Saving...' : editingBus ? 'Update Bus' : 'Add Bus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* main content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '32px',
          flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
              Buses Management
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {buses.length} buses in the fleet
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={filterRoute}
              onChange={e => setFilterRoute(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: '8px',
                border: '2px solid #e2e8f0', fontSize: '14px',
                color: '#0f172a', background: '#fff'
              }}
            >
              <option value="">All Routes</option>
              {routes.map(route => (
                <option key={route._id} value={route._id}>
                  {route.from} → {route.to}
                </option>
              ))}
            </select>

            <button onClick={() => handleOpenModal()} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
              boxShadow: '0 4px 12px rgba(29,78,216,0.3)', cursor: 'pointer', border: 'none'
            }}>
              <FaPlus size={13} /> Add Bus
            </button>
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
                    {['Bus', 'Type', 'Route', 'Departure', 'Seats', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        fontSize: '12px', fontWeight: '700', color: '#64748b',
                        textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBuses.map(bus => {
                    const availableSeats = bus.seats?.filter(s => s.isAvailable).length || 0
                    return (
                      <tr key={bus._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                            {bus.busName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {bus.busNumber}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: bus.busType === 'coaster' ? '#eff6ff' : '#f0fdf4',
                            color: bus.busType === 'coaster' ? '#1d4ed8' : '#16a34a',
                            fontSize: '12px', fontWeight: '700',
                            padding: '3px 10px', borderRadius: '50px'
                          }}>
                            {bus.busType === 'coaster' ? 'Coaster' : 'Hiace'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                          {bus.route?.from} → {bus.route?.to}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                          {bus.departureTime}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                            {availableSeats}/{bus.totalSeats}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>available</div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>
                          ₦{bus.price?.toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: bus.isActive ? '#dcfce7' : '#fee2e2',
                            color: bus.isActive ? '#16a34a' : '#dc2626',
                            fontSize: '11px', fontWeight: '700',
                            padding: '3px 10px', borderRadius: '50px'
                          }}>
                            {bus.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleOpenModal(bus)} style={{
                              padding: '6px 10px', background: '#eff6ff',
                              color: '#1d4ed8', borderRadius: '6px',
                              fontSize: '12px', cursor: 'pointer', border: 'none'
                            }}>
                              <FaEdit size={12} />
                            </button>
                            <button onClick={() => handleDeactivate(bus._id)} style={{
                              padding: '6px 10px',
                              background: bus.isActive ? '#fef3c7' : '#dcfce7',
                              color: bus.isActive ? '#d97706' : '#16a34a',
                              borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: 'none'
                            }}>
                              {bus.isActive ? <FaToggleOn size={12} /> : <FaToggleOff size={12} />}
                            </button>
                            <button onClick={() => handleResetSeats(bus._id)} style={{
                              padding: '6px 10px', background: '#f0fdf4',
                              color: '#16a34a', borderRadius: '6px',
                              fontSize: '12px', cursor: 'pointer', border: 'none'
                            }}>
                              <FaRedo size={12} />
                            </button>
                            <button onClick={() => handleDelete(bus._id)} style={{
                              padding: '6px 10px', background: '#fee2e2',
                              color: '#dc2626', borderRadius: '6px',
                              fontSize: '12px', cursor: 'pointer', border: 'none'
                            }}>
                              <FaTrash size={12} />
                            </button>
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

export default AdminBuses