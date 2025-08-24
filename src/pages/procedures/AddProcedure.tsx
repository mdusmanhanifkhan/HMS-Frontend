import { useEffect, useState } from "react";
import * as Yup from "yup"; // ✅ only Yup for validation
import Button from "../../components/button/Button";
import { GroupInput } from "../../components/input/GroupInput";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/input/Label";
import TextArea from "../../components/input/TextArea";
import Dropdown from "../../components/input/Dropdown";

// ✅ Yup schema
const procedureSchema = Yup.object().shape({
  name: Yup.string().required("Procedure name is required"),
  shortCode: Yup.string().required("Short code is required"),
  department: Yup.object()
    .shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
    })
    .nullable()
    .required("Department is required"),
});

const AddProcedure = () => {
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>(
    []
  );

  const [form, setForm] = useState({
    status: false,
    name: "",
    shortCode: "",
    department: null as { id: number; name: string } | null,
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // ✅ Handle input/checkbox change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // clear error while typing
  };

  // ✅ Handle dropdown selection
  const handleSelectDepartment = (dept: { id: number; name: string }) => {
    setForm((prev) => ({
      ...prev,
      department: dept,
    }));
    setErrors((prev) => ({ ...prev, department: "" }));
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      // Validate with Yup
      await procedureSchema.validate(form, { abortEarly: false });

      const payload = {
        status: form.status,
        name: form.name,
        shortCode: form.shortCode,
        description: form.description,
        departmentId: form.department?.id,
      };

      const res = await fetch(`${API_BASE}/api/procedures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add procedure");
      }

      setSuccessMsg("✅ Procedure added successfully!");
      console.log("Procedure created:", data);

      // reset form after success
      setForm({
        status: false,
        name: "",
        shortCode: "",
        department: null,
        description: "",
      });
      setErrors({});
    } catch (err: any) {
      if (err.name === "ValidationError") {
        // Yup validation errors
        const fieldErrors: Record<string, string> = {};
        err.inner.forEach((e: Yup.ValidationError) => {
          if (e.path) fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        // API or network error
        console.error("Error adding procedure:", err);
        setErrorMsg(
          err.message ||
            "We’re experiencing technical difficulties. Please try again later or contact support@xyzzy.com."
        );
      }
    } finally {
      setIsLoading(false);
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
        console.log("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <p className="text-xl font-semibold w-full border-b pb-3">
        Add Procedure
      </p>

      {/* Global Messages */}
      {successMsg && (
        <p className="text-green-600 font-medium">{successMsg}</p>
      )}
      {errorMsg && <p className="text-red-600 font-medium">{errorMsg}</p>}

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
          {errors.name && <p className="text-red text-sm">{errors.name}</p>}
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
          {errors.shortCode && (
            <p className="text-red text-sm">{errors.shortCode}</p>
          )}
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
             {isLoading ? 'Loading...' : (
                <>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <use href="/assets/svg/plus-icon.svg#plus-icon" />
                  </svg>
                  Add Procedure
                </>
              )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddProcedure;
