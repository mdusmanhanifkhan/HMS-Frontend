import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/input/Label";
import Button from "../../components/button/Button";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

interface Role {
  id: number;
  name: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  roleId: number;
}

interface ApiErrorResponse {
  message?: string;
}

const CreateUser = () => {
  const { id } = useParams<{ id: string }>(); // for edit mode
  const token = localStorage.getItem("token");

  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);

  const isEditMode = Boolean(id);

  // ✅ Fetch Roles
  useEffect(() => {
    const fetchRoles = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE}/api/roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: Role[] = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };

    fetchRoles();
  }, [token]);

  // ✅ Fetch User if Edit Mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchUser = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: UserResponse = await response.json();

        setName(data.name);
        setEmail(data.email);
        setRoleId(data.roleId);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, [id, isEditMode, token]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || roleId === "") {
      alert("All required fields must be filled");
      return;
    }

    if (!isEditMode && !password.trim()) {
      alert("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/api/users${isEditMode ? `/${id}` : ""}`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            password: password || undefined,
            roleId,
          }),
        }
      );

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.message || "Failed to save user");
      }

      alert(
        isEditMode
          ? "User updated successfully"
          : "User created successfully"
      );
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
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">
        {isEditMode ? "Edit User" : "Create User"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required={!isEditMode}
          />
        </div>

        <div>
          <Label>Assign Role *</Label>
          <select
            value={roleId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setRoleId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
        >
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update User"
            : "Save User"}
        </Button>
      </form>
    </div>
  );
};

export default CreateUser;