'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'

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
  createdAt: string
}

function formatBytes(bytes: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function DropPage() {
  const params = useParams()
  const token = params.token as string
  const [drop, setDrop] = useState<Drop | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  const fetchDrop = useCallback(() => {
    fetch(`${API_URL}/drops/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setDrop(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load drop details')
        setLoading(false)
      })
  }, [token])

  useEffect(() => {
    fetchDrop()
    // Poll every 5s to detect payment
    const interval = setInterval(fetchDrop, 5000)
    return () => clearInterval(interval)
  }, [fetchDrop])

  // Stop polling once paid
  useEffect(() => {
    if (drop?.paid) return
  }, [drop?.paid])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await fetch(`${API_URL}/drops/${token}/download`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Download failed')
        setDownloading(false)
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = drop?.fileName || 'download'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      setError('Download failed — please try again')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>🔒</div>
          <div>Loading drop…</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ marginBottom: '12px' }}>Drop not found</h2>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
      </main>
    )
  }

  if (!drop) return null

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>

        {drop.paid ? (
          /* ──── UNLOCKED STATE ──── */
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px',
              background: 'rgba(16,185,129,0.15)',
              border: '2px solid rgba(16,185,129,0.5)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 24px', fontSize: '2.5rem'
            }}>
              🔓
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
              Payment confirmed <span style={{ color: 'var(--green)' }}>✓</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
              Your payment for <strong style={{ color: 'var(--text)' }}>"{drop.projectName}"</strong> has been received.
              Your file is ready.
            </p>

            <div className="card" style={{ marginBottom: '32px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '2rem' }}>📁</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>{drop.fileName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {formatBytes(drop.fileSize)}
                  </div>
                </div>
                <div style={{ color: 'var(--green)', fontWeight: 700 }}>{drop.amountDisplay}</div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary"
              style={{ width: '100%', fontSize: '1.05rem', padding: '16px' }}
            >
              {downloading ? 'Downloading…' : '⬇ Download file'}
            </button>

            {error && (
              <div className="error" style={{ marginTop: '12px' }}>{error}</div>
            )}
          </div>
        ) : (
          /* ──── LOCKED STATE ──── */
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px',
              background: 'rgba(148,163,184,0.08)',
              border: '2px solid var(--border)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 24px', fontSize: '2.5rem'
            }}>
              🔒
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
              This file is locked
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
              <strong style={{ color: 'var(--text)' }}>{drop.freelancerEmail}</strong> has completed{' '}
              <strong style={{ color: 'var(--text)' }}>"{drop.projectName}"</strong>.
              Pay to download your file.
            </p>

            <div className="card" style={{ marginBottom: '32px', textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>File</div>
                  <div style={{ fontWeight: 500 }}>{drop.fileName}</div>
                  {drop.fileSize > 0 && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatBytes(drop.fileSize)}</div>
                  )}
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Amount</div>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--green)' }}>{drop.amountDisplay}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>From</div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{drop.freelancerEmail}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Project</div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{drop.projectName}</div>
                </div>
              </div>
            </div>

            {drop.paymentUrl ? (
              <a
                href={drop.paymentUrl}
                className="btn-primary"
                style={{ display: 'block', width: '100%', fontSize: '1.1rem', padding: '16px', textDecoration: 'none' }}
              >
                Pay {drop.amountDisplay} to download →
              </a>
            ) : (
              <div style={{ padding: '16px', background: 'rgba(148,163,184,0.1)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                Payment link unavailable. Contact {drop.freelancerEmail}
              </div>
            )}

            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '16px' }}>
              Secured by Stripe · File unlocks instantly after payment
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="https://lockdrop.co" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
            Powered by <span style={{ color: 'var(--green)', fontWeight: 600 }}>LockDrop</span> · lockdrop.co
          </a>
        </div>
      </div>
    </main>
  )
}
