import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import GradientText from "@/components/ui/GradientText";
import SectionDivider from "@/components/layout/SectionDivider";

export const metadata: Metadata = {
  title: "About | Dating Insights",
  description:
    "Dating Insights is data-driven dating intelligence for the Nordics. Learn about our mission, methodology, and the team behind the numbers.",
  openGraph: {
    title: "About | Dating Insights",
    description:
      "Dating Insights is data-driven dating intelligence for the Nordics.",
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
          About Dating Insights
        </GradientText>

        {/* ─── INTRO ─── */}
        <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
          <p>
            Dating Insights is where hard data meets the messy, beautiful,
            occasionally baffling world of modern romance. We take the numbers
            that most dating apps keep locked away and turn them into stories
            that are actually fun to read. No jargon, no academic posturing,
            just real stats about how people swipe, match, text, ghost, and
            (sometimes) fall in love across the Nordics.
          </p>
          <p>
            We believe that understanding the data makes you a better dater. Not
            in a manipulative, game-theory way, but in a genuine, &ldquo;oh,
            so that is why nobody replies on Friday nights&rdquo; kind of way.
            Knowledge is power, and in dating, power is knowing that your lead
            photo matters more than your entire bio.
          </p>
          <p>
            Every insight you see on this site is backed by real survey data,
            behavioral analytics, and the kind of obsessive statistical
            curiosity that comes from genuinely caring about whether double
            texting is still desperate (it is not, by the way).
          </p>
        </div>

        <SectionDivider />

        {/* ─── POWERED BY SMITTEN ─── */}
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-content-primary sm:text-4xl">
            Powered by Smitten
          </h2>
          <div className="mt-4 space-y-4 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
            <p>
              Dating Insights is the editorial and data arm of Smitten, the
              Nordic dating platform built on the radical idea that people
              deserve to know what is actually happening in the dating world.
              Smitten collects anonymized, aggregated data from millions of
              interactions across Iceland, Denmark, Norway, Sweden, and Finland.
            </p>
            <p>
              We turn that data into the insights you read here. No individual
              user is ever identified, no private messages are ever read, and no
              personal information is shared. What we do share: the big-picture
              patterns that reveal how modern dating actually works.
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* ─── FOR PRESS & MEDIA ─── */}
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-content-primary sm:text-4xl">
            For Press &amp; Media
          </h2>
          <div className="mt-4 space-y-4 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
            <p>
              Every story on Dating Insights includes a Media Reuse Block with
              a ready-made headline, key stat, question angle, and blurb. You
              are welcome to quote our data in your reporting. We just ask that
              you credit &ldquo;Smitten / Dating Insights&rdquo; as the source
              and link back to the original story.
            </p>
            <p>
              For press inquiries, custom data requests, or expert commentary,
              reach out to our team at{" "}
              <span className="font-heading font-semibold text-brand-purple">
                press@smitten.dating
              </span>
              . We are always happy to help journalists make sense of the
              numbers.
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* ─── METHODOLOGY ─── */}
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-content-primary sm:text-4xl">
            Methodology
          </h2>
          <div className="mt-4 space-y-4 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
            <p>
              Our data comes from three primary sources: the Smitten Nordic
              Dating Survey (an annual survey of 6,000+ active daters across
              five countries), anonymized behavioral analytics from the Smitten
              platform, and commissioned third-party research studies.
            </p>
            <p>
              Sample sizes are listed on every data module. Survey data is
              weighted to be representative of the active dating population by
              age, gender, and country. Behavioral data reflects real usage
              patterns, not self-reported behavior. Where a finding is based on
              a small or non-representative sample, we say so.
            </p>
            <p>
              We are obsessive about accuracy, but we are not an academic
              journal. Our goal is to make data accessible and useful, not to
              publish peer-reviewed papers. If you spot something that looks off,
              tell us. We would rather be corrected than wrong.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
