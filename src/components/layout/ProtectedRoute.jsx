import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()

  // Firebase restores the session asynchronously. Without this, a refresh on a
  // protected page redirects to /login before the user has been resolved.
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-terracotta" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  // Admin is a flag on the account rather than one of the two app roles.
  if (role === 'admin') {
    return user.isAdmin ? children : <Navigate to="/" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'provider' ? '/provider/dashboard' : '/discover'} replace />
  }
  return children
}
