import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import GradientText from "@/components/ui/GradientText";
import SectionDivider from "@/components/layout/SectionDivider";

export const metadata: Metadata = {
  title: "About | Dating Insights",
  description:
    "Dating Insights is the data editorial from Smitten. We explore human behavior through the lens of modern dating.",
  openGraph: {
    title: "About | Dating Insights",
    description:
      "Dating Insights is the data editorial from Smitten. We explore human behavior through the lens of modern dating.",
  },
};

export default function AboutPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        {/* ─── TITLE ─── */}
        <GradientText
          as="h1"
          variant="primary"
          className="font-display text-5xl uppercase tracking-wide sm:text-6xl md:text-7xl"
        >
          About
        </GradientText>

        {/* ─── WHAT IS DATING INSIGHTS ─── */}
        <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
          <p>
            Dating Insights is the data editorial from Smitten. We take
            anonymized, aggregated data from millions of dating interactions and
            turn it into stories, interactive tools, and visualizations that
            anyone can explore.
          </p>
          <p>
            The goal is simple: make the invisible patterns of modern dating
            visible. How do people actually behave when they swipe, match, and
            message? What do the numbers say about first impressions, timing,
            and attraction? We dig into the data to find out.
          </p>
        </div>

        <SectionDivider />

        {/* ─── HUMAN BEHAVIOR ─── */}
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-content-primary sm:text-4xl">
            Why We Do This
          </h2>
          <div className="mt-4 space-y-4 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
            <p>
              We are genuinely curious about human behavior. Dating generates
              one of the richest behavioral datasets in the world. Every swipe,
              message, and match is a small decision that says something about
              how people think, feel, and connect.
            </p>
            <p>
              When you look at that data closely, unexpected things show up.
              Patterns that go against what people assume, odd quirks, and
              useful stuff that actually changes how you think about dating.
              That curiosity is what drives everything we publish here.
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* ─── ABOUT SMITTEN ─── */}
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-content-primary sm:text-4xl">
            About Smitten
          </h2>
          <div className="mt-4 space-y-4 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
            <p>
              Smitten is a dating app that makes meeting people fun. Instead
              of awkward openers and empty profiles, Smitten uses personality
              games and interactive features that make it as easy as swiping
              to get into great conversations.
            </p>
            <p>
              Instead of keeping data locked away, we share the big-picture
              patterns through Dating Insights. Individual users stay
              completely anonymous and private.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
