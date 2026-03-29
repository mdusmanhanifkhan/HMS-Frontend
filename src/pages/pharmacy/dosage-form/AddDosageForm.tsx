import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { Input } from "../../../components/input/Input";
import { Label } from "../../../components/input/Label";
import { GroupInput } from "../../../components/input/GroupInput";
import ToggleButton from "../../../components/button/ToggleButton";
import Button from "../../../components/button/Button";
import { routePaths } from "../../../constants/routePaths";
import SuccessMessage from "../../../components/error-handling/SuccessMessage";
import ErrorMessage from "../../../components/error-handling/ErrorMessage";

type DosageFormData = {
  name: string;
  code: string;
  status: boolean;
};

const AddDosageForm = () => {
  const [formData, setFormData] = useState<DosageFormData>({
    name: "",
    code: "",
    status: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  // ✅ Handle Input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Toggle Status
  const handleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: !prev.status,
    }));
  };

  // ✅ Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Dosage form name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/dosage-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          code: formData.code.trim(),
          status: formData.status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create dosage form");
      }

      setSuccess("Dosage form created successfully ✅");

      // Reset
      setFormData({
        name: "",
        code: "",
        status: true,
      });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Dosage Form</p>
        <Button to={routePaths.DOSAGE_FORM} asLink>
          Back
        </Button>
      </div>

      {/* Messages */}
      {error && <ErrorMessage msg={error} />}
      {success && <SuccessMessage msg={success} />}

      {/* FORM */}
      <div className="grid grid-cols-3 gap-4 max-w-[700px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton
            id="status"
            checked={formData.status}
            onChange={handleToggle}
          />
        </GroupInput>

        {/* Name */}
        <GroupInput className="col-span-full">
          <Label required="true">Form Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Dosage Form (e.g. Tablet)"
          />
        </GroupInput>

        {/* Code */}
        <GroupInput className="col-span-full">
          <Label>Code</Label>
          <Input
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter Code (e.g. TAB)"
          />
        </GroupInput>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Dosage Form"}
        </Button>

        <Button
          type="reset"
          onClick={() =>
            setFormData({
              name: "",
              code: "",
              status: true,
            })
          }
        >
          Clear
        </Button>
      </div>
    </form>
  );
};

export default AddDosageForm;