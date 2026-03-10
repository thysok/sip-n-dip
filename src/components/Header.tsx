import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const ORDER_URL =
  "https://www.getsauce.com/order/sip-n-dip/menu?utm_source=wp-site&utm_medium=order-now";

const navLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/menu" as const, label: "Menu" },
  { to: "/gallery" as const, label: "Gallery" },
  { to: "/about" as const, label: "About" },
  { to: "/reviews" as const, label: "Reviews" },
  { to: "/contact" as const, label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex items-center justify-between py-3 sm:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="display-title flex items-center gap-2 text-xl font-bold text-[var(--text-primary)] no-underline"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-2xl" aria-hidden="true">
            🍩
          </span>
          <span>
            Sip n' Dip{" "}
            <span className="text-[var(--donut-pink)]">Donuts</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link"
              activeProps={{ className: "nav-link is-active" }}
              activeOptions={{ exact: true }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Order Now <ExternalLink size={14} />
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Order Now <ExternalLink size={14} />
          </a>
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--donut-pink-soft)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-[var(--line)] pb-4 md:hidden">
          <div className="page-wrap flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] no-underline transition hover:bg-[var(--donut-pink-soft)] hover:text-[var(--text-primary)]"
                activeProps={{
                  className:
                    "rounded-lg px-4 py-2.5 text-sm font-semibold bg-[var(--donut-pink-soft)] text-[var(--donut-pink)] no-underline",
                }}
                activeOptions={{ exact: true }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 px-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
