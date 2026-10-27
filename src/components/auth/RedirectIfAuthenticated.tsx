import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/services/authStore";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

export const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const { isAuthenticated, role, isResolved } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  // Neutral same-size luxury placeholder while auth state resolves
  if (!isResolved) {
    return <div className="min-h-screen bg-white dark:bg-[#17111D]" />;
  }

  if (isAuthenticated) {
    if (redirectUrl) {
      return <Navigate to={decodeURIComponent(redirectUrl)} replace />;
    }
    if (role === "customer") {
      return <Navigate to="/customer/bookings" replace />;
    }
    if (role === "artisan" || role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
