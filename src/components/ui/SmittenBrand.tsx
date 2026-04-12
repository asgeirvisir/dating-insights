/**
 * Compact Smitten brand mark — interlinked hearts icon + "Smitten" wordmark.
 * Used in chart footers for "Powered by Smitten" attribution.
 */

const GRADIENT_ID = "smitten-brand-grad";

export function SmittenHearts({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF509B" />
          <stop offset="100%" stopColor="#9B00FF" />
        </linearGradient>
      </defs>
      {/* Two interlinked hearts */}
      <path
        d="M8.5 4C6 4 4 6 4 8.5c0 5 7 9.5 7 9.5s2.2-1.4 4.2-3.5"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M15.5 4C18 4 20 6 20 8.5c0 5-7 9.5-7 9.5s-2.2-1.4-4.2-3.5"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function SmittenBrandMark() {
  return (
    <span className="font-body text-[13px] text-white/35">
      Powered by{" "}
      <span className="gradient-text font-semibold text-[13px]">Smitten</span>
    </span>
  );
}
