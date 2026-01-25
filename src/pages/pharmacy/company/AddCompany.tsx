import { useState } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'

interface CompanyForm {
  name: string
  code?: string
  contactPerson?: string
  phone?: string
  email?: string
  drugRegistrationNo?: string
  manufacturingLicenseNo?: string
  ntnNumber?: string
  gstNumber?: string
  remarks?: string
  isActive: boolean
}

export default function AddCompany() {
  const [form, setForm] = useState<CompanyForm>({
    name: '',
    code: '',
    contactPerson: '',
    phone: '',
    email: '',
    drugRegistrationNo: '',
    manufacturingLicenseNo: '',
    ntnNumber: '',
    gstNumber: '',
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
      setError('Company Name is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/company`, {
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

      setSuccess('Company added successfully!')
      setForm({
        name: '',
        code: '',
        contactPerson: '',
        phone: '',
        email: '',
        drugRegistrationNo: '',
        manufacturingLicenseNo: '',
        ntnNumber: '',
        gstNumber: '',
        remarks: '',
        isActive: true,
      })
    } catch (err: unknown) {
      // ✅ Type guard to safely extract message
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="flex flex-col gap-10 "
      onSubmit={handleSubmit}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Medicine Company</p>
        <Button to={routePaths.PROCEDURE} asLink>
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
          <ToggleButton
            id="isActive"
            checked={form.isActive}
            onChange={handleToggle}
          />
        </GroupInput>

        {/* BASIC COMPANY INFO */}
        <GroupInput>
          <Label required="true">Company Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Company Name"
          />
        </GroupInput>

        <GroupInput>
          <Label>Company Code</Label>
          <Input
            id="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Short Code (optional)"
          />
        </GroupInput>

        <GroupInput>
          <Label>Contact Person</Label>
          <Input
            id="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            placeholder="Contact Person Name"
          />
        </GroupInput>

        <GroupInput>
          <Label>Phone</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </GroupInput>

        <GroupInput>
          <Label>Email</Label>
          <Input
            id="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
        </GroupInput>

        {/* LEGAL / REGULATORY INFO */}
        <GroupInput>
          <Label>Drug Registration No</Label>
          <Input
            id="drugRegistrationNo"
            value={form.drugRegistrationNo}
            onChange={handleChange}
            placeholder="DRAP Registration Number"
          />
        </GroupInput>

        <GroupInput>
          <Label>Manufacturing License No</Label>
          <Input
            id="manufacturingLicenseNo"
            value={form.manufacturingLicenseNo}
            onChange={handleChange}
            placeholder="Manufacturing License Number"
          />
        </GroupInput>

        <GroupInput>
          <Label>NTN Number</Label>
          <Input
            id="ntnNumber"
            value={form.ntnNumber}
            onChange={handleChange}
            placeholder="NTN Number"
          />
        </GroupInput>

        <GroupInput>
          <Label>GST Number</Label>
          <Input
            id="gstNumber"
            value={form.gstNumber}
            onChange={handleChange}
            placeholder="GST Number"
          />
        </GroupInput>

        {/* REMARKS */}
        <GroupInput className="col-span-full">
          <Label>Remarks</Label>
          <Input
            id="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Any notes about company"
          />
        </GroupInput>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Company'}
        </Button>
        <Button
          type="reset"
          onClick={() =>
            setForm({
              name: '',
              code: '',
              contactPerson: '',
              phone: '',
              email: '',
              drugRegistrationNo: '',
              manufacturingLicenseNo: '',
              ntnNumber: '',
              gstNumber: '',
              remarks: '',
              isActive: true,
            })
          }
        >
          Clear
        </Button>
      </div>
    </form>
  )
}
