import { useState } from "react";
import Button from "../../components/button/Button";
import { GroupInput } from "../../components/input/GroupInput";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/input/Label";
import TextArea from "../../components/input/TextArea";

const AddDepartments = () => {
  const [form, setForm] = useState({
    status: false,
    name: "",
    shortCode: "",
    timeFrom: "",
    timeTo: "",
    location: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Convert HH:MM -> full ISO datetime
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const body = {
    ...form,
    timeFrom: `${today}T${form.timeFrom}:00Z`, // "2025-08-22T10:30:00Z"
    timeTo: `${today}T${form.timeTo}:00Z`
  };

  try {
    const res = await fetch(`http://localhost:3000/api/department`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const resData = await res.json();
    console.log(resData);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <p className="text-xl font-semibold w-full border-b pb-3">
        Add Department
      </p>

      <div className="grid grid-cols-3 gap-3 max-w-[1000px]">
        {/* Checkbox */}
        <GroupInput className="col-span-full">
          <Label htmlFor="status">Status</Label>
          <div className="checkbox-apple">
            <input
              id="status"
              type="checkbox"
              checked={form.status}
              onChange={handleChange}
              className="yep"
            />
            <label htmlFor="status"></label>
          </div>
        </GroupInput>

        {/* Department Name */}
        <GroupInput>
          <Label htmlFor="departmentName">Department Name</Label>
          <Input
            id="name"
            placeholder="Enter Department Name"
            value={form.name}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Short Code */}
        <GroupInput>
          <Label htmlFor="shortCode">Short Code</Label>
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
            <input
              id="timeFrom"
              type="time"
              className="bg-gray-50 border leading-none border-gray text-dark text-sm rounded-md block w-full px-2.5 py-[10px]"
              min="09:00"
              max="18:00"
              value={form.timeFrom}
              onChange={handleChange}
              required
            />
          </GroupInput>
          <p className="text-base">To</p>
          <GroupInput>
            <Label htmlFor="timeTo" className="invisible">To</Label>
            <input
              id="timeTo"
              type="time"
              className="bg-gray-50 border leading-none border-gray text-dark text-sm rounded-md block w-full px-2.5 py-[11px]"
              min="09:00"
              max="18:00"
              value={form.timeTo}
              onChange={handleChange}
              required
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
          <Button type="submit">Add Department</Button>
        </div>
      </div>
    </form>
  );
};

export default AddDepartments;
