import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

const SPRINKLE_COLORS = [
  "var(--donut-pink)",
  "var(--sprinkle-yellow)",
  "var(--sprinkle-coral)",
  "var(--sprinkle-teal)",
  "var(--sprinkle-blue)",
  "var(--donut-pink-light)",
];

interface Sprinkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotate: number;
  shape: "circle" | "rod";
}

export default function FloatingSprinkles({ count = 24 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sprinkles = useMemo<Sprinkle[]>(() => {
    if (!mounted) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      color: SPRINKLE_COLORS[Math.floor(Math.random() * SPRINKLE_COLORS.length)],
      duration: Math.random() * 8 + 6,
      delay: Math.random() * -10,
      rotate: Math.random() * 360,
      shape: Math.random() > 0.4 ? "rod" : "circle",
    }));
  }, [count, mounted]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {sprinkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.shape === "rod" ? s.size * 2.5 : s.size,
            height: s.size,
            borderRadius: s.shape === "rod" ? s.size / 2 : "50%",
            background: s.color,
            opacity: 0.25,
            rotate: `${s.rotate}deg`,
          }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, -8, 5, 0],
            rotate: [s.rotate, s.rotate + 40, s.rotate - 20, s.rotate + 10, s.rotate],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}
    </div>
  );
}
