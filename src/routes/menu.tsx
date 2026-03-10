import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import Badge from "../components/ui/Badge";
import DonutSpinner from "../components/ui/DonutSpinner";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { cn } from "../lib/utils";

const ORDER_URL =
  "https://www.getsauce.com/order/sip-n-dip/menu?utm_source=wp-site&utm_medium=order-now";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
  head: () => ({
    meta: [
      { title: "Menu | Sip n' Dip Donuts — Saint Cloud, FL" },
      { name: "description", content: "Browse our full menu of handmade donuts, pastries, smoothies, boba milk tea, and breakfast items. Made fresh daily in Saint Cloud, FL." },
    ],
  }),
});

function MenuCard({ item, i, categoryName }: { item: any; i: number; categoryName?: string }) {
  return (
    <motion.article
      className="card-shell group flex flex-col overflow-hidden rounded-2xl"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
      whileHover={{
        y: -3,
        boxShadow:
          "0 1px 0 var(--inset-glint) inset, 0 28px 56px rgba(78, 52, 46, 0.1), 0 8px 22px rgba(78, 52, 46, 0.06)",
        transition: { duration: 0.2 },
      }}
    >
      {item.imageUrl ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {item.badge && (
            <div className="absolute right-2 top-2">
              <Badge type={item.badge} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--donut-pink-soft)] text-3xl">
            {categoryName?.includes("Smoothie") || categoryName?.includes("Milk Tea") || categoryName?.includes("Boba")
              ? "🧋"
              : categoryName?.includes("Bundle")
                ? "🎁"
                : categoryName?.includes("Breakfast")
                  ? "🌯"
                  : categoryName?.includes("Pastri")
                    ? "🥐"
                    : "🍩"}
          </div>
          {item.badge && <Badge type={item.badge} />}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-1.5 text-lg font-bold text-[var(--text-primary)]">
          {item.name}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {item.description}
        </p>
        {item.orderLink ? (
          <a
            href={item.orderLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <ShoppingCart size={14} /> Add to Cart
          </a>
        ) : (
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <ShoppingCart size={14} /> Add to Cart
          </a>
        )}
      </div>
    </motion.article>
  );
}

function MenuPage() {
  const categories = useQuery(api.categories.listActive);
  const menuItems = useQuery(api.menuItems.listActive);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? menuItems
      : menuItems?.filter((item) => item.categoryId === activeCategory);

  const categoryMap = new Map(
    categories?.map((c) => [c._id, c.name]) ?? []
  );

  return (
    <main className="px-4 pb-16 pt-12">
      <div className="page-wrap">
        <SectionHeading
          kicker="What's Cookin'"
          title="Our Menu"
          subtitle="Everything is made fresh daily. No shortcuts, no preservatives — just good dough and great toppings."
        />

        {/* Order CTA */}
        <motion.div
          className="mt-8 rounded-2xl bg-[var(--donut-pink-soft)] px-6 py-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="mb-2 text-sm font-semibold text-[var(--donut-pink)]">
            Order online for pickup or delivery!
          </p>
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Order Now <ExternalLink size={14} />
          </a>
        </motion.div>

        {/* Category Filter */}
        {categories && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeCategory === "all"
                  ? "bg-[var(--donut-pink)] text-white shadow-md"
                  : "bg-[var(--surface-strong)] text-[var(--text-secondary)] border border-[var(--line)] hover:border-[var(--donut-pink)] hover:text-[var(--donut-pink)]"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => setActiveCategory(cat._id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  activeCategory === cat._id
                    ? "bg-[var(--donut-pink)] text-white shadow-md"
                    : "bg-[var(--surface-strong)] text-[var(--text-secondary)] border border-[var(--line)] hover:border-[var(--donut-pink)] hover:text-[var(--donut-pink)]"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Menu Grid */}
        {filtered === undefined ? (
          <DonutSpinner className="mt-16" />
        ) : activeCategory !== "all" && filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="text-4xl">🍩</span>
            <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">
              No items in this category
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Check back soon — we're always adding new treats!
            </p>
          </div>
        ) : activeCategory !== "all" ? (
          /* Single category — flat grid */
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <MenuCard key={item._id} item={item} i={i} categoryName={categoryMap.get(item.categoryId)} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* All categories — grouped sections */
          <div className="mt-10 space-y-14">
            {categories?.map((cat) => {
              const items = menuItems?.filter((item) => item.categoryId === cat._id) ?? [];
              if (items.length === 0) return null;
              const emoji = cat.name.includes("Smoothie") || cat.name.includes("Latte")
                ? "🧋"
                : cat.name.includes("Milk Tea") || cat.name.includes("Boba")
                  ? "🧋"
                  : cat.name.includes("Bundle")
                    ? "🎁"
                    : cat.name.includes("Breakfast")
                      ? "🌯"
                      : cat.name.includes("Pastri")
                        ? "🥐"
                        : "🍩";
              return (
                <section key={cat._id} id={cat.slug}>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-2xl">{emoji}</span>
                    <h2 className="display-title text-2xl font-bold text-[var(--text-primary)]">
                      {cat.name}
                    </h2>
                    <span className="text-sm text-[var(--text-muted)]">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, i) => (
                      <MenuCard key={item._id} item={item} i={i} categoryName={cat.name} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
