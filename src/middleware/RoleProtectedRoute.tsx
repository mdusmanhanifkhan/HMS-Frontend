import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import Button from '../components/button/Button'

export interface Role {
  id: number
  name: string
  description: string
  canManageDepartments: boolean
  canManageDoctors: boolean
  canManagePatients: boolean
  canManageWelfare: boolean
  canManageProcedures: boolean
  canManageFees: boolean
  canViewReports: boolean
  canManagePatientsHistory: boolean
  canManageFinanceReport: boolean
  canManageToken: boolean
  canSuperAdmin: boolean
}

interface User {
  id: number
  name: string
  email: string
  role: Role
}

interface RoleProtectedRouteProps {
  children: ReactNode
  allow: (role: Role) => boolean
}

const RoleProtectedRoute = ({ children, allow }: RoleProtectedRouteProps) => {
  const userStr = localStorage.getItem('user')

  if (!userStr) {
    return <Navigate to="/login" replace />
  }

  const user: User = JSON.parse(userStr)
  console.log(user)
  if (!allow(user.role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl shadow-[3px_0px_10px_2px_#dfdede] p-8 text-center">
          {/* SVG ICON */}
          <div className="flex justify-center mb-6">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-500"
            >
              <path
                d="M12 2C9.24 2 7 4.24 7 7V10H6C4.9 10 4 10.9 4 12V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V12C20 10.9 19.1 10 18 10H17V7C17 4.24 14.76 2 12 2ZM9 7C9 5.35 10.35 4 12 4C13.65 4 15 5.35 15 7V10H9V7Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* TEXT */}
          <h2 className="text-2xl font-bold text-red mb-2">Access Denied</h2>

          <p className="text-dark mb-6">
            You don’t have permission to access this page.
            <br />
            Please contact the IT Team if you think this is a mistake.
          </p>

          {/* ACTIONS */}
          <div className="flex justify-center gap-4">
            <Button to="/" asLink={true}>
              Go to Dashboard
            </Button>
            <Button className="px-6"> Contact Us</Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default RoleProtectedRoute
