import GradientText from "@/components/ui/GradientText";
import Badge from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";

/* Emojis sampled from guessary questions, positioned around the edges */
const FLOATING_EMOJIS = [
  { emoji: "💔", top: "14%", left: "6%", size: "text-2xl", opacity: "opacity-15" },
  { emoji: "🔥", top: "18%", right: "8%", size: "text-2xl", opacity: "opacity-10" },
  { emoji: "🤷", top: "68%", left: "4%", size: "text-xl", opacity: "opacity-10" },
  { emoji: "👶", top: "72%", right: "5%", size: "text-2xl", opacity: "opacity-15" },
  { emoji: "😈", top: "22%", right: "22%", size: "text-xl", opacity: "opacity-10" },
  { emoji: "💕", top: "70%", left: "20%", size: "text-xl", opacity: "opacity-10" },
  { emoji: "🍷", top: "30%", right: "15%", size: "text-xl", opacity: "opacity-15" },
];

export default function GuessaryPromoCard() {
  return (
    <div className="group relative w-full overflow-hidden rounded-xl bg-surface-card border border-purple-main/20 transition-all duration-300 hover:border-transparent hover:shadow-[0_0_24px_rgba(155,0,255,0.2)]">
      {/* Gradient border glow on hover */}
      <div
        className="pointer-events-none absolute inset-[-1px] rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink opacity-0 transition-opacity duration-300 group-hover:opacity-50"
        style={{
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
        aria-hidden="true"
      />

      {/* Gradient glow orbs */}
      <div
        className="pointer-events-none absolute left-1/3 top-0 h-[200px] w-[300px] rounded-full bg-brand-purple opacity-10 blur-[80px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0 h-[180px] w-[250px] rounded-full bg-brand-pink opacity-8 blur-[70px]"
        aria-hidden="true"
      />

      {/* Decorative area chart silhouette */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-full h-20 sm:h-24"
        viewBox="0 0 800 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="promo-card-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF509B" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF509B" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path
          d="M0 100 L0 70 C100 65, 150 50, 200 42 C280 32, 350 25, 440 35 C520 44, 580 28, 650 18 C720 8, 770 12, 800 20 L800 100 Z"
          fill="url(#promo-card-fill)"
        />
        <path
          d="M0 70 C100 65, 150 50, 200 42 C280 32, 350 25, 440 35 C520 44, 580 28, 650 18 C720 8, 770 12, 800 20"
          fill="none"
          stroke="#FF509B"
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />
        <circle cx="200" cy="42" r="2.5" fill="#FF509B" fillOpacity="0.35" />
        <circle cx="440" cy="35" r="2.5" fill="#FF509B" fillOpacity="0.35" />
        <circle cx="650" cy="18" r="2.5" fill="#FF509B" fillOpacity="0.35" />
      </svg>

      {/* Floating emojis */}
      {FLOATING_EMOJIS.map(({ emoji, top, left, right, size, opacity }, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute select-none ${size} ${opacity}`}
          style={{ top, left, right }}
          aria-hidden="true"
        >
          {emoji}
        </span>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-12">
        <Badge variant="gradient" className="mb-4">
          125+ Questions
        </Badge>

        <GradientText
          as="h2"
          variant="primary"
          className="font-heading text-2xl font-black leading-tight sm:text-3xl lg:text-4xl"
        >
          Guess What Everyone&apos;s Hiding
        </GradientText>

        <p className="mx-auto mt-3 max-w-lg font-body text-sm text-content-secondary sm:text-base">
          125+ questions about dating and life — see how answers shift by age.
        </p>

        <span className="mt-5 inline-flex items-center gap-2 font-body text-sm font-semibold text-brand-pink transition-all duration-200 group-hover:gap-3">
          Explore the Guessary
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
