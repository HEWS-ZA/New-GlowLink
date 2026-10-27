import { useState, useEffect } from "react";
import { Role } from "./dataTypes";
import { seedDemoArtisanData, clearArtisanData } from "./bookingStore";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  role: Role;
}

const AUTH_KEY = "glowlink_isAuthenticated";
const USER_KEY = "glowlink_userEmail";
const PROFILE_KEY = "glowlink_userProfile";
const TOKEN_KEY = "glowlink_session_token";
const EXPIRY_KEY = "glowlink_session_expiry";
const AUTH_EVENT = "glowlink-auth-change";

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  role: Role;
}

/**
 * Returns current authentication state.
 * STRICT SECURITY INVARIANT:
 * An incomplete, expired, or malformed session is NEVER given a fallback identity.
 * It is immediately cleared and reset to 'guest'.
 */
export function getAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null, role: "guest" };
  }

  const isAuth =
    localStorage.getItem(AUTH_KEY) === "true" ||
    sessionStorage.getItem(AUTH_KEY) === "true";

  const rawProfile =
    localStorage.getItem(PROFILE_KEY) ||
    sessionStorage.getItem(PROFILE_KEY);

  const expiry = Number(
    localStorage.getItem(EXPIRY_KEY) ||
    sessionStorage.getItem(EXPIRY_KEY) ||
    "0"
  );

  if (isAuth) {
    // Check TTL (session expiration)
    if (expiry > 0 && Date.now() > expiry) {
      logout();
      return { isAuthenticated: false, user: null, role: "guest" };
    }

    // Require complete, valid JSON profile. Corrupted or missing profile is immediately cleared.
    if (!rawProfile) {
      logout();
      return { isAuthenticated: false, user: null, role: "guest" };
    }

    try {
      const parsed: UserProfile = JSON.parse(rawProfile);
      if (!parsed.email || !parsed.role) {
        logout();
        return { isAuthenticated: false, user: null, role: "guest" };
      }
      return {
        isAuthenticated: true,
        user: parsed,
        role: parsed.role,
      };
    } catch {
      logout();
      return { isAuthenticated: false, user: null, role: "guest" };
    }
  }

  return { isAuthenticated: false, user: null, role: "guest" };
}

/**
 * Log in or register as a Customer (Client)
 */
export function loginCustomer(email: string, name?: string, phone?: string): UserProfile {
  const customerName = name || email.split("@")[0].replace(".", " ");
  const profile: UserProfile = {
    id: `cust_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
    name: customerName,
    email,
    phone: phone || "+27 82 555 0192",
    role: "customer",
  };

  persistSession(profile);
  return profile;
}

/**
 * Log in or register as an Artisan
 */
export function loginArtisan(email: string, name?: string, businessName?: string): UserProfile {
  const isThandi =
    email.toLowerCase().includes("thandi") ||
    email.toLowerCase() === DEMO_CREDENTIALS.artisan.email.toLowerCase() ||
    !name;
  const artisanName = name || (isThandi ? "Thandi Mthembu" : email.split("@")[0].replace(".", " "));
  const profile: UserProfile = {
    id: isThandi ? "1" : `artisan_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
    name: artisanName,
    email,
    businessName: businessName || (isThandi ? "Mthembu Beauty Atelier" : `${artisanName} Atelier`),
    role: "artisan",
  };

  persistSession(profile);
  // Seed demo booking data for artisan workspace
  seedDemoArtisanData();
  return profile;
}

function persistSession(profile: UserProfile) {
  if (typeof window === "undefined") return;

  // 24 hour session TTL
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const mockToken = `gw_${profile.role}_` + Math.random().toString(36).substring(2, 15);

  localStorage.setItem(AUTH_KEY, "true");
  localStorage.setItem(USER_KEY, profile.email);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem(TOKEN_KEY, mockToken);
  localStorage.setItem(EXPIRY_KEY, String(expiresAt));

  sessionStorage.setItem(AUTH_KEY, "true");
  sessionStorage.setItem(USER_KEY, profile.email);
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  sessionStorage.setItem(TOKEN_KEY, mockToken);
  sessionStorage.setItem(EXPIRY_KEY, String(expiresAt));

  window.dispatchEvent(new Event(AUTH_EVENT));
}

/**
 * Universal Logout function
 */
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);

    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(PROFILE_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRY_KEY);

    clearArtisanData();
    sessionStorage.clear();

    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

// Backwards compatibility alias for existing artisan components
export const logoutArtisan = logout;

/**
 * Real-time reactive authentication hook with resolution tracking
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    role: "guest",
  });
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    // Immediate hydration from local storage
    const initial = getAuthState();
    setAuthState(initial);
    setIsResolved(true);

    const handleAuthChange = () => {
      setAuthState(getAuthState());
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return {
    ...authState,
    isResolved,
    loginCustomer,
    loginArtisan,
    logout,
  };
}

// Preset Quick-Fill Demo Users for Testing
export const DEMO_CREDENTIALS = {
  customer: {
    name: "Nandi Khumalo",
    email: "nandi@glowlink.co.za",
    phone: "+27 82 555 1234",
  },
  artisan: {
    name: "Thandi Mthembu",
    email: "thandi@glowlink.co.za",
    businessName: "Mthembu Beauty Atelier",
  },
};
