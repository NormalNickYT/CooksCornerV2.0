import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading) {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  } 

  return isAuthenticated ? <Outlet /> : null;
}
