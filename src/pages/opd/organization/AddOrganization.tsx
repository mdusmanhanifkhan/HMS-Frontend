import { useState } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import TextArea from '../../../components/input/TextArea'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'

interface OrganizationForm {
  name: string
  email: string
  phone: string
  address: string
  status: boolean
}

const AddOrganization = () => {
  const [form, setForm] = useState<OrganizationForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: true,
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
    setForm((prev) => ({ ...prev, status: !prev.status }))
  }

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name || !form.email || !form.phone) {
      setError('Name, Email and Phone are required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/organization`, {
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

      setSuccess('Organization added successfully!')
      setForm({ name: '', email: '', phone: '', address: '', status: true })
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
        <p className="text-xl font-semibold w-full">Add Organization</p>
        <Button to={routePaths.ORGANIZATION} asLink>
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

        {/* Name */}
        <GroupInput className="col-span-full">
          <Label required='true'>Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Organization Name"
          />
        </GroupInput>

        {/* Email */}
        <GroupInput className="col-span-full">
          <Label required='true'>Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="org@example.com"
          />
        </GroupInput>

        {/* Phone */}
        <GroupInput className="col-span-full">
          <Label required='true'>Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="1234567890"
          />
        </GroupInput>

        {/* Address */}
        <GroupInput className="col-span-full">
          <Label>Address</Label>
          <TextArea
            id="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Organization Address"
          />
        </GroupInput>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Organization'}
        </Button>
        <Button
          type="reset"
          onClick={() => setForm({ name: '', email: '', phone: '', address: '', status: true })}
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

export default AddOrganization
