'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lockdrop-api.up.railway.app'

export default function CreatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    freelancerEmail: '',
    clientEmail: '',
    projectName: '',
    amount: '',
    currency: 'gbp',
  })

  const handleFile = (f: File) => {
    if (f.size > 50 * 1024 * 1024) {
      setError('File too large — maximum 50MB')
      return
    }
    setFile(f)
    setError('')
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!file) return setError('Please upload a file')
    if (!form.freelancerEmail || !form.clientEmail || !form.projectName || !form.amount) {
      return setError('Please fill in all fields')
    }
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount < 1) return setError('Amount must be at least 1.00')

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('freelancerEmail', form.freelancerEmail)
      fd.append('clientEmail', form.clientEmail)
      fd.append('projectName', form.projectName)
      fd.append('amount', form.amount)
      fd.append('currency', form.currency)

      const res = await fetch(`${API_URL}/drops`, { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to create drop')

      router.push(`/sent/${data.token}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const currencySymbols: Record<string, string> = { gbp: '£', usd: '$', eur: '€' }
  const sym = currencySymbols[form.currency] || '£'

  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
      {/* Nav */}
      <nav style={{ maxWidth: '560px', margin: '0 auto 40px', display: 'flex', alignItems: 'center' }}>
        <a href="/" style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
          ← LockDrop
        </a>
      </nav>

      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px' }}>
          Create a drop
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Upload your file, set your price. We'll lock it until your client pays.
        </p>

        <form onSubmit={handleSubmit}>
          {/* File upload */}
          <div className="field">
            <label className="label">Your file</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              style={{
                border: `2px dashed ${dragOver ? 'var(--green)' : file ? 'var(--green)' : 'var(--border)'}`,
                borderRadius: '10px', padding: '32px', textAlign: 'center',
                cursor: 'pointer', transition: 'border-color 0.15s',
                background: dragOver ? 'rgba(16,185,129,0.05)' : 'transparent'
              }}
            >
              {file ? (
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📎</div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{file.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <div style={{ color: 'var(--green)', fontSize: '0.85rem', marginTop: '8px' }}>
                    Click to change
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>☁️</div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Drag & drop or click to upload</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Any file type · Max 50MB
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {/* Project name */}
          <div className="field">
            <label className="label" htmlFor="projectName">Project name</label>
            <input
              id="projectName"
              type="text"
              placeholder="e.g. Logo design, Website copy, Brand pack"
              value={form.projectName}
              onChange={e => setForm(f => ({ ...f, projectName: e.target.value }))}
              required
            />
          </div>

          {/* Amount + currency */}
          <div className="field">
            <label className="label">Amount</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', fontSize: '1rem', pointerEvents: 'none'
                }}>
                  {sym}
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  style={{ paddingLeft: '32px' }}
                  required
                />
              </div>
              <select
                value={form.currency}
                onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                style={{ width: '90px', flex: 'none' }}
              >
                <option value="gbp">GBP</option>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
              </select>
            </div>
          </div>

          {/* Your email */}
          <div className="field">
            <label className="label" htmlFor="freelancerEmail">Your email</label>
            <input
              id="freelancerEmail"
              type="email"
              placeholder="you@example.com"
              value={form.freelancerEmail}
              onChange={e => setForm(f => ({ ...f, freelancerEmail: e.target.value }))}
              required
            />
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
              We'll email you when your client pays.
            </div>
          </div>

          {/* Client email */}
          <div className="field">
            <label className="label" htmlFor="clientEmail">Client's email</label>
            <input
              id="clientEmail"
              type="email"
              placeholder="client@example.com"
              value={form.clientEmail}
              onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
              required
            />
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
              We'll email them a payment link instantly.
            </div>
          </div>

          {error && (
            <div className="error" style={{ marginBottom: '16px', padding: '12px', background: 'rgba(248,113,113,0.1)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.3)' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: '1.05rem' }}>
            {loading ? 'Creating drop…' : `Create drop →`}
          </button>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '16px' }}>
            By creating a drop you agree to our terms. We take 2% when payment is made.
          </p>
        </form>
      </div>
    </main>
  )
}
