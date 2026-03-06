import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  requiredRole: "hospital";
  redirectTo?: string;
}

export function ProtectedRoute({ requiredRole, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user || user.role !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}