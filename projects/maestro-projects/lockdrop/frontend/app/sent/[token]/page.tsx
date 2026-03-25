'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lockdrop-api.up.railway.app'

interface Drop {
  paid: boolean
  fileName: string
  fileSize: number
  amountDisplay: string
  currency: string
  projectName: string
  paymentUrl: string
  freelancerEmail: string
  clientEmail: string
}

export default function SentPage() {
  const params = useParams()
  const token = params.token as string
  const [drop, setDrop] = useState<Drop | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const dropUrl = typeof window !== 'undefined' ? `${window.location.origin}/drop/${token}` : `https://lockdrop.co/drop/${token}`

  useEffect(() => {
    fetch(`${API_URL}/drops/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setDrop(data)
      })
      .catch(() => setError('Could not load drop details'))
  }, [token])

  const copyLink = () => {
    navigator.clipboard.writeText(dropUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (error) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
          <Link href="/" style={{ color: 'var(--green)', marginTop: '16px', display: 'block' }}>← Home</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
        {/* Success header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px', height: '72px', background: 'rgba(16,185,129,0.15)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', border: '2px solid rgba(16,185,129,0.4)'
          }}>
            <span style={{ fontSize: '2rem' }}>✓</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
            Drop created <span style={{ color: 'var(--green)' }}>✓</span>
          </h1>
          {drop ? (
            <p style={{ color: 'var(--text-muted)' }}>
              We've emailed <strong style={{ color: 'var(--text)' }}>{drop.clientEmail}</strong> their payment link.
              You'll get an email the moment they pay.
            </p>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Loading drop details…</p>
          )}
        </div>

        {drop && (
          <>
            {/* Drop details */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</div>
                  <div style={{ fontWeight: 600 }}>{drop.projectName}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</div>
                  <div style={{ fontWeight: 600, color: 'var(--green)' }}>{drop.amountDisplay}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client</div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{drop.clientEmail}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>File</div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{drop.fileName}</div>
                </div>
              </div>
            </div>

            {/* Share link */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px', fontWeight: 500 }}>
                Drop link (share directly with your client)
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  readOnly
                  value={dropUrl}
                  style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={copyLink}
                />
                <button
                  onClick={copyLink}
                  className="btn-primary"
                  style={{ whiteSpace: 'nowrap', padding: '12px 20px', fontSize: '0.9rem' }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Next steps */}
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '20px', marginBottom: '32px' }}>
              <div style={{ fontWeight: 600, marginBottom: '10px', color: 'var(--green)' }}>What happens next</div>
              <ul style={{ color: 'var(--text-muted)', lineHeight: 2, paddingLeft: '0', listStyle: 'none', fontSize: '0.9rem' }}>
                <li>✉️ {drop.clientEmail} has been emailed a payment link</li>
                <li>🔒 They see the file name but can't download until paid</li>
                <li>💰 When they pay, you get an email immediately</li>
                <li>📥 Their file unlocks for download instantly</li>
              </ul>
            </div>
          </>
        )}

        <div style={{ textAlign: 'center' }}>
          <Link href="/create" style={{ color: 'var(--green)', fontWeight: 600 }}>
            Create another drop →
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <span style={{ color: 'var(--green)', fontWeight: 700 }}>LockDrop</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}> · lockdrop.co</span>
        </div>
      </div>
    </main>
  )
}
