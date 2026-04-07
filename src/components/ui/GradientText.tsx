import type { ReactNode } from "react";

type GradientVariant = "primary" | "data";

interface GradientTextProps {
  variant?: GradientVariant;
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
}

const variantClass: Record<GradientVariant, string> = {
  primary: "gradient-text",
  data: "gradient-text-data",
};

export default function GradientText({
  variant = "primary",
  children,
  className = "",
  as: Tag = "span",
}: GradientTextProps) {
  return (
    <Tag className={`${variantClass[variant]} ${className}`}>{children}</Tag>
  );
}
