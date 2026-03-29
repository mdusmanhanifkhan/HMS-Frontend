import { useState } from "react";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/input/Label";
import Button from "../../components/button/Button";
import SuccessMessage from "../../components/error-handling/SuccessMessage";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

interface ApiErrorResponse {
  message?: string;
}

interface CreatePermissionProps {
  onSuccess?: () => void;
}

const CreatePermission: React.FC<CreatePermissionProps> = () => {
  const token = localStorage.getItem("token");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success , setSuccess] = useState<string>("")

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Permission name is required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.message || "Failed to create permission"
        );
      }
      setSuccess('Permission created successfully')

      setName("");
      setDescription("");

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
     {success &&  <SuccessMessage msg={success} />}

      <h2 className="text-xl font-semibold mb-5">
        Create Permission
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Label required="true">Permission Name</Label>
        <Input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
        }
        required
        />

        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg "
        >
          {loading ? "Saving..." : "Save Permission"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePermission;