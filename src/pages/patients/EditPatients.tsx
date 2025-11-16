import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import Dropdown from '../../components/input/Dropdown'

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

// ✅ Validation schema
const patientSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  gender: Yup.string().required('Gender is required'),
  age: Yup.number()
    .typeError('Age must be a number')
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .required('Age is required'),
  guardianName: Yup.string(),
  maritalStatus: Yup.string(),
  bloodGroup: Yup.string(),
  phoneNumber: Yup.string().matches(/^\d{11}$/, 'Phone number must be 11 digits'),
  cnicNumber: Yup.string().matches(/^\d{13}$/, 'CNIC must be 13 digits'),
  address: Yup.string(),
})

const EditPatients = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const { id } = useParams()

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
  const [fetching, setFetching] = useState(true)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // ✅ Formatters
  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits
  }

  const formatCnicNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 13)
    if (digits.length > 12) return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return digits
  }

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'phoneNumber') formattedValue = formatPhoneNumber(value)
    else if (name === 'cnicNumber') formattedValue = formatCnicNumber(value)

    setForm((prev) => ({ ...prev, [name]: formattedValue }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setGeneralError(null)
  }

  // ✅ Dropdown selection
  const handleDropdownSelect = (name: string, option: { id: string | number; name: string }) => {
    setForm((prev) => ({ ...prev, [name]: option.name }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setGeneralError(null)
  }

  // ✅ Fetch existing patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/patient/${id}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data?.general_error || 'Failed to load patient data')

        setForm({
          name: data?.data?.name || '',
          guardianName: data?.data?.guardianName || '',
          gender: data?.data?.gender || '',
          age: data?.data?.age?.toString() || '',
          maritalStatus: data?.data?.maritalStatus || '',
          bloodGroup: data?.data?.bloodGroup || '',
          phoneNumber: formatPhoneNumber(data?.data?.phoneNumber || ''),
          cnicNumber: formatCnicNumber(data?.data?.cnicNumber || ''),
          address: data?.data?.address || '',
        })
      } catch (err) {
        if (err instanceof Error) setGeneralError(err.message)
      } finally {
        setFetching(false)
      }
    }

    fetchPatient()
  }, [id])

  // ✅ Submit updated data
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

      const res = await fetch(`${API_BASE}/api/patient/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanForm),
      })

      const data = await res.json()
      if (!res.ok) {
        if (data?.errors) setErrors(data.errors)
        if (data?.general_error) setGeneralError(data.general_error)
        if (!data?.errors && !data?.general_error)
          setGeneralError('Failed to update patient')
        return
      }

      setSuccess('Patient updated successfully ✅')
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

  if (fetching) {
    return <p className="text-center text-gray-600 mt-10">Loading patient details...</p>
  }

  return (
    <>
      <p className="text-3xl font-semibold mb-2">Edit Patient</p>

      {generalError && <p className="text-red text-center col-span-full">{generalError}</p>}
      {success && <p className="text-green-600 text-center col-span-full">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className="grid min-[1440px]:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6"
      >
        {/* Name */}
        <GroupInput>
          <Label>Full Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter patient name" />
          {errors.name && <p className="text-red text-sm">{errors.name}</p>}
        </GroupInput>

        {/* Guardian Name */}
        <GroupInput>
          <Label>Father / Guardian Name</Label>
          <Input name="guardianName" value={form.guardianName} onChange={handleChange} placeholder="Enter guardian name" />
        </GroupInput>

        {/* Gender */}
        <GroupInput>
          <Label>Gender</Label>
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
          <Label>Age</Label>
          <Input name="age" value={form.age} onChange={handleChange} placeholder="Years" />
          {errors.age && <p className="text-red text-sm">{errors.age}</p>}
        </GroupInput>

        {/* Marital Status */}
        <GroupInput>
          <Label>Marital Status</Label>
          <Dropdown
            options={maritalStatusOptions}
            selected={form.maritalStatus ? { id: form.maritalStatus, name: form.maritalStatus } : null}
            onSelect={(opt) => handleDropdownSelect('maritalStatus', opt)}
            placeholder="Select status"
          />
        </GroupInput>

        {/* Blood Group */}
        <GroupInput>
          <Label>Blood Group</Label>
          <Dropdown
            options={bloodGroupOptions}
            selected={form.bloodGroup ? { id: form.bloodGroup, name: form.bloodGroup } : null}
            onSelect={(opt) => handleDropdownSelect('bloodGroup', opt)}
            placeholder="Select blood group"
          />
        </GroupInput>

        {/* Phone Number */}
        <GroupInput>
          <Label>Phone Number</Label>
          <Input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="0304-3763110"
          />
          {errors.phoneNumber && <p className="text-red text-sm">{errors.phoneNumber}</p>}
        </GroupInput>

        {/* CNIC */}
        <GroupInput>
          <Label>CNIC / ID Card No.</Label>
          <Input
            name="cnicNumber"
            value={form.cnicNumber}
            onChange={handleChange}
            placeholder="12345-1234567-1"
          />
          {errors.cnicNumber && <p className="text-red text-sm">{errors.cnicNumber}</p>}
        </GroupInput>

        {/* Address */}
        <GroupInput className="col-span-2">
          <Label>Address</Label>
          <TextArea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter full address"
          />
        </GroupInput>

        {/* Submit */}
        <div className="col-span-full mx-auto">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Patient'}
          </Button>
        </div>
      </form>
    </>
  )
}

export default EditPatients
