"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
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

  function isActive(link: { href: string; exact?: boolean; matchPrefix?: string }) {
    if (link.href === "/") return pathname === "/";
    if (link.exact) return pathname === link.href;
    if (link.matchPrefix) return pathname.endsWith(link.matchPrefix) || pathname === link.href;
    return pathname.startsWith(link.href);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/50 bg-surface-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-display text-2xl uppercase tracking-wide">
          <Image
            src="/images/Smitten-Logo.svg"
            alt="Smitten"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="gradient-text">Dating Insights</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-heading text-sm font-medium transition-colors duration-200 ${
                isActive(link)
                  ? "text-content-primary"
                  : "text-content-muted hover:text-content-secondary"
              }`}
            >
              {link.label}
              {isActive(link) && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full gradient-primary rounded-full" />
              )}
            </Link>
          ))}
          <a
            href="https://smitten.onelink.me/38fj/pe5hu9iw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full gradient-primary px-5 py-2 font-heading text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-pink-500/25"
          >
            Get Smitten
          </a>
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
                isActive(link)
                  ? "bg-surface-elevated text-content-primary"
                  : "text-content-muted hover:bg-surface-elevated hover:text-content-secondary"
              }`}
            >
              {link.label}
              {isActive(link) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 gradient-primary rounded-full" />
              )}
            </Link>
          ))}
          <a
            href="https://smitten.onelink.me/38fj/pe5hu9iw"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-4 flex items-center justify-center rounded-full gradient-primary px-5 py-3 font-heading text-base font-semibold text-white transition-all duration-200 hover:brightness-110"
          >
            Get Smitten
          </a>
        </div>
      </nav>
    </header>
  );
}
