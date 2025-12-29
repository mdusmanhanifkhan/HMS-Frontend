import { useState, useEffect } from 'react'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import { useParams } from 'react-router-dom'
import Dropdown from '../../components/input/Dropdown'

type Department = { id: number; name: string }
type Procedure = {
  status: boolean
  procedureName: string
  shortCode: string
  department?: Department
  description: string
}

type Option = {
  id: string | number
  name: string
}

const EditProcedure = () => {
  const { id } = useParams<{ id: string }>()

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  const [form, setForm] = useState<Procedure>({
    status: false,
    procedureName: '',
    shortCode: '',
    department: undefined,
    description: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const departments: Department[] = [
    { id: 1, name: 'Dental' },
    { id: 2, name: 'Ortho' },
    { id: 3, name: 'Eye' },
  ]

  // ✅ Fixed type for checkbox/text/textarea
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value } = e.target
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setForm((prev) => ({
        ...prev,
        [id]: target.checked,
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [id]: value,
      }))
    }
  }

  const handleSelectDepartment = (option: Option) => {
    const dept = departments.find((d) => d.id === Number(option.id))
    if (dept) setForm((prev) => ({ ...prev, department: dept }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!token) {
      setError('No token found. Please login first.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/procedures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: form.status,
          name: form.procedureName,
          shortCode: form.shortCode,
          description: form.description,
          departmentId: form.department?.id ?? null,
        }),
      })

      const data = await res.json()

      if (!res.ok)
        throw new Error(data?.message || 'Failed to update procedure')

      setSuccess('Procedure updated successfully ✅')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong ❌')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      setError('No token found. Please login first.')
      return
    }

    const fetchProcedure = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/procedures/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (res.ok && data?.data) {
          setForm({
            status: data.data.status ?? false,
            procedureName: data.data.name ?? '',
            shortCode: data.data.shortCode ?? '',
            department: data.data.department ?? undefined,
            description: data.data.description ?? '',
          })
        } else {
          setError(data?.message || 'Failed to load procedure')
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong ❌')
      }
    }
    fetchProcedure()
  }, [id, token, API_BASE])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <p className="text-xl font-semibold w-full border-b pb-3">
        Edit Procedure
      </p>

      {/* Success & Error Messages */}
      {error && <p className="text-red-500 font-medium">{error}</p>}
      {success && <p className="text-green-600 font-medium">{success}</p>}

      <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label htmlFor="status">Status</Label>
          <div className="checkbox-apple">
            <input
              id="status"
              type="checkbox"
              checked={form.status}
              onChange={handleChange}
            />
            <label htmlFor="status"></label>
          </div>
        </GroupInput>

        {/* Procedure Name */}
        <GroupInput>
          <Label htmlFor="procedureName">Procedure Name</Label>
          <Input
            id="procedureName"
            placeholder="Enter Procedure Name"
            value={form.procedureName}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Short Code */}
        <GroupInput>
          <Label htmlFor="shortCode">Short Code</Label>
          <Input
            id="shortCode"
            placeholder="Enter Procedure Short Code"
            value={form.shortCode}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Department */}
        <GroupInput>
          <Label>Department</Label>
          <Dropdown
            options={departments.map((d) => ({ id: d.id, name: d.name }))}
            selected={
              form.department
                ? ({
                    id: form.department.id,
                    name: form.department.name,
                  } as Option)
                : null
            }
            onSelect={(option) => {
              handleSelectDepartment({
                id: option.id as number,
                name: option.name,
              })
            }}
            placeholder="Select Department"
          />
        </GroupInput>

        {/* Description */}
        <GroupInput>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            placeholder="Enter Procedure Description"
            value={form.description}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Submit */}
        <div className="col-span-full mx-auto mt-5">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Procedure'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default EditProcedure
