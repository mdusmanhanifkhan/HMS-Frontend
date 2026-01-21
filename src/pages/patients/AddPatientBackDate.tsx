import { useState } from 'react'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import Dropdown from '../../components/input/Dropdown'
import { routePaths } from '../../constants/routePaths'
import SuccessMessage from '../../components/error-handling/SuccessMessage'
import { useNavigate } from 'react-router-dom'

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
  maritalStatus: Yup.string().required('Marital status is required'),
})
const AddPatientBackDate = () => {
  const navigate = useNavigate()

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
    date: '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [linkLoading, setLinkLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [patientId, setPatientId] = useState<number | null>(null)
  const [submitAction, setSubmitAction] = useState<'save' | 'saveAndPrint'>(
    'save'
  )

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length > 4) return `${digits.slice(0, 4)}-${digits.slice(4)}`
    return digits
  }

  const formatCnicNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 13)
    if (digits.length > 12)
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return digits
  }

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

  const handleDropdownSelect = (
    name: string,
    option: { id: string | number; name: string }
  ) => {
    setForm((prev) => ({ ...prev, [name]: option.name }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setGeneralError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setGeneralError(null)

    try {
      const cleanForm = {
        ...form,
        age: Number(form.age),
        phoneNumber: form.phoneNumber?.replace(/\D/g, ''),
        cnicNumber: form.cnicNumber?.replace(/\D/g, ''),
        createdByUserId: 1,
        createdAt: form.date ? new Date(form.date).toISOString() : undefined,
      }
      await patientSchema.validate(cleanForm, { abortEarly: false })
      setErrors({})
      setLoading(true)
      setLinkLoading(true)

      const res = await fetch(`${API_BASE}/api/patient-backdate`, {
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
      setPatientId(data?.data?.patientId)
      if (submitAction === 'saveAndPrint') {
        const patientId = data?.data?.patientId

        if (patientId) {
          navigate(`/patients/patients-receipt-generate/${patientId}`)
        }
      } else {
        setSuccess('Patient added successfully ✅')
      }
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
      setLinkLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!patientId) return
    await navigator.clipboard.writeText(String(patientId))
    setSuccess('Copy Successfully')
  }

  return (
    <>
      {generalError && (
        <p className="text-red text-center col-span-full">{generalError}</p>
      )}
      {success && <SuccessMessage msg={success} />}

      <div className="flex justify-between items-center border-b pb-3">
        <div className="flex items-center gap-3">
          <p className="text-xl font-semibold w-full">Add Patient</p>
          <Button
            onClick={() => {
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
                date: '',
              })
              setPatientId(null)
            }}
            className="px-2 !py-0.5"
          >
            +
          </Button>
        </div>
        <div className="flex items-center gap-5">
          {patientId && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 hover:bg-gray-200 rounded transition cursor-pointer"
                title="Copy Patient ID"
              >
                {/* Copy SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <p className="font-semibold text-lg">{patientId || ''}</p>
            </div>
          )}
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
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid min-desktop:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6"
      >
        <GroupInput>
          <Label htmlFor="date">Select Date</Label>
          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </GroupInput>

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

        <GroupInput>
          <Label required="true">Marital Status</Label>
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
        </GroupInput>

        <GroupInput>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            name="phoneNumber"
            placeholder="0000-0000000"
            value={form.phoneNumber}
            onChange={handleChange}
            maxLength={12}
          />
        </GroupInput>

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

        <div className="col-span-full mx-auto flex items-center gap-5">
          <Button
            type="submit"
            disabled={loading}
            onClick={() => setSubmitAction('save')}
          >
            {loading ? 'loading...' : 'Add patient'}
          </Button>

          <Button
            type="submit"
            disabled={linkLoading}
            onClick={() => setSubmitAction('saveAndPrint')}
          >
            {linkLoading ? 'loading...' : 'Add patient & generate receipt'}
          </Button>
        </div>
      </form>
    </>
  )
}

export default AddPatientBackDate
