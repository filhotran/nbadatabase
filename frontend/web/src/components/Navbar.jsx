import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DASH_ROUTES = {
  SCOUT:   '/dashboard/scout',
  GM:      '/dashboard/gm',
  ANALYST: '/dashboard/analyst',
  ADMIN:   '/dashboard/admin',
  FAN:     '/dashboard/fan',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="navbar-diamond" />
        NBA <span>DRAFT</span> SCOUT
      </Link>

      <div className="navbar-right">
        {user ? (
          <>
            <Link
              to={DASH_ROUTES[user.role] || '/'}
              className="btn btn-ghost btn-sm"
            >
              Dashboard
            </Link>
            <div className="navbar-user">
              <span>{user.u_fname || user.name}</span>
              <span className="role-badge">{user.role}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
