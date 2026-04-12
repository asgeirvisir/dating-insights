"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LAB_PAGES = [
  { href: "/stories/guessary/lab", label: "Chart Lab" },
  { href: "/stories/percentile/lab", label: "Percentile Lab" },
];

export default function LabNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2 mb-10">
      {LAB_PAGES.map((page) => {
        const isActive = pathname === page.href;
        return (
          <Link
            key={page.href}
            href={page.href}
            className={`rounded-full px-3.5 py-1.5 font-body text-sm font-medium transition-all duration-200 border min-h-[36px] inline-flex items-center ${
              isActive
                ? "bg-white text-[#0A0A0F] border-transparent"
                : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {page.label}
          </Link>
        );
      })}
    </nav>
  );
}
