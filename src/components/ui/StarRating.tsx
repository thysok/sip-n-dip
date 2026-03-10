import { Star } from "lucide-react";

export default function StarRating({
  rating,
  size = 18,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < rating
              ? "fill-[var(--sprinkle-yellow)] text-[var(--sprinkle-yellow)]"
              : "text-[var(--line)] fill-none"
          }
        />
      ))}
    </div>
  );
}
