import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

export default function FanDash() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [prospects, setProspects] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [posFilter, setPosFilter] = useState('')
  const [search,    setSearch]    = useState('')
  const [sortDir,   setSortDir]   = useState('asc')

  useEffect(() => {
    fetch('/api/prospects', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setProspects(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = prospects
    .filter(p => {
      const name = (p.name || p.full_name || p.prospect_name || `${p.p_fname} ${p.p_lname}`).toLowerCase()
      const matchQ = !search || name.includes(search.toLowerCase()) || (p.college || '').toLowerCase().includes(search.toLowerCase())
      const matchP = !posFilter || p.position === posFilter
      return matchQ && matchP
    })
    .sort((a, b) => {
      const pickA = a.draft_pick_no ?? 9999
      const pickB = b.draft_pick_no ?? 9999
      if (sortDir === 'asc') return pickA - pickB
      return pickB - pickA
    })

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div style={{ padding: '0 1.5rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Fan</div>
          <div style={{ fontWeight: 700 }}>{user?.name || user?.u_fname}</div>
        </div>
        <div className="dash-nav-item active">
          <span className="dash-nav-icon">📊</span>
          Draft Board
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <div className="dash-welcome">Welcome back,</div>
          <div className="dash-title">2026 Draft Board</div>
        </div>

        {/* Filters */}
        <div className="filter-bar" style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search by name or college..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 260 }}
          />
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)}>
            <option value="">All Positions</option>
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {(search || posFilter) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setPosFilter('') }}>Clear</button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
            Draft Pick {sortDir === 'asc' ? '↑' : '↓'}
          </button>
          <span className="filter-count">{filtered.length} prospect{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><h3>No prospects found</h3><p>Try adjusting your filters</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filtered.map((p) => {
              const name = p.name || p.full_name || p.prospect_name || `${p.p_fname} ${p.p_lname}`
              const pid  = p.prospect_id
              const pick = p.draft_pick_no
              const isTop3 = pick != null && pick <= 3
              return (
                <div key={pid} className="card" style={{ padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                  onClick={() => navigate(`/prospect/${pid}`)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {/* Real draft pick number — never changes with sort */}
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: isTop3 ? 'var(--accent)' : 'var(--text-dim)', width: 32, textAlign: 'center', flexShrink: 0 }}>
                    {pick ?? '—'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`pos-badge pos-${p.position}`}>{p.position}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{name}</span>
                    </div>
                    <div className="text-sm text-muted">{p.college}</div>
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
      </main>
    </div>
  )
}
