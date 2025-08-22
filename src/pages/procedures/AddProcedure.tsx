import { useState } from "react";
import Button from "../../components/button/Button";
import { GroupInput } from "../../components/input/GroupInput";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/input/Label";
import TextArea from "../../components/input/TextArea";
import Dropdown from "../../components/input/dropdown";

const AddProcedure = () => {
  const [form, setForm] = useState({
    status: false,
    procedureName: "",
    shortCode: "",
    department: null as { id: number; name: string } | null,
    description: "",
  });

  const departments = [
    { id: 1, name: "Dental" },
    { id: 2, name: "Ortho" },
    { id: 3, name: "Eye" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectDepartment = (dept: { id: number; name: string }) => {
    setForm((prev) => ({
      ...prev,
      department: dept,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Procedure Data:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <p className="text-xl font-semibold w-full border-b pb-3">
        Add Procedure
      </p>

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

        {/* Procedure Name */}
        <GroupInput>
          <Label htmlFor="procedureName">Procedure Name</Label>
          <Input
            id="procedureName"
            placeholder="Enter Procedure Name"
            value={form.procedureName}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Short Code */}
        <GroupInput>
          <Label htmlFor="shortCode">Short Code</Label>
          <Input
            id="shortCode"
            placeholder="Enter Procedure Short Code"
            value={form.shortCode}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Department */}
        <GroupInput>
          <Label>Department</Label>
          <Dropdown
            options={departments}
            selected={form.department}
            onSelect={handleSelectDepartment}
            placeholder="Select Department"
          />
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
          <Button type="submit">Add Procedure</Button>
        </div>
      </div>
    </form>
  );
};

export default AddProcedure;
