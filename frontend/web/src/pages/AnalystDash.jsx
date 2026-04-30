import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const POS_ORDER = ['PG', 'SG', 'SF', 'PF', 'C']

function SortableTable({ columns, data, defaultSort, defaultAsc = false }) {
  const [sort, setSort] = useState(defaultSort || columns[0]?.key)
  const [asc,  setAsc]  = useState(defaultAsc)

  const toggle = (key) => { if (sort === key) setAsc(a => !a); else { setSort(key); setAsc(false) } }

  const sorted = [...data].sort((a, b) => {
    let va = a[sort], vb = b[sort]
    if (va == null) return 1
    if (vb == null) return -1
    if (sort === 'position') {
      const ia = POS_ORDER.indexOf(va), ib = POS_ORDER.indexOf(vb)
      return asc ? ia - ib : ib - ia
    }
    const na = parseFloat(va), nb = parseFloat(vb)
    if (!isNaN(na) && !isNaN(nb)) { va = na; vb = nb }
    return asc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
  })

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} onClick={() => toggle(c.key)} style={{ cursor: 'pointer' }}>
                {c.label} {sort === c.key ? (asc ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              {columns.map(c => (
                <td key={c.key} style={c.style || {}}>
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AnalystDash() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab]           = useState('rankings')
  const [rankings, setRankings] = useState([])
  const [reports,  setReports]  = useState([])
  const [stats,    setStats]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [posFilter, setPosFilter] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/rankings', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/reports',  { credentials: 'include' }).then(r => r.json()),
      fetch('/api/stats',    { credentials: 'include' }).then(r => r.json()),
    ]).then(([ra, re, st]) => {
      setRankings(Array.isArray(ra) ? ra : [])
      setReports(Array.isArray(re)  ? re : [])
      setStats(Array.isArray(st)    ? st : [])
    }).finally(() => setLoading(false))
  }, [])

  const pct = v => v != null ? `${(v * 100).toFixed(1)}%` : '—'
  const num = v => v != null ? Number(v).toFixed(1) : '—'

  // merge rankings + stats into one dataset
  const combined = rankings.map(r => {
    const s = stats.find(s => s.prospect_id === r.prospect_id) || {}
    return { ...s, ...r }
  })

  const filteredCombined = posFilter ? combined.filter(p => p.position === posFilter) : combined

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div style={{ padding: '0 1.5rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Analyst</div>
          <div style={{ fontWeight: 700 }}>{user?.name || user?.u_fname}</div>
        </div>
        {[
          { id: 'rankings', icon: '📊', label: 'Draft Rankings' },
          { id: 'reports',  icon: '📋', label: 'All Reports' },
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
          <div className="dash-title">Analyst Dashboard</div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading data...</div>
        ) : (
          <>
            {/* Combined Rankings + Stats Tab */}
            {tab === 'rankings' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="section-title" style={{ margin: 0 }}>2026 Draft Class Rankings & Stats</div>
                  <select value={posFilter} onChange={e => setPosFilter(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '4px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)' }}>
                    <option value="">All Positions</option>
                    {POS_ORDER.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {posFilter && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setPosFilter('')}>Clear</button>
                  )}
                </div>
                <SortableTable
                  defaultSort="avg_scout_rating"
                  columns={[
                    { key: 'p_fname', label: 'Name', render: (v, row) => (
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/prospect/${row.prospect_id}`)}>
                        {row.p_fname || row.name} {row.p_lname || ''}
                      </button>
                    )},
                    { key: 'position', label: 'Pos', render: v => <span className={`pos-badge pos-${v}`}>{v}</span> },
                    { key: 'college', label: 'College' },
                    { key: 'PPG',  label: 'PPG',  render: v => <strong style={{ color: 'var(--accent)' }}>{num(v)}</strong> },
                    { key: 'RPG',  label: 'RPG',  render: num },
                    { key: 'APG',  label: 'APG',  render: num },
                    { key: 'fg_pct',       label: 'FG%', render: pct },
                    { key: 'three_pt_pct', label: '3P%', render: pct },
                    { key: 'ft_pct',       label: 'FT%', render: pct },
                    { key: 'stl', label: 'STL', render: num },
                    { key: 'blk', label: 'BLK', render: num },
                    { key: 'o_rating', label: 'ORtg', render: num },
                    { key: 'd_rating', label: 'DRtg', render: num },
                    { key: 'avg_scout_rating', label: 'Scout Rtg', render: v => v != null
                      ? <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{Number(v).toFixed(1)}/10</span>
                      : <span className="text-muted">—</span>
                    },
                    { key: 'total_reports', label: 'Reports' },
                  ]}
                  data={filteredCombined}
                />
              </div>
            )}

            {/* All Reports */}
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
                              <span className="text-muted text-xs">scouted by <strong>{r.scout_name}</strong></span>
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
          </>
        )}
      </main>
    </div>
  )
}
