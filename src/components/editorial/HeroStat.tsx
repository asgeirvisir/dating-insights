import GradientText from "@/components/ui/GradientText";

export default function HeroStat() {
  return (
    <section className="relative w-full overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-24">
      {/* ─── Animated gradient mesh ─── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-mesh-orb hero-mesh-orb--pink absolute left-[15%] top-[20%] h-[320px] w-[380px] opacity-20" />
        <div className="hero-mesh-orb hero-mesh-orb--purple absolute right-[10%] top-[10%] h-[400px] w-[420px] opacity-15" />
        <div className="hero-mesh-orb hero-mesh-orb--cyan absolute left-[50%] bottom-[5%] h-[280px] w-[300px] opacity-10" />
        <div className="hero-mesh-orb hero-mesh-orb--purple absolute left-[5%] bottom-[15%] h-[200px] w-[240px] opacity-10" />
      </div>

      {/* ─── Dot grid overlay ─── */}
      <div
        className="pointer-events-none absolute inset-0 dot-grid opacity-60"
        aria-hidden="true"
      />

      {/* ─── Horizontal accent lines ─── */}
      <div className="pointer-events-none absolute left-0 top-[30%] h-px w-full opacity-[0.06]" aria-hidden="true">
        <div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent, #9B00FF, #FF509B, transparent)" }} />
      </div>
      <div className="pointer-events-none absolute left-0 bottom-[25%] h-px w-full opacity-[0.04]" aria-hidden="true">
        <div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent, #0CC4EF, #9B00FF, transparent)" }} />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Overline */}
        <p className="animate-fade-up font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
          Powered by real data
        </p>

        {/* Large editorial title — staggered per line */}
        <h1 className="mt-6 font-heading font-black leading-[0.92] tracking-tight text-content-primary">
          <span className="animate-fade-up delay-100 block text-[3.2rem] sm:text-[5.5rem] lg:text-[7.5rem]">
            The Unfiltered
          </span>
          <span className="animate-fade-up delay-200 block text-[3.8rem] sm:text-[6.5rem] lg:text-[8.5rem]">
            Truth
          </span>
        </h1>

        {/* Byline */}
        <p className="animate-fade-up delay-400 mt-8 font-body text-lg text-content-muted sm:text-xl">
          Human behavior on dating app{" "}
          <GradientText as="span" variant="primary" className="font-bold">
            Smitten
          </GradientText>
        </p>

        {/* Subtitle */}
        <p className="animate-fade-up delay-500 mx-auto mt-4 max-w-md font-body text-base text-content-secondary/80 sm:text-lg">
          What millions of swipes, matches, and messages actually reveal.
        </p>
      </div>
    </section>
  );
}
