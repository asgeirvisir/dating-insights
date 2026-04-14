import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Badge from "@/components/ui/Badge";
import InsightCharts from "@/components/guessary/InsightCharts";
import { getGuessaryQuestions } from "@/lib/data";
import { ArrowLeft } from "lucide-react";

/* ── Insight data ── */

interface Insight {
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  questionIds: string[];
  body: string[];
}

const INSIGHTS: Record<string, Insight> = {
  "things-people-actually-admit-to": {
    slug: "things-people-actually-admit-to",
    title: "The Things People Actually Admit To",
    subtitle:
      "Turns out most people's private lives are more interesting than they let on.",
    publishedAt: "2026-04-10T09:00:00Z",
    questionIds: [
      "q-98",  // Dirty talk
      "q-101", // Sexual fantasy
      "q-134", // Thought about someone else during sex
      "q-104", // Sleep naked
      "q-48",  // Sex in public
      "q-100", // BDSM
      "q-102", // Affair
      "q-25",  // Arrested
      "q-133", // STD
      "q-26",  // Slept with more than ten people
    ],
    body: [
      "Most people assume their desires are more unusual than they really are. The data says otherwise. When we asked users across the Nordics about their sex lives and fantasies, what came back wasn't shocking...it was quietly revealing. The things people whisper about are, more often than not, the things nearly everyone is doing.",
      "Take dirty talk. It feels like something people either love or avoid, but the split is nowhere near even. The vast majority are into it, and that number only grows with age. Sexual fantasy follows the same pattern: more common the older you get, which says less about youthful innocence and more about how comfort and imagination develop over time.",
      "Thinking about someone else during sex sits in the same territory, common enough that nearly half of people admit to it, with women slightly more likely to say so than men. It's one of those findings that feels transgressive until you realize how many people are nodding quietly while reading it. Sleeping naked and sex in public are less universal, but more common than you'd guess, and fewer than you might fear.",
      "Then there are the things that feel heavier to admit: affairs, BDSM, the experiences that carry more weight socially. These numbers are smaller, but what's interesting isn't just how many people say yes, it's when. Affairs, for instance, are nearly twice as common among the oldest group as the youngest. Not impulsive, not reckless. Something that happens slowly, inside relationships that have grown complicated over time.",
      "None of this is really about guilt. It's about the gap between what people perform in public and what they actually do in private. That gap, it turns out, is smaller than most people think.",
    ],
  },
  "how-age-rewrites-the-rules": {
    slug: "how-age-rewrites-the-rules",
    title: "People Believe in Love More as They Get Older",
    subtitle:
      "The assumption is that cynicism grows with age. The data doesn't agree.",
    publishedAt: "2026-04-10T09:00:00Z",
    questionIds: [
      "q-93",  // Been in love
      "q-80",  // Love at first sight
      "q-47",  // Regret anything
      "q-94",  // Afraid of anything
      "q-37",  // Been dumped
      "q-73",  // Dumped someone over text
      "q-74",  // Breakfast in bed
      "q-102", // Affair
    ],
    body: [
      "There's a story most people tell about getting older and love: that it gets harder to believe in, that experience makes you guarded, that somewhere between your twenties and your forties the romanticism fades. The Smitten data tells a different story entirely.",
      "Belief in love at first sight climbs with age. Love itself becomes more universal where almost everyone over 45 has been in it. And as it accumulates, regret and fear quietly shrink. Whatever the years bring, they don't seem to make people more closed off. If anything, the opposite.",
      "The fuller picture is more complicated, as it always is. Most people have made someone breakfast in bed, and that number only grows with age. But so does having been dumped. The tenderness and the hurt accumulate together. Even the graceless exits get kinder over time: fewer people admit to ending things over text as the years pass.",
      "And then there's the number that complicates everything. Affairs increase steadily with age across the Nordics, but the gap between markets is where it gets interesting. Denmark and Norway sit at nearly double the rate of Iceland, where the number stays low across every age group. Whether that says something about culture, about honesty, or about what long relationships look like on a small island, the data doesn't say.",
    ],
  },
};

/* ── Static params ── */

export function generateStaticParams() {
  return Object.keys(INSIGHTS).map((slug) => ({ slug }));
}

/* ── Metadata ── */

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = INSIGHTS[slug];

  if (!insight) {
    return { title: "Not Found | Dating Insights" };
  }

  return {
    title: `${insight.title} | Guessary Insights`,
    description: insight.subtitle,
    openGraph: {
      title: insight.title,
      description: insight.subtitle,
      type: "article",
      publishedTime: insight.publishedAt,
    },
  };
}

/* ── Page ── */

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = INSIGHTS[slug];

  if (!insight) {
    notFound();
  }

  const allQuestions = await getGuessaryQuestions();
  const questions = insight.questionIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter((q): q is NonNullable<typeof q> => q !== null && q !== undefined);

  const date = new Date(insight.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl">
        {/* ─── Back link ─── */}
        <Link
          href="/stories/guessary"
          className="mb-8 inline-flex items-center gap-2 font-body text-sm text-content-muted transition-colors hover:text-content-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Guessary
        </Link>

        {/* ─── Header ─── */}
        <header className="mb-10">
          <Badge variant="purple" className="mb-4">
            Guessary
          </Badge>

          <h1 className="font-display text-4xl uppercase leading-tight text-content-primary sm:text-5xl md:text-6xl lg:text-7xl">
            {insight.title}
          </h1>

          <p className="mt-4 font-heading text-lg text-content-secondary sm:text-xl md:text-2xl">
            {insight.subtitle}
          </p>

          <div className="mt-6 flex items-center gap-3 font-body text-sm text-content-muted">
            <span>Smitten Data Team</span>
            <span>&middot;</span>
            <time dateTime={insight.publishedAt}>{date}</time>
          </div>
        </header>

        {/* ─── Body ─── */}
        <div className="space-y-6 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
          {insight.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* ─── Chart cards ─── */}
        {questions.length > 0 && (
          <InsightCharts questions={questions} />
        )}

        {/* ─── CTA ─── */}
        <div className="mt-10 text-center">
          <Link
            href="/stories/guessary"
            className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 font-body text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-pink-500/25"
          >
            Explore the full Guessary data
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
