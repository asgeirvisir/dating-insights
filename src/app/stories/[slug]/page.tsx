import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import SectionDivider from "@/components/layout/SectionDivider";
import SectionHeader from "@/components/layout/SectionHeader";
import Badge from "@/components/ui/Badge";
import BigNumber from "@/components/data-modules/BigNumber";
import ArticleRenderer from "@/components/editorial/ArticleRenderer";
import MediaReuseBlock from "@/components/editorial/MediaReuseBlock";
import StoryGrid from "@/components/editorial/StoryGrid";

import { getStories, getStoryBySlug, getStoryById } from "@/lib/data";
import { formatDate } from "@/lib/formatters";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found | Dating Insights",
    };
  }

  return {
    title: `${story.title} | Dating Insights`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: "article",
      publishedTime: story.publishedAt,
      authors: [story.author.name],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  // Fetch related stories
  const relatedStoryData = await Promise.all(
    story.relatedStories.map((id) => getStoryById(id))
  );
  const relatedStories = relatedStoryData.filter(
    (s): s is NonNullable<typeof s> => s !== null
  );

  // Determine lead stat from the first data module if available
  const leadStat = story.dataModules.length > 0
    ? getLeadStat(story)
    : null;

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl">
        {/* ─── ARTICLE HEADER ─── */}
        <header className="mb-10">
          <Badge variant="purple" className="mb-4">
            {story.category}
          </Badge>

          <h1 className="font-display text-4xl uppercase leading-tight text-content-primary sm:text-5xl md:text-6xl lg:text-7xl">
            {story.title}
          </h1>

          <p className="mt-4 font-heading text-lg text-content-secondary sm:text-xl md:text-2xl">
            {story.subtitle}
          </p>

          <div className="mt-6 flex items-center gap-3 font-body text-sm text-content-muted">
            <span>{story.author.name}</span>
            <span>&middot;</span>
            <span>{story.author.role}</span>
            <span>&middot;</span>
            <time dateTime={story.publishedAt}>
              {formatDate(story.publishedAt)}
            </time>
          </div>
        </header>

        {/* ─── LEAD STAT ─── */}
        {leadStat && (
          <div className="mb-10 rounded-xl bg-surface-card p-8 text-center sm:p-10">
            <BigNumber
              value={leadStat.value}
              label={leadStat.label}
              variant="data"
            />
          </div>
        )}

        {/* ─── ARTICLE BODY ─── */}
        <ArticleRenderer blocks={story.body} />

        <SectionDivider />

        {/* ─── MEDIA REUSE BLOCK ─── */}
        <MediaReuseBlock mediaReuse={story.mediaReuse} />

        <SectionDivider />
      </article>

      {/* ─── RELATED STORIES ─── */}
      {relatedStories.length > 0 && (
        <div>
          <SectionHeader title="Related Stories" />
          <div className="mt-6">
            <StoryGrid
              stories={relatedStories}
              columns={relatedStories.length >= 3 ? 3 : 2}
            />
          </div>
        </div>
      )}
    </PageShell>
  );
}

/**
 * Extract a lead stat from the story's first data module reference.
 * This provides a visual anchor at the top of the article.
 */
function getLeadStat(story: NonNullable<Awaited<ReturnType<typeof getStoryBySlug>>>) {
  const firstModule = story.dataModules[0];
  if (!firstModule) return null;

  // Extract a meaningful stat from the media reuse block
  // since it always has a clean stat string
  const stat = story.mediaReuse.stat;
  const headline = story.mediaReuse.headline;

  // Try to extract the number/percentage from the stat string
  const match = stat.match(/(\d+%?)/);
  if (match) {
    return {
      value: match[1],
      label: stat.replace(match[1], "").trim().replace(/^of\s+/, "Of ").replace(/^,?\s*/, ""),
    };
  }

  return {
    value: stat.split(" ")[0],
    label: headline,
  };
}
