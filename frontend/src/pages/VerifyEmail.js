import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { verifyEmail } from '../utils/api'
import { FaBus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import Spinner from '../components/Spinner'

const VerifyEmail = () => {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyEmail(token)
        setMessage(res.data.message)
        setStatus('success')
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed')
        setStatus('error')
      }
    }
    verify()
  }, [token])

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
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>

        {/* logo */}
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            borderRadius: '12px',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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

        {status === 'loading' && (
          <div>
            <Spinner size="lg" />
            <p style={{
              color: '#64748b',
              fontSize: '16px',
              marginTop: '16px'
            }}>
              Verifying your email address...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{
              background: '#dcfce7',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <FaCheckCircle color="#16a34a" size={40} />
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '12px'
            }}>
              Email Verified!
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '15px',
              marginBottom: '32px'
            }}>
              {message}
            </p>
            <Link to="/login" style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              boxShadow: '0 4px 15px rgba(29,78,216,0.4)'
            }}>
              Login to Your Account
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{
              background: '#fee2e2',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <FaTimesCircle color="#dc2626" size={40} />
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '12px'
            }}>
              Verification Failed
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '15px',
              marginBottom: '32px'
            }}>
              {message}
            </p>
            <Link to="/register" style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              boxShadow: '0 4px 15px rgba(29,78,216,0.4)'
            }}>
              Back to Register
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail