"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/50 bg-surface-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl uppercase tracking-wide">
          <span className="gradient-text">Dating Insights</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-heading text-sm font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-content-primary"
                  : "text-content-muted hover:text-content-secondary"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full gradient-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="md:hidden cursor-pointer p-2 text-content-secondary hover:text-content-primary transition-colors"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <nav
        className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 bg-surface-card border-l border-neutral-800/50 transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-2 p-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`relative rounded-lg px-4 py-3 font-heading text-base font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-surface-elevated text-content-primary"
                  : "text-content-muted hover:bg-surface-elevated hover:text-content-secondary"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 gradient-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
