import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/services/authStore";
import { Role } from "@/services/dataTypes";
import { hasRouteAccess } from "@/services/permissionMap";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const { isAuthenticated, role, isResolved } = useAuth();
  const location = useLocation();

  // Neutral same-size luxury placeholder while auth state resolves from storage (prevents nav flash)
  if (!isResolved) {
    return <div className="min-h-screen bg-white dark:bg-[#17111D]" />;
  }

  // Not signed in: redirect to the role-specific login portal with return URL
  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    if (location.pathname.startsWith("/customer")) {
      return <Navigate to={`/customer/login?redirect=${returnUrl}`} replace />;
    }
    if (location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/artisan")) {
      return <Navigate to={`/artisan/login?redirect=${returnUrl}`} replace />;
    }
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  // Role validation: check explicit allowedRoles if provided, otherwise check permissionMap
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/access-denied" replace />;
    }
  } else if (!hasRouteAccess(role, location.pathname)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};
