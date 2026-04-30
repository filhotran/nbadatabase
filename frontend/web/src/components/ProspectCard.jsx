import { useNavigate } from 'react-router-dom'

export default function ProspectCard({ prospect }) {
  const navigate = useNavigate()
  const { prospect_id, p_fname, p_lname, full_name, name: dbName, prospect_name, position, college, conference, PPG, RPG, APG, archetypes } = prospect
  const name = dbName || prospect_name || full_name || `${p_fname} ${p_lname}`

  return (
    <div
      className="card prospect-card"
      onClick={() => navigate(`/prospect/${prospect_id}`)}
      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,166,35,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className={`pos-badge pos-${position}`}>{position}</span>
        <span className="text-xs text-muted">2026 Draft</span>
      </div>

      {/* Name */}
      <div style={{ marginTop: '10px', marginBottom: '4px' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.2 }}>{name}</div>
        <div className="text-sm text-muted" style={{ marginTop: 3 }}>
          {college} · <span style={{ color: 'var(--text-dim)' }}>{conference}</span>
        </div>
      </div>

      <hr className="divider" />

      {/* Key Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
        {[['PPG', PPG], ['RPG', RPG], ['APG', APG]].map(([lbl, val]) => (
          <div key={lbl} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
              {val != null ? parseFloat(val).toFixed(1) : '—'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Archetypes */}
      {archetypes && archetypes.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {archetypes.slice(0, 2).map((a, i) => (
            <span key={i} className="arch-chip">{typeof a === 'string' ? a : a.arch_name}</span>
          ))}
        </div>
      )}
    </div>
  )
}
