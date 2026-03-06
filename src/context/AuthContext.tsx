import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

const API = "http://localhost:5000/api"; // 🔧 Change this to your backend URL in production

type Role = "hospital" | "user" | null;

interface AuthUser {
  email: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: Role; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("epi_user");
    return stored ? JSON.parse(stored) : null;
  });

  // ── Login ──────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) return { success: false, error: data.error };

      const authUser: AuthUser = { email: data.email, role: data.role, name: data.name };
      setUser(authUser);
      localStorage.setItem("epi_user", JSON.stringify(authUser));
      localStorage.setItem("epi_token", data.token);

      return { success: true, role: data.role };
    } catch {
      return { success: false, error: "Could not connect to server. Please try again." };
    }
  };

  // ── Register ───────────────────────────────────────────────────────────
  const register = async (email: string, password: string, name: string) => {
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!data.success) return { success: false, error: data.error };

      const authUser: AuthUser = { email: data.email, role: data.role, name: data.name };
      setUser(authUser);
      localStorage.setItem("epi_user", JSON.stringify(authUser));
      localStorage.setItem("epi_token", data.token);

      return { success: true };
    } catch {
      return { success: false, error: "Could not connect to server. Please try again." };
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = async () => {
    const token = localStorage.getItem("epi_token");
    try {
      await fetch(`${API}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Logout locally even if server call fails
    }
    setUser(null);
    localStorage.removeItem("epi_user");
    localStorage.removeItem("epi_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}