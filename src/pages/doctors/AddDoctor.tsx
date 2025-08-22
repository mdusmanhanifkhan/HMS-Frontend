import { useState } from 'react'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import Dropdown from '../../components/input/dropdown'

const AddDoctor = () => {
  const [form, setForm] = useState({
    status: false,
    name: '',
    fatherHusbandName: '',
    gender: '',
    age: '',
    cnic: '',
    phone: '',
    email: '',
    address: '',
    specialization: '',
    department: null as { id: number; name: string } | null,
    qualification: '',
    subSpecialties: '',
    experience: '',
    languages: '',
    joiningDate: '',
    employmentType: null as { id: number; name: string } | null,
    description: '',
    consultationFee: '',
    followUpFee: '',
    discountAllowed: false,
    paymentType: null as { id: number; name: string } | null,
    availableDays: [] as string[],
    availableFrom: '',
    availableTo: '',
    shiftType: null as { id: number; name: string } | null,
    maxPatients: '',
    teleconsultation: false,
  })

  const departments = [
    { id: 1, name: 'Dental' },
    { id: 2, name: 'Ortho' },
    { id: 3, name: 'Eye' },
  ]

  const employmentTypes = [
    { id: 1, name: 'Full-time' },
    { id: 2, name: 'Visiting' },
    { id: 3, name: 'Consultant' },
    { id: 4, name: 'On Call' },
  ]

  const paymentTypes = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Online' },
    { id: 3, name: 'Insurance' },
    { id: 4, name: 'Panel' },
  ]

  const shiftTypes = [
    { id: 1, name: 'Morning' },
    { id: 2, name: 'Evening' },
    { id: 3, name: 'Night' },
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelect = (
    field: keyof typeof form,
    value: { id: number; name: string } | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDaySelect = (day: string) => {
    setForm((prev) => {
      const selected = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day]
      return { ...prev, availableDays: selected }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Doctor Data:', form)
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <p className="text-xl font-semibold w-full border-b pb-3">Add Doctor</p>

      {/* ===== PERSONAL INFO ===== */}
      <p className="text-xl font-semibold w-full">Personal Information</p>
      <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
        <GroupInput>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter Doctor Name"
            value={form.name}
            onChange={handleChange}
          />
        </GroupInput>
        <GroupInput>
          <Label htmlFor="fatherHusbandName">Father / Husband Name</Label>
          <Input
            id="fatherHusbandName"
            placeholder="Enter Father / Husband Name"
            value={form.fatherHusbandName}
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
                  onChange={() => setForm((p) => ({ ...p, gender: g }))}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </GroupInput>
        <GroupInput>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            placeholder="Enter Age"
            value={form.age}
            onChange={handleChange}
          />
        </GroupInput>
        <GroupInput>
          <Label htmlFor="cnic">CNIC / ID Card</Label>
          <Input
            id="cnic"
            placeholder="Enter CNIC"
            value={form.cnic}
            onChange={handleChange}
          />
        </GroupInput>
        <GroupInput>
          <Label htmlFor="phone">Mobile Number</Label>
          <Input
            id="phone"
            placeholder="Enter Contact"
            value={form.phone}
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

      {/* ===== PROFESSIONAL INFO ===== */}
      <p className="text-xl font-semibold w-full">Professional Information</p>
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
            selected={form.department}
            onSelect={(v) => handleSelect('department', v)}
            placeholder="Select Department"
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
            value={form.subSpecialties}
            onChange={handleChange}
          />
        </GroupInput>
        <GroupInput>
          <Label htmlFor="experience">Experience (Years)</Label>
          <Input
            id="experience"
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
          <Label htmlFor="joiningDate">Joining Date</Label>
          <Input
            id="joiningDate"
            type="date"
            value={form.joiningDate}
            onChange={handleChange}
          />
        </GroupInput>
        <GroupInput>
          <Label>Employment Type</Label>
          <Dropdown
            options={employmentTypes}
            selected={form.employmentType}
            onSelect={(v) => handleSelect('employmentType', v)}
            placeholder="Select Employment Type"
          />
        </GroupInput>
      </div>

      {/* ===== FEES & CONSULTATION ===== */}
      <p className="text-xl font-semibold w-full">Consultation & Fees</p>
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
      </div>

      {/* ===== AVAILABILITY ===== */}
      <p className="text-xl font-semibold w-full">Availability</p>
      <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
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
        <div className='flex items-center gap-3'>
            <GroupInput>
          <Label htmlFor="availableFrom">Available From</Label>
          <Input
            id="availableFrom"
            type="time"
            value={form.availableFrom}
            onChange={handleChange}
          />
        </GroupInput>
        <GroupInput>
          <Label htmlFor="availableTo">Available To</Label>
          <Input
            id="availableTo"
            type="time"
            value={form.availableTo}
            onChange={handleChange}
          />
        </GroupInput>
        </div>
        <GroupInput>
          <Label>Shift Type</Label>
          <Dropdown
            options={shiftTypes}
            selected={form.shiftType}
            onSelect={(v) => handleSelect('shiftType', v)}
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
        <GroupInput>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.teleconsultation}
              onChange={(e) =>
                setForm((p) => ({ ...p, teleconsultation: e.target.checked }))
              }
            />
            Teleconsultation Available
          </label>
        </GroupInput>
      </div>

      {/* ===== SUBMIT ===== */}
      <div className="col-span-full mx-auto mt-5">
        <Button type="submit">Add Doctor</Button>
      </div>
    </form>
  )
}

export default AddDoctor
