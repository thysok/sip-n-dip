import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const settings = useQuery(api.shopSettings.getAll);

  const phone = settings?.phone ?? "(407) 892-1252";
  const email = settings?.email ?? "hello@sipndipdonuts.com";
  const address = settings?.address ?? "1001 13th St, Saint Cloud, FL 34769";
  const hours = settings?.hours ? JSON.parse(settings.hours) : null;

  return (
    <footer className="site-footer mt-20 px-4 pb-10 pt-12">
      <div className="page-wrap">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="display-title mb-3 text-lg font-bold text-[var(--text-primary)]">
              <span aria-hidden="true">🍩</span> Sip n' Dip Donuts
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Best Donuts in Town! <br />
              A family donut shop in Saint Cloud, FL.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/menu" className="text-[var(--text-muted)] no-underline hover:text-[var(--donut-pink)]">Menu</Link>
              <Link to="/gallery" className="text-[var(--text-muted)] no-underline hover:text-[var(--donut-pink)]">Gallery</Link>
              <Link to="/about" className="text-[var(--text-muted)] no-underline hover:text-[var(--donut-pink)]">About Us</Link>
              <Link to="/reviews" className="text-[var(--text-muted)] no-underline hover:text-[var(--donut-pink)]">Reviews</Link>
              <Link to="/contact" className="text-[var(--text-muted)] no-underline hover:text-[var(--donut-pink)]">Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Visit Us
            </h4>
            <div className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 no-underline text-[var(--text-muted)] transition hover:text-[var(--donut-pink)]"
              >
                <MapPin size={14} className="shrink-0 text-[var(--donut-pink)]" />
                {address}
              </a>
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 no-underline text-[var(--text-muted)] transition hover:text-[var(--donut-pink)]"
              >
                <Phone size={14} className="shrink-0 text-[var(--donut-pink)]" />
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 no-underline text-[var(--text-muted)] transition hover:text-[var(--donut-pink)]"
              >
                <Mail size={14} className="shrink-0 text-[var(--donut-pink)]" />
                {email}
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Hours
            </h4>
            <div className="flex flex-col gap-1 text-sm text-[var(--text-muted)]">
              {hours ? (
                Object.entries(hours).map(([day, h]) => (
                  <span key={day} className="flex items-center gap-2">
                    <Clock size={14} className="shrink-0 text-[var(--donut-pink)]" />
                    <span className="capitalize">{day}:</span> {h as string}
                  </span>
                ))
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="shrink-0 text-[var(--donut-pink)]" />
                    Mon–Thu: 6 AM – 2 PM
                  </span>
                  <span className="pl-[22px]">Fri–Sat: 6 AM – 3 PM</span>
                  <span className="pl-[22px]">Sun: 7 AM – 1 PM</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--line)] pt-6 text-center text-sm text-[var(--text-muted)]">
          <p>&copy; {year} Sip n' Dip Donuts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
