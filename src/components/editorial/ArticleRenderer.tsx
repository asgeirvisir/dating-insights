import type { ContentBlock } from "@/types/story";
import { ModuleRenderer } from "@/components/data-modules/ModuleRenderer";
import type { ModuleType } from "@/types/modules";

interface ArticleRendererProps {
  blocks: ContentBlock[];
}

function ParagraphBlock({ text }: { text: string }) {
  return (
    <p className="mx-auto mb-6 max-w-prose font-body text-base leading-relaxed text-content-secondary sm:text-lg">
      {text}
    </p>
  );
}

function HeadingBlock({ level, text }: { level: 2 | 3; text: string }) {
  if (level === 2) {
    return (
      <h2 className="mx-auto mb-4 mt-12 max-w-prose font-heading text-2xl font-bold text-content-primary sm:text-3xl">
        {text}
      </h2>
    );
  }

  return (
    <h3 className="mx-auto mb-3 mt-8 max-w-prose font-heading text-xl font-semibold text-content-primary sm:text-2xl">
      {text}
    </h3>
  );
}

function PullQuoteBlock({
  text,
  attribution,
}: {
  text: string;
  attribution?: string;
}) {
  return (
    <blockquote
      className="mx-auto my-10 max-w-2xl border-l-4 border-transparent bg-surface-card px-8 py-6 sm:my-12"
      style={{
        borderImage: "linear-gradient(180deg, #9B00FF, #FF509B) 1",
      }}
    >
      <p className="font-heading text-xl italic leading-snug text-content-primary sm:text-2xl">
        &ldquo;{text}&rdquo;
      </p>
      {attribution && (
        <cite className="mt-4 block font-body text-sm not-italic text-content-muted">
          &mdash; {attribution}
        </cite>
      )}
    </blockquote>
  );
}

function DataModuleBlock({
  moduleType,
  moduleId,
}: {
  moduleType: string;
  moduleId: string;
}) {
  return (
    <div className="my-10 sm:my-12">
      <ModuleRenderer
        moduleRef={{ type: moduleType as ModuleType, id: moduleId }}
      />
    </div>
  );
}

function ImageBlock({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="mx-auto my-10 max-w-3xl sm:my-12">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-surface-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-body text-sm text-content-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function ArticleRenderer({ blocks }: ArticleRendererProps) {
  return (
    <article className="w-full">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <ParagraphBlock key={index} text={block.text} />;
          case "heading":
            return (
              <HeadingBlock key={index} level={block.level} text={block.text} />
            );
          case "pullQuote":
            return (
              <PullQuoteBlock
                key={index}
                text={block.text}
                attribution={block.attribution}
              />
            );
          case "dataModule":
            return (
              <DataModuleBlock
                key={index}
                moduleType={block.moduleType}
                moduleId={block.moduleId}
              />
            );
          case "image":
            return (
              <ImageBlock
                key={index}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
              />
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
