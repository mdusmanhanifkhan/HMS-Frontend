import { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  role: {
    [key: string]: boolean
  }
}

type PermissionContextType = {
  user: User | null
  permissions: string[]   // ✅ ARRAY
  loading: boolean
  role: string | null
}

const PermissionContext = createContext<PermissionContextType>({
  user: null,
  permissions: [],
  loading: true,
  role: null,
})

export const usePermissions = () => useContext(PermissionContext)

const API_BASE = import.meta.env.VITE_API_BASE_URL

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<string[]>([]) // ✅
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()

        if (res.ok && data.user) {
          setUser(data.user)
          setPermissions(data.user.allowedPermissions || []) // ✅
          setRole(data.user.role.name)
        }
      } catch (error) {
        console.error('Failed to load permissions', error)
      }

      setLoading(false)
    }

    fetchPermissions()
  }, [token])

  return (
    <PermissionContext.Provider value={{ user, permissions, loading, role }}>
      {children}
    </PermissionContext.Provider>
  )
}