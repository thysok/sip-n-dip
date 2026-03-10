import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/menu" as const, label: "Menu" },
  { to: "/gallery" as const, label: "Gallery" },
  { to: "/about" as const, label: "About" },
  { to: "/reviews" as const, label: "Reviews" },
  { to: "/contact" as const, label: "Contact" },
];

const deliveryLinks = [
  {
    name: "Uber Eats",
    href: "https://www.ubereats.com/store/sip-n-dip-donuts-1001-13th-street/YZ0R3ApYW72JMaAK_WlNWw?surfaceName=",
    color: "#06C167",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-label="Uber Eats">
        <rect width="24" height="24" rx="4" fill="#06C167"/>
        <text x="12" y="16.5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">UE</text>
      </svg>
    ),
  },
  {
    name: "DoorDash",
    href: "https://www.doordash.com/store/sip-'n-dip-saint-cloud-36018899/79519546/?srsltid=AfmBOoqyh_vzWgdIYXQQGv_9P6sn8BVtiFbDHxkB9Rwsc",
    color: "#FF3008",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-label="DoorDash">
        <rect width="24" height="24" rx="4" fill="#FF3008"/>
        <text x="12" y="16.5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">DD</text>
      </svg>
    ),
  },
];

function OrderDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--donut-pink)] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
      >
        Order Now
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-xl">
          {deliveryLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[var(--text-primary)] no-underline transition hover:bg-[var(--donut-pink-soft)]"
              onClick={() => setOpen(false)}
            >
              {link.icon}
              {link.name}
              <svg viewBox="0 0 20 20" fill="currentColor" className="ml-auto h-3.5 w-3.5 text-[var(--text-muted)]">
                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 010-1.06l7.22-7.22H8.75a.75.75 0 010-1.5h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V6.56l-7.22 7.22a.75.75 0 01-1.06 0z" clipRule="evenodd"/>
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

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
          <OrderDropdown />
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <OrderDropdown />
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
