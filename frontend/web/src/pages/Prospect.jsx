import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RatingBar({ label, value }) {
  return (
    <div className="rating-bar">
      <span style={{ width: 90, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
      <div className="rating-bar-track">
        <div className="rating-bar-fill" style={{ width: `${value * 10}%` }} />
      </div>
      <span className="rating-value">{value}</span>
    </div>
  )
}

export default function Prospect() {
  const { id }      = useParams()
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    fetch(`/api/prospects/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading"><div className="spinner" /> Loading profile...</div>
  if (error)   return <div className="page"><div className="alert alert-error">{error}</div></div>
  if (!data)   return null

  // The API returns different shapes for public vs authenticated users
  const bio       = data.bio || data
  const reports   = data.reports  || []
  const flags     = data.flags    || []
  const comp      = data.nba_comp || null
  const archetypes= data.archetypes || []

  const name = bio.full_name || `${bio.p_fname} ${bio.p_lname}`
  const canSeeReports = user && ['SCOUT', 'GM', 'ANALYST', 'ADMIN'].includes(user.role)
  const canSeeFlags   = user && ['SCOUT', 'GM', 'ANALYST', 'ADMIN'].includes(user.role)

  const roleClass = (level) => `role-${(level || '').toLowerCase().replace(' ', '-')}`

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted mb-2" style={{ flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Prospects</Link>
        <span>›</span>
        <span style={{ color: 'var(--text)' }}>{name}</span>
      </div>

      {/* Profile Header */}
      <div className="card mb-2" style={{ background: 'linear-gradient(135deg, #141414, #0f0f0f)' }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`pos-badge pos-${bio.position}`}>{bio.position}</span>
              <span className="text-xs text-muted">{bio.draft_year} Draft · {bio.eligibility_status}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-1px', marginBottom: 4 }}>{name}</h1>
            <div className="text-muted" style={{ fontSize: '0.95rem' }}>
              {bio.college} · <span style={{ color: 'var(--text-dim)' }}>{bio.conference}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '0.75rem', textAlign: 'center' }}>
            {[['PPG', bio.PPG], ['RPG', bio.RPG], ['APG', bio.APG]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>
                  {v != null ? parseFloat(v).toFixed(1) : '—'}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Bio */}
        <div className="card">
          <div className="section-title">Bio</div>
          <table style={{ fontSize: '0.85rem' }}>
            <tbody>
              {[
                ['Height',   bio.height],
                ['Weight',   bio.weight ? `${bio.weight} lbs` : '—'],
                ['Hometown', bio.hometown],
                ['DOB',      bio.date_of_birth || bio.dob],
                ['College',  bio.college],
                ['Conference', bio.conference],
              ].map(([k, v]) => (
                <tr key={k} style={{ border: 'none' }}>
                  <td style={{ padding: '6px 0', color: 'var(--text-muted)', width: 110 }}>{k}</td>
                  <td style={{ padding: '6px 0', fontWeight: 500 }}>{v || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Full Stats */}
        <div className="card">
          <div className="section-title">Season Stats ({bio.season_year || bio.draft_year})</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.82rem' }}>
            {[
              ['Games', bio.games_played],
              ['MPG',  bio.MPG],
              ['PPG',  bio.PPG],
              ['RPG',  bio.RPG],
              ['APG',  bio.APG],
              ['TPG',  bio.TPG || bio.turnover || bio.turnovers],
              ['STL',  bio.stl],
              ['BLK',  bio.blk],
              ['FG%',  bio.fg_pct  ? `${(bio.fg_pct  * 100).toFixed(1)}%` : '—'],
              ['3P%',  bio.three_pt_pct ? `${(bio.three_pt_pct * 100).toFixed(1)}%` : '—'],
              ['FT%',  bio.ft_pct  ? `${(bio.ft_pct  * 100).toFixed(1)}%` : '—'],
              ['ORtg', bio.o_rating],
              ['DRtg', bio.d_rating],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between" style={{ padding: '4px 8px', background: 'var(--bg-elevated)', borderRadius: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{typeof v === 'number' ? v.toFixed(1) : (v || '—')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Archetypes */}
      {archetypes.length > 0 && (
        <div className="card mt-2">
          <div className="section-title">Archetypes</div>
          <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
            {archetypes.map((a, i) => (
              <span key={i} className="arch-chip" style={{ fontSize: '0.82rem', padding: '5px 14px' }}>
                {typeof a === 'string' ? a : a.arch_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* NBA Comp */}
      {comp && (
        <div className="mt-2">
          <div className="section-title">NBA Comparison</div>
          <div className="comp-card">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Comparable to</div>
                <div className="comp-name">{comp.comp_player_name}</div>
                <div className="comp-meta">Pick #{comp.draft_pick_no} · {comp.nba_team} · {comp.seasons_played} seasons</div>
                <span className={`role-level ${roleClass(comp.role_level)}`}>
                  {comp.role_level}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
                {[['Career ORtg', comp.career_orating], ['Career DRtg', comp.career_drating]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{v}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Behavioral Flags (restricted) */}
      {canSeeFlags && flags.length > 0 && (
        <div className="card mt-2">
          <div className="section-title">Behavioral Assessment</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {flags.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span className={`flag-chip flag-${f.flag_type}`} style={{ flexShrink: 0 }}>
                  {f.flag_type === 'positive' ? '✓' : f.flag_type === 'negative' ? '!' : '~'} {f.flag_label}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingTop: 4 }}>{f.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scouting Reports (restricted) */}
      {canSeeReports && reports.length > 0 && (
        <div className="card mt-2">
          <div className="section-title">Scouting Reports ({reports.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reports.map((r, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center mb-1" style={{ flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.scout_name}</span>
                    <span className="text-muted text-xs" style={{ marginLeft: 8 }}>
                      vs {r.game_opponent} · {r.game_date}
                    </span>
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>
                    {r.overall_rating}/10
                  </span>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  {r.notes}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <RatingBar label="Offense" value={r.scout_orating} />
                  <RatingBar label="Defense" value={r.scout_drating} />
                  <RatingBar label="Intangibles" value={r.scout_intangibles} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA for unauthenticated users */}
      {!user && (
        <div className="alert alert-info mt-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span>Sign in to see scouting reports, behavioral flags, and full analysis.</span>
          <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
        </div>
      )}
    </div>
  )
}
