import { motion } from "framer-motion";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const DEFAULT_HOURS: Record<number, [number, number]> = {
  0: [7, 13],    // Sunday 7am-1pm
  1: [6, 14],    // Monday 6am-2pm
  2: [6, 14],    // Tuesday
  3: [6, 14],    // Wednesday
  4: [6, 14],    // Thursday
  5: [6, 15],    // Friday 6am-3pm
  6: [6, 15],    // Saturday 6am-3pm
};

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function parseTimeRange(str: string): [number, number] | null {
  // Parses "6:00 AM – 2:00 PM" into [6, 14]
  const parts = str.split(/\s*[–-]\s*/);
  if (parts.length !== 2) return null;
  const parse12h = (t: string): number | null => {
    const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const ampm = m[3].toUpperCase();
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return h;
  };
  const open = parse12h(parts[0]);
  const close = parse12h(parts[1]);
  if (open === null || close === null) return null;
  return [open, close];
}

export default function OpenNowBadge() {
  const settings = useQuery(api.shopSettings.getAll);

  const isOpen = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    // Try to use hours from Convex settings
    if (settings?.hours) {
      try {
        const hoursMap = JSON.parse(settings.hours);
        const dayName = DAY_NAMES[day];
        const dayStr = hoursMap[dayName];
        if (dayStr && dayStr.toLowerCase() !== "closed") {
          const range = parseTimeRange(dayStr);
          if (range) return hour >= range[0] && hour < range[1];
        } else if (dayStr && dayStr.toLowerCase() === "closed") {
          return false;
        }
      } catch {
        // Fall through to defaults
      }
    }

    // Fall back to hardcoded defaults
    const range = DEFAULT_HOURS[day];
    if (!range) return false;
    return hour >= range[0] && hour < range[1];
  }, [settings?.hours]);

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
