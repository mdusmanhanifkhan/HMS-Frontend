import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    if (user) {
      setIsAuthorized(true);
      setLoading(false);

      fetch(`${API_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthorized(false);
          } else {
            res.json().then((data) => {
              localStorage.setItem("user", JSON.stringify(data));
            });
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthorized(false);
        });

      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthorized(false);
        } else {
          const data = await res.json();
          localStorage.setItem("user", JSON.stringify(data));
          setIsAuthorized(true);
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p className="text-center mt-10">Checking authentication...</p>;
  if (!isAuthorized) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
