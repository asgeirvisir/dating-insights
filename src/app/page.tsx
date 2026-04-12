import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import HeroStat from "@/components/editorial/HeroStat";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <PageShell>
      {/* ─── HERO ─── */}
      <HeroStat />

      {/* ─── STORY CARDS ─── */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:mt-16 sm:gap-8">
        {/* ── Guessary Card ── */}
        <Link
          href="/stories/guessary"
          className="card-spring image-card animate-fade-scale delay-600 group block cursor-pointer"
          aria-label="Explore Guessary insights"
        >
          {/* Hero image */}
          <div className="image-card-img">
            <Image
              src="/images/cards/guessary-pile.png"
              alt="A pile of colorful question shapes representing 125+ dating questions"
              width={800}
              height={450}
              priority
            />
          </div>

          {/* Content */}
          <div className="image-card-body">
            <h2 className="font-heading text-[1.65rem] font-black leading-[1.15] text-content-primary sm:text-[1.85rem]">
              The Guilty Pleasures of Daters
            </h2>

            <p className="mt-3 font-body text-[15px] leading-relaxed text-white/45">
              The stuff people actually admit to in Smitten's flagship icebreaker, Guessary.
            </p>

            {/* CTA */}
            <div className="mt-auto pt-7">
              <span className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition-all duration-200 group-hover:brightness-110 group-hover:shadow-lg group-hover:shadow-pink-500/25">
                Explore the data
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>

        {/* ── Percentile Card ── */}
        <Link
          href="/stories/percentile"
          className="card-spring image-card animate-fade-scale delay-700 group block cursor-pointer"
          aria-label="Explore percentile distribution insights"
        >
          {/* Hero image */}
          <div className="image-card-img">
            <Image
              src="/images/cards/hearts-pile.png"
              alt="A large pile and small pile of hearts showing unequal distribution of likes"
              width={800}
              height={450}
              priority
            />
          </div>

          {/* Content */}
          <div className="image-card-body">
            <h2 className="font-heading text-[1.65rem] font-black leading-[1.15] text-content-primary sm:text-[1.85rem]">
              50% of Likes Go to the Top Profiles
            </h2>

            <p className="mt-3 font-body text-[15px] leading-relaxed text-white/45">
              The dating game for most men is unfair. But it's not just dating apps, it's human behavior.
            </p>

            {/* CTA */}
            <div className="mt-auto pt-7">
              <span className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition-all duration-200 group-hover:brightness-110 group-hover:shadow-lg group-hover:shadow-pink-500/25">
                See the numbers
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </PageShell>
  );
}
