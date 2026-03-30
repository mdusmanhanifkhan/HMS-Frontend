import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import Loading from '../../components/loading/Loading'
import { Input } from '../../components/input/Input'

/* ================= TYPES ================= */

interface Role {
  id: number
  name: string
}

interface User {
  id: number
  name: string
  email: string
  role?: Role
  status: boolean
}

interface ApiResponse {
  success: boolean
  users: User[]
}

/* ================= COMPONENT ================= */

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  /* ================= DEBOUNCE ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const controller = new AbortController()

    const fetchUsers = async () => {
      if (!token) {
        setError('Authentication token missing')
        return
      }

      try {
        setLoading(true)
        setError(null)

        let url = `${API_BASE}/api/users`

        if (debouncedSearch.trim()) {
          url = `${API_BASE}/api/users/search?query=${encodeURIComponent(
            debouncedSearch
          )}`
        }

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.message || 'Failed to fetch users')
        }

        const data: ApiResponse = await res.json()

        setUsers(data.users || [])
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
          setUsers([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
    return () => controller.abort()
  }, [debouncedSearch, token])

  /* ================= DELETE ================= */
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete || !token) return

    try {
      setLoading(true)

      const res = await fetch(
        `${API_BASE}/api/users/${userToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Delete failed')
      }

      setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
      setDeleteModalOpen(false)
      setUserToDelete(null)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="flex flex-col gap-10">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold">User Management</p>

        <div className="flex gap-4 min-w-[400px]">

          {/* SEARCH */}
          <div className="flex items-center border rounded-lg px-2 w-full">
            <Input
              type="text"
              placeholder="Search user..."
              variant="none"
              className="outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* CREATE */}
          <Link to={routePaths.CREATE_USER}>
            <Button>+ Create User</Button>
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-dark text-white">
            <tr>
              <th className="text-start px-6 py-3">ID</th>
              <th className="text-start px-6 py-3">Name</th>
              <th className="text-start px-6 py-3">Email</th>
              <th className="text-start px-6 py-3">Role</th>
              <th className="text-start px-6 py-3">Status</th>
              <th className="text-start px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-red-500 text-center py-6">
                  {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-b bg-gray-50">
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    {user.role?.name || '-'}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.status
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 flex gap-2">
                    {/* <Link to={`${routePaths.EDIT_USER}/${user.id}`}>
                      <Button>Edit</Button>
                    </Link> */}

                    <Button onClick={() => handleDeleteClick(user)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80 text-center">
            <p>
              Delete <strong>{userToDelete.name}</strong>?
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={confirmDelete}>Yes</Button>
              <Button onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement