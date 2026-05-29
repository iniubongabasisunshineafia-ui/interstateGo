import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { getMyProfile, getMyBookings } from '../utils/api'
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaCheck, FaTimes, FaBus, FaTicketAlt, FaMoneyBillWave } from 'react-icons/fa'
import axios from 'axios'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const Profile = () => {
const { updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    completedTrips: 0
  })

  const [form, setForm] = useState({
    name: '',
    phone: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          getMyProfile(),
          getMyBookings()
        ])

        setProfile(profileRes.data)
        setForm({
          name: profileRes.data.name,
          phone: profileRes.data.phone
        })

        const allBookings = [
          ...bookingsRes.data.upcoming,
          ...bookingsRes.data.completed,
          ...bookingsRes.data.cancelled
        ]

        const totalSpent = bookingsRes.data.upcoming.reduce((sum, b) => sum + b.amountPaid, 0) +
          bookingsRes.data.completed.reduce((sum, b) => sum + b.amountPaid, 0)

        setStats({
          totalBookings: allBookings.length,
          totalSpent,
          completedTrips: bookingsRes.data.completed.length
        })

      } catch (err) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      toast.error('Name and phone cannot be empty')
      return
    }
    setSaving(true)
    try {
      const res = await axios.put('/auth/me', form)
      setProfile(res.data)
      updateUser({ name: res.data.name })
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
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
        maxWidth: '720px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>

        {/* profile header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          {/* avatar */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: '800',
            color: '#fff',
            flexShrink: 0,
            boxShadow: '0 8px 25px rgba(29,78,216,0.4)'
          }}>
            {profile?.name?.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '800',
              marginBottom: '4px'
            }}>
              {profile?.name}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#94a3b8',
              marginBottom: '12px'
            }}>
              {profile?.email}
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: profile?.role === 'admin'
                ? 'rgba(220,38,38,0.2)'
                : 'rgba(22,163,74,0.2)',
              color: profile?.role === 'admin' ? '#fca5a5' : '#86efac',
              fontSize: '12px',
              fontWeight: '700',
              padding: '4px 12px',
              borderRadius: '50px',
              textTransform: 'capitalize'
            }}>
              {profile?.role}
            </div>
          </div>
        </div>

        {/* stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            {
              icon: <FaTicketAlt size={20} color="#1d4ed8" />,
              label: 'Total Bookings',
              value: stats.totalBookings
            },
            {
              icon: <FaBus size={20} color="#16a34a" />,
              label: 'Trips Completed',
              value: stats.completedTrips
            },
            {
              icon: <FaMoneyBillWave size={20} color="#d97706" />,
              label: 'Total Spent',
              value: `₦${stats.totalSpent.toLocaleString()}`
            }
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px'
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
                fontSize: '12px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* personal details */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '800',
              color: '#0f172a'
            }}>
              Personal Details
            </h2>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  border: '1px solid #bfdbfe'
                }}
              >
                <FaEdit size={12} />
                Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setEditing(false)
                    setForm({ name: profile.name, phone: profile.phone })
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                >
                  <FaTimes size={12} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: saving ? '#93c5fd' : '#1d4ed8',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  <FaCheck size={12} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>

            {/* name */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                <FaUser size={12} color="#1d4ed8" />
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #1d4ed8',
                    fontSize: '15px',
                    color: '#0f172a'
                  }}
                />
              ) : (
                <div style={{
                  padding: '12px 16px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0'
                }}>
                  {profile?.name}
                </div>
              )}
            </div>

            {/* email */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                <FaEnvelope size={12} color="#1d4ed8" />
                Email Address
              </label>
              <div style={{
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#94a3b8',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                {profile?.email}
                <span style={{
                  fontSize: '11px',
                  background: '#dcfce7',
                  color: '#16a34a',
                  padding: '2px 8px',
                  borderRadius: '50px',
                  fontWeight: '700'
                }}>
                  Verified
                </span>
              </div>
            </div>

            {/* phone */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                <FaPhone size={12} color="#1d4ed8" />
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #1d4ed8',
                    fontSize: '15px',
                    color: '#0f172a'
                  }}
                />
              ) : (
                <div style={{
                  padding: '12px 16px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0'
                }}>
                  {profile?.phone}
                </div>
              )}
            </div>

            {/* member since */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                Member Since
              </label>
              <div style={{
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#0f172a',
                border: '1px solid #e2e8f0'
              }}>
                {new Date(profile?.createdAt).toDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile