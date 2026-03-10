import { motion, useReducedMotion } from "framer-motion";

const items = [
  "Fresh Every Morning",
  "Family Owned Since 2018",
  "Saint Cloud's Favorite",
  "Handmade with Love",
  "Strong Coffee & Warm Donuts",
  "Come Hungry, Leave Happy",
];

export default function Marquee() {
  const prefersReducedMotion = useReducedMotion();
  const content = items.map((t) => `${t}  \u2022  `).join("");
  const doubled = content + content;

  return (
    <div className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--donut-pink-soft)] py-3">
      <motion.div
        className="flex whitespace-nowrap"
        animate={prefersReducedMotion ? {} : { x: ["0%", "-50%"] }}
        transition={prefersReducedMotion ? undefined : { duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <span className="display-title text-sm font-bold tracking-wide text-[var(--donut-pink)]">
          {doubled}
        </span>
      </motion.div>
    </div>
  );
}
