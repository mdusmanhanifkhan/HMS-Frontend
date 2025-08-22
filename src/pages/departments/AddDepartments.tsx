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

    // const today = new Date().toISOString().split("T")[0];
    const body = {
      ...form,
      timeFrom: `${form.timeFrom}`,
      timeTo: `${form.timeTo}`,
    }
    console.log(body)
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/api/department`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const resData = await res.json()
      console.log(resData)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
          <Label required='required' htmlFor="departmentName">Department Name </Label>
          <Input
            id="name"
            placeholder="Enter Department Name"
            value={form.name}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Short Code */}
        <GroupInput>
          <Label htmlFor="shortCode" required='required' >Short Code</Label>
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
  )
}

export default AddDepartments
