"use client";

interface PillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Pill({
  label,
  active = false,
  onClick,
  className = "",
}: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-heading font-medium cursor-pointer transition-all duration-200 ${
        active
          ? "gradient-primary text-content-primary"
          : "bg-surface-elevated text-content-secondary hover:text-content-primary"
      } ${className}`}
    >
      {label}
    </button>
  );
}
