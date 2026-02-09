import { useState } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'

interface GenericForm {
  name: string
  status: boolean
}

const AddGenericName = () => {
  const [form, setForm] = useState<GenericForm>({
    name: '',
    status: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  // Handle toggle
  const handleToggle = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }))
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Generic name is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/generic-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || 'Something went wrong')
      }

      setSuccess('Generic name added successfully!')
      setForm({ name: '', status: true })
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Generic Name</p>
        <Button to={routePaths.GENERIC_NAME} asLink>
          Back
        </Button>
      </div>

      {/* Error / Success */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {/* Form Fields */}
      <div className="grid grid-cols-3 gap-4 max-w-[700px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton checked={form.status} onChange={handleToggle} />
        </GroupInput>

        {/* Name */}
        <GroupInput className="col-span-full">
          <Label required="true">Generic Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Generic Name"
          />
        </GroupInput>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Generic Name'}
        </Button>
        <Button
          type="reset"
          onClick={() => setForm({ name: '', status: true })}
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

export default AddGenericName
