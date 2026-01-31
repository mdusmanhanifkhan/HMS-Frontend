import { useState } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'

interface DosageFormType {
  name: string
  description?: string
  isActive: boolean
}

const AddDosageForm = () => {
  const [form, setForm] = useState<DosageFormType>({
    name: '',
    description: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  // handle toggle
  const handleToggle = () => {
    setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
  }

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name) {
      setError('Dosage Form Name is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/dosage-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.message || 'Something went wrong')
      }

      setSuccess('Dosage Form added successfully!')
      setForm({ name: '', description: '', isActive: true })
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
        <p className="text-xl font-semibold w-full">Add Dosage Form</p>
        <Button to={routePaths.DOSAGE_FORM} asLink>
          Back
        </Button>
      </div>

      {/* Error / Success Messages */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {/* FORM */}
      <div className="grid grid-cols-3 gap-4 max-w-[700px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton id="isActive" checked={form.isActive} onChange={handleToggle} />
        </GroupInput>

        {/* Name */}
        <GroupInput className="col-span-full">
          <Label required="true">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Dosage Form Name (e.g., Tablet, Capsule)"
          />
        </GroupInput>

        {/* Description */}
        <GroupInput className="col-span-full">
          <Label>Description</Label>
          <Input
            id="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional description"
          />
        </GroupInput>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Dosage Form'}
        </Button>
        <Button
          type="reset"
          onClick={() => setForm({ name: '', description: '', isActive: true })}
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

export default AddDosageForm
