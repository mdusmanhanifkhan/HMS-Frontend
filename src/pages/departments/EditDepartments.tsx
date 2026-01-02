import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import { GroupInput } from "../../components/input/GroupInput";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/input/Label";
import TextArea from "../../components/input/TextArea";
import { useParams } from "react-router-dom";
import SuccessMessage from "../../components/error-handling/SuccessMessage";
import ErrorMessage from "../../components/error-handling/ErrorMessage";

interface DepartmentResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    shortCode: string;
    timeFrom?: string;
    timeTo?: string;
    location: string;
    description: string;
    status: boolean;
  };
}

interface FormState {
  status: boolean;
  departmentName: string;
  shortCode: string;
  timeFrom: string;
  timeTo: string;
  location: string;
  description: string;
}

const EditDepartments = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL as string;
  const token = localStorage.getItem("token");

  const [form, setForm] = useState<FormState>({
    status: false,
    departmentName: "",
    shortCode: "",
    timeFrom: "",
    timeTo: "",
    location: "",
    description: "",
  });

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/api/department/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.departmentName,
          shortCode: form.shortCode,
          location: form.location,
          description: form.description,
          status: form.status,
          timeFrom: form.timeFrom,
          timeTo: form.timeTo,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setSuccess("Department updated successfully ✅");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch department data
  useEffect(() => {
    const controller = new AbortController();

    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/department/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data: DepartmentResponse = await res.json();
        const dept = data.data;

        setForm({
          status: dept.status,
          departmentName: dept.name,
          shortCode: dept.shortCode,
          timeFrom: dept.timeFrom ?? "",
          timeTo: dept.timeTo ?? "",
          location: dept.location,
          description: dept.description,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
    return () => controller.abort();
  }, [id, API_BASE, token]);

  return (
    <>
      {error && <ErrorMessage msg={error} />}
      {success && <SuccessMessage msg={success} />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <p className="text-xl font-semibold w-full border-b pb-3">
          Edit Department
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

          {/* Department Name */}
          <GroupInput>
            <Label htmlFor="departmentName">Department Name</Label>
            <Input
              id="departmentName"
              placeholder="Enter Department Name"
              value={form.departmentName}
              onChange={handleChange}
            />
          </GroupInput>

          {/* Short Code */}
          <GroupInput>
            <Label htmlFor="shortCode">Short Code</Label>
            <Input
              id="shortCode"
              placeholder="Enter Short Code"
              value={form.shortCode}
              onChange={handleChange}
            />
          </GroupInput>

          {/* Time */}
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

          {/* Location */}
          <GroupInput>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter Location"
              value={form.location}
              onChange={handleChange}
            />
          </GroupInput>

          {/* Description */}
          <GroupInput>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              placeholder="Enter Description"
              value={form.description}
              onChange={handleChange}
            />
          </GroupInput>

          {/* Submit */}
          <div className="col-span-full mx-auto mt-5">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Department"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditDepartments;
