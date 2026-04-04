import { Navigate } from 'react-router-dom'
import { getRoleFromLocalStorage } from '@/shared/helpers/get-department-id'

interface ProtectedRouteProps {
  allowedRole: string
  children: React.ReactNode
}

const ProtectedRoute = ({ allowedRole, children }: ProtectedRouteProps) => {
  const role = getRoleFromLocalStorage()

  if (!role || role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
