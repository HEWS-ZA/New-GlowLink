/**
 * GlowLink Centralized Permission Map & Three-Portal Access Control
 * Enforces strict boundaries between Guest, Customer, and Artisan portals.
 */

import { Role } from "./dataTypes";
export type { Role };

export interface PermissionConfig {
  allowedRoutes: string[];
  canAccessCustomerPortal: boolean;
  canAccessArtisanPortal: boolean;
  canViewNotifications: boolean;
  canManageBookings: boolean;
  canViewClientele: boolean;
  canViewEarnings: boolean;
}

export const PERMISSION_MAP: Record<Role, PermissionConfig> = {
  // Public, unauthenticated visitor
  guest: {
    allowedRoutes: [
      "/",
      "/about",
      "/contact",
      "/pricing",
      "/how-it-works",
      "/search",
      "/profile",
      "/profile/:id",
      "/login",
      "/customer/login",
      "/customer/register",
      "/artisan/login",
      "/artisan/register",
      "/register-artist",
      "/access-denied",
    ],
    canAccessCustomerPortal: false,
    canAccessArtisanPortal: false,
    canViewNotifications: false,
    canManageBookings: false,
    canViewClientele: false,
    canViewEarnings: false,
  },

  // Discerning client who books and pays for beauty services
  customer: {
    allowedRoutes: [
      "/",
      "/about",
      "/contact",
      "/pricing",
      "/how-it-works",
      "/search",
      "/profile",
      "/profile/:id",
      "/login",
      "/customer/bookings",
      "/customer/receipts",
      "/customer/profile",
      "/access-denied",
    ],
    canAccessCustomerPortal: true,
    canAccessArtisanPortal: false,
    canViewNotifications: true,
    canManageBookings: true,
    canViewClientele: false,
    canViewEarnings: false,
  },

  // Verified beauty artisan / salon owner
  artisan: {
    allowedRoutes: [
      "/",
      "/about",
      "/contact",
      "/pricing",
      "/how-it-works",
      "/search",
      "/profile",
      "/profile/:id",
      "/login",
      "/dashboard",
      "/access-denied",
    ],
    canAccessCustomerPortal: false,
    canAccessArtisanPortal: true,
    canViewNotifications: true,
    canManageBookings: true,
    canViewClientele: true,
    canViewEarnings: true,
  },

  // Platform administrator
  admin: {
    allowedRoutes: ["*"],
    canAccessCustomerPortal: true,
    canAccessArtisanPortal: true,
    canViewNotifications: true,
    canManageBookings: true,
    canViewClientele: true,
    canViewEarnings: true,
  },
};

/**
 * Check if a given role is permitted on a route
 */
export function hasRouteAccess(role: Role, pathname: string): boolean {
  const config = PERMISSION_MAP[role];
  if (!config) return false;

  if (config.allowedRoutes.includes("*")) return true;

  return config.allowedRoutes.some((route) => {
    if (route.includes(":")) {
      const baseRoute = route.split("/:")[0];
      return pathname.startsWith(baseRoute);
    }
    return (
      pathname === route ||
      (route === "/dashboard" && pathname.startsWith("/dashboard")) ||
      (route.startsWith("/customer/") && pathname.startsWith(route))
    );
  });
}

/**
 * Check if a role has a specific capability flag
 */
export function hasPermission(
  role: Role,
  permissionKey: keyof Omit<PermissionConfig, "allowedRoutes">
): boolean {
  const config = PERMISSION_MAP[role];
  if (!config) return false;
  return Boolean(config[permissionKey]);
}
