import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading) {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  }

  return isAuthenticated ? <Outlet /> : null;
}
