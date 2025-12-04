import { createContext, useContext, useEffect, useState } from "react";

type Permissions = {
  canManagePatients?: boolean;
  canManageDepartments?: boolean;
  canManageProcedures?: boolean;
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
};

type User = {
  id: number;
  name: string;
  role: string;
  permissions: Permissions;
};

type PermissionContextType = {
  user: User | null;
  permissions: Permissions;
  loading: boolean;
};

const PermissionContext = createContext<PermissionContextType>({
  user: null,
  permissions: {},
  loading: true,
});

export const usePermissions = () => useContext(PermissionContext);

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const PermissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/api/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
          setPermissions(data.user.permissions || {});
        }
      } catch (error) {
        console.error("Failed to load permissions", error);
      }

      setLoading(false);
    };

    fetchPermissions();
  }, [token]);

  return (
    <PermissionContext.Provider value={{ user, permissions, loading }}>
      {children}
    </PermissionContext.Provider>
  );
};
