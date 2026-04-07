"use client";

interface GuessaryFilterBarProps {
  availableSlices: string[];
  activeSlice: string;
  onSliceChange: (slice: string) => void;
}

const SLICE_LABELS: Record<string, string> = {
  all: "All",
  women: "Women",
  men: "Men",
  is: "Iceland",
  dk: "Denmark",
  no: "Norway",
  se: "Sweden",
  fi: "Finland",
};

export default function GuessaryFilterBar({
  availableSlices,
  activeSlice,
  onSliceChange,
}: GuessaryFilterBarProps) {
  if (availableSlices.length <= 1) return null;

  return (
    <div className="sticky top-16 z-30 -mx-4 bg-surface-base/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap gap-2">
        {availableSlices.map((slice) => (
          <button
            key={slice}
            type="button"
            onClick={() => onSliceChange(slice)}
            className={`cursor-pointer rounded-full px-4 py-1.5 font-heading text-sm font-medium transition-all duration-200 ${
              activeSlice === slice
                ? "gradient-primary text-content-primary"
                : "bg-surface-elevated text-content-muted hover:text-content-secondary"
            }`}
          >
            {SLICE_LABELS[slice] ?? slice}
          </button>
        ))}
      </div>
    </div>
  );
}
