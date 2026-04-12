import Image from "next/image";
import GradientText from "@/components/ui/GradientText";

export default function GuessaryHero() {
  return (
    <section className="relative w-full">
      {/* ─── Full-bleed hero image ─── */}
      <div
        className="relative w-[100vw] left-1/2 -translate-x-1/2 aspect-[16/9] sm:aspect-[21/9] max-h-[520px]"
      >
        <Image
          src="/images/cards/guessary-pile.png"
          alt="A pile of colorful question shapes representing 125+ dating questions"
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

      {/* ─── Title ─── */}
      <div className="relative -mt-20 sm:-mt-28 lg:-mt-36 pt-4 pb-10 sm:pb-14">
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
          <h1 className="font-display text-[3.5rem] font-black uppercase leading-[0.95] tracking-wide text-content-primary sm:text-[6rem] lg:text-[8rem]">
            The Unfiltered Truth
          </h1>

          <p className="mt-6 font-body text-lg text-content-muted sm:text-xl">
            Insights by{" "}
            <GradientText as="span" variant="primary" className="font-bold">
              Smitten
            </GradientText>
          </p>

          <p className="mx-auto mt-5 max-w-lg font-body text-base text-content-secondary sm:text-lg">
            See how age shapes our behavior &amp; guilty pleasures.
          </p>
        </div>
      </div>

      {/* ─── Intro copy ─── */}
      <div className="relative mx-auto max-w-2xl px-4 pb-10 sm:pb-14">
        <div className="space-y-5 font-body text-base leading-relaxed text-content-secondary sm:text-lg">
          <p>
            Every day, thousands of people on Smitten play Guessary — a social
            icebreaker where you guess how someone answered a personal question,
            then reveal the truth. The data below comes from over 125 real
            questions answered by real users across Denmark, Iceland, Norway, and
            Sweden. None of it is hypothetical. These are things people actually
            admitted to.
          </p>
          <p>
            What the numbers reveal is surprisingly consistent: age reshapes
            almost everything. Confidence climbs, guilt fades, and priorities
            shift in ways that are both predictable and deeply human. The
            questions that divide 20-year-olds barely register with 40-year-olds
            — and the things older users confess to would make their younger
            selves cringe. Scroll through and see where you fall.
          </p>
        </div>
      </div>
    </section>
  );
}
