import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SAMPLE_CREDS = [
  { role: 'ADMIN',   email: 'admin@nbascout.com' },
  { role: 'SCOUT',   email: 'scout1@nbascout.com' },
  { role: 'GM',      email: 'gm1@nbascout.com' },
  { role: 'ANALYST', email: 'analyst@nbascout.com' },
  { role: 'FAN',     email: 'fan1@nbascout.com' },
]

const DASH = { SCOUT: '/dashboard/scout', GM: '/dashboard/gm', ANALYST: '/dashboard/analyst', ADMIN: '/dashboard/admin', FAN: '/' }

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res  = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      login(data)
      navigate(DASH[data.role] || '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '1.1rem', fontWeight: 800 }}>
            <div className="navbar-diamond" />
            NBA <span style={{ color: 'var(--accent)' }}>DRAFT</span> SCOUT
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Sign in to access your dashboard
          </p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error mb-2">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@nbascout.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', padding: '10px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Sample credentials */}
        <div className="card mt-2" style={{ padding: '1rem' }}>
          <div className="section-title" style={{ marginBottom: '0.75rem' }}>Sample Credentials</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            All passwords: <code style={{ color: 'var(--accent)' }}>password123</code>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {SAMPLE_CREDS.map(c => (
              <button
                key={c.role}
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', gap: 10 }}
                onClick={() => { setEmail(c.email); setPassword('password123') }}
              >
                <span className="role-badge">{c.role}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{c.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/" className="text-muted text-sm">
            ← Browse as guest
          </Link>
        </div>
      </div>
    </div>
  )
}
