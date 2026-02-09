import { useState } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'

interface UnitForm {
  value: number | ''
  unit: string
  status: boolean
}

const AddUnit = () => {
  const [form, setForm] = useState<UnitForm>({
    value: '',
    unit: '',
    status: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({
      ...prev,
      [id]: id === 'value' ? Number(value) || '' : value,
    }))
  }

  // handle toggle
  const handleToggle = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }))
  }

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.value === '' || !form.unit) {
      setError('Value and Unit are required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/unit`, {
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

      setSuccess('Medicine unit added successfully!')
      setForm({ value: '', unit: '', status: true })
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
        <p className="text-xl font-semibold w-full">Add Medicine Unit</p>
        <Button to={routePaths.UNIT} asLink>
          Back
        </Button>
      </div>

      {/* Error / Success */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {/* FORM */}
      <div className="grid grid-cols-3 gap-4 max-w-[700px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton checked={form.status} onChange={handleToggle} />
        </GroupInput>

        {/* Value */}
        <GroupInput className="col-span-full">
          <Label required="true">Value</Label>
          <Input
            id="value"
            type="number"
            value={form.value}
            onChange={handleChange}
            placeholder="e.g. 500"
          />
        </GroupInput>

        {/* Unit */}
        <GroupInput className="col-span-full">
          <Label required="true">Unit</Label>
          <Input
            id="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="e.g. mg, ml, g"
          />
        </GroupInput>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Unit'}
        </Button>
        <Button
          type="reset"
          onClick={() => setForm({ value: '', unit: '', status: true })}
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

export default AddUnit
