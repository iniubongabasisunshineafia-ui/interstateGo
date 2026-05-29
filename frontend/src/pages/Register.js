import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../utils/api'
import { FaBus, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      })
      toast.success('Registration successful! Please check your email to verify your account.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    fontSize: '15px',
    color: '#0f172a',
    transition: 'border-color 0.2s'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1d4ed8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
      }}>

        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              borderRadius: '12px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(29,78,216,0.3)'
            }}>
              <FaBus color="#fff" size={20} />
            </div>
            <span style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#0f172a'
            }}>
              InterstateGo
            </span>
          </Link>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Create your account
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Join thousands of passengers travelling across Nigeria
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>

          {/* full name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g John Doe"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* phone */}
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g 08012345678"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  color: '#94a3b8'
                }}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* confirm password */}
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                style={{
                  ...inputStyle,
                  paddingRight: '48px',
                  borderColor: form.confirmPassword && form.password !== form.confirmPassword
                    ? '#dc2626'
                    : form.confirmPassword && form.password === form.confirmPassword
                      ? '#16a34a'
                      : '#e2e8f0'
                }}
                onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                onBlur={e => {
                  if (form.confirmPassword && form.password !== form.confirmPassword) {
                    e.target.style.borderColor = '#dc2626'
                  } else if (form.confirmPassword) {
                    e.target.style.borderColor = '#16a34a'
                  } else {
                    e.target.style.borderColor = '#e2e8f0'
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  color: '#94a3b8'
                }}
              >
                {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p style={{
                fontSize: '12px',
                color: '#dc2626',
                marginTop: '6px'
              }}>
                Passwords do not match
              </p>
            )}
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              background: loading
                ? '#93c5fd'
                : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(29,78,216,0.4)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* login link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: '#1d4ed8',
            fontWeight: '700'
          }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register