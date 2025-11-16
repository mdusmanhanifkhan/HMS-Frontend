import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import Dropdown from '../../components/input/Dropdown'

// ✅ Validation schema
const procedureSchema = Yup.object().shape({
  doctor: Yup.object().nullable().required('Doctor is required'),
  department: Yup.object().nullable().required('Department is required'),
  procedure: Yup.object().nullable().required('Procedure is required'),
  paymentType: Yup.string().required('Payment type is required'),
  procedurePrice: Yup.string().required('Procedure price is required'),
})

// ✅ Types
interface OptionType {
  id: number | string
  name: string
}

interface FormType {
  status: boolean
  doctor: OptionType | null
  department: OptionType | null
  procedure: OptionType | null
  description: string
  paymentType: string
  doctorShare: string
  hospitalShare: string
  fixedPrice: string
  procedurePrice: string
}

const AddDoctorFee = () => {
  const [departments, setDepartments] = useState<OptionType[]>([])
  const [procedures, setProcedures] = useState<OptionType[]>([])
  const [doctors, setDoctors] = useState<OptionType[]>([])
  const [form, setForm] = useState<FormType>({
    status: false,
    doctor: null,
    department: null,
    procedure: null,
    description: '',
    paymentType: '',
    doctorShare: '',
    hospitalShare: '',
    fixedPrice: '',
    procedurePrice: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const token = localStorage.getItem('token') // ✅ Get token

  // ✅ handle input and dropdown changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    const { id, type, value, checked } = target
    setForm((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelect = (field: keyof FormType, value: OptionType | string | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // ✅ handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setErrorMsg('Authorization token missing. Please login.')
      return
    }

    setIsLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      // Validate fields
      await procedureSchema.validate(form, { abortEarly: false })

      // Prepare payload for backend
      const payload = {
        status: form.status,
        doctorId: form.doctor?.id,
        departmentId: form.department?.id,
        procedureId: form.procedure?.id,
        description: form.description,
        paymentType: form.paymentType,
        doctorShare: form.doctorShare || null,
        hospitalShare: form.hospitalShare || null,
        fixedPrice: form.fixedPrice || null,
        procedurePrice: form.procedurePrice || null,
      }

      const response = await fetch(`${API_BASE}/api/doctor-fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ Add token here
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to add doctor fee')

      setSuccessMsg('✅ Doctor fee added successfully!')
      setForm({
        status: false,
        doctor: null,
        department: null,
        procedure: null,
        description: '',
        paymentType: '',
        doctorShare: '',
        hospitalShare: '',
        fixedPrice: '',
        procedurePrice: '',
      })
      setErrors({})
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const fieldErrors: Record<string, string> = {}
        err.inner.forEach((e) => {
          if (e.path) fieldErrors[e.path] = e.message
        })
        setErrors(fieldErrors)
      } else if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Something went wrong')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setErrorMsg('Authorization token missing. Please login.')
        return
      }

      try {
        const [docRes, procRes, deptRes] = await Promise.all([
          fetch(`${API_BASE}/api/doctors`, {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Token added
          }),
          fetch(`${API_BASE}/api/procedures`, {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Token added
          }),
          fetch(`${API_BASE}/api/department`, {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Token added
          }),
        ])
        const [docData, procData, deptData] = await Promise.all([
          docRes.json(),
          procRes.json(),
          deptRes.json(),
        ])
        setDoctors(docData.data || [])
        setProcedures(procData.data || [])
        setDepartments(deptData.data || [])
      } catch (err) {
        console.error('Error fetching dropdown data:', err)
      }
    }
    fetchData()
  }, [API_BASE, token])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <p className="text-xl font-semibold w-full border-b pb-3">Add Doctor Fee</p>

      {successMsg && <p className="text-green-600">{successMsg}</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label htmlFor="status">Status</Label>
          <div className="checkbox-apple">
            <input
              id="status"
              type="checkbox"
              checked={form.status}
              onChange={handleChange}
            />
            <label htmlFor="status"></label>
          </div>
        </GroupInput>

        {/* Doctor */}
        <GroupInput>
          <Label>Doctor</Label>
          <Dropdown
            options={doctors}
            selected={form.doctor}
            onSelect={(val) => handleSelect('doctor', val)}
            placeholder="Select Doctor"
          />
          {errors.doctor && <p className="text-red text-sm">{errors.doctor}</p>}
        </GroupInput>

        {/* Department */}
        <GroupInput>
          <Label>Department</Label>
          <Dropdown
            options={departments}
            selected={form.department}
            onSelect={(val) => handleSelect('department', val)}
            placeholder="Select Department"
          />
          {errors.department && <p className="text-red text-sm">{errors.department}</p>}
        </GroupInput>

        {/* Procedure */}
        <GroupInput>
          <Label>Procedure</Label>
          <Dropdown
            options={procedures}
            selected={form.procedure}
            onSelect={(val) => handleSelect('procedure', val)}
            placeholder="Select Procedure"
          />
          {errors.procedure && <p className="text-red text-sm">{errors.procedure}</p>}
        </GroupInput>

        {/* Procedure Price */}
        <GroupInput>
          <Label htmlFor="procedurePrice">Procedure Price (Rs)</Label>
          <Input
            id="procedurePrice"
            type="number"
            value={form.procedurePrice}
            onChange={handleChange}
          />
          {errors.procedurePrice && (
            <p className="text-red text-sm">{errors.procedurePrice}</p>
          )}
        </GroupInput>

        {/* Payment Type */}
        <GroupInput>
          <Label>Payment Type</Label>
          <Dropdown
            options={[
              { id: 'Share', name: 'Share' },
              { id: 'Fixed', name: 'Fixed' },
              { id: 'Share + Fixed', name: 'Share + Fixed' },
            ]}
            selected={
              form.paymentType ? { id: form.paymentType, name: form.paymentType } : null
            }
            onSelect={(val) => handleSelect('paymentType', val.id)}
            placeholder="Select Payment Type"
          />
          {errors.paymentType && (
            <p className="text-red text-sm">{errors.paymentType}</p>
          )}
        </GroupInput>

        {/* Doctor/Hospital Share */}
        {(form.paymentType === 'Share' || form.paymentType === 'Share + Fixed') && (
          <>
            <GroupInput>
              <Label htmlFor="doctorShare">Doctor Share (%)</Label>
              <Input
                id="doctorShare"
                type="number"
                value={form.doctorShare}
                onChange={handleChange}
              />
            </GroupInput>

            <GroupInput>
              <Label htmlFor="hospitalShare">Hospital Share (%)</Label>
              <Input
                id="hospitalShare"
                type="number"
                value={form.hospitalShare}
                onChange={handleChange}
              />
            </GroupInput>
          </>
        )}

        {/* Fixed Price */}
        {(form.paymentType === 'Fixed' || form.paymentType === 'Share + Fixed') && (
          <GroupInput>
            <Label htmlFor="fixedPrice">Fixed Price</Label>
            <Input
              id="fixedPrice"
              type="number"
              value={form.fixedPrice}
              onChange={handleChange}
            />
          </GroupInput>
        )}

        {/* Description */}
        <GroupInput className="col-span-full">
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </GroupInput>

        {/* Submit */}
        <div className="col-span-full mx-auto mt-5">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Add Doctor Fee'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default AddDoctorFee
