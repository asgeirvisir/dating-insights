import PercentileIntervalChart from "@/components/percentile/PercentileIntervalChart";
import LabNav from "@/components/lab/LabNav";
import PageShell from "@/components/layout/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PercentileLabPage() {
  return (
    <PageShell>
      <LabNav />
      <h1 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
        Percentile Lab
      </h1>
      <p className="mt-2 font-body text-lg text-white/40">
        Design sandbox — top percentile hero stat.
      </p>

      <div className="mt-12 flex flex-col items-center gap-10">
        <PercentileIntervalChart />
      </div>
    </PageShell>
  );
}
