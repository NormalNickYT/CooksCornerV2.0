import { Navigate, Outlet, useLocation } from "react-router-dom";
import SpinnerLoader from "@/components/SpinnerLoader";
import { useCurrentUser } from "@/features/auth/useAuth";

/**
 * Gate for the dashboard routes.
 *
 * Waits for the session check before deciding: rendering the redirect while
 * loading bounced signed-in users to the login page on every hard refresh.
 * The attempted path is passed along so they land where they were going.
 */
export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) return <SpinnerLoader />;

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <Outlet />;
}
