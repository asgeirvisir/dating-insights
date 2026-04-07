import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Story } from "@/types/story";

interface StoryCardProps {
  story: Story;
  size: "featured" | "standard" | "compact";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function FeaturedCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="gradient-border group block cursor-pointer p-6 transition-all duration-300 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <Badge variant="purple">{story.category}</Badge>
        <span className="font-body text-xs text-content-muted">
          {formatDate(story.publishedAt)}
        </span>
      </div>

      <h3 className="mt-4 font-heading text-2xl font-bold text-content-primary transition-colors duration-200 group-hover:text-brand-purple">
        {story.title}
      </h3>

      <p className="mt-2 font-heading text-base text-content-secondary">
        {story.subtitle}
      </p>

      <p className="mt-3 font-body text-sm leading-relaxed text-content-muted line-clamp-3">
        {story.excerpt}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {story.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>
    </Link>
  );
}

function StandardCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="gradient-border group block cursor-pointer p-5 transition-all duration-300 sm:p-6"
    >
      <h3 className="font-heading text-lg font-bold text-content-primary transition-colors duration-200 group-hover:text-brand-purple">
        {story.title}
      </h3>

      <p className="mt-2 font-body text-sm text-content-muted">
        {story.subtitle}
      </p>
    </Link>
  );
}

function CompactCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group flex items-center gap-4 rounded-lg bg-surface-card px-4 py-3 transition-all duration-200 hover:bg-surface-elevated"
    >
      <Badge variant="purple" className="shrink-0">
        {story.category}
      </Badge>

      <h3 className="min-w-0 flex-1 truncate font-heading text-base font-medium text-content-primary transition-colors duration-200 group-hover:text-brand-purple">
        {story.title}
      </h3>

      <span className="shrink-0 font-body text-xs text-content-muted">
        {formatDate(story.publishedAt)}
      </span>
    </Link>
  );
}

export default function StoryCard({ story, size }: StoryCardProps) {
  switch (size) {
    case "featured":
      return <FeaturedCard story={story} />;
    case "standard":
      return <StandardCard story={story} />;
    case "compact":
      return <CompactCard story={story} />;
  }
}
