import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nba_user')) } catch { return null }
  })

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('nba_user', JSON.stringify(userData))
  }

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    setUser(null)
    localStorage.removeItem('nba_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
