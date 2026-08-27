import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { role: 'customer' | 'provider', name, email }

  const login = ({ role, name, email }) => {
    setUser({ role, name: name || (role === 'customer' ? 'Vraj Prajapati' : 'Maa Ka Swaad Tiffins'), email })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
