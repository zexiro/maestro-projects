import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LockDrop — Get paid before they download'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F172A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }} />

        {/* Glow blob */}
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
        }} />

        {/* Lock icon (CSS shapes) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
          {/* Shackle */}
          <div style={{
            width: 52,
            height: 32,
            borderTop: '7px solid #10B981',
            borderLeft: '7px solid #10B981',
            borderRight: '7px solid #10B981',
            borderRadius: '26px 26px 0 0',
            marginBottom: -2,
          }} />
          {/* Body */}
          <div style={{
            width: 88,
            height: 64,
            background: '#10B981',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
            {/* Keyhole circle */}
            <div style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#0F172A',
              marginBottom: 4,
            }} />
            {/* Keyhole stem */}
            <div style={{
              width: 8,
              height: 14,
              borderRadius: 4,
              background: '#0F172A',
            }} />
          </div>
        </div>

        {/* Brand name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <span style={{
            color: '#10B981',
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: '-2px',
          }}>
            LockDrop
          </span>
        </div>

        {/* Headline */}
        <div style={{
          color: '#F1F5F9',
          fontSize: 38,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 20,
          letterSpacing: '-0.5px',
        }}>
          Get paid before they download.
        </div>

        {/* Subhead */}
        <div style={{
          color: '#94A3B8',
          fontSize: 24,
          textAlign: 'center',
          maxWidth: 680,
          lineHeight: 1.5,
          marginBottom: 40,
        }}>
          Upload your work. Set your price. Client pays to unlock.
          No more chasing invoices.
        </div>

        {/* Badge */}
        <div style={{
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.35)',
          borderRadius: 24,
          padding: '10px 28px',
          color: '#10B981',
          fontSize: 20,
          fontWeight: 600,
          display: 'flex',
        }}>
          Free to use · 2% per transaction
        </div>

        {/* Bottom URL */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          color: '#475569',
          fontSize: 18,
          display: 'flex',
        }}>
          lockdrop.co
        </div>
      </div>
    ),
    { ...size }
  )
}
