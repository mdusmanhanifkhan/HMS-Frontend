import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import { GroupInput } from "../../components/input/GroupInput";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/input/Label";
import TextArea from "../../components/input/TextArea";
import Dropdown from "../../components/input/Dropdown";

const AddProcedure = () => {
  const [departments, setDepartments] = useState<any[]>([]);

  const [form, setForm] = useState({
    status: false,
    name: "",
    shortCode: "",
    department: null as { id: number; name: string } | null,
    description: "",
  });


   const API_BASE = import.meta.env.VITE_API_BASE_URL

  // ✅ Handle input/checkbox change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle dropdown selection
  const handleSelectDepartment = (dept: { id: number; name: string }) => {
    setForm((prev) => ({
      ...prev,
      department: dept,
    }));
  };

  // ✅ Submit form to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.department) {
      alert("Please select a department!");
      return;
    }

    const payload = {
      status: form.status,
      name: form.name,
      shortCode: form.shortCode,
      description: form.description,
      departmentId: form.department.id,
    };

    try {
      const res = await fetch(`${API_BASE}/api/procedures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add procedure");
      }

      alert("Procedure added successfully!");
      console.log("✅ Procedure created:", data);

      // reset form after success
      setForm({
        status: false,
        name: "",
        shortCode: "",
        department: null,
        description: "",
      });
    } catch (error: any) {
      console.error("❌ Error adding procedure:", error.message);
      alert("Failed to add procedure: " + error.message);
    }
  };

  // ✅ Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/department`);
        const resData = await res.json();
        setDepartments(resData.data);
      } catch (error) {
        console.log("❌ Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  console.log(departments)

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
          <Label htmlFor="name">Procedure Name</Label>
          <Input
            id="name"
            placeholder="Enter Procedure Name"
            value={form.name}
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
