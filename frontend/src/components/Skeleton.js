import React from 'react'

const Skeleton = ({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) => {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style
    }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

// card skeleton for bus/route cards
export const CardSkeleton = () => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
    }}>
      <Skeleton height="24px" width="60%" style={{ marginBottom: '12px' }} />
      <Skeleton height="16px" width="40%" style={{ marginBottom: '8px' }} />
      <Skeleton height="16px" width="80%" style={{ marginBottom: '8px' }} />
      <Skeleton height="16px" width="50%" style={{ marginBottom: '16px' }} />
      <Skeleton height="40px" borderRadius="8px" />
    </div>
  )
}

export default Skeleton