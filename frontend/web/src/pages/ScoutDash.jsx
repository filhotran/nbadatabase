import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const POSITIONS = ['PG','SG','SF','PF','C']
const FLAG_TYPES = ['positive','negative','neutral']

export default function ScoutDash() {
  const { user } = useAuth()
  const [tab, setTab]         = useState('reports')
  const [reports, setReports] = useState([])
  const [allReports, setAllReports] = useState([])
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg]         = useState(null)

  // Report form state
  const [rForm, setRForm] = useState({
    prospect_id: '', game_date: '', game_opponent: '', notes: '', nba_comp: '',
    scout_orating: 7, scout_drating: 7, scout_intangibles: 7, overall_rating: 7
  })

  // Flag form state
  const [fForm, setFForm] = useState({
    prospect_id: '', flag_type: 'positive', flag_label: '', description: ''
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/my-reports', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/reports',    { credentials: 'include' }).then(r => r.json()),
      fetch('/api/prospects',  { credentials: 'include' }).then(r => r.json()),
    ]).then(([r, all, p]) => {
      setReports(Array.isArray(r) ? r : [])
      setAllReports(Array.isArray(all) ? all : [])
      setProspects(Array.isArray(p) ? p : [])
    }).finally(() => setLoading(false))
  }, [])

  const flash = (text, type='success') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 4000) }

  const submitReport = async (e) => {
    e.preventDefault()
    const notes = rForm.nba_comp
      ? `[NBA Comp: ${rForm.nba_comp}]\n${rForm.notes}`
      : rForm.notes
    const res  = await fetch('/api/reports', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rForm, notes, prospect_id: Number(rForm.prospect_id) })
    })
    const data = await res.json()
    if (data.ok) {
      flash('Report submitted successfully!')
      setRForm({ prospect_id: '', game_date: '', game_opponent: '', notes: '', nba_comp: '', scout_orating: 7, scout_drating: 7, scout_intangibles: 7, overall_rating: 7 })
    } else {
      flash(data.message || 'Failed to submit report', 'error')
    }
  }

  const submitFlag = async (e) => {
    e.preventDefault()
    const res  = await fetch('/api/flags', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...fForm, prospect_id: Number(fForm.prospect_id) })
    })
    const data = await res.json()
    if (data.ok) {
      flash('Flag added successfully!')
      setFForm({ prospect_id: '', flag_type: 'positive', flag_label: '', description: '' })
    } else {
      flash(data.message || 'Failed to add flag', 'error')
    }
  }

  const ratingInput = (field, label, form, setForm) => (
    <div className="form-group">
      <label>{label}: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{form[field]}/10</span></label>
      <input type="range" min="1" max="10" value={form[field]}
        onChange={e => setForm(prev => ({ ...prev, [field]: Number(e.target.value) }))}
        style={{ background: 'none', border: 'none', padding: 0, accentColor: 'var(--accent)', cursor: 'pointer' }}
      />
    </div>
  )

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div style={{ padding: '0 1.5rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Scout</div>
          <div style={{ fontWeight: 700 }}>{user?.name || user?.u_fname}</div>
        </div>
        {[
          { id: 'reports', icon: '📋', label: 'My Reports' },
          { id: 'all',     icon: '📂', label: 'All Reports' },
          { id: 'submit',  icon: '✏️',  label: 'Submit Report' },
          { id: 'flag',    icon: '🚩',  label: 'Tag Flag' },
        ].map(item => (
          <div key={item.id} className={`dash-nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
            <span className="dash-nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-header">
          <div className="dash-welcome">Welcome back,</div>
          <div className="dash-title">Scout Dashboard</div>
        </div>

        {msg && <div className={`alert alert-${msg.type} mb-2`}>{msg.text}</div>}

        {/* My Reports Tab */}
        {tab === 'reports' && (
          <div>
            <div className="section-title">My Submitted Reports</div>
            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : reports.length === 0 ? (
              <div className="empty-state"><h3>No reports yet</h3><p>Submit your first scouting report</p></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Prospect</th>
                      <th>Opponent</th>
                      <th>Game Date</th>
                      <th>O-Rtg</th>
                      <th>D-Rtg</th>
                      <th>Intangibles</th>
                      <th>Overall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{r.prospect}</td>
                        <td className="text-muted">vs {r.opponent}</td>
                        <td className="text-muted">{r.game_date}</td>
                        <td><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{r.rating || r.scout_orating}/10</span></td>
                        <td><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{r.scout_drating}/10</span></td>
                        <td><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{r.scout_intangibles}/10</span></td>
                        <td><span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)' }}>{r.rating || r.overall_rating}/10</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* All Reports Tab */}
        {tab === 'all' && (
          <div>
            <div className="section-title">All Scouting Reports ({allReports.length})</div>
            {allReports.length === 0 ? (
              <div className="empty-state"><h3>No reports yet</h3></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {allReports.map((r, i) => (
                  <div key={i} className="card" style={{ padding: '1rem' }}>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-1" style={{ flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700 }}>{r.prospect_name}</span>
                          <span className="text-muted text-xs">by <strong>{r.scout_name}</strong></span>
                          <span className="text-muted text-xs">vs {r.game_opponent} · {r.game_date}</span>
                        </div>
                        {r.notes && (
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6 }}>{r.notes}</p>
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

        {/* Submit Report Tab */}
        {tab === 'submit' && (
          <div style={{ maxWidth: 600 }}>
            <div className="section-title">Submit Scouting Report</div>
            <div className="card">
              <form onSubmit={submitReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>Prospect</label>
                  <select value={rForm.prospect_id} onChange={e => setRForm(p => ({ ...p, prospect_id: e.target.value }))} required>
                    <option value="">Select a prospect...</option>
                    {prospects.map(p => (
                      <option key={p.prospect_id} value={p.prospect_id}>
                        {p.name || p.full_name || p.prospect_name || `${p.p_fname} ${p.p_lname}`} — {p.position}, {p.college}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Game Date</label>
                    <input type="date" value={rForm.game_date} onChange={e => setRForm(p => ({ ...p, game_date: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Opponent</label>
                    <input type="text" placeholder="e.g. Duke" value={rForm.game_opponent} onChange={e => setRForm(p => ({ ...p, game_opponent: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>NBA Comp <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <input type="text" placeholder='e.g. Kevin Durant, Steph Curry...' value={rForm.nba_comp}
                    onChange={e => setRForm(p => ({ ...p, nba_comp: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea placeholder="Your scouting observations..." value={rForm.notes} onChange={e => setRForm(p => ({ ...p, notes: e.target.value }))} required style={{ minHeight: 100 }} />
                </div>
                <hr className="divider" />
                <div className="section-title">Ratings (1–10)</div>
                {ratingInput('scout_orating',     'Offensive Rating',  rForm, setRForm)}
                {ratingInput('scout_drating',     'Defensive Rating',  rForm, setRForm)}
                {ratingInput('scout_intangibles', 'Intangibles',       rForm, setRForm)}
                {ratingInput('overall_rating',    'Overall Rating',    rForm, setRForm)}
                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tag Flag Tab */}
        {tab === 'flag' && (
          <div style={{ maxWidth: 500 }}>
            <div className="section-title">Tag Behavioral Flag</div>
            <div className="card">
              <form onSubmit={submitFlag} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>Prospect</label>
                  <select value={fForm.prospect_id} onChange={e => setFForm(p => ({ ...p, prospect_id: e.target.value }))} required>
                    <option value="">Select a prospect...</option>
                    {prospects.map(p => (
                      <option key={p.prospect_id} value={p.prospect_id}>
                        {p.name || p.full_name || p.prospect_name || `${p.p_fname} ${p.p_lname}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Flag Type</label>
                  <select value={fForm.flag_type} onChange={e => setFForm(p => ({ ...p, flag_type: e.target.value }))}>
                    {FLAG_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Flag Label</label>
                  <input type="text" placeholder='e.g. "High Motor", "Injury Prone"' value={fForm.flag_label} onChange={e => setFForm(p => ({ ...p, flag_label: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea placeholder="Explain the flag..." value={fForm.description} onChange={e => setFForm(p => ({ ...p, description: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  Add Flag
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
