import { motion } from "framer-motion";
import { useMemo } from "react";

const DEFAULT_HOURS: Record<number, [number, number]> = {
  0: [7, 13],    // Sunday 7am-1pm
  1: [6, 14],    // Monday 6am-2pm
  2: [6, 14],    // Tuesday
  3: [6, 14],    // Wednesday
  4: [6, 14],    // Thursday
  5: [6, 15],    // Friday 6am-3pm
  6: [6, 15],    // Saturday 6am-3pm
};

export default function OpenNowBadge() {
  const isOpen = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const range = DEFAULT_HOURS[day];
    if (!range) return false;
    return hour >= range[0] && hour < range[1];
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold"
      style={{
        borderColor: isOpen
          ? "rgba(46, 125, 50, 0.3)"
          : "var(--line)",
        background: isOpen
          ? "rgba(46, 125, 50, 0.1)"
          : "var(--surface)",
        color: isOpen ? "#2e7d32" : "var(--text-muted)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <motion.span
        className="inline-block h-2 w-2 rounded-full"
        style={{
          background: isOpen ? "#4caf50" : "var(--text-muted)",
        }}
        animate={isOpen ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {isOpen ? "Open Now" : "Currently Closed"}
    </motion.div>
  );
}
