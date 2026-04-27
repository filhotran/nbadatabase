import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const ROLES     = ['ADMIN','SCOUT','GM','ANALYST','FAN']
const POSITIONS = ['PG','SG','SF','PF','C']

const BLANK_PROSPECT = {
  p_fname:'', p_lname:'', position:'PG', draft_year: 2026,
  college_id:'', games_played:'', PPG:'', RPG:'', APG:''
}

export default function AdminDash() {
  const { user } = useAuth()
  const [tab, setTab]           = useState('users')
  const [users, setUsers]       = useState([])
  const [prospects, setProspects] = useState([])
  const [colleges, setColleges] = useState([])
  const [loading, setLoading]   = useState(true)
  const [msg, setMsg]           = useState(null)

  const [uForm, setUForm] = useState({ u_fname: '', u_lname: '', email: '', password: '', role: 'SCOUT' })
  const [pForm, setPForm] = useState(BLANK_PROSPECT)

  const flash = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 4000) }

  useEffect(() => {
    Promise.all([
      fetch('/api/users',    { credentials: 'include' }).then(r => r.json()),
      fetch('/api/prospects',{ credentials: 'include' }).then(r => r.json()),
      fetch('/api/colleges', { credentials: 'include' }).then(r => r.json()),
    ]).then(([u, p, c]) => {
      setUsers(Array.isArray(u) ? u : [])
      setProspects(Array.isArray(p) ? p : [])
      setColleges(Array.isArray(c) ? c : [])
    }).finally(() => setLoading(false))
  }, [])

  const createUser = async (e) => {
    e.preventDefault()
    const res  = await fetch('/api/users', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uForm)
    })
    const data = await res.json()
    if (data.ok) {
      flash('User created!')
      setUForm({ u_fname: '', u_lname: '', email: '', password: '', role: 'SCOUT' })
      const r = await fetch('/api/users', { credentials: 'include' })
      setUsers(await r.json())
    } else {
      flash(data.message || 'Error', 'error')
    }
  }

  const deleteUser = async (uid) => {
    if (!confirm('Delete this user?')) return
    const res  = await fetch(`/api/users/${uid}`, { method: 'DELETE', credentials: 'include' })
    const data = await res.json()
    if (data.ok) {
      setUsers(prev => prev.filter(u => u.user_id !== uid))
      flash('User removed')
    } else {
      flash(data.message || 'Error', 'error')
    }
  }

  const addProspect = async (e) => {
    e.preventDefault()
    const res  = await fetch('/api/admin/prospects', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...pForm,
        draft_year:   parseInt(pForm.draft_year),
        college_id:   parseInt(pForm.college_id),
        games_played: parseInt(pForm.games_played),
        PPG: parseFloat(pForm.PPG),
        RPG: parseFloat(pForm.RPG),
        APG: parseFloat(pForm.APG),
      })
    })
    const data = await res.json()
    if (data.ok) {
      flash('Prospect added!')
      setPForm(BLANK_PROSPECT)
      const r = await fetch('/api/prospects', { credentials: 'include' })
      setProspects(await r.json())
    } else {
      flash(data.message || 'Error', 'error')
    }
  }

  const deleteProspect = async (pid) => {
    if (!confirm('Delete this prospect and all associated data?')) return
    const res  = await fetch(`/api/admin/prospects/${pid}`, { method: 'DELETE', credentials: 'include' })
    const data = await res.json()
    if (data.ok) {
      setProspects(prev => prev.filter(p => p.prospect_id !== pid))
      flash('Prospect deleted')
    } else {
      flash(data.message || 'Error', 'error')
    }
  }

  const roleColor = (role) => {
    const map = { ADMIN: '#ef4444', SCOUT: '#3b82f6', GM: '#22c55e', ANALYST: '#f59e0b', FAN: '#888' }
    return map[role] || '#888'
  }

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div style={{ padding: '0 1.5rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Administrator</div>
          <div style={{ fontWeight: 700 }}>{user?.name || user?.u_fname}</div>
        </div>
        {[
          { id: 'users',     icon: '👥', label: `Users (${users.length})` },
          { id: 'prospects', icon: '🏀', label: `Prospects (${prospects.length})` },
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
          <div className="dash-title">Admin Dashboard</div>
        </div>

        {msg && <div className={`alert alert-${msg.type} mb-2`}>{msg.text}</div>}

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading...</div>
        ) : (
          <>
            {/* Users Tab */}
            {tab === 'users' && (
              <div>
                {/* Create User Form */}
                <div className="card mb-2">
                  <div className="section-title">Create New User</div>
                  <form onSubmit={createUser} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
                    {[
                      ['First Name', 'u_fname', 'text', 'John'],
                      ['Last Name',  'u_lname', 'text', 'Doe'],
                      ['Email',      'email',   'email','john@nbascout.com'],
                      ['Password',   'password','password', '••••••••'],
                    ].map(([label, key, type, ph]) => (
                      <div key={key} className="form-group" style={{ flex: '1 1 140px' }}>
                        <label>{label}</label>
                        <input type={type} placeholder={ph} value={uForm[key]}
                          onChange={e => setUForm(p => ({ ...p, [key]: e.target.value }))} required />
                      </div>
                    ))}
                    <div className="form-group" style={{ flex: '1 1 120px' }}>
                      <label>Role</label>
                      <select value={uForm.role} onChange={e => setUForm(p => ({ ...p, role: e.target.value }))}>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: 38 }}>Create User</button>
                  </form>
                </div>

                {/* Users Table */}
                <div className="section-title">All Users ({users.length})</div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.user_id}>
                          <td style={{ fontWeight: 600 }}>{u.name || `${u.u_fname} ${u.u_lname}`}</td>
                          <td className="text-muted">{u.email}</td>
                          <td>
                            <span style={{
                              padding: '2px 8px', borderRadius: 4,
                              fontSize: '0.7rem', fontWeight: 700,
                              background: `${roleColor(u.role)}20`,
                              color: roleColor(u.role)
                            }}>{u.role}</span>
                          </td>
                          <td>
                            {u.user_id !== user?.user_id && (
                              <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.user_id)}>
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Prospects Tab */}
            {tab === 'prospects' && (
              <div>
                {/* Add Prospect Form */}
                <div className="card mb-2">
                  <div className="section-title">Add New Prospect</div>
                  <form onSubmit={addProspect} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
                    {[
                      ['First Name',    'p_fname',      'text',   'Zion'],
                      ['Last Name',     'p_lname',      'text',   'Williams'],
                      ['Draft Year',    'draft_year',   'number', '2026'],
                      ['Games Played',  'games_played', 'number', '30'],
                      ['PPG',           'PPG',          'number', '18.5'],
                      ['RPG',           'RPG',          'number', '7.2'],
                      ['APG',           'APG',          'number', '3.1'],
                    ].map(([label, key, type, ph]) => (
                      <div key={key} className="form-group" style={{ flex: '1 1 120px' }}>
                        <label>{label}</label>
                        <input type={type} placeholder={ph} value={pForm[key]} step="any"
                          onChange={e => setPForm(p => ({ ...p, [key]: e.target.value }))} required />
                      </div>
                    ))}
                    <div className="form-group" style={{ flex: '1 1 100px' }}>
                      <label>Position</label>
                      <select value={pForm.position} onChange={e => setPForm(p => ({ ...p, position: e.target.value }))}>
                        {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: '1 1 160px' }}>
                      <label>College</label>
                      <select value={pForm.college_id} onChange={e => setPForm(p => ({ ...p, college_id: e.target.value }))} required>
                        <option value="">Select college...</option>
                        {colleges.map(c => <option key={c.college_id} value={c.college_id}>{c.c_name}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: 38 }}>Add Prospect</button>
                  </form>
                </div>

                <div className="section-title">All Prospects ({prospects.length})</div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Name</th><th>Pos</th><th>College</th><th>PPG</th><th>RPG</th><th>APG</th><th>Draft Year</th><th></th></tr>
                    </thead>
                    <tbody>
                      {prospects.map(p => {
                        const name = p.full_name || p.name || `${p.p_fname} ${p.p_lname}`
                        return (
                          <tr key={p.prospect_id}>
                            <td style={{ fontWeight: 600 }}>{name}</td>
                            <td><span className={`pos-badge pos-${p.position}`}>{p.position}</span></td>
                            <td className="text-muted">{p.college}</td>
                            <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{p.PPG}</td>
                            <td>{p.RPG}</td>
                            <td>{p.APG}</td>
                            <td className="text-muted">{p.draft_year}</td>
                            <td>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteProspect(p.prospect_id)}>
                                Delete
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
          </>
        )}
      </main>
    </div>
  )
}
