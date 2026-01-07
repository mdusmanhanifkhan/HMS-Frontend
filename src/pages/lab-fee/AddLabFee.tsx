import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import Dropdown from '../../components/input/Dropdown'
import ToggleButton from '../../components/button/ToggleButton'
import { routePaths } from '../../constants/routePaths'
import SuccessMessage from '../../components/error-handling/SuccessMessage'
import ErrorMessage from '../../components/error-handling/ErrorMessage'

// ✅ Validation schema
const labFeeSchema = Yup.object().shape({
  department: Yup.object().nullable().required('Department is required'),
  procedure: Yup.object().nullable().required('Procedure is required'),
  fee: Yup.number().required('Fee is required').min(0, 'Fee must be >= 0'),
  discount: Yup.number().min(0, 'Discount must be >= 0'),
})

// ✅ Types
interface OptionType {
  id: number | string
  name: string
}

interface FormType {
  status: boolean
  department: OptionType | null
  procedure: OptionType | null
  fee: string
  discount: string
  description: string
}

const AddLabFee = () => {
  const [departments, setDepartments] = useState<OptionType[]>([])
  const [procedures, setProcedures] = useState<OptionType[]>([])
  const [form, setForm] = useState<FormType>({
    status: true,
    department: null,
    procedure: null,
    fee: '',
    discount: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const token = localStorage.getItem('token')

  // ✅ handle input and dropdown changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value } = e.target

    // Only HTMLInputElement has checked
    const checked = (e.target as HTMLInputElement).checked

    setForm((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelect = (field: keyof FormType, value: OptionType | null) => {
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
      await labFeeSchema.validate(form, { abortEarly: false })

      const payload = {
        status: form.status,
        departmentId: form.department?.id,
        procedureId: form.procedure?.id,
        price: Number(form.fee),
        discount: Number(form.discount) || 0,
        description: form.description,
      }

      const response = await fetch(`${API_BASE}/api/lab-fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to add lab fee')

      setSuccessMsg('✅ Lab fee added successfully!')
      setForm({
        status: true,
        department: null,
        procedure: null,
        fee: '',
        discount: '',
        description: '',
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
      if (!token) return

      try {
        const [deptRes, procRes] = await Promise.all([
          fetch(`${API_BASE}/api/department`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/procedures`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        const [deptData, procData] = await Promise.all([
          deptRes.json(),
          procRes.json(),
        ])
        setDepartments(deptData.data || [])
        setProcedures(procData.data || [])
      } catch (err) {
        console.error('Error fetching dropdown data:', err)
      }
    }
    fetchData()
  }, [API_BASE, token])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Lab Fee</p>
        <Button to={routePaths.LAB_FEE} asLink={true}>
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

      {successMsg && <SuccessMessage msg={successMsg} />}
      {errorMsg && <ErrorMessage msg={errorMsg} />}

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

        {/* Fee */}
        <GroupInput>
          <Label required="true">Fee (Rs)</Label>
          <Input
            id="fee"
            type="number"
            value={form.fee}
            onChange={handleChange}
          />
          {errors.fee && <p className="text-red text-sm">{errors.fee}</p>}
        </GroupInput>

        {/* Discount */}
        <GroupInput>
          <Label>Discount (Rs)</Label>
          <Input
            id="discount"
            type="number"
            value={form.discount}
            onChange={handleChange}
          />
          {errors.discount && (
            <p className="text-red text-sm">{errors.discount}</p>
          )}
        </GroupInput>

        {/* Description */}
        <GroupInput className="col-span-1">
          <Label>Description</Label>
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
            {isLoading ? 'Submitting...' : 'Add Lab Fee'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default AddLabFee
