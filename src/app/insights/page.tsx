import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import SectionDivider from "@/components/layout/SectionDivider";
import GradientText from "@/components/ui/GradientText";
import Pill from "@/components/ui/Pill";
import Guessary from "@/components/data-modules/Guessary";
import ComparisonBars from "@/components/data-modules/ComparisonBars";
import MythVerdict from "@/components/data-modules/MythVerdict";
import ProfileTraitCard from "@/components/data-modules/ProfileTraitCard";
import RankingList from "@/components/data-modules/RankingList";
import BehavioralStat from "@/components/data-modules/BehavioralStat";

import {
  getGuessaryModules,
  getComparisonModules,
  getMythModules,
  getProfileInsightModules,
  getRankingModules,
  getBehavioralModules,
  getCategories,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Insights | Dating Insights",
  description:
    "All the data, all in one place. Browse dating opinions, country comparisons, myth-busting, profile tips, rankings, and behavioral stats.",
  openGraph: {
    title: "Insights | Dating Insights",
    description:
      "All the data, all in one place. Browse dating opinions, country comparisons, myth-busting, profile tips, rankings, and behavioral stats.",
  },
};

export default async function InsightsPage() {
  const [
    categories,
    guessaryModules,
    comparisonModules,
    mythModules,
    profileInsightModules,
    rankingModules,
    behavioralModules,
  ] = await Promise.all([
    getCategories(),
    getGuessaryModules(),
    getComparisonModules(),
    getMythModules(),
    getProfileInsightModules(),
    getRankingModules(),
    getBehavioralModules(),
  ]);

  return (
    <PageShell>
      {/* ─── PAGE HEADER ─── */}
      <div className="mb-10">
        <GradientText
          as="h1"
          variant="primary"
          className="font-display text-5xl uppercase tracking-wide sm:text-6xl md:text-7xl"
        >
          Insights
        </GradientText>
        <p className="mt-3 max-w-2xl font-heading text-lg text-content-secondary sm:text-xl">
          All the data, all in one place. Browse opinions, comparisons,
          myth-busting, and more from the Smitten Nordic Dating Survey.
        </p>
      </div>

      {/* ─── CATEGORY FILTER PILLS ─── */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
        <Pill label="All" active />
        {categories.map((cat) => (
          <Pill key={cat.id} label={cat.name} />
        ))}
      </div>

      {/* ─── OPINION DATA (GUESSARY) ─── */}
      <SectionHeader
        title="Opinion Data"
        subtitle="What do people actually think?"
        className="mt-10"
      />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {guessaryModules.map((g) => (
          <Guessary key={g.id} {...g} />
        ))}
      </div>

      <SectionDivider />

      {/* ─── COUNTRY COMPARISONS ─── */}
      <SectionHeader
        title="Country Comparisons"
        subtitle="How dating varies across the Nordics"
      />
      <div className="mt-6 space-y-6">
        {comparisonModules.map((c) => (
          <ComparisonBars key={c.id} {...c} />
        ))}
      </div>

      <SectionDivider />

      {/* ─── MYTH VS FACT ─── */}
      <SectionHeader
        title="Myth vs Fact"
        subtitle="Separating dating truth from internet fiction"
      />
      <div className="mt-6 space-y-6">
        {mythModules.map((m) => (
          <MythVerdict key={m.id} {...m} />
        ))}
      </div>

      <SectionDivider />

      {/* ─── PROFILE PLAYBOOK ─── */}
      <SectionHeader
        title="Profile Playbook"
        subtitle="Data-backed tips to level up your profile"
      />
      <div className="mt-6 space-y-6">
        {profileInsightModules.map((pi) => (
          <ProfileTraitCard key={pi.id} {...pi} />
        ))}
      </div>

      <SectionDivider />

      {/* ─── RANKINGS ─── */}
      <SectionHeader
        title="Rankings"
        subtitle="Who leads, who trails, and why it matters"
      />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {rankingModules.map((r) => (
          <RankingList key={r.id} {...r} />
        ))}
      </div>

      <SectionDivider />

      {/* ─── BY THE NUMBERS ─── */}
      <SectionHeader
        title="By the Numbers"
        subtitle="The stats that tell the story"
      />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {behavioralModules.map((b) => (
          <BehavioralStat key={b.id} {...b} />
        ))}
      </div>
    </PageShell>
  );
}
