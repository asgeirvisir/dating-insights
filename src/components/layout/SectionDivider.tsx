interface SectionDividerProps {
  className?: string;
}

export default function SectionDivider({ className = "" }: SectionDividerProps) {
  return <div className={`section-divider my-12 ${className}`} />;
}
