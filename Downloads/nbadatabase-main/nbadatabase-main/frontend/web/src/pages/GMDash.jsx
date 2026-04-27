import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const POSITIONS = ['', 'PG', 'SG', 'SF', 'PF', 'C']

const DEFAULT_FILTERS = { position: '', min_PPG: 0, min_RPG: 0, min_APG: 0, min_three_pct: 0, min_fg_pct: 0, min_stl: 0, min_blk: 0 }

export default function GMDash() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [tab, setTab]           = useState('filter')
  const [filters, setFilters]   = useState(DEFAULT_FILTERS)
  const [results, setResults]   = useState([])
  const [shortlist, setShortlist] = useState([])
  const [reports, setReports]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [slLoading, setSlLoading] = useState(true)
  const [msg, setMsg]           = useState(null)
  const [noteModal, setNoteModal] = useState(null)

  useEffect(() => {
    fetch('/api/shortlist', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setShortlist(Array.isArray(d) ? d : []))
      .finally(() => setSlLoading(false))
    fetch('/api/reports', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setReports(Array.isArray(d) ? d : []))
  }, [])

  const flash = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 4000) }

  const runFilter = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    const res  = await fetch(`/api/filter?${params}`, { credentials: 'include' })
    const data = await res.json()
    setResults(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const addToShortlist = async (pid) => {
    const res  = await fetch('/api/shortlist', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prospect_id: pid, internal_notes: '' })
    })
    const data = await res.json()
    if (data.ok) {
      flash('Added to shortlist!')
      const r = await fetch('/api/shortlist', { credentials: 'include' })
      setShortlist(await r.json())
    } else {
      flash(data.message || 'Error', 'error')
    }
  }

  const removeFromShortlist = async (pid) => {
    await fetch(`/api/shortlist/${pid}`, { method: 'DELETE', credentials: 'include' })
    setShortlist(prev => prev.filter(p => (p.prospect_id || p.pid) !== pid))
    flash('Removed from shortlist')
  }

  const onShortlist = (pid) => shortlist.some(s => (s.prospect_id || s.pid) === pid)

  const f = (k, v) => setFilters(prev => ({ ...prev, [k]: v }))

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div style={{ padding: '0 1.5rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>General Manager</div>
          <div style={{ fontWeight: 700 }}>{user?.name || user?.u_fname}</div>
        </div>
        {[
          { id: 'filter',    icon: '🔍', label: 'Filter Prospects' },
          { id: 'shortlist', icon: '⭐', label: `Shortlist (${shortlist.length})` },
          { id: 'reports',   icon: '📋', label: `Reports (${reports.length})` },
        ].map(item => (
          <div key={item.id} className={`dash-nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
            <span className="dash-nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <div className="dash-welcome">Welcome back,</div>
          <div className="dash-title">GM Dashboard</div>
        </div>

        {msg && <div className={`alert alert-${msg.type} mb-2`}>{msg.text}</div>}

        {/* Filter Tab */}
        {tab === 'filter' && (
          <div>
            {/* Filter Panel */}
            <div className="card mb-2">
              <div className="section-title">Filter Prospects</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>Position</label>
                  <select value={filters.position} onChange={e => f('position', e.target.value)}>
                    <option value="">Any</option>
                    {POSITIONS.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {[
                  ['Min PPG', 'min_PPG', 0, 30],
                  ['Min RPG', 'min_RPG', 0, 15],
                  ['Min APG', 'min_APG', 0, 10],
                  ['Min STL', 'min_stl', 0, 3],
                  ['Min BLK', 'min_blk', 0, 3],
                  ['Min FG%', 'min_fg_pct', 0, 0.7],
                  ['Min 3P%', 'min_three_pct', 0, 0.5],
                ].map(([label, key, min, max]) => (
                  <div key={key} className="form-group">
                    <label>{label}</label>
                    <input type="number" min={min} max={max} step={key.includes('pct') ? 0.01 : 0.5}
                      value={filters[key]} onChange={e => f(key, e.target.value)} />
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                <button className="btn btn-primary" onClick={runFilter} disabled={loading}>
                  {loading ? 'Filtering...' : 'Run Filter'}
                </button>
                <button className="btn btn-ghost" onClick={() => { setFilters(DEFAULT_FILTERS); setResults([]) }}>
                  Reset
                </button>
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div>
                <div className="section-title">{results.length} Prospect{results.length !== 1 ? 's' : ''} Found</div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                            <th>Name</th><th>Pos</th><th>College</th>
                            <th>PPG</th><th>RPG</th><th>APG</th>
                            <th>FG%</th><th>3P%</th><th>FT%</th><th>STL</th><th>BLK</th>
                            <th></th>
                          </tr>
                    </thead>
                    <tbody>
                      {results.map(p => {
                        const name = p.name || p.full_name || `${p.p_fname} ${p.p_lname}`
                        const pid  = p.prospect_id
                        return (
                          <tr key={pid}>
                            <td>
                              <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/prospect/${pid}`)}>
                                {name}
                              </button>
                            </td>
                            <td><span className={`pos-badge pos-${p.position}`}>{p.position}</span></td>
                            <td className="text-muted">{p.college}</td>
                            <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{p.PPG}</td>
                            <td>{p.RPG}</td><td>{p.APG}</td>
                            <td>{p.fg_pct ? `${(p.fg_pct*100).toFixed(1)}%` : '—'}</td>
                            <td>{p.three_pt_pct ? `${(p.three_pt_pct*100).toFixed(1)}%` : '—'}</td>
                            <td>{p.ft_pct ? `${(p.ft_pct*100).toFixed(1)}%` : '—'}</td>
                            <td>{p.stl}</td><td>{p.blk}</td>
                            <td>
                              <button
                                className={`btn btn-sm ${onShortlist(pid) ? 'btn-ghost' : 'btn-primary'}`}
                                onClick={() => onShortlist(pid) ? removeFromShortlist(pid) : addToShortlist(pid)}
                              >
                                {onShortlist(pid) ? '★ Listed' : '+ Shortlist'}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shortlist Tab */}
        {tab === 'shortlist' && (
          <div>
            <div className="section-title">My Shortlist</div>
            {slLoading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : shortlist.length === 0 ? (
              <div className="empty-state">
                <h3>No prospects shortlisted</h3>
                <p>Use the filter tab to find and add prospects</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {shortlist.map((p, i) => {
                  const name = p.prospect_name || p.full_name || `${p.p_fname} ${p.p_lname}`
                  const pid  = p.prospect_id || p.pid
                  return (
                    <div key={i} className="card" style={{ padding: '1rem' }}>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`pos-badge pos-${p.position}`}>{p.position}</span>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/prospect/${pid}`)}>
                              {name}
                            </button>
                          </div>
                          <div className="text-sm text-muted">{p.college} · Added {p.date_added}</div>
                          {p.internal_notes && (
                            <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 10px', background: 'var(--bg-elevated)', borderRadius: 4, borderLeft: '2px solid var(--accent)' }}>
                              {p.internal_notes}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', alignItems: 'center', color: 'var(--text-muted)' }}>
                            <span><strong style={{ color: 'var(--accent)' }}>{p.PPG}</strong> PPG</span>
                            <span><strong style={{ color: 'var(--text)' }}>{p.RPG}</strong> RPG</span>
                            <span><strong style={{ color: 'var(--text)' }}>{p.APG}</strong> APG</span>
                          </div>
                          <button className="btn btn-danger btn-sm" onClick={() => removeFromShortlist(pid)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {/* Reports Tab */}
        {tab === 'reports' && (
          <div>
            <div className="section-title">All Scouting Reports ({reports.length})</div>
            {reports.length === 0 ? (
              <div className="empty-state"><h3>No reports yet</h3></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reports.map((r, i) => (
                  <div key={i} className="card" style={{ padding: '1rem' }}>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-1" style={{ flexWrap: 'wrap' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/prospect/${r.prospect_id}`)}>
                            {r.prospect_name}
                          </button>
                          <span className="text-muted text-xs">by <strong>{r.scout_name}</strong></span>
                          <span className="text-muted text-xs">vs {r.game_opponent} · {r.game_date}</span>
                        </div>
                        {r.notes && (
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6 }}>
                            {r.notes}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', textAlign: 'center', flexShrink: 0 }}>
                        {[['OFF', r.scout_orating], ['DEF', r.scout_drating], ['INT', r.scout_intangibles], ['OVR', r.overall_rating]].map(([l, v]) => (
                          <div key={l}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: l === 'OVR' ? 'var(--accent)' : 'var(--text)' }}>{v}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
