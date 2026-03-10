import { motion } from "framer-motion";

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  center = true,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      className={center ? "text-center" : ""}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {kicker && <p className="kicker mb-2">{kicker}</p>}
      <h2 className="section-title mb-3 text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto max-w-2xl text-[var(--text-muted)]">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
