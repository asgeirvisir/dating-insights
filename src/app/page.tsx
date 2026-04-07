import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import HeroStat from "@/components/editorial/HeroStat";
import StoryCard from "@/components/editorial/StoryCard";

import { getStories } from "@/lib/data";

export default async function HomePage() {
  const allStories = await getStories();
  const cards = allStories.slice(0, 3);

  return (
    <PageShell>
      {/* ─── HERO ─── */}
      <Link href="/stories/guessary" className="block" aria-label="Explore Guessary insights">
        <HeroStat />
      </Link>

      {/* ─── THREE CARDS ─── */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((story) => (
          <StoryCard key={story.id} story={story} size="standard" />
        ))}
      </div>
    </PageShell>
  );
}
