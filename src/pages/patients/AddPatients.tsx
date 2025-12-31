import { useState } from 'react'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import Dropdown from '../../components/input/Dropdown'
import { routePaths } from '../../constants/routePaths'

// ✅ Dropdown options
const maritalStatusOptions = [
  { id: 'single', name: 'Single' },
  { id: 'married', name: 'Married' },
  { id: 'widowed', name: 'Widowed' },
  { id: 'divorced', name: 'Divorced' },
]

const bloodGroupOptions = [
  { id: 'A+', name: 'A+' },
  { id: 'A-', name: 'A-' },
  { id: 'B+', name: 'B+' },
  { id: 'B-', name: 'B-' },
  { id: 'O+', name: 'O+' },
  { id: 'O-', name: 'O-' },
  { id: 'AB+', name: 'AB+' },
  { id: 'AB-', name: 'AB-' },
]

const patientSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  gender: Yup.string().required('Gender is required'),
  age: Yup.number()
    .typeError('Age must be a number')
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .required('Age is required'),
  guardianName: Yup.string().required('Guardian name is required'),
  maritalStatus: Yup.string().required('Marital status is required'),
  bloodGroup: Yup.string().required('Blood group is required'),
  phoneNumber: Yup.string()
    .optional()
    .matches(/^\d{11}$/, 'Phone number is required & must be exactly 11 digits')
    .nullable(),
})
const AddPatients = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')
  if (!token) console.error('No token found. Users must login first.')

  const [form, setForm] = useState({
    name: '',
    guardianName: '',
    gender: '',
    age: '',
    maritalStatus: '',
    bloodGroup: '',
    phoneNumber: '',
    cnicNumber: '',
    address: '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // ✅ Format phone like 0304-3763110 (for display only)
  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length > 4) return `${digits.slice(0, 4)}-${digits.slice(4)}`
    return digits
  }

  // ✅ Format CNIC like 12345-1234567-1 (for display only)
  const formatCnicNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 13)
    if (digits.length > 12)
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return digits
  }

  // ✅ Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'phoneNumber') formattedValue = formatPhoneNumber(value)
    else if (name === 'cnicNumber') formattedValue = formatCnicNumber(value)

    setForm((prev) => ({ ...prev, [name]: formattedValue }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setGeneralError(null)
  }

  // ✅ Handle dropdown select
  const handleDropdownSelect = (
    name: string,
    option: { id: string | number; name: string }
  ) => {
    setForm((prev) => ({ ...prev, [name]: option.name }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setGeneralError(null)
  }

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setGeneralError(null)

    try {
      const cleanForm = {
        ...form,
        phoneNumber: form.phoneNumber.replace(/\D/g, ''),
        cnicNumber: form.cnicNumber.replace(/\D/g, ''),
      }

      await patientSchema.validate(cleanForm, { abortEarly: false })
      setErrors({})
      setLoading(true)

      const res = await fetch(`${API_BASE}/api/patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanForm),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data?.errors) setErrors(data.errors)
        if (data?.general_error) setGeneralError(data.general_error)
        if (!data?.errors && !data?.general_error)
          setGeneralError('Failed to add patient')
        return
      }

      setSuccess('Patient added successfully ✅')
      setForm({
        name: '',
        guardianName: '',
        gender: '',
        age: '',
        maritalStatus: '',
        bloodGroup: '',
        phoneNumber: '',
        cnicNumber: '',
        address: '',
      })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: { [key: string]: string } = {}
        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message
        })
        setErrors(newErrors)
      } else if (err instanceof Error) {
        setGeneralError(err.message || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {generalError && (
        <p className="text-red text-center col-span-full">{generalError}</p>
      )}
      {success && (
        <p className="text-green-600 text-center col-span-full">{success}</p>
      )}

      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Patient</p>
        <Button to={routePaths.PATIENTS} asLink={true}>
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

      <form
        onSubmit={handleSubmit}
        className="grid min-desktop:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6"
      >
        {/* Name */}
        <GroupInput>
          <Label required="required" htmlFor="name">
            Full Name
          </Label>
          <Input
            name="name"
            placeholder="Enter patient name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red text-sm">{errors.name}</p>}
        </GroupInput>

        {/* Guardian Name */}
        <GroupInput>
          <Label>Father / Guardian Name</Label>
          <Input
            name="guardianName"
            placeholder="Enter father/guardian name"
            value={form.guardianName}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Gender */}
        <GroupInput>
          <Label required="required" htmlFor="gender">
            Gender
          </Label>
          <div className="flex items-center gap-2">
            {['Male', 'Female', 'Other'].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={handleChange}
                  className="accent-dark"
                />
                <span className="text-sm font-normal">{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-red text-sm">{errors.gender}</p>}
        </GroupInput>

        {/* Age */}
        <GroupInput>
          <Label required="required" htmlFor="age">
            Age
          </Label>
          <Input
            name="age"
            placeholder="Years"
            value={form.age}
            onChange={handleChange}
            type="number"
          />
          {errors.age && <p className="text-red text-sm">{errors.age}</p>}
        </GroupInput>

        {/* ✅ Marital Status (Dropdown) */}
        <GroupInput>
          <Label>Marital Status</Label>
          <Dropdown
            options={maritalStatusOptions}
            selected={
              form.maritalStatus
                ? { id: form.maritalStatus, name: form.maritalStatus }
                : null
            }
            onSelect={(opt) => handleDropdownSelect('maritalStatus', opt)}
            placeholder="Select status"
          />
          {errors.maritalStatus && (
            <p className="text-red text-sm">{errors.maritalStatus}</p>
          )}
        </GroupInput>

        {/* ✅ Blood Group (Dropdown) */}
        <GroupInput>
          <Label>Blood Group</Label>
          <Dropdown
            options={bloodGroupOptions}
            selected={
              form.bloodGroup
                ? { id: form.bloodGroup, name: form.bloodGroup }
                : null
            }
            onSelect={(opt) => handleDropdownSelect('bloodGroup', opt)}
            placeholder="Select blood group"
          />
          {errors.bloodGroup && (
            <p className="text-red text-sm">{errors.bloodGroup}</p>
          )}
        </GroupInput>

        {/* Phone Number */}
        <GroupInput>
          <Label required="required" htmlFor="phoneNumber">
            Phone Number
          </Label>
          <Input
            name="phoneNumber"
            placeholder="0000-0000000"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && (
            <p className="text-red text-sm">{errors.phoneNumber}</p>
          )}
        </GroupInput>

        {/* CNIC */}
        <GroupInput>
          <Label htmlFor="cnicNumber">CNIC / ID Card No.</Label>
          <Input
            name="cnicNumber"
            placeholder="00000-0000000-0"
            value={form.cnicNumber}
            onChange={handleChange}
            maxLength={14}
          />
          {errors.cnicNumber && (
            <p className="text-red text-sm">{errors.cnicNumber}</p>
          )}
        </GroupInput>

        {/* Address */}
        <GroupInput className="col-span-2">
          <Label>Address</Label>
          <TextArea
            name="address"
            placeholder="Enter full address"
            value={form.address}
            onChange={handleChange}
          />
          {errors.address && (
            <p className="text-red text-sm">{errors.address}</p>
          )}
        </GroupInput>

        {/* Submit */}
        <div className="col-span-full mx-auto">
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add patient'}
          </Button>
        </div>
      </form>
    </>
  )
}

export default AddPatients
