export default function Badge({ type }: { type: string }) {
  if (type === "new") {
    return (
      <span className="rounded-full bg-[var(--badge-new-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--badge-new-text)]">
        New
      </span>
    );
  }
  if (type === "popular") {
    return (
      <span className="rounded-full bg-[var(--badge-popular-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--badge-popular-text)]">
        Popular
      </span>
    );
  }
  return null;
}
