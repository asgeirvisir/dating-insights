import GuessaryLabCards from "@/components/guessary/GuessaryLabCards";
import LabNav from "@/components/lab/LabNav";
import PageShell from "@/components/layout/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function GuessaryLabPage() {
  return (
    <PageShell>
      <LabNav />
      <h1 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
        Chart Lab
      </h1>
      <p className="mt-2 font-body text-lg text-white/40">
        Design sandbox — two cards for iteration.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <GuessaryLabCards />
      </div>
    </PageShell>
  );
}
