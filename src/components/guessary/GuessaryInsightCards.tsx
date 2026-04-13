import Link from "next/link";
import { ArrowRight } from "lucide-react";

const INSIGHTS = [
  {
    slug: "things-people-actually-admit-to",
    title: "The things people actually admit to",
    teaser:
      "Most people assume their desires are more unusual than they really are. The data says otherwise.",
  },
  {
    slug: "how-age-rewrites-the-rules",
    title: "People believe in love more as they get older",
    teaser:
      "The assumption is that cynicism grows with age. The data doesn't agree.",
  },
  {
    slug: "the-nordic-divide",
    title: "The Nordic divide",
    teaser:
      "Same questions, different answers. Where you live in the Nordics shapes what you're willing to admit.",
  },
];

export default function GuessaryInsightCards() {
  return (
    <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
      {INSIGHTS.map((insight, i) => (
        <Link
          key={insight.slug}
          href={`/stories/guessary/insights/${insight.slug}`}
          className={`card-spring group block cursor-pointer rounded-2xl border border-white/[0.06] bg-[#141414] p-6 sm:p-7 animate-fade-scale delay-${(i + 3) * 100}`}
          aria-label={`Read: ${insight.title}`}
        >
          <h3 className="font-heading text-[1.25rem] font-bold leading-snug text-content-primary sm:text-[1.35rem]">
            {insight.title}
          </h3>

          <p className="mt-3 font-body text-[14px] leading-relaxed text-white/45 sm:text-[15px]">
            {insight.teaser}
          </p>

          <div className="mt-5 inline-flex items-center gap-1.5 font-body text-sm font-medium text-white/40 transition-colors duration-200 group-hover:text-white/70">
            Read more
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}
