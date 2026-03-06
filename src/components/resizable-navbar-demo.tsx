"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function NavbarDemo() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "About", link: "#about" },
    { name: "Purpose", link: "#purpose" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDashboard = () => {
    if (user?.role === "hospital") navigate("/hospital/dashboard");
    else if (user?.role === "user") navigate("/portal");
  };

  return (
    <div className="relative w-full mt-2">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-neutral-500 font-medium">{user.name}</span>
                <NavbarButton variant="secondary" onClick={handleDashboard}>
                  {user.role === "hospital" ? "Dashboard" : "Portal"}
                </NavbarButton>
                <NavbarButton variant="primary" onClick={handleLogout}>
                  Sign out
                </NavbarButton>
              </>
            ) : (
              <>
                <NavbarButton variant="primary" onClick={() => navigate("/login")}>
                  Sign in
                </NavbarButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {user ? (
                <>
                  <NavbarButton
                    onClick={() => { handleDashboard(); setIsMobileMenuOpen(false); }}
                    variant="secondary"
                    className="w-full"
                  >
                    {user.role === "hospital" ? "Dashboard" : "Portal"}
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    variant="primary"
                    className="w-full"
                  >
                    Sign out
                  </NavbarButton>
                </>
              ) : (
                <>
                  <NavbarButton
                    onClick={() => { navigate("/register"); setIsMobileMenuOpen(false); }}
                    variant="secondary"
                    className="w-full"
                  >
                    Register
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                    variant="primary"
                    className="w-full"
                  >
                    Sign in
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}