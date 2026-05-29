import React from 'react'

const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: '20px',
    md: '36px',
    lg: '52px'
  }

  const colors = {
    blue: '#1d4ed8',
    white: '#ffffff',
    navy: '#0f172a'
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: sizes[size],
        height: sizes[size],
        border: `3px solid ${colors[color]}20`,
        borderTop: `3px solid ${colors[color]}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Spinner