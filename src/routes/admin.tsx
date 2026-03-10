import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Image,
  Star,
  Info,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const SIDEBAR_LINKS = [
  { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/menu" as const, label: "Menu", icon: UtensilsCrossed },
  { to: "/admin/gallery" as const, label: "Gallery", icon: Image },
  { to: "/admin/reviews" as const, label: "Reviews", icon: Star },
  { to: "/admin/about" as const, label: "About Page", icon: Info },
  { to: "/admin/settings" as const, label: "Settings", icon: Settings },
  { to: "/admin/messages" as const, label: "Messages", icon: MessageSquare },
];

function AdminLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="card-shell w-full max-w-md rounded-3xl p-8">
          <div className="mb-6 text-center">
            <span className="text-4xl">🍩</span>
            <h1 className="display-title mt-3 text-2xl font-bold text-[var(--text-primary)]">
              Admin Login
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Sip n' Dip Donuts Dashboard
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoggedIn(true);
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--donut-pink)] focus:ring-2 focus:ring-[var(--donut-pink-soft)]"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--donut-pink)] focus:ring-2 focus:ring-[var(--donut-pink-soft)]"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)]">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--donut-pink)] text-white shadow-lg lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-40 w-64 pt-[65px] transition-transform lg:static lg:translate-x-0 lg:pt-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 rounded-xl bg-[var(--donut-pink-soft)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--donut-pink)]">
              Admin Panel
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Sip n' Dip Donuts
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {SIDEBAR_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="admin-sidebar-link"
                activeProps={{ className: "admin-sidebar-link is-active" }}
                activeOptions={{ exact: link.exact }}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="admin-sidebar-link mt-4 text-[var(--text-muted)] hover:text-red-500"
            onClick={() => setIsLoggedIn(false)}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
}
