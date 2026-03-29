import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { usePermissions } from '../context/PermissionsContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
}

const ProtectedRoute = ({
  children,
  requiredPermission,
}: ProtectedRouteProps) => {
  const { permissions, loading } = usePermissions()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!requiredPermission) {
      setIsAuthorized(true)
      return
    }

    if (!loading) {
      const hasPermission = permissions.includes(requiredPermission)
      console.log('CHECK:', requiredPermission, permissions, hasPermission)
      setIsAuthorized(hasPermission)
    }
  }, [permissions, requiredPermission, loading])

  if (loading) {
    return <p className="text-center mt-10">Checking authentication...</p>
  }

  if (!isAuthorized) {
    return (
      <p className="text-center mt-20 text-red-600 font-medium text-xl">
        You do not have permission to view this page.
      </p>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
