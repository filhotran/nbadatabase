import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Prospect from './pages/Prospect'
import ScoutDash from './pages/ScoutDash'
import GMDash from './pages/GMDash'
import AnalystDash from './pages/AnalystDash'
import AdminDash from './pages/AdminDash'
import FanDash from './pages/FanDash'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/prospect/:id"  element={<Prospect />} />
        <Route path="/dashboard/scout"   element={<ProtectedRoute roles={['SCOUT']}><ScoutDash /></ProtectedRoute>} />
        <Route path="/dashboard/gm"      element={<ProtectedRoute roles={['GM']}><GMDash /></ProtectedRoute>} />
        <Route path="/dashboard/analyst" element={<ProtectedRoute roles={['ANALYST']}><AnalystDash /></ProtectedRoute>} />
        <Route path="/dashboard/admin"   element={<ProtectedRoute roles={['ADMIN']}><AdminDash /></ProtectedRoute>} />
        <Route path="/dashboard/fan"     element={<ProtectedRoute roles={['FAN']}><FanDash /></ProtectedRoute>} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
