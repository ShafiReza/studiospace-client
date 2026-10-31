"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const AUTH_BASE = API_URL.replace(/\/api$/, "") + "/api/auth";

const AuthContext = createContext(null);

async function authFetch(path, options = {}) {
  const res = await fetch(`${AUTH_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data.message || data.error?.message || data.error || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data;
}

async function syncJwtCookie() {
  try {
    const { data } = await api.get("/session/sync");
    return data;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get("/session/me");
      if (data?.user) {
        setUser(data.user);
        setLoading(false);
        return;
      }
    } catch {
      /* try Better Auth session */
    }
    try {
      const data = await authFetch("/get-session", { method: "GET" });
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          photoURL: data.user.image || null,
          role: data.user.role || "user",
        });
        await syncJwtCookie();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const data = await authFetch("/sign-in/email", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const u = data.user || data;
    await syncJwtCookie();
    setUser({
      id: u.id,
      name: u.name,
      email: u.email,
      photoURL: u.image || null,
      role: u.role || "user",
    });
    toast.success("Welcome back!");
    return data;
  };

  const register = async ({ name, email, password, photoURL }) => {
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain a lowercase letter");
    }

    const data = await authFetch("/sign-up/email", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        image: photoURL || undefined,
      }),
    });
    const u = data.user || data;
    await syncJwtCookie();
    setUser({
      id: u.id,
      name: u.name,
      email: u.email,
      photoURL: u.image || photoURL || null,
      role: u.role || "user",
    });
    toast.success("Account created successfully!");
    return data;
  };

  /**
   * Google login via Better Auth
   * Must POST to /sign-in/social (not open URL in browser as GET)
   * Requires GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET on the backend
   */

  const googleLogin = async () => {
    const callbackURL =
      process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    const res = await fetch(`${AUTH_BASE}/sign-in/social`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.message || data.error?.message || "Google login failed",
      );
    }

    if (!data.url) {
      throw new Error("Google authorization URL was not returned");
    }

    window.location.assign(data.url);
  };

  const logout = async () => {
    try {
      await authFetch("/sign-out", {
        method: "POST",
        body: JSON.stringify({}),
      });
    } catch {
      /* ignore */
    }
    try {
      await api.post("/session/logout");
    } catch {
      /* ignore */
    }
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
