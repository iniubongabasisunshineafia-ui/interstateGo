import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../utils/api'
import { FaBus, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data)
      toast.success(`Welcome back, ${res.data.name.split(' ')[0]}!`)
      if (res.data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed, please try again')
    } finally {
      setLoading(false)
    }
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
        maxWidth: '420px',
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
            Welcome back
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Login to your account to continue
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* email */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                fontSize: '15px',
                color: '#0f172a',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* password */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '15px',
                  color: '#0f172a',
                  transition: 'border-color 0.2s'
                }}
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
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <Link to="/forgot-password" style={{
                fontSize: '13px',
                color: '#1d4ed8',
                fontWeight: '500'
              }}>
                Forgot password?
              </Link>
            </div>
          </div>

          {/* submit button */}
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
              transition: 'all 0.2s',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* register link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#1d4ed8',
            fontWeight: '700'
          }}>
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login