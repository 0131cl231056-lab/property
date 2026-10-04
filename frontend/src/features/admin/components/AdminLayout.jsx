import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Building2,
  ClipboardList,
} from "lucide-react";
import useAdminStore from "../state/adminSlice";
import { useAuth } from "../../auth/hook/useAuth";

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: ClipboardList },
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Properties", path: "/admin/properties", icon: Building2 },
  { label: "Pending requests", path: "/admin/pending", icon: ClipboardList, badge: true },
];

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { pendingProperties = [], inquiries = [] } = useAdminStore();
  const user = useSelector((state) => state.auth.user);
  const { handleLogout: logoutUser } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const pendingCount = pendingProperties.length;
  const adminName = user?.fullname || "Admin";
  const adminEmail = user?.email || "";

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logoutUser(); // clears the cookie and the Redux user
    navigate("/login", { replace: true });
  };

  const desktopLink = ({ isActive }) =>
    `relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const mobileLink = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-gray-900 text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div
      className="flex min-h-screen flex-col bg-stone-50"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white">
        <div className="flex h-16 w-full items-center justify-between gap-4 px-3 sm:px-4 lg:px-5">
          {/* Left: menu button + brand */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2.5 rounded-lg p-1 text-left"
              aria-label="Go to dashboard"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900">
                <Home className="h-5 w-5 text-white" />
              </span>
              <span className="hidden leading-tight sm:block">
                <span
                  className="block text-base font-extrabold tracking-tight text-gray-900"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  360Views
                </span>
                <span className="block text-xs text-gray-500">Admin panel</span>
              </span>
            </button>
          </div>

          {/* Center: navigation (desktop), fills the space between logo and profile */}
          <nav className="mx-4 hidden flex-1 items-center gap-2 md:flex" aria-label="Admin">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} className={desktopLink}>
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                {item.label}
                {item.badge && pendingCount > 0 && (
                  <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: notifications and profile */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                }}
                aria-label="Notifications"
                aria-expanded={notifOpen}
                className="relative rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <Bell className="h-5 w-5" strokeWidth={1.8} />
                {pendingCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {pendingCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {pendingCount} pending
                    </span>
                  </div>

                  <div className="max-h-72 divide-y divide-stone-100 overflow-y-auto">
                    {pendingCount === 0 && inquiries.length === 0 ? (
                      <p className="px-4 py-10 text-center text-sm text-gray-500">
                        You're all caught up.
                      </p>
                    ) : (
                      <>
                        {pendingProperties.slice(0, 3).map((p) => (
                          <button
                            key={p._id}
                            onClick={() => navigate("/admin/pending")}
                            className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50"
                          >
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
                            <span className="min-w-0">
                              <span className="block text-xs text-gray-500">
                                New listing to review
                              </span>
                              <span className="mt-0.5 block truncate text-sm font-semibold text-gray-900">
                                {p.title}
                              </span>
                              <span className="mt-0.5 block text-xs text-gray-400">
                                {formatDate(p.createdAt || p.date)}
                              </span>
                            </span>
                          </button>
                        ))}
                        {inquiries.slice(0, 2).map((inq) => (
                          <button
                            key={inq._id}
                            onClick={() => navigate("/admin/purchase-requests")}
                            className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50"
                          >
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                            <span className="min-w-0">
                              <span className="block text-xs text-gray-500">
                                New purchase request
                              </span>
                              <span className="mt-0.5 block truncate text-sm font-semibold text-gray-900">
                                {inq.buyer}
                              </span>
                              <span className="mt-0.5 block text-xs text-gray-400">
                                {formatDate(inq.createdAt || inq.date)}
                              </span>
                            </span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="border-t border-stone-100 bg-stone-50 px-4 py-2.5 text-center">
                    <button
                      onClick={() => navigate("/admin/pending")}
                      className="text-sm font-semibold text-gray-700 transition-colors hover:text-gray-950"
                    >
                      View all pending requests
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-1 hidden h-6 w-px bg-stone-200 sm:block" />

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotifOpen(false);
                }}
                aria-expanded={profileOpen}
                className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                  {adminName.charAt(0).toUpperCase()}
                </span>
                <span className="hidden text-left leading-tight lg:block">
                  <span className="block max-w-32 truncate text-sm font-semibold text-gray-900">
                    {adminName}
                  </span>
                  <span className="block max-w-32 truncate text-xs text-gray-500">
                    {adminEmail}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={1.8}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
                  <div className="border-b border-stone-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">{adminName}</p>
                    <p className="truncate text-xs text-gray-500">{adminEmail}</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="space-y-4 border-t border-stone-200 bg-white px-4 py-4 md:hidden">
            <nav className="space-y-1" aria-label="Admin mobile">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.path} to={item.path} className={mobileLink}>
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && pendingCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ─── Content ─── */}
      <main className="w-full flex-1 px-3 py-6 sm:px-4 lg:px-5">{children}</main>

      {/* ─── Footer ─── */}
      <footer className="mt-auto border-t border-stone-200 bg-white">
        <div className="w-full px-3 py-5 text-sm text-gray-500 sm:px-4 lg:px-5">
          © 2026 360Views. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
