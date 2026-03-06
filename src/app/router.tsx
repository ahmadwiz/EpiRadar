import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout/RootLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import { HomePage } from "./pages/Home/Home";
import { Login } from "./pages/Auth/Login";

// Protected: hospital only
import { HospitalDashboard } from "./pages/Hospital/HospitalDashboard";

// Protected: user only
import { PublicPortal } from "./pages/Portal/PublicPortal";

export const router = createBrowserRouter([
  // ── Public routes (with navbar/footer layout) ──────────────
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
    ],
  },

  // ── Auth routes (no navbar/footer) ──────────────────────────
  { path: "/login", element: <Login /> },

  // ── Portal: public but no navbar/footer ─────────────────────
  { path: "/portal", element: <PublicPortal /> },

  // ── Hospital-only routes (no public layout) ─────────────────
  {
    element: <ProtectedRoute requiredRole="hospital" redirectTo="/login" />,
    children: [
      { path: "/hospital/dashboard", element: <HospitalDashboard /> },
    ],
  },

  // ── Fallback ────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/404" replace /> },
]);