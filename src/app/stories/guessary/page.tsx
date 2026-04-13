import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import GuessaryHero from "@/components/guessary/GuessaryHero";
import GuessaryInsightCards from "@/components/guessary/GuessaryInsightCards";
import GuessaryExplorer from "@/components/guessary/GuessaryExplorer";
import { getGuessaryQuestions } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Unfiltered Truth — Guessary Insights | Dating Insights",
  description:
    "125+ questions about dating, relationships, and life — answered by thousands. See how answers change dramatically by age group.",
  openGraph: {
    title: "The Unfiltered Truth — Guessary Insights",
    description:
      "125+ questions about dating, relationships, and life — answered by thousands. See how answers change dramatically by age group.",
    type: "website",
  },
};

export default async function GuessaryPage() {
  const questions = await getGuessaryQuestions();

  return (
    <PageShell>
      <GuessaryHero />
      <GuessaryInsightCards />

      {/* ─── Data section heading ─── */}
      <h2 className="mt-16 font-display text-3xl uppercase tracking-wide text-content-primary sm:mt-20 sm:text-4xl">
        See all data
      </h2>

      <GuessaryExplorer questions={questions} />
    </PageShell>
  );
}
