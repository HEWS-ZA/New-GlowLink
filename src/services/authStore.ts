import { useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
  businessName?: string;
  role: "artisan" | "client";
}

const AUTH_KEY = "glowlink_isAuthenticated";
const USER_KEY = "glowlink_userEmail";
const PROFILE_KEY = "glowlink_userProfile";
const AUTH_EVENT = "glowlink-auth-change";

export function getAuthState(): { isAuthenticated: boolean; user: UserProfile | null } {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null };
  }

  // Check localStorage first (shared across tabs), then fallback to sessionStorage for backwards compatibility
  const isAuth =
    localStorage.getItem(AUTH_KEY) === "true" ||
    sessionStorage.getItem(AUTH_KEY) === "true";

  const email =
    localStorage.getItem(USER_KEY) ||
    sessionStorage.getItem(USER_KEY) ||
    "";

  const rawProfile =
    localStorage.getItem(PROFILE_KEY) ||
    sessionStorage.getItem(PROFILE_KEY);

  let profile: UserProfile | null = null;
  if (rawProfile) {
    try {
      profile = JSON.parse(rawProfile);
    } catch {
      profile = { name: "Thandi Mthembu", email, role: "artisan" };
    }
  } else if (isAuth) {
    profile = { name: "Thandi Mthembu", email: email || "thandi@glowlink.co.za", role: "artisan" };
  }

  return { isAuthenticated: isAuth, user: profile };
}

export function loginArtisan(email: string): UserProfile {
  const profile: UserProfile = {
    name: email.split("@")[0].replace(".", " "),
    email,
    role: "artisan",
  };

  if (typeof window !== "undefined") {
    // Write to both localStorage (cross-tab sync) and sessionStorage
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(USER_KEY, email);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    sessionStorage.setItem(AUTH_KEY, "true");
    sessionStorage.setItem(USER_KEY, email);
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

    // Dispatch custom event for same-tab instant reactivity
    window.dispatchEvent(new Event(AUTH_EVENT));
  }

  return profile;
}

export function logoutArtisan() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(PROFILE_KEY);

    // Clear any cached dashboard or user session storage
    sessionStorage.clear();

    // Dispatch custom event for same-tab instant reactivity
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

/**
 * React hook to subscribe to auth state with instant updates across same-tab and cross-tab actions.
 * Provides isResolved to prevent any UI flashing on initial paint.
 */
export function useAuth() {
  const [state, setState] = useState<{
    isAuthenticated: boolean;
    user: UserProfile | null;
    isResolved: boolean;
  }>(() => {
    // Read synchronous state immediately on first render if in browser
    if (typeof window !== "undefined") {
      const current = getAuthState();
      return { ...current, isResolved: true };
    }
    return { isAuthenticated: false, user: null, isResolved: false };
  });

  useEffect(() => {
    const syncState = () => {
      const current = getAuthState();
      setState({ ...current, isResolved: true });
    };

    // Ensure synchronous update
    syncState();

    // Listen for same-tab custom event
    window.addEventListener(AUTH_EVENT, syncState);
    // Listen for cross-tab storage changes
    window.addEventListener("storage", syncState);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncState);
      window.removeEventListener("storage", syncState);
    };
  }, []);

  return state;
}
