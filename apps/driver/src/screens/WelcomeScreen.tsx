import { useState } from 'react';

interface Props {
  onSignIn: () => void;
}

export function WelcomeScreen({ onSignIn }: Props) {
  const [tab, setTab]         = useState<'signin' | 'signup'>('signin');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [name, setName]       = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSignIn(); }, 600);
  };

  return (
    <div className="dv-screen" style={{ background: '#fff', overflowY: 'auto' }}>
      <div className="dv-auth">
        <div className="logo">
          <img src="/assets/brand/logo-revv.svg" alt="Revv" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-brand-600)', letterSpacing: '-0.02em', display: 'none' }} className="logo-fallback">Revv</div>
        </div>

        <h1>Welcome to Revv</h1>
        <p className="lead">
          Track your car, find honest deals from BC shops near you, and never miss maintenance.
        </p>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'var(--color-neutral-100)', borderRadius: 10, padding: 3, marginBottom: 22, gap: 3 }}>
          {(['signin', 'signup'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontSize: 13.5, fontWeight: 600, transition: 'all .15s',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,.10)' : 'none',
              }}
            >
              {t === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {tab === 'signup' && (
          <div className="dv-field">
            <label>Full name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Chiamaka Mbamalu"
              autoComplete="name"
            />
          </div>
        )}

        <div className="dv-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="dv-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••"
            autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
          />
        </div>

        {tab === 'signin' && (
          <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 14 }}>
            <span style={{ fontSize: 12.5, color: 'var(--color-brand-600)', cursor: 'pointer', fontWeight: 500 }}>
              Forgot password?
            </span>
          </div>
        )}

        <button
          className="dv-btn dv-btn--primary"
          style={{ width: '100%', marginTop: 4 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <><div className="dv-spinner"/>Signing in…</>
            : tab === 'signin' ? 'Sign in' : 'Create account'
          }
        </button>

        <div className="dv-divider" style={{ margin: '20px 0' }}>
          <div className="line"/>
          <span className="text">OR</span>
          <div className="line"/>
        </div>

        <button className="dv-social" disabled style={{ opacity: .55, cursor: 'not-allowed' }}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8.1z"/>
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7a6.6 6.6 0 0 1-9.9-3.5H2.3v2.8A11 11 0 0 0 12 23z"/>
            <path fill="#FBBC04" d="M5.9 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.3a11 11 0 0 0 0 9.8l3.6-2.8z"/>
            <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.7l3.1-3.1A11 11 0 0 0 12 1a11 11 0 0 0-9.8 6L5.9 9.9A6.6 6.6 0 0 1 12 5.4z"/>
          </svg>
          Continue with Google
        </button>

        <button className="dv-social" disabled style={{ marginTop: 8, opacity: .55, cursor: 'not-allowed' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 12.5c0-3 2.4-4.4 2.5-4.5-1.4-2-3.5-2.3-4.3-2.3-1.8-.2-3.5 1.1-4.4 1.1-.9 0-2.3-1-3.8-1-2 0-3.8 1.1-4.8 2.9-2 3.5-.5 8.7 1.5 11.5 1 1.4 2.1 2.9 3.6 2.8 1.5-.1 2-.9 3.7-.9 1.7 0 2.2.9 3.7.9 1.5 0 2.5-1.4 3.4-2.7 1.1-1.6 1.5-3.1 1.5-3.2-.1 0-3-1.1-3-4.6zM14.7 4c.8-1 1.4-2.3 1.2-3.7-1.2.1-2.6.8-3.4 1.7-.7.8-1.4 2.2-1.2 3.5 1.3.1 2.7-.6 3.4-1.5z"/>
          </svg>
          Continue with Apple
        </button>

        <p className="dv-foot">
          {tab === 'signin'
            ? <>New to Revv? <span onClick={() => setTab('signup')}>Create an account</span></>
            : <>Already have an account? <span onClick={() => setTab('signin')}>Sign in</span></>
          }
        </p>
      </div>
    </div>
  );
}
