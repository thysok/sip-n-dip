import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Image,
  Star,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const menuItems = useQuery(api.menuItems.list);
  const galleryPhotos = useQuery(api.galleryPhotos.list);
  const reviews = useQuery(api.reviews.listAll);
  const unreadCount = useQuery(api.contactMessages.unreadCount);

  const stats = [
    {
      label: "Menu Items",
      value: menuItems?.length ?? "—",
      icon: UtensilsCrossed,
      link: "/admin/menu" as const,
      color: "text-[var(--donut-pink)]",
      bg: "bg-[var(--donut-pink-soft)]",
    },
    {
      label: "Gallery Photos",
      value: galleryPhotos?.length ?? "—",
      icon: Image,
      link: "/admin/gallery" as const,
      color: "text-[var(--sprinkle-teal)]",
      bg: "bg-teal-50",
    },
    {
      label: "Reviews",
      value: reviews?.length ?? "—",
      icon: Star,
      link: "/admin/reviews" as const,
      color: "text-[var(--sprinkle-yellow)]",
      bg: "bg-amber-50",
    },
    {
      label: "Unread Messages",
      value: unreadCount ?? "—",
      icon: MessageSquare,
      link: "/admin/messages" as const,
      color: "text-[var(--sprinkle-coral)]",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div>
      <h1 className="display-title mb-2 text-2xl font-bold text-[var(--text-primary)]">
        Dashboard
      </h1>
      <p className="mb-8 text-sm text-[var(--text-muted)]">
        Welcome back! Here's an overview of your shop.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={stat.link}
              className="card-shell group flex items-center gap-4 rounded-2xl p-5 no-underline"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon size={22} className={stat.color} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {stat.label}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-[var(--text-muted)] opacity-0 transition group-hover:opacity-100"
              />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="card-shell mt-10 rounded-2xl p-6">
        <h2 className="mb-3 font-bold text-[var(--text-primary)]">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/menu" className="btn-primary text-sm">
            <UtensilsCrossed size={16} /> Manage Menu
          </Link>
          <Link to="/admin/gallery" className="btn-secondary text-sm">
            <Image size={16} /> Upload Photos
          </Link>
          <Link to="/admin/messages" className="btn-secondary text-sm">
            <MessageSquare size={16} /> View Messages
          </Link>
        </div>
      </div>
    </div>
  );
}
