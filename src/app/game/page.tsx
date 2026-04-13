import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import GuessaryGame from "@/components/guessary/GuessaryGame";
import { getGuessaryQuestions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Guess the Percentage | Dating Insights",
  description:
    "Can you guess how people answered? Test your instincts against real survey data from thousands of respondents.",
};

export default async function GamePage() {
  const questions = await getGuessaryQuestions();

  return (
    <PageShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 sm:py-24">
        <GuessaryGame questions={questions} />
      </div>
    </PageShell>
  );
}
