interface ShareableQuoteProps {
  quote: string;
  source: string;
}

export default function ShareableQuote({ quote, source }: ShareableQuoteProps) {
  return (
    <div className="gradient-border mx-auto max-w-xl p-8 sm:p-10">
      {/* Decorative quote mark */}
      <span
        className="block font-display text-5xl leading-none gradient-text select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <p className="mt-2 font-heading text-xl leading-snug text-content-primary sm:text-2xl lg:text-3xl">
        {quote}
      </p>

      {/* Source attribution */}
      <p className="mt-6 font-body text-sm text-content-muted">
        &mdash; {source}
      </p>

      {/* Divider */}
      <div className="section-divider mt-8" />

      {/* Branding */}
      <p className="mt-4 text-center font-heading text-xs font-medium tracking-wider text-content-muted">
        Dating Insights by{" "}
        <span className="gradient-text">Smitten</span>
      </p>
    </div>
  );
}
