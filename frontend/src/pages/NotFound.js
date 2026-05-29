import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBus } from 'react-icons/fa'

const NotFound = () => {
  const navigate = useNavigate()

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
        textAlign: 'center',
        maxWidth: '480px'
      }}>

        {/* animated bus */}
        <div style={{
          fontSize: '80px',
          marginBottom: '8px',
          animation: 'bounce 2s infinite'
        }}>
          🚌
        </div>

        {/* 404 */}
        <div style={{
          fontSize: 'clamp(80px, 15vw, 140px)',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #3b82f6, #93c5fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1',
          marginBottom: '16px'
        }}>
          404
        </div>

        <h2 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '12px'
        }}>
          Looks like this bus took a wrong turn!
        </h2>

        <p style={{
          color: '#94a3b8',
          fontSize: '16px',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on the right route.
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '14px 28px',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              boxShadow: '0 4px 15px rgba(29,78,216,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <FaBus size={16} />
            Go Home
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

export default NotFound