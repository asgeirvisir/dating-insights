import GradientText from "@/components/ui/GradientText";

export default function HeroStat() {
  return (
    <section className="relative w-full overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
      {/* Gradient glow orbs */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[500px] rounded-full bg-brand-purple opacity-15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/3 top-1/2 -translate-x-1/2 h-[300px] w-[400px] rounded-full bg-brand-pink opacity-10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Large editorial title */}
        <h1 className="font-heading text-[3.5rem] font-black leading-[0.95] tracking-tight text-content-primary sm:text-[6rem] lg:text-[8rem]">
          The Unfiltered Truth
        </h1>

        {/* Byline */}
        <p className="mt-6 font-body text-lg text-content-muted sm:text-xl">
          Insights by dating app{" "}
          <GradientText as="span" variant="primary" className="font-bold">
            Smitten
          </GradientText>
        </p>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-lg font-body text-base text-content-secondary sm:text-lg">
          What millions of swipes, matches, and messages actually reveal.
        </p>
      </div>
    </section>
  );
}
