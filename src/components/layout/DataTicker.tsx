"use client";

interface TickerItem {
  label: string;
  value: string;
}

interface DataTickerProps {
  items: TickerItem[];
  /** Speed in seconds for one full scroll cycle. Default: 30 */
  speed?: number;
  className?: string;
}

export default function DataTicker({
  items,
  speed = 30,
  className = "",
}: DataTickerProps) {
  // Duplicate items for seamless infinite scroll
  const duplicated = [...items, ...items];

  return (
    <div
      className={`relative overflow-hidden border-y border-neutral-800/50 bg-surface-card/50 ${className}`}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface-base to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface-base to-transparent" />

      <div
        className="flex items-center gap-10 py-3 whitespace-nowrap animate-ticker"
        style={
          {
            "--ticker-speed": `${speed}s`,
          } as React.CSSProperties
        }
      >
        {duplicated.map((item, i) => (
          <div key={`${item.label}-${i}`} className="flex items-center gap-2">
            <span className="font-heading text-lg font-semibold gradient-text">
              {item.value}
            </span>
            <span className="font-body text-sm text-content-muted">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
