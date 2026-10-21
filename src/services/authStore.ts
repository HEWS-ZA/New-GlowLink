export interface UserProfile {
  name: string;
  email: string;
  businessName?: string;
  role: "artisan" | "client";
}

const AUTH_KEY = "isAuthenticated";
const USER_KEY = "userEmail";
const PROFILE_KEY = "userProfile";

export function getAuthState(): { isAuthenticated: boolean; user: UserProfile | null } {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null };
  }

  const isAuth = sessionStorage.getItem(AUTH_KEY) === "true";
  const email = sessionStorage.getItem(USER_KEY) || "";
  const rawProfile = sessionStorage.getItem(PROFILE_KEY);

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
    sessionStorage.setItem(AUTH_KEY, "true");
    sessionStorage.setItem(USER_KEY, email);
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  return profile;
}

export function logoutArtisan() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(PROFILE_KEY);
  }
}
