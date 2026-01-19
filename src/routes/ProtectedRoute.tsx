// import { useEffect, useState } from "react";
// import type { ReactNode } from "react";
// import { Navigate } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const [loading, setLoading] = useState(true);
//   const [isAuthorized, setIsAuthorized] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");

//     // No token → not authorized
//     if (!token) {
//       setIsAuthorized(false);
//       setLoading(false);
//       return;
//     }

//     // User already cached → authorize immediately
//     if (user) {
//       setIsAuthorized(true);
//       setLoading(false);
//       return;
//     }

//     // Token exists but user missing → verify token
//     const checkAuth = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           return console.log("unauthorized")
//         }

//         const data = await res.json();
//         localStorage.setItem("user", JSON.stringify(data));
//         setIsAuthorized(true);
//       } catch {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setIsAuthorized(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-10">Checking authentication...</p>;
//   }

//   if (!isAuthorized) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;


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

    // No token → not authorized
    if (!token) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    // User already cached → authorize immediately
    if (user) {
      setIsAuthorized(true);
      setLoading(false);
      return;
    }

    // Token exists but user missing → verify token
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Unauthorized → remove token and redirect
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthorized(false); // ← this triggers redirect
          return;
        }

        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        setIsAuthorized(true);
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

  if (loading) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  // Redirect to login if not authorized
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
