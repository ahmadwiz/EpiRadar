import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Role = "hospital" | "user" | null;

interface AuthUser {
  email: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; role?: Role; error?: string };
  register: (email: string, password: string, name: string) => { success: boolean; error?: string };
  logout: () => void;
}

// ── Hardcoded hospital admin account ──────────────────────────
const HOSPITAL_ADMINS = [
  { email: "admin@hospital.com", password: "admin123", name: "Hospital Admin", role: "hospital" as Role },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("epi_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string) => {
    // Check hardcoded hospital admins first
    const admin = HOSPITAL_ADMINS.find(
      (a) => a.email === email && a.password === password
    );
    if (admin) {
      const authUser = { email: admin.email, role: admin.role, name: admin.name };
      setUser(authUser);
      localStorage.setItem("epi_user", JSON.stringify(authUser));
      return { success: true, role: admin.role };
    }

    // Check registered users from localStorage
    const users: { email: string; password: string; name: string }[] =
      JSON.parse(localStorage.getItem("epi_registered_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const authUser = { email: found.email, role: "user" as Role, name: found.name };
      setUser(authUser);
      localStorage.setItem("epi_user", JSON.stringify(authUser));
      return { success: true, role: 'user' as Role };
    }

    return { success: false, error: "Invalid email or password." };
  };

  const register = (email: string, password: string, name: string) => {
    const users: { email: string; password: string; name: string }[] =
      JSON.parse(localStorage.getItem("epi_registered_users") || "[]");

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "An account with this email already exists." };
    }

    users.push({ email, password, name });
    localStorage.setItem("epi_registered_users", JSON.stringify(users));

    const authUser = { email, role: "user" as Role, name };
    setUser(authUser);
    localStorage.setItem("epi_user", JSON.stringify(authUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("epi_user");
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