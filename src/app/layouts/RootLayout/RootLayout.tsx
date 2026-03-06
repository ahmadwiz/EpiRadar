import {Outlet } from "react-router-dom";
import NavbarDemo from "@/components/resizable-navbar-demo";

export function RootLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Keep navbar on top of everything */}
      <div className="sticky top-0 z-50">
        <NavbarDemo />
      </div>

      <main style={{ flex: 1 }}>
        {/* This was fine; keep it */}
        <div className="pt-28">
          <Outlet />
        </div>
      </main>
        </div>
  );
}