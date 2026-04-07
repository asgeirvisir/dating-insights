import type { ReactNode } from "react";

type BadgeVariant = "default" | "pink" | "purple" | "cyan" | "gradient";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-elevated text-content-secondary",
  pink: "bg-pink-mega-dark/30 text-pink-light",
  purple: "bg-purple-mega-dark/30 text-purple-light",
  cyan: "bg-brand-cyan/15 text-brand-cyan",
  gradient: "gradient-primary text-content-primary",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-heading font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
