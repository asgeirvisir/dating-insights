import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="bg-surface-card border-t border-neutral-800/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Branding */}
          <div className="text-center sm:text-left">
            <p className="font-heading text-sm text-content-secondary">
              Powered by{" "}
              <span className="gradient-text font-semibold">Smitten</span>
            </p>
            <p className="mt-1 text-xs text-content-muted">
              &copy; {new Date().getFullYear()} Dating Insights. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading text-sm text-content-muted hover:text-content-secondary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
