import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute() {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="page-loading" role="status">
        Loading…
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
