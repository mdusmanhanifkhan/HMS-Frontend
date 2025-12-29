import { useEffect, useState } from 'react'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import Dropdown from '../../components/input/Dropdown'
import ErrorMessage from '../../components/error-handling/ErrorMessage'
import SuccessMessage from '../../components/error-handling/SuccessMessage'
import * as yup from 'yup'
import ToggleButton from '../../components/button/ToggleButton'
import { routePaths } from '../../constants/routePaths'

const doctorSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  gender: yup.string().required('Gender is required'),
  age: yup.number().required('Age is required').min(1, 'Age must be valid'),
  idCard: yup.string().required('CNIC / ID Card is required'),
  phoneNumber: yup.string().required('Mobile Number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  joinDate: yup.string().required('Joining date is required'),
  employmentType: yup
    .string()
    .oneOf(
      ['Full-time', 'Visiting', 'Consultant', 'On Call'],
      'Select a valid employment type'
    )
    .required('Employment type is required'),
  shiftType: yup
    .string()
    .oneOf(['Morning', 'Evening', 'Night'], 'Select a valid shift type')
    .required('Shift type is required'),
  maxPatients: yup
    .number()
    .required('Max Patients per day is required')
    .min(1, 'Must be at least 1'),
  experience: yup.number().required('Experience is required'),
  departmentIds: yup
    .array()
    .of(yup.number())
    .min(1, 'Select at least one department'),
})

const initialFormState = {
  status: true,
  name: '',
  guardianName: '',
  gender: '',
  dateOfBirth: '',
  age: 0,
  idCard: '',
  phoneNumber: '',
  email: '',
  address: '',
  specialization: '',
  qualification: '',
  subSpecialities: '',
  experience: '',
  languages: '',
  joinDate: '',
  departmentIds: [] as number[],
  employmentType: null as string | null,
  availableDays: [] as string[],
  timingFrom: '',
  timingTo: '',
  shiftType: null as string | null,
  maxPatients: '',
}

const AddDoctor = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState(initialFormState)

  const employmentTypes = [
    { id: 1, name: 'Full-time' },
    { id: 2, name: 'Visiting' },
    { id: 3, name: 'Consultant' },
    { id: 4, name: 'On Call' },
    { id: 5, name: 'Part Time' },
  ]

  const shiftTypes = [
    { id: 1, name: 'Morning' },
    { id: 2, name: 'Evening' },
    { id: 3, name: 'Night' },
  ]

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target
    let newValue: string | number | boolean = value

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked
    } else if (type === 'number') {
      newValue = Number(value)
    } else if (id === 'idCard') {
      // CNIC formatting with dash: 12345-1234567-1
      const digitsOnly = value.replace(/\D/g, '').slice(0, 13)
      const formatted = digitsOnly
        .replace(/^(\d{5})(\d{7})(\d{1})$/, '$1-$2-$3')
        .replace(/^(\d{5})(\d{0,7})$/, '$1-$2')
      newValue = formatted
    } else if (id === 'dateOfBirth') {
      // Auto calculate age
      const today = new Date()
      const birthDate = new Date(value)
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      // setForm((prev) => ({ ...prev, age })) // update age
      setForm((prev) => ({ ...prev, age: Number(age) }))
    }

    setForm((prev) => ({ ...prev, [id]: newValue }))

    setErrors((prev) => {
      if (prev[id]) {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      }
      return prev
    })
  }

  const handleSelect = (
    field: keyof typeof form,
    value: { id: number; name: string } | null
  ) => {
    setForm((prev) => ({ ...prev, [field]: value ? value.name : null }))
  }

  const handleDaySelect = (day: string) => {
    setForm((prev) => {
      const selected = prev.availableDays.includes(day)
        ? prev.availableDays?.filter((d) => d !== day)
        : [...prev.availableDays, day]
      return { ...prev, availableDays: selected }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setErrors({})

    try {
      await doctorSchema.validate(form, { abortEarly: false })
      setLoading(true)

      // Remove dashes from CNIC before sending
      const payload = { ...form, idCard: form.idCard.replace(/-/g, '') }

      const res = await fetch(`${API_URL}/api/doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.general_error || 'Something went wrong')

      setSuccessMsg('Doctor created successfully!')
      setForm(initialFormState)
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        // Handle yup validation errors
        const fieldErrors: Record<string, string> = {}
        err.inner.forEach((e) => {
          if (e.path) fieldErrors[e.path] = e.message
        })
        setErrors(fieldErrors)
      } else if (err instanceof Error) {
        // Handle general JS errors
        setErrorMsg(err.message || 'Submission failed')
      } else {
        // Fallback for unknown error types
        setErrorMsg('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/department`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const resData = await res.json()
        setDepartments(resData.data)
      } catch (error) {
        console.log('Error fetching departments:', error)
      }
    }
    fetchDepartments()
  }, [API_URL, token])

  return (
    <>
      {errorMsg && <ErrorMessage error={errorMsg} />}
      {successMsg && <SuccessMessage success={successMsg} />}
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <p className="text-xl font-semibold w-full">Add Doctor</p>
          <Button to={routePaths.DOCTORS} asLink>
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

        {/* ===== PERSONAL INFO ===== */}
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold w-full underline">
            Personal Information:
          </p>
          <GroupInput className="col-span-full">
            <Label htmlFor="status">Status</Label>
            <ToggleButton
              id="status"
              checked={form.status}
              onChange={handleChange}
            />
          </GroupInput>
          <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
            {/* Name */}
            <GroupInput>
              <Label htmlFor="name" required="true">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter Doctor Full Name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red text-xs">{errors.name}</p>}
            </GroupInput>

            {/* Father / Husband */}
            <GroupInput>
              <Label htmlFor="guardianName">Father / Husband Name</Label>
              <Input
                id="guardianName"
                placeholder="Enter Father / Husband Name"
                value={form.guardianName}
                onChange={handleChange}
              />
            </GroupInput>

            {/* Gender */}
            <GroupInput>
              <Label required="true">Gender</Label>
              <div className="flex items-center gap-2">
                {['Male', 'Female', 'Other'].map((g) => (
                  <label key={g} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      checked={form.gender === g}
                      onChange={() => setForm((e) => ({ ...e, gender: g }))}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red text-xs">{errors.gender}</p>
              )}
            </GroupInput>

            {/* Date of Birth */}
            <GroupInput>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </GroupInput>

            {/* Age */}
            <GroupInput>
              <Label htmlFor="age" required="true">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter Age"
              />
              {errors.age && <p className="text-red text-xs">{errors.age}</p>}
            </GroupInput>

            {/* CNIC */}
            <GroupInput>
              <Label htmlFor="idCard" required="true">
                CNIC / ID Card
              </Label>
              <Input
                id="idCard"
                placeholder="Enter CNIC"
                value={form.idCard}
                onChange={handleChange}
              />
              {errors.idCard && (
                <p className="text-red text-xs">{errors.idCard}</p>
              )}
            </GroupInput>

            {/* Phone */}
            <GroupInput>
              <Label htmlFor="phoneNumber" required="true">
                Mobile Number
              </Label>
              <Input
                id="phoneNumber"
                placeholder="Enter Contact"
                value={form.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <p className="text-red text-xs">{errors.phoneNumber}</p>
              )}
            </GroupInput>

            {/* Email */}
            <GroupInput>
              <Label htmlFor="email" required="true">
                Email
              </Label>
              <Input
                id="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red text-xs">{errors.email}</p>
              )}
            </GroupInput>

            {/* Address */}
            <GroupInput>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter Address"
                value={form.address}
                onChange={handleChange}
              />
            </GroupInput>
          </div>
        </div>

        {/* ===== PROFESSIONAL INFO ===== */}
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold w-full underline">
            Professional Information:
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
            {/* Specialization */}
            <GroupInput>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="Enter Specialization"
                value={form.specialization}
                onChange={handleChange}
              />
            </GroupInput>

            {/* Department */}
            <GroupInput>
              <Label required="true">Department</Label>
              <Dropdown
                options={departments}
                selected={departments?.filter((d) =>
                  form.departmentIds.includes(Number(d.id))
                )}
                // onSelect={opt => setForm(prev => {
                //   const exists = prev.departmentIds.includes(opt.id)
                //   return { ...prev, departmentIds: exists ? prev.departmentIds.filter(id => id!==opt.id) : [...prev.departmentIds,opt.id] }
                // })}
                onSelect={(opt) =>
                  setForm((prev) => {
                    if (!opt) return prev // safeguard
                    const id = Number(opt.id) // ensure it's a number
                    const exists = prev.departmentIds.includes(id)
                    return {
                      ...prev,
                      departmentIds: exists
                        ? prev.departmentIds?.filter((d) => d !== id)
                        : [...prev.departmentIds, id],
                    }
                  })
                }
                placeholder="Select Departments"
                multiple={true}
              />
              {errors.departmentIds && (
                <p className="text-red text-xs">{errors.departmentIds}</p>
              )}
            </GroupInput>

            {/* Qualification */}
            <GroupInput>
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                placeholder="Enter Qualification"
                value={form.qualification}
                onChange={handleChange}
              />
            </GroupInput>

            {/* Sub-Specialties */}
            <GroupInput>
              <Label htmlFor="subSpecialities">Sub-Specialties</Label>
              <Input
                id="subSpecialities"
                placeholder="Enter Sub-Specialties"
                value={form.subSpecialities}
                onChange={handleChange}
              />
            </GroupInput>

            {/* Experience */}
            <GroupInput>
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input
                id="experience"
                type="number"
                placeholder="Enter Experience"
                value={form.experience}
                onChange={handleChange}
              />
              {errors.experience && (
                <p className="text-red text-xs">{errors.experience}</p>
              )}
            </GroupInput>

            {/* Languages */}
            <GroupInput>
              <Label htmlFor="languages">Languages Spoken</Label>
              <Input
                id="languages"
                placeholder="Enter Languages"
                value={form.languages}
                onChange={handleChange}
              />
            </GroupInput>

            {/* Join Date */}
            <GroupInput>
              <Label htmlFor="joinDate" required="true">
                Joining Date
              </Label>
              <Input
                id="joinDate"
                type="date"
                value={form.joinDate}
                onChange={handleChange}
              />
              {errors.joinDate && (
                <p className="text-red text-xs">{errors.joinDate}</p>
              )}
            </GroupInput>

            {/* Employment Type */}
            <GroupInput>
              <Label required="true">Employment Type</Label>
              <Dropdown
                options={employmentTypes}
                selected={
                  employmentTypes.find(
                    (item) => item.name === form.employmentType
                  ) || null
                }
                onSelect={(e) =>
                  handleSelect(
                    'employmentType',
                    e ? { id: Number(e.id), name: e.name } : null
                  )
                }
                placeholder="Select Employment Type"
              />
              {errors.employmentType && (
                <p className="text-red text-xs">{errors.employmentType}</p>
              )}
            </GroupInput>
          </div>
        </div>

        {/* ===== AVAILABILITY ===== */}
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold w-full underline">
            Availability:
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
            {/* Shift */}
            <GroupInput>
              <Label>Shift Type</Label>
              <Dropdown
                options={shiftTypes}
                selected={
                  shiftTypes.find((item) => item.name === form.shiftType) ||
                  null
                }
                onSelect={(e) =>
                  handleSelect(
                    'shiftType',
                    e ? { id: Number(e.id), name: e.name } : null
                  )
                }
                placeholder="Select Shift"
              />
              {errors.shiftType && (
                <p className="text-red text-xs">{errors.shiftType}</p>
              )}
            </GroupInput>

            {/* Max Patients */}
            <GroupInput>
              <Label htmlFor="maxPatients" required="true">
                Max Patients Per Day
              </Label>
              <Input
                id="maxPatients"
                type="number"
                value={form.maxPatients}
                onChange={handleChange}
                placeholder="Enter Maximum Patients"
              />
              {errors.maxPatients && (
                <p className="text-red text-xs">{errors.maxPatients}</p>
              )}
            </GroupInput>

            {/* Available Time */}
            <div className="flex items-start gap-3">
              <GroupInput>
                <Label htmlFor="timingFrom">Available From</Label>
                <Input
                  id="timingFrom"
                  type="time"
                  value={form.timingFrom}
                  onChange={handleChange}
                />
              </GroupInput>
              <GroupInput>
                <Label htmlFor="timingTo">Available To</Label>
                <Input
                  id="timingTo"
                  type="time"
                  value={form.timingTo}
                  onChange={handleChange}
                />
              </GroupInput>
            </div>

            {/* Available Days */}
            <GroupInput>
              <Label>Available Days</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={form.availableDays.includes(day)}
                      onChange={() => handleDaySelect(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </GroupInput>
          </div>
        </div>

        <div className="col-span-full mx-auto mt-5">
          <Button type="submit">{loading ? 'loading...' : 'Add Doctor'}</Button>
        </div>
      </form>
    </>
  )
}

export default AddDoctor
