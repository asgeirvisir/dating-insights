"use client";

interface BigNumberProps {
  value: string;
  label: string;
  variant?: "primary" | "data";
  className?: string;
}

const gradientClass: Record<"primary" | "data", string> = {
  primary: "gradient-text",
  data: "gradient-text-data",
};

export default function BigNumber({
  value,
  label,
  variant = "primary",
  className = "",
}: BigNumberProps) {
  return (
    <div className={`text-center ${className}`}>
      <span
        className={`block font-display text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl lg:text-[96px] ${gradientClass[variant]}`}
      >
        {value}
      </span>
      <p className="mt-2 font-body text-base text-content-muted sm:text-lg">
        {label}
      </p>
    </div>
  );
}
