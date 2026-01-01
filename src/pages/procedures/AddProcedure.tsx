import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import Dropdown from '../../components/input/Dropdown'
import { routePaths } from '../../constants/routePaths'
import ToggleButton from '../../components/button/ToggleButton'
import ErrorMessage from '../../components/error-handling/ErrorMessage'
import SuccessMessage from '../../components/error-handling/SuccessMessage'

// ✅ Type definitions
interface Department {
  id: number
  name: string
}

interface ProcedureForm {
  status: boolean
  name: string
  shortCode: string
  department: Department | null
  description: string
}

// ✅ Yup schema
const procedureSchema = Yup.object().shape({
  name: Yup.string().required('Procedure name is required'),
  shortCode: Yup.string().required('Short code is required'),
  department: Yup.object()
    .shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
    })
    .nullable()
    .required('Department is required'),
})

const AddProcedure: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [form, setForm] = useState<ProcedureForm>({
    status: true,
    name: '',
    shortCode: '',
    department: null,
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // ✅ Handle input/checkbox change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target

    const checked =
      type === 'checkbox' && 'checked' in e.target
        ? e.target.checked
        : undefined

    setForm((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))

    setErrors((prev) => ({ ...prev, [id]: '' }))
  }

  // ✅ Handle department selection
  const handleSelectDepartment = (dept: Department) => {
    setForm((prev) => ({ ...prev, department: dept }))
    setErrors((prev) => ({ ...prev, department: '' }))
  }

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      await procedureSchema.validate(form, { abortEarly: false })

      const payload = {
        status: form.status,
        name: form.name,
        shortCode: form.shortCode,
        description: form.description,
        departmentId: form.department?.id,
      }

      const res = await fetch(`${API_BASE}/api/procedures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add procedure')
      }

      setSuccessMsg('✅ Procedure added successfully!')
      setForm({
        status: false,
        name: '',
        shortCode: '',
        department: null,
        description: '',
      })
      setErrors({})
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        const fieldErrors: Record<string, string> = {}
        err.inner.forEach((e) => {
          if (e.path) fieldErrors[e.path] = e.message
        })
        setErrors(fieldErrors)
      } else if (err instanceof Error) {
        setErrorMsg(
          err.message ||
            'We’re experiencing technical difficulties. Please try again later.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Fetch departments on mount with token
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!token) {
        console.error('No token found. Please login first.')
        return
      }

      try {
        const res = await fetch(`${API_BASE}/api/department?status=true`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.message || 'Failed to fetch departments')
        }

        const data = (await res.json()) as { data: Department[] }
        setDepartments(data.data || [])
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching departments:', err.message)
        } else {
          console.error('Unknown error fetching departments')
        }
      }
    }

    fetchDepartments()
  }, [API_BASE, token])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Procedure</p>
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

      {errorMsg && <ErrorMessage msg={errorMsg} />}
      {successMsg && <SuccessMessage msg={successMsg} />}
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

        {/* Procedure Name */}
        <GroupInput>
          <Label required="true" htmlFor="name">
            Procedure Name
          </Label>
          <Input
            id="name"
            placeholder="Enter Procedure Name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red text-sm">{errors.name}</p>}
        </GroupInput>

        {/* Short Code */}
        <GroupInput>
          <Label htmlFor="shortCode" required="true">
            Short Code
          </Label>
          <Input
            id="shortCode"
            placeholder="Enter Procedure Short Code"
            value={form.shortCode}
            onChange={handleChange}
          />
          {errors.shortCode && (
            <p className="text-red text-sm">{errors.shortCode}</p>
          )}
        </GroupInput>

        {/* Department */}
        <GroupInput>
          <Label required="true">Department</Label>
          <Dropdown
            options={departments.map((d) => ({ id: d.id, name: d.name }))}
            selected={
              form.department
                ? { id: form.department.id, name: form.department.name }
                : null
            }
            onSelect={(option) =>
              handleSelectDepartment({
                id: Number(option.id),
                name: option.name,
              })
            }
            placeholder="Select Department"
          />

          {errors.department && (
            <p className="text-red text-sm">{errors.department}</p>
          )}
        </GroupInput>

        {/* Description */}
        <GroupInput>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            placeholder="Enter Procedure Description"
            value={form.description}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Submit */}
        <div className="col-span-full mx-auto mt-5">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                >
                  <use href="/assets/svg/plus-icon.svg#plus-icon" />
                </svg>
                Add Procedure
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default AddProcedure
