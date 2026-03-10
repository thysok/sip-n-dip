export default function WaveDivider({
  flip = false,
  color = "var(--donut-pink)",
  opacity = 0.06,
}: {
  flip?: boolean;
  color?: string;
  opacity?: number;
}) {
  return (
    <div
      className="pointer-events-none relative -my-1 w-full overflow-hidden"
      style={{ height: 60, transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={color}
          fillOpacity={opacity}
        />
        <path
          d="M0,38 C300,58 600,10 900,38 C1100,58 1300,18 1440,38 L1440,60 L0,60 Z"
          fill={color}
          fillOpacity={opacity * 0.7}
        />
      </svg>
    </div>
  );
}
