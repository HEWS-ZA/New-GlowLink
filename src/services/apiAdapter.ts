/**
 * ============================================================================
 * GlowLink API & Data Guard Adapter (DEVELOPMENT MOCK LAYER)
 * ============================================================================
 * 
 * ⚠️ ARCHITECTURAL NOTICE:
 * "No real security until a backend exists; localStorage is user-editable."
 * 
 * In this client-only development environment, this adapter enforces domain
 * contracts, checks session presence, and models role authorization. However,
 * client-side checks can be bypassed by modifying browser storage or memory.
 * 
 * Production security requires a real server-side backend (Node/Express,
 * Firebase Auth + Firestore Rules, or PostgreSQL + Row-Level Security)
 * enforcing identity on every request via cryptographic session tokens.
 * ============================================================================
 */

import { Role } from "./permissionMap";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number; // 200, 401, 403, 404, 500
}

export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  role: Role;
  expiresAt: number; // Unix timestamp
}

export interface AuthApi {
  getSession(): Promise<ApiResponse<AuthSession>>;
  validateSession(token: string): Promise<ApiResponse<{ valid: boolean; role: Role }>>;
  logout(): Promise<ApiResponse<{ success: boolean }>>;
}

export interface DataApi {
  fetchBookings(token: string): Promise<ApiResponse<unknown[]>>;
  fetchClientele(token: string): Promise<ApiResponse<unknown[]>>;
  fetchNotifications(token: string): Promise<ApiResponse<unknown[]>>;
}

/**
 * Development Mock Implementation of AuthApi & DataApi
 * Enforces role checks and simulates 401 / 403 errors when sessions are missing or expired.
 */
export const MockAuthApi: AuthApi = {
  async getSession(): Promise<ApiResponse<AuthSession>> {
    if (typeof window === "undefined") {
      return { data: null, error: "SSR Environment", status: 500 };
    }

    const token = localStorage.getItem("glowlink_session_token");
    const rawProfile = localStorage.getItem("glowlink_userProfile");
    const expiresAt = Number(localStorage.getItem("glowlink_session_expiry") || "0");

    if (!token || !rawProfile) {
      return { data: null, error: "No active session", status: 401 };
    }

    if (Date.now() > expiresAt) {
      // Clear expired session
      localStorage.removeItem("glowlink_session_token");
      localStorage.removeItem("glowlink_session_expiry");
      return { data: null, error: "Session expired (401)", status: 401 };
    }

    try {
      const profile = JSON.parse(rawProfile);
      return {
        data: {
          token,
          userId: profile.email || "artisan_1",
          email: profile.email || "",
          role: profile.role || "guest",
          expiresAt,
        },
        error: null,
        status: 200,
      };
    } catch {
      return { data: null, error: "Malformed profile session", status: 401 };
    }
  },

  async validateSession(token: string): Promise<ApiResponse<{ valid: boolean; role: Role }>> {
    const sessionRes = await this.getSession();
    if (sessionRes.status !== 200 || !sessionRes.data || sessionRes.data.token !== token) {
      return { data: null, error: "Invalid token or expired session", status: 401 };
    }

    return {
      data: { valid: true, role: sessionRes.data.role },
      error: null,
      status: 200,
    };
  },

  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("glowlink_session_token");
      localStorage.removeItem("glowlink_session_expiry");
      localStorage.removeItem("glowlink_isAuthenticated");
      localStorage.removeItem("glowlink_userEmail");
      localStorage.removeItem("glowlink_userProfile");
    }
    return { data: { success: true }, error: null, status: 200 };
  },
};

export const MockDataApi: DataApi = {
  async fetchBookings(token: string): Promise<ApiResponse<unknown[]>> {
    const auth = await MockAuthApi.validateSession(token);
    if (auth.status !== 200) {
      return { data: null, error: "Unauthorized: Please sign in", status: 401 };
    }

    if (auth.data?.role !== "artisan") {
      return { data: null, error: "Forbidden: Artisan role required", status: 403 };
    }

    const raw = localStorage.getItem("glowlink_bookings");
    const bookings = raw ? JSON.parse(raw) : [];
    return { data: bookings, error: null, status: 200 };
  },

  async fetchClientele(token: string): Promise<ApiResponse<unknown[]>> {
    const auth = await MockAuthApi.validateSession(token);
    if (auth.status !== 200) {
      return { data: null, error: "Unauthorized: Please sign in", status: 401 };
    }

    if (auth.data?.role !== "artisan") {
      return { data: null, error: "Forbidden: Artisan role required", status: 403 };
    }

    const raw = localStorage.getItem("glowlink_customers");
    const customers = raw ? JSON.parse(raw) : [];
    return { data: customers, error: null, status: 200 };
  },

  async fetchNotifications(token: string): Promise<ApiResponse<unknown[]>> {
    const auth = await MockAuthApi.validateSession(token);
    if (auth.status !== 200) {
      return { data: null, error: "Unauthorized: Notifications require active session", status: 401 };
    }

    if (auth.data?.role !== "artisan") {
      return { data: null, error: "Forbidden: Notifications restricted to verified artisans", status: 403 };
    }

    const raw = localStorage.getItem("glowlink_notifications");
    const notifications = raw ? JSON.parse(raw) : [];
    return { data: notifications, error: null, status: 200 };
  },
};
