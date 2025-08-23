import { useState } from 'react'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import TextArea from '../../components/input/TextArea'
import ToggleButton from '../../components/button/ToggleButton'

const AddDepartments = () => {
  const [form, setForm] = useState({
    status: false,
    name: '',
    shortCode: '',
    timeFrom: '',
    timeTo: '',
    location: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState<null>(null)
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const body = {
      ...form,
      timeFrom: `${form.timeFrom}`,
      timeTo: `${form.timeTo}`,
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`http://localhost:3000/api/department`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const resData = await res.json()

      if (!res.ok) {
        setError(
          resData?.errors?.general || resData?.message || 'Something went wrong'
        )
        return
      }
      setSuccess(resData?.message)

      // success
      console.log('Department created:', resData)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  console.log(error)

  return (
    <>
      {error && <p className="text-white py-2 px-4 rounded-md mx-auto w-fit font-medium bg-red ">{error}</p>}
      {success && <p className="text-white py-2 px-4 rounded-md mx-auto w-fit font-medium bg-[#5cb85c] ">{success}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <p className="text-xl font-semibold w-full border-b pb-3">
          Add Department
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
          {/* Checkbox */}
          <GroupInput className="col-span-full">
            <Label htmlFor="status">Status</Label>
            <ToggleButton id="status" onChange={handleChange} className="yep" />
          </GroupInput>

          {/* Department Name */}
          <GroupInput>
            <Label required="required" htmlFor="departmentName">
              Department Name{' '}
            </Label>
            <Input
              id="name"
              placeholder="Enter Department Name"
              value={form.name}
              onChange={handleChange}
            />
            <span>{}</span>
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
          </GroupInput>

          {/* Time Inputs */}
          <div className="flex w-full items-end gap-3">
            <GroupInput>
              <Label htmlFor="timeFrom">Select Time</Label>
              <Input
                id="timeFrom"
                type="time"
                value={form.timeFrom}
                onChange={handleChange}
                variant="type_time"
              />
            </GroupInput>
            <p className="text-base">To</p>
            <GroupInput>
              <Label htmlFor="timeTo" className="invisible">
                To
              </Label>
              <Input
                id="timeTo"
                type="time"
                value={form.timeTo}
                onChange={handleChange}
                variant="type_time"
              />
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
              {isLoading ? 'Loading...' : 'Add Department'}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddDepartments
