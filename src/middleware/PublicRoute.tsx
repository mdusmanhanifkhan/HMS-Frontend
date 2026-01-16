import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PublicRoute = ({ children, redirectTo = "/" }: PublicRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  if (loading) return <p className="text-center mt-10">Checking authentication...</p>;

  if (isLoggedIn) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
};

export default PublicRoute;
