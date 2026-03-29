import { useEffect, useState } from 'react'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import Button from '../../components/button/Button'

const API_BASE = import.meta.env.VITE_API_BASE_URL

interface Permission {
  id: number
  name: string
}

const CreateRolePage = () => {
  const token = localStorage.getItem('token')

  const [permissions, setPermissions] = useState<Permission[]>([])
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [permissionIds, setPermissionIds] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // ✅ Fetch permissions on page load
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/permissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data: Permission[] = await response.json()

        if (!response.ok) {
          throw new Error('Failed to fetch permissions')
        }

        setPermissions(data)
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    }

    fetchPermissions()
  }, [token])

  const togglePermission = (id: number) => {
    setPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('Role name is required')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE}/api/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          permissionIds,
        }),
      })

      if (!response.ok) {
        const errorData: { message?: string } = await response.json()
        throw new Error(errorData.message || 'Failed to create role')
      }

      alert('Role created successfully')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Create Role</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          required
        />
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
        />

        <div>
          <label className="font-medium text-gray-700 mb-2 block">
            Assign Permissions
          </label>

          <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 max-h-60 overflow-y-auto">
            {permissions.map((permission) => (
              <label
                key={permission.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={permissionIds.includes(permission.id)}
                  onChange={() => togglePermission(permission.id)}
                />
                {permission.name}
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition flex justify-center items-center"
        >
          {loading ? 'Saving...' : 'Create Role'}
        </Button>
      </form>
    </div>
  )
}

export default CreateRolePage
