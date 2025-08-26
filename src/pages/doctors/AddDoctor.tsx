import { useEffect, useState } from 'react'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import Dropdown from '../../components/input/Dropdown'
import { number } from 'yup'

const AddDoctor = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([])
  const [form, setForm] = useState({
    status: true,
    name: '',
    guardianName: '',
    gender: '',
    dateOfBirth: '',
    age: number,
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
    employmentType: null as { id: number; name: string } | null,
    availableDays: [] as string[],
    timingFrom: '',
    timingTo: '',
    shiftType: null as { id: number; name: string } | null,
    maxPatients: '',
  })

  const employmentTypes = [
    { id: 1, name: 'Full-time' },
    { id: 2, name: 'Visiting' },
    { id: 3, name: 'Consultant' },
    { id: 4, name: 'On Call' },
  ]

  const shiftTypes = [
    { id: 1, name: 'Morning' },
    { id: 2, name: 'Evening' },
    { id: 3, name: 'Night' },
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
    }

    setForm((prev) => ({
      ...prev,
      [id]: newValue,
    }))
  }

 const handleSelect = (
  field: keyof typeof form,
  value: { id: number; name: string } | null
) => {
  setForm((prev) => ({
    ...prev,
    [field]: value ? value.name : null, 
  }));
};


  const handleDaySelect = (day: string) => {
    setForm((prev) => {
      const selected = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day]
      return { ...prev, availableDays: selected }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Raw Doctor Data:', form)

    try {
      const res = await fetch(`${API_URL}/api/doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      console.log('Doctor created successfully:', data)
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/department`)
        const resData = await res.json()
        setDepartments(resData.data)
      } catch (error) {
        console.log('Error fetching departments:', error)
      }
    }
    fetchDepartments()
  }, [API_URL])

  console.log(form)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <p className="text-xl font-semibold w-full border-b pb-3">Add Doctor</p>

      {/* ===== PERSONAL INFO ===== */}
      <div className="flex flex-col gap-3">
        <p className="text-lg font-semibold w-full underline">
          Personal Information:
        </p>
        <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
          <GroupInput>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter Doctor Full Name"
              value={form.name}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="guardianName">Father / Husband Name</Label>
            <Input
              id="guardianName"
              placeholder="Enter Father / Husband Name"
              value={form.guardianName}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label>Gender</Label>
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
          </GroupInput>
          <GroupInput>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              placeholder="Enter the Date of Birth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter Age"
              value={form.age}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="idCard">CNIC / ID Card</Label>
            <Input
              id="idCard"
              placeholder="Enter CNIC"
              value={form.idCard}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="phoneNumber">Mobile Number</Label>
            <Input
              id="phoneNumber"
              placeholder="Enter Contact"
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
            />
          </GroupInput>
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
          <GroupInput>
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              placeholder="Enter Specialization"
              value={form.specialization}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label>Department</Label>
            <Dropdown
              options={departments}
              selected={departments.filter((d) =>
                form.departmentIds.includes(Number(d.id))
              )}
              onSelect={(opt) =>
                setForm((prev) => {
                  const exists = prev.departmentIds.includes(opt.id)
                  return {
                    ...prev,
                    departmentIds: exists
                      ? prev.departmentIds.filter((id) => id !== opt.id)
                      : [...prev.departmentIds, opt.id],
                  }
                })
              }
              placeholder="Select Departments"
              multiple={true}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              placeholder="Enter Qualification"
              value={form.qualification}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="subSpecialties">Sub-Specialties</Label>
            <Input
              id="subSpecialties"
              placeholder="Enter Sub-Specialties"
              value={form.subSpecialities}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="experience">Experience (Years)</Label>
            <Input
              id="experience"
              type="number"
              placeholder="Enter Experience"
              value={form.experience}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="languages">Languages Spoken</Label>
            <Input
              id="languages"
              placeholder="Enter Languages"
              value={form.languages}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="joinDate">Joining Date</Label>
            <Input
              id="joinDate"
              type="date"
              value={form.joinDate}
              onChange={handleChange}
            />
          </GroupInput>
          <GroupInput>
            <Label>Employment Type</Label>
            <Dropdown
              options={employmentTypes}
              selected={form.employmentType}
              onSelect={(e) =>
                handleSelect(
                  'employmentType',
                  e ? { id: Number(e.id), name: e.name } : null
                )
              }
              placeholder="Select Employment Type"
            />
          </GroupInput>
        </div>
      </div>

      {/* ===== FEES & CONSULTATION ===== */}
      {/* <p className="text-xl font-semibold w-full">Consultation & Fees</p>
      <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
        <GroupInput>
          <Label htmlFor="consultationFee">Consultation Fee</Label>
          <Input
            id="consultationFee"
            type="number"
            placeholder="Enter Fee"
            value={form.consultationFee}
            onChange={handleChange}
          />
        </GroupInput>
        <GroupInput>
          <Label htmlFor="followUpFee">Follow-up Fee</Label>
          <Input
            id="followUpFee"
            type="number"
            placeholder="Enter Follow-up Fee"
            value={form.followUpFee}
            onChange={handleChange}
          />
        </GroupInput>
        <GroupInput>
          <Label>Payment Type</Label>
          <Dropdown
            options={paymentTypes}
            selected={form.paymentType}
            onSelect={(v) => handleSelect('paymentType', v)}
            placeholder="Select Payment Type"
          />
        </GroupInput>
        <GroupInput>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.discountAllowed}
              onChange={(e) =>
                setForm((p) => ({ ...p, discountAllowed: e.target.checked }))
              }
            />
            Allow Discounts
          </label>
        </GroupInput>
      </div> */}

      {/* ===== AVAILABILITY ===== */}
      <div className="flex flex-col gap-3">
        <p className="text-lg font-semibold w-full underline">Availability:</p>
        <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
          <GroupInput>
            <Label>Shift Type</Label>
            <Dropdown
              options={shiftTypes}
              selected={form.shiftType}
              onSelect={(e) =>
                handleSelect(
                  'shiftType',
                  e ? { id: Number(e.id), name: e.name } : null
                )
              }
              placeholder="Select Shift"
            />
          </GroupInput>
          <GroupInput>
            <Label htmlFor="maxPatients">Max Patients Per Day</Label>
            <Input
              id="maxPatients"
              type="number"
              value={form.maxPatients}
              onChange={handleChange}
            />
          </GroupInput>
          <div className="flex items-center gap-3">
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
        <Button type="submit">Add Doctor</Button>
      </div>
    </form>
  )
}

export default AddDoctor
