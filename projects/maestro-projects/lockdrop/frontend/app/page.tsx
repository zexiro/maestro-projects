import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid var(--border)',
        maxWidth: '1100px', margin: '0 auto'
      }}>
        <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--green)' }}>
          LockDrop
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            Blog
          </Link>
          <Link href="/create" className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
            Create a Drop
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: '800px', margin: '0 auto', padding: '80px 40px 60px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(16,185,129,0.15)',
          color: 'var(--green)', borderRadius: '20px', padding: '6px 16px',
          fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px',
          border: '1px solid rgba(16,185,129,0.3)'
        }}>
          Free to use · 2% per transaction
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800,
          lineHeight: 1.15, marginBottom: '24px',
          color: '#F8FAFC'
        }}>
          Get paid before<br />
          <span style={{ color: 'var(--green)' }}>they download.</span>
        </h1>

        <p style={{
          fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7,
          marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px'
        }}>
          Upload your work. Set your price. Client pays to unlock.<br />
          No more chasing invoices.
        </p>

        <Link href="/create" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
          Create your first drop →
        </Link>

        <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.9rem' }}>
          Takes 60 seconds. No account needed.
        </p>
      </section>

      {/* How it works */}
      <section style={{
        maxWidth: '900px', margin: '0 auto', padding: '60px 40px'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 700, marginBottom: '48px' }}>
          How it works
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {[
            { icon: '⬆️', step: '1', title: 'Upload your file', desc: 'Drag & drop your deliverable and set your price. We keep it locked.' },
            { icon: '🔗', step: '2', title: 'Client gets a locked link', desc: 'We email your client a payment link. They can\'t download until they pay.' },
            { icon: '💰', step: '3', title: 'They pay, file unlocks', desc: 'The moment payment clears, they can download instantly. You get notified.' },
          ].map(({ icon, step, title, desc }) => (
            <div key={step} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{icon}</div>
              <div style={{
                display: 'inline-block', background: 'var(--green)', color: '#fff',
                borderRadius: '50%', width: '28px', height: '28px',
                lineHeight: '28px', fontSize: '0.85rem', fontWeight: 700,
                marginBottom: '12px'
              }}>{step}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '1.1rem' }}>{title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem / Solution */}
      <section style={{
        background: 'var(--navy-light)', borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '70px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '20px' }}>
            Tired of "I'll pay after I see it"?
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.05rem' }}>
            57 million freelancers globally deliver work every day and hope their client pays.
            LockDrop flips the leverage. Your file sits locked behind a payment wall.
            Client pays → file unlocks. No chasing. No awkward follow-ups. No escrow drama.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '70px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>Simple pricing</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.05rem' }}>
          Free to use. We take 2% per transaction. No monthly fees. No subscription.
        </p>
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--green)', marginBottom: '8px' }}>
            2%
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>per transaction</div>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', lineHeight: 2 }}>
            {['No monthly fee', 'No account required', 'Unlimited drops', 'Stripe-secured payments', 'Instant file unlock'].map(f => (
              <li key={f}><span style={{ color: 'var(--green)', marginRight: '8px' }}>✓</span>{f}</li>
            ))}
          </ul>
          <div style={{ marginTop: '28px' }}>
            <Link href="/create" className="btn-primary" style={{ width: '100%', display: 'block' }}>
              Get started free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', textAlign: 'center',
        padding: '32px', color: 'var(--text-muted)', fontSize: '0.875rem'
      }}>
        <span style={{ color: 'var(--green)', fontWeight: 700 }}>LockDrop</span>
        {' '}· Secure pay-to-unlock file delivery for freelancers
        <br />
        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Payments secured by Stripe</span>
      </footer>
    </main>
  )
}
