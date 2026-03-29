import { useState } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'

interface BrandForm {
  name: string
  code?: string
  phone?: string
  email?: string
  remarks?: string
  isActive: boolean
}

export default function AddBrand() {
  const [form, setForm] = useState<BrandForm>({
    name: '',
    code: '',
    phone: '',
    email: '',
    remarks: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // basic validation
    if (!form.name) {
      setError('Brand Name is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/brand`, {
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

      setSuccess('Brand added successfully!')
      setForm({
        name: '',
        code: '',
        phone: '',
        email: '',
        remarks: '',
        isActive: true,
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
        <p className="text-xl font-semibold w-full">Add Brand</p>
        <Button to={routePaths.BRAND} asLink>
          <svg
            className="w-3.5 h-3.5 -scale-x-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <use href="/assets/svg/arrow-icon.svg#arrow-icon" />
          </svg>
          Back
        </Button>
      </div>

      {/* Error / Success Messages */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {/* FORM */}
      <div className="grid grid-cols-3 gap-4 max-w-[1100px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton id="isActive" checked={form.isActive} onChange={handleToggle} />
        </GroupInput>

        {/* Brand Info */}
        <GroupInput>
          <Label required="true">Brand Name</Label>
          <Input id="name" value={form.name} onChange={handleChange} placeholder="Enter Brand Name" />
        </GroupInput>

        <GroupInput>
          <Label>Brand Code</Label>
          <Input id="code" value={form.code} onChange={handleChange} placeholder="Short Code (optional)" />
        </GroupInput>

        <GroupInput>
          <Label>Phone</Label>
          <Input id="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
        </GroupInput>

        <GroupInput>
          <Label>Email</Label>
          <Input id="email" value={form.email} onChange={handleChange} placeholder="Email Address" />
        </GroupInput>

        <GroupInput className="col-span-full">
          <Label>Remarks</Label>
          <Input id="remarks" value={form.remarks} onChange={handleChange} placeholder="Any notes about the brand" />
        </GroupInput>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Brand'}
        </Button>
        <Button
          type="reset"
          onClick={() =>
            setForm({ name: '', code: '', phone: '', email: '', remarks: '', isActive: true })
          }
        >
          Clear
        </Button>
      </div>
    </form>
  )
}