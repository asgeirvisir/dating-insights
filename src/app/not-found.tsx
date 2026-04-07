import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import GradientText from "@/components/ui/GradientText";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center py-20 text-center sm:py-32">
        {/* Big 404 */}
        <GradientText
          as="h1"
          variant="primary"
          className="font-display text-[120px] leading-none tracking-tight sm:text-[160px] md:text-[200px]"
        >
          404
        </GradientText>

        {/* Witty message */}
        <h2 className="mt-4 font-heading text-2xl font-semibold text-content-primary sm:text-3xl">
          This page ghosted you.
        </h2>
        <p className="mt-3 max-w-md font-body text-base text-content-muted sm:text-lg">
          It seemed interested at first, but then it just... disappeared.
          Classic. Maybe try swiping right on a different page.
        </p>

        {/* Back to homepage */}
        <div className="mt-8">
          <Link href="/">
            <Button variant="primary" size="lg">
              Back to the homepage
            </Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
