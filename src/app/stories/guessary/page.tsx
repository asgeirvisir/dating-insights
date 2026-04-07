import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import GuessaryHero from "@/components/guessary/GuessaryHero";
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
      <GuessaryExplorer questions={questions} />
    </PageShell>
  );
}
