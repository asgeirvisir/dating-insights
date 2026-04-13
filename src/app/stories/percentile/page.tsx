import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import PercentileIntervalChart from "@/components/percentile/PercentileIntervalChart";

export const metadata: Metadata = {
  title: "Who Gets the Likes? — Percentile Distribution | Dating Insights",
  description:
    "How likes are distributed across user profiles in Nordic dating apps. Data from Denmark, Iceland, Norway, and Sweden.",
  openGraph: {
    title: "Who Gets the Likes? — Percentile Distribution",
    description:
      "How likes are distributed across user profiles in Nordic dating apps.",
    type: "website",
  },
};

export default function PercentilePage() {
  return (
    <PageShell>
      {/* ─── Full-bleed hero image ─── */}
      <div className="relative w-[100vw] left-1/2 -translate-x-1/2 aspect-[16/9] sm:aspect-[21/9] max-h-[520px]">
        <Image
          src="/images/cards/hearts-pile.png"
          alt="A large pile and small pile of hearts showing unequal distribution of likes"
          fill
          priority
          className="object-cover"
        />
        {/* Bottom gradient fade to background */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-base via-surface-base/80 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* ─── Header ─── */}
      <section className="relative -mt-20 sm:-mt-28 pt-4 pb-10 sm:pb-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-content-primary sm:text-5xl lg:text-6xl">
            Who Gets the Likes?
          </h1>
          <p className="mt-4 font-body text-lg text-content-secondary sm:text-xl">
            How attention is distributed across dating profiles in the Nordics.
          </p>
        </div>
      </section>

      {/* ─── Chart ─── */}
      <section className="flex justify-center">
        <PercentileIntervalChart />
      </section>

      {/* ─── Editorial copy ─── */}
      <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <div className="space-y-6 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
          <p>
            Not all profiles get equal attention. Our data from millions of
            users across Denmark, Iceland, Norway, and Sweden reveals a stark
            pattern: the top 10% of male profiles attract nearly half of all
            likes men receive, while the top 10% of women attract about a fifth.
            In other words, a small group of men captures a disproportionately
            large share of attention -- far more so than among women.
          </p>
          <p>
            This isn&apos;t something dating apps engineer -- it&apos;s what raw
            human behavior looks like. The difference comes down to how men and
            women swipe. Men tend to like broadly, spreading their attention
            across many profiles. Women are far more selective, concentrating
            their likes on fewer people. The result: male likes pile up on a
            small number of top profiles, while female likes are spread more
            evenly. The apps just hold up the mirror.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
