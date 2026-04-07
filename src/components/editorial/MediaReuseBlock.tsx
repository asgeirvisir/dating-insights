import CopyButton from "@/components/ui/CopyButton";

interface MediaReuseBlockProps {
  mediaReuse: {
    headline: string;
    stat: string;
    questionAngle: string;
    blurb: string;
  };
}

interface CopyableFieldProps {
  label: string;
  content: string;
}

function CopyableField({ label, content }: CopyableFieldProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-surface-elevated p-4 sm:p-5">
      <div className="min-w-0 flex-1">
        <span className="block font-heading text-xs font-medium uppercase tracking-wider text-content-muted">
          {label}
        </span>
        <p className="mt-1.5 font-body text-sm leading-relaxed text-content-primary sm:text-base">
          {content}
        </p>
      </div>
      <CopyButton text={content} className="shrink-0" />
    </div>
  );
}

export default function MediaReuseBlock({ mediaReuse }: MediaReuseBlockProps) {
  return (
    <section className="rounded-2xl bg-surface-card p-6 sm:p-8">
      <h3 className="font-display text-xl uppercase tracking-wider text-content-muted">
        Use This in Your Article
      </h3>

      <div className="mt-6 flex flex-col gap-4">
        <CopyableField label="Headline" content={mediaReuse.headline} />
        <CopyableField label="Key Stat" content={mediaReuse.stat} />
        <CopyableField
          label="Question Angle"
          content={mediaReuse.questionAngle}
        />
        <CopyableField label="Short Blurb" content={mediaReuse.blurb} />
      </div>

      <p className="mt-6 text-center font-body text-xs text-content-muted">
        Powered by{" "}
        <span className="font-heading font-medium text-content-secondary">
          Smitten
        </span>
      </p>
    </section>
  );
}
