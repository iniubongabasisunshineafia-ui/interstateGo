import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaBus, FaBars, FaTimes, FaUser, FaSignOutAlt, FaTicketAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <nav style={{
      background: '#fff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>

        {/* logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(29,78,216,0.3)'
          }}>
            <FaBus color="#fff" size={18} />
          </div>
          <div>
            <span style={{
              fontSize: '18px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Interstate
            </span>
            <span style={{
              fontSize: '18px',
              fontWeight: '800',
              color: '#0f172a'
            }}>
              Go
            </span>
          </div>
        </Link>

        {/* desktop nav links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }} className="desktop-nav">
          <Link to="/search" style={{
            padding: '8px 16px',
            borderRadius: '8px',
            color: '#475569',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => {
              e.target.style.background = '#eff6ff'
              e.target.style.color = '#1d4ed8'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent'
              e.target.style.color = '#475569'
            }}
          >
            Find a Bus
          </Link>

          {user ? (
            <>
              <Link to="/bookings" style={{
                padding: '8px 16px',
                borderRadius: '8px',
                color: '#475569',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#eff6ff'
                  e.currentTarget.style.color = '#1d4ed8'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#475569'
                }}
              >
                <FaTicketAlt size={14} />
                My Bookings
              </Link>

              {/* user dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name?.split(' ')[0]}
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8f0',
                    minWidth: '180px',
                    overflow: 'hidden',
                    zIndex: 200
                  }}>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 16px',
                          color: '#475569',
                          fontSize: '14px',
                          borderBottom: '1px solid #f1f5f9'
                        }}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        color: '#475569',
                        fontSize: '14px',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <FaUser size={13} />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        color: '#dc2626',
                        fontSize: '14px',
                        width: '100%',
                        background: 'transparent',
                        textAlign: 'left'
                      }}
                    >
                      <FaSignOutAlt size={13} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" style={{
                padding: '8px 20px',
                borderRadius: '8px',
                color: '#1d4ed8',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid #bfdbfe',
                background: '#eff6ff'
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                padding: '8px 20px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                boxShadow: '0 4px 12px rgba(29,78,216,0.3)'
              }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent',
            color: '#0f172a',
            display: 'none'
          }}
          className="mobile-menu-btn"
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid #e2e8f0',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <Link to="/search" onClick={() => setMenuOpen(false)} style={{
            padding: '12px 16px',
            color: '#475569',
            fontSize: '15px',
            fontWeight: '500',
            borderRadius: '8px'
          }}>
            Find a Bus
          </Link>
          {user ? (
            <>
              <Link to="/bookings" onClick={() => setMenuOpen(false)} style={{
                padding: '12px 16px',
                color: '#475569',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                My Bookings
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={{
                padding: '12px 16px',
                color: '#475569',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                My Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} style={{
                  padding: '12px 16px',
                  color: '#475569',
                  fontSize: '15px',
                  fontWeight: '500'
                }}>
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} style={{
                padding: '12px 16px',
                color: '#dc2626',
                fontSize: '15px',
                fontWeight: '500',
                background: 'transparent',
                textAlign: 'left'
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{
                padding: '12px 16px',
                color: '#1d4ed8',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                padding: '12px 16px',
                color: '#1d4ed8',
                fontSize: '15px',
                fontWeight: '600'
              }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

export default Navbar