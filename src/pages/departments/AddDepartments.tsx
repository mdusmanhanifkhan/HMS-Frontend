import { useState } from 'react'
import * as yup from 'yup'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import ToggleButton from '../../components/button/ToggleButton'
import ErrorMessage from '../../components/error-handling/ErrorMessage'
import SuccessMessage from '../../components/error-handling/SuccessMessage'
import { routePaths } from '../../constants/routePaths'

const departmentSchema = yup.object().shape({
  name: yup.string().required('Department Name is required'),
  shortCode: yup.string().required('Short Code is required'),
  timeFrom: yup.string().nullable(),
  timeTo: yup.string().nullable(),
  location: yup.string().nullable(),
  description: yup.string().nullable(),
  status: yup.boolean(),
})

const AddDepartments = () => {
  const initialForm = {
    status: true,
    name: '',
    shortCode: '',
    timeFrom: '',
    timeTo: '',
    location: '',
    description: '',
    type:'OPD'
  }

  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL
   const token = localStorage.getItem('token')
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value } = e.target

    const newValue =
      type === 'checkbox' && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value

    setForm((prev) => ({
      ...prev,
      [id]: newValue,
    }))

    setFieldErrors((prev) => ({
      ...prev,
      [id]: '',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await departmentSchema.validate(form, { abortEarly: false })
      setFieldErrors({})

       const payload = {
      ...form,
      type: 'OPD',
    }
console.log(payload)
      const res = await fetch(`${API_BASE}/api/department`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,   Authorization: `Bearer ${token}`,},
        body: JSON.stringify(payload),
      })

      const resData = await res.json()

      if (!res.ok) {
        setError(
          resData?.errors?.general || resData?.message || 'Something went wrong'
        )
        return
      }

      setSuccess(resData?.message)
      setForm(initialForm)
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {}

        err.inner.forEach((e) => {
          if (e.path) {
            newErrors[e.path] = e.message
          }
        })

        setFieldErrors(newErrors)
      } else if (err instanceof Error) {
        setError(err.message || 'Something went wrong')
        console.error(err)
      } else {
        setError('An unknown error occurred')
        console.error(err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && <ErrorMessage msg={error} />}
      {success && <SuccessMessage msg={success} />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex justify-between items-center border-b pb-3">
          <p className="text-xl font-semibold w-full">Add Department</p>
          <Button to={routePaths.DEPARTMENTS} asLink={true}>
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

        <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
          {/* Checkbox */}
          <GroupInput className="col-span-full">
            <Label htmlFor="status">Status</Label>
            <ToggleButton
              id="status"
              checked={form.status}
              onChange={handleChange}
            />
          </GroupInput>

          {/* Department Name */}
          <GroupInput>
            <Label required="required" htmlFor="name">
              Department Name
            </Label>
            <Input
              id="name"
              placeholder="Enter Department Name"
              value={form.name}
              onChange={handleChange}
            />
            {fieldErrors.name && (
              <p className="text-red text-xs">{fieldErrors.name}</p>
            )}
          </GroupInput>

          {/* Short Code */}
          <GroupInput>
            <Label htmlFor="shortCode" required="required">
              Short Code
            </Label>
            <Input
              id="shortCode"
              placeholder="Enter Department Short Code"
              value={form.shortCode}
              onChange={handleChange}
            />
            {fieldErrors.shortCode && (
              <p className="text-red text-xs">{fieldErrors.shortCode}</p>
            )}
          </GroupInput>

          {/* Time Inputs */}
          <div className="flex w-full items-start gap-3">
            <GroupInput>
              <Label htmlFor="timeFrom">Select Time</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="timeFrom"
                  type="time"
                  value={form.timeFrom}
                  onChange={handleChange}
                  variant="type_time"
                />
                <p className="text-base">To</p>
                <Input
                  id="timeTo"
                  type="time"
                  value={form.timeTo}
                  onChange={handleChange}
                  variant="type_time"
                />
              </div>
            </GroupInput>
          </div>

          {/* Location */}
          <GroupInput>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter Department Location"
              value={form.location}
              onChange={handleChange}
            />
          </GroupInput>

          {/* Description */}
          <GroupInput>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              placeholder="Enter Department Description"
              value={form.description}
              onChange={handleChange}
            />
          </GroupInput>

          {/* Submit Button */}
          <div className="col-span-full mx-auto mt-5">
            <Button type="submit">
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
                  Add Department
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddDepartments
