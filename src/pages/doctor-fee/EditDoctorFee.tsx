




import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import Dropdown from '../../components/input/Dropdown'
import ToggleButton from '../../components/button/ToggleButton'
import { routePaths } from '../../constants/routePaths'

const procedureSchema = Yup.object().shape({
  doctor: Yup.object().nullable().required('Doctor is required'),
  department: Yup.object().nullable().required('Department is required'),
  procedure: Yup.object().nullable().required('Procedure is required'),
  paymentType: Yup.string().required('Payment type is required'),
  procedurePrice: Yup.string().required('Procedure price is required'),
})

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

const EditDoctorFee = () => {
  const { id } = useParams() // ✅ get id from params

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
  const token = localStorage.getItem('token')

  // --------------------------------
  // INPUT HANDLERS
  // --------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement
    const { id, type, value, checked } = target
    setForm(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelect = (
    field: keyof FormType,
    value: OptionType | string | null | number
  ) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // --------------------------------
  // FETCH DROPDOWN DATA
  // --------------------------------
  useEffect(() => {
    if (!token) return

    const fetchLists = async () => {
      try {
        const [docRes, procRes, deptRes] = await Promise.all([
          fetch(`${API_BASE}/api/doctors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/procedures`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/department`, {
            headers: { Authorization: `Bearer ${token}` },
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
        console.error('Dropdown fetch error:', err)
      }
    }

    fetchLists()
  }, [API_BASE, token])

  // --------------------------------
  // FETCH SINGLE DOCTOR FEE (EDIT MODE)
  // --------------------------------
  useEffect(() => {
    if (!id || !token) return

    const fetchSingleDoctorFee = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/doctor-fees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (!res.ok) throw new Error('Failed to load record')

        const fee = data.data

        // 🟢 Fill form values
        setForm({
          status: fee.status ?? false,
          doctor: fee.doctor || null,
          department: fee.department || null,
          procedure: fee.procedure || null,
          description: fee.description || '',
          paymentType: fee.paymentType || '',
          doctorShare: fee.doctorShare?.toString() || '',
          hospitalShare: fee.hospitalShare?.toString() || '',
          fixedPrice: fee.fixedPrice?.toString() || '',
          procedurePrice: fee.procedurePrice?.toString() || '',
        })
      } catch (err) {
        console.error(err)
        setErrorMsg('Failed to load doctor fee details')
      }
    }

    fetchSingleDoctorFee()
  }, [id, API_BASE, token])

  // --------------------------------
  // UPDATE (PUT)
  // --------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return setErrorMsg('Authorization token missing.')

    setIsLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      await procedureSchema.validate(form, { abortEarly: false })

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

      const response = await fetch(`${API_BASE}/api/doctor-fees/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Update failed')

      setSuccessMsg('✅ Doctor fee updated successfully!')
      setErrors({})
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const fieldErrors: Record<string, string> = {}
        err.inner.forEach(e => e.path && (fieldErrors[e.path] = e.message))
        setErrors(fieldErrors)
      } else if (err instanceof Error) {
        setErrorMsg(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // --------------------------------
  // UI
  // --------------------------------
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Edit Fee</p>
        <Button to={routePaths.DOCTOR_FEE} asLink>
          Back
        </Button>
      </div>

      {successMsg && <p className="text-green-600">{successMsg}</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
    <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label htmlFor="status">Status</Label>
          <ToggleButton
            id="status"
            checked={form.status}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Doctor */}
        <GroupInput>
          <Label required="true">Doctor</Label>
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
          <Label required="true">Department</Label>
          <Dropdown
            options={departments}
            selected={form.department}
            onSelect={(val) => handleSelect('department', val)}
            placeholder="Select Department"
          />
          {errors.department && (
            <p className="text-red text-sm">{errors.department}</p>
          )}
        </GroupInput>

        {/* Procedure */}
        <GroupInput>
          <Label required="true">Procedure</Label>
          <Dropdown
            options={procedures}
            selected={form.procedure}
            onSelect={(val) => handleSelect('procedure', val)}
            placeholder="Select Procedure"
          />
          {errors.procedure && (
            <p className="text-red text-sm">{errors.procedure}</p>
          )}
        </GroupInput>

        {/* Procedure Price */}
        <GroupInput>
          <Label required="true" htmlFor="procedurePrice">
            Procedure Price (Rs)
          </Label>
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
          <Label required="true">Payment Type</Label>
          <Dropdown
            options={[
              { id: 'Share', name: 'Share' },
              { id: 'Fixed', name: 'Fixed' },
              { id: 'Share + Fixed', name: 'Share + Fixed' },
            ]}
            selected={
              form.paymentType
                ? { id: form.paymentType, name: form.paymentType }
                : null
            }
            onSelect={(val) => handleSelect('paymentType', val.id)}
            placeholder="Select Payment Type"
          />
          {errors.paymentType && (
            <p className="text-red text-sm">{errors.paymentType}</p>
          )}
        </GroupInput>

        {/* Doctor/Hospital Share */}
        {(form.paymentType === 'Share' ||
          form.paymentType === 'Share + Fixed') && (
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
        {(form.paymentType === 'Fixed' ||
          form.paymentType === 'Share + Fixed') && (
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
        <GroupInput className="col-span-2">
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
          {isLoading ? 'Updating...' : 'Update Doctor Fee'}
        </Button>
        </div>
      </div>
    </form>
  )
}

export default EditDoctorFee
