import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import Button from '../../components/button/Button'

const API_BASE = import.meta.env.VITE_API_BASE_URL as string

// ======================
// TYPES
// ======================
interface Role {
  id: number
  name: string
}

interface UserResponse {
  id: number
  name: string
  email: string
  roleId: number
}

type UserPayload = {
  name: string
  email: string
  roleId: number
  password?: string
  newPassword?: string
}

const EditUser = () => {
  const { id } = useParams<{ id: string }>()
  const token = localStorage.getItem('token')

  const isEditMode = Boolean(id)

  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState<number | ''>('')

  // password fields
  const [password, setPassword] = useState('') // old password (edit mode)
  const [newPassword, setNewPassword] = useState('') // new password

  // ======================
  // FETCH ROLES
  // ======================
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data: Role[] = await res.json()
        setRoles(data)
      } catch (err) {
        console.error('Failed to fetch roles', err)
      }
    }

    fetchRoles()
  }, [token])

  // ======================
  // FETCH USER (EDIT MODE)
  // ======================
  useEffect(() => {
    if (!isEditMode) return

    const fetchUser = async () => {
      try {
        setFetching(true)

        const res = await fetch(`${API_BASE}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch user')

        const data: UserResponse = await res.json()

        setName(data.name)
        setEmail(data.email)
        setRoleId(data.roleId)

        // NEVER preload passwords
        setPassword('')
        setNewPassword('')
      } catch (err) {
        console.error(err)
        alert('Failed to load user data')
      } finally {
        setFetching(false)
      }
    }

    fetchUser()
  }, [id, isEditMode, token])

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || roleId === '') {
      return alert('Name, email and role are required')
    }

    // create mode requires password
    if (!isEditMode && !newPassword) {
      return alert('Password is required for new user')
    }

    try {
      setLoading(true)

      const payload: UserPayload = {
        name,
        email,
        roleId: Number(roleId),
      }

      // ======================
      // CREATE USER
      // ======================
      if (!isEditMode) {
        payload.password = newPassword
      }

      // ======================
      // UPDATE USER PASSWORD
      // ======================
      if (isEditMode && password && newPassword) {
        payload.password = password
        payload.newPassword = newPassword
      }

      const res = await fetch(
        `${API_BASE}/api/users${isEditMode ? `/${id}` : ''}`,
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      alert(isEditMode ? 'User updated successfully' : 'User created successfully')

      // reset only in create mode
      if (!isEditMode) {
        setName('')
        setEmail('')
        setPassword('')
        setNewPassword('')
        setRoleId('')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-center p-5">Loading user...</div>
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">
        {isEditMode ? 'Edit User' : 'Create User'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* EMAIL */}
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD (OLD - EDIT MODE ONLY) */}
        {isEditMode && (
          <div>
            <Label>Old Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {/* NEW PASSWORD */}
        <div>
          <Label>
            New Password {isEditMode && '(leave empty if not changing)'}
          </Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* ROLE */}
        <div>
          <Label>Role</Label>
          <select
            value={roleId}
            onChange={(e) =>
              setRoleId(e.target.value ? Number(e.target.value) : '')
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg"
        >
          {loading
            ? 'Saving...'
            : isEditMode
            ? 'Update User'
            : 'Create User'}
        </Button>
      </form>
    </div>
  )
}

export default EditUser