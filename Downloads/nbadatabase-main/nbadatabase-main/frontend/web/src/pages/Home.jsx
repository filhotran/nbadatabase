import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

export default function Home() {
  const navigate = useNavigate()
  const [prospects,  setProspects]  = useState([])
  const [archetypes, setArchetypes] = useState([])
  const [query,      setQuery]      = useState('')
  const [position,   setPosition]   = useState('')
  const [archetype,  setArchetype]  = useState('')
  const [sortDir,    setSortDir]    = useState('asc')
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    fetch('/api/archetypes', { credentials: 'include' })
      .then(r => r.json())
      .then(a => setArchetypes(Array.isArray(a) ? a : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (archetype) params.set('archetype', archetype)
    fetch(`/api/prospects?${params}`, { credentials: 'include' })
      .then(r => r.json())
      .then(p => {
        if (p.error) throw new Error(p.error)
        setProspects(Array.isArray(p) ? p : [])
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [archetype])

  const filtered = prospects.filter(p => {
    const name = `${p.name || ''} ${p.p_fname || ''} ${p.p_lname || ''} ${p.full_name || ''}`.toLowerCase()
    const college = (p.college || '').toLowerCase()
    const q = query.toLowerCase()
    const matchQ = !q || name.includes(q) || college.includes(q)
    const matchP = !position || p.position === position
    return matchQ && matchP
  }).sort((a, b) => {
    const pickA = a.draft_pick_no ?? 9999
    const pickB = b.draft_pick_no ?? 9999
    return sortDir === 'asc' ? pickA - pickB : pickB - pickA
  })

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-eyebrow">2026 NBA Draft</div>
        <h1>Draft Class<br /><span>Scouting Hub</span></h1>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">{prospects.length}</span>
            <span>Prospects</span>
          </div>
          <div className="hero-stat" style={{ color: 'var(--text-dim)' }}>·</div>
          <div className="hero-stat">
            <span className="hero-stat-num">{archetypes.length}</span>
            <span>Archetypes</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search prospects or colleges..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <select value={position} onChange={e => setPosition(e.target.value)}>
          <option value="">All Positions</option>
          {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={archetype} onChange={e => setArchetype(e.target.value)}>
          <option value="">All Archetypes</option>
          {archetypes.map(a => (
            <option key={a.archetype_id} value={a.arch_name}>{a.arch_name}</option>
          ))}
        </select>
        {(query || position || archetype) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setQuery(''); setPosition(''); setArchetype('') }}>
            Clear
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
          Draft Pick {sortDir === 'asc' ? '↑' : '↓'}
        </button>
        <span className="filter-count">{filtered.length} prospect{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Content */}
      <div className="page">
        {loading && <div className="loading"><div className="spinner" /> Loading prospects...</div>}

        {error && (
          <div className="alert alert-error">
            <strong>Database offline</strong> — {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state"><h3>No prospects found</h3><p>Try adjusting your filters</p></div>
        )}

        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filtered.map((p) => {
              const name = p.name || p.full_name || `${p.p_fname} ${p.p_lname}`
              const pick = p.draft_pick_no
              const isTop3 = pick != null && pick <= 3
              return (
                <div key={p.prospect_id} className="card"
                  style={{ padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
                  onClick={() => navigate(`/prospect/${p.prospect_id}`)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  {/* Pick number — always shows real pick, never changes */}
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: isTop3 ? 'var(--accent)' : 'var(--text-dim)', width: 32, textAlign: 'center', flexShrink: 0 }}>
                    {pick ?? '—'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span className={`pos-badge pos-${p.position}`}>{p.position}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{name}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.college}</div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: '1.5rem', flexShrink: 0 }}>
                    {[['PPG', p.PPG], ['RPG', p.RPG], ['APG', p.APG]].map(([lbl, val]) => (
                      <div key={lbl} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: lbl === 'PPG' ? 'var(--accent)' : 'var(--text)', lineHeight: 1 }}>
                          {val != null ? parseFloat(val).toFixed(1) : '—'}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
