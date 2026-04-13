import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
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

          {/* Navigation Links & Contact */}
          <div className="flex flex-col items-center gap-4 sm:items-end">
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
            <div className="flex items-center gap-4 text-xs text-content-muted">
              <p>
                Data &amp; media inquiries:{" "}
                <a
                  href="mailto:marketing@smitten.fun?subject=Dating%20Insights%20Inquiry"
                  className="text-content-secondary hover:text-brand-pink transition-colors duration-200 underline underline-offset-2"
                >
                  marketing@smitten.fun
                </a>
              </p>
              <span className="text-neutral-700">|</span>
              <Link
                href="/game"
                className="text-content-muted/60 hover:text-content-muted transition-colors duration-200"
              >
                Play the game
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
