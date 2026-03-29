import { useState } from 'react'
import type { FormEvent } from 'react'

import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'

interface DosageFormData {
  name: string
  code: string
  status: boolean
}

const AddDosageForm = () => {
  const [form, setForm] = useState<DosageFormData>({
    name: '',
    code: '',
    status: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // Toggle Status
  const handleToggle = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }))
  }

  // Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Dosage Form Name is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/dosage-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          code: form.code.trim(),
          status: form.status,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Something went wrong')
      }

      setSuccess('Dosage form added successfully!')
      setForm({
        name: '',
        code: '',
        status: true,
      })
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

      {/* Messages */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {/* FORM */}
      <div className="grid grid-cols-3 gap-4 max-w-[700px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton
            id="status"
            checked={form.status}
            onChange={handleToggle}
          />
        </GroupInput>

        {/* Name */}
        <GroupInput className="col-span-full">
          <Label required="true">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter Dosage Form (e.g. Tablet)"
          />
        </GroupInput>

        {/* Code */}
        <GroupInput className="col-span-full">
          <Label>Code</Label>
          <Input
            id="code"
            value={form.code}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="Enter Code (e.g. TAB)"
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
          onClick={() =>
            setForm({
              name: '',
              code: '',
              status: true,
            })
          }
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

export default AddDosageForm