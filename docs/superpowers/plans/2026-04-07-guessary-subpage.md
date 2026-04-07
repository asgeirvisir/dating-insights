# Guessary Subpage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/stories/guessary` subpage showing 125+ Smitten Guessary questions as a bento grid of interactive area-chart cards, with the main page hero linking to it.

**Architecture:** Server component page loads JSON data, passes it to a client `GuessaryExplorer` wrapper that manages a global slice toggle (for future gender/market splits). Each card renders a Recharts `AreaChart` showing age-group breakdowns. The data model uses a `slices` map for extensibility.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, Recharts, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-07-guessary-subpage-design.md`

---

## File Map

### New files
| File | Responsibility |
|------|---------------|
| `scripts/convert-guessary-csv.ts` | One-time script: CSV → JSON conversion |
| `src/data/modules/guessaryQuestions.json` | 125+ question records with age-breakdown data |
| `src/components/guessary/AgeBreakdownChart.tsx` | Recharts area chart (client) |
| `src/components/guessary/GuessaryCard.tsx` | Single question card (client) |
| `src/components/guessary/GuessaryGrid.tsx` | Bento CSS grid of cards (client) |
| `src/components/guessary/GuessaryFilterBar.tsx` | Slice toggle pills (client) |
| `src/components/guessary/GuessaryExplorer.tsx` | State owner: wraps filter + grid (client) |
| `src/components/guessary/GuessaryHero.tsx` | Page hero section (server) |
| `src/app/stories/guessary/page.tsx` | Page route with metadata |

### Modified files
| File | Change |
|------|--------|
| `src/types/modules.ts` | Add `GuessaryQuestion` interface |
| `src/types/index.ts` | Re-export `GuessaryQuestion` |
| `src/lib/data.ts` | Add `getGuessaryQuestions()` accessor, import JSON |
| `src/app/page.tsx` | Wrap HeroStat in a Link to `/stories/guessary` |
| `package.json` | Add `recharts` dependency (via npm install) |

---

## Task 1: Install Recharts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install recharts**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && npm install recharts
```

Expected: `recharts` appears in `dependencies` in `package.json`.

- [ ] **Step 2: Verify installation**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && node -e "require('recharts'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add package.json package-lock.json && git commit -m "chore: add recharts dependency"
```

---

## Task 2: Convert CSV to JSON Data File

**Files:**
- Create: `scripts/convert-guessary-csv.ts`
- Create: `src/data/modules/guessaryQuestions.json`

The CSV is at `/Users/asgeirvisir/Downloads/Smitten Guessary spurningar-Blö - Sheet1.csv`.

- [ ] **Step 1: Create the conversion script**

Create `scripts/convert-guessary-csv.ts`:

```ts
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CSV_PATH = "/Users/asgeirvisir/Downloads/Smitten Guessary spurningar-Blö - Sheet1.csv";
const OUT_PATH = join(__dirname, "../src/data/modules/guessaryQuestions.json");

// --- Editorial curation for featured questions ---
interface Curation {
  emoji: string;
  headline: string | null;
  displayQuestion: string;
  tags: string[];
  featured: boolean;
}

const curated: Record<number, Curation> = {
  3: {
    emoji: "👶",
    headline: null,
    displayQuestion: "How many people have kids?",
    tags: ["mainstream"],
    featured: true,
  },
  95: {
    emoji: "👶",
    headline: null,
    displayQuestion: "How many people want to have children?",
    tags: ["mainstream"],
    featured: true,
  },
  111: {
    emoji: "☕",
    headline: "Somewhere after 40, coffee becomes part of the personality",
    displayQuestion: "How many people drink coffee?",
    tags: ["mainstream"],
    featured: false,
  },
  102: {
    emoji: "💔",
    headline: "Affairs triple between your 20s and 40s",
    displayQuestion: "How many people have had an affair?",
    tags: ["spicy"],
    featured: true,
  },
  11: {
    emoji: "🌍",
    headline: null,
    displayQuestion: "How many people think the earth is flat?",
    tags: ["niche"],
    featured: false,
  },
  109: {
    emoji: "🔒",
    headline: null,
    displayQuestion: "How many people are virgins?",
    tags: ["spicy"],
    featured: false,
  },
  83: {
    emoji: "🙏",
    headline: "Religion climbs steadily with age",
    displayQuestion: "How many people are religious?",
    tags: ["mainstream"],
    featured: true,
  },
  29: {
    emoji: "🤷",
    headline: "Only 31% of young adults think they're normal",
    displayQuestion: "How many people consider themselves normal?",
    tags: ["mainstream"],
    featured: true,
  },
  93: {
    emoji: "❤️",
    headline: "By 45, almost everyone has been in love",
    displayQuestion: "How many people have been in love?",
    tags: ["mainstream"],
    featured: true,
  },
  119: {
    emoji: "📱",
    headline: "The iPhone generation gap is real",
    displayQuestion: "How many people are iPhone users?",
    tags: ["niche"],
    featured: true,
  },
  100: {
    emoji: "🔥",
    headline: null,
    displayQuestion: "How many people have tried BDSM?",
    tags: ["spicy"],
    featured: false,
  },
  26: {
    emoji: "🛏️",
    headline: "The number jumps dramatically after 25",
    displayQuestion: "How many people have slept with more than ten people?",
    tags: ["spicy"],
    featured: true,
  },
  18: {
    emoji: "💃",
    headline: "Strip clubs are a rite of passage after 35",
    displayQuestion: "How many people have been to a strip club?",
    tags: ["spicy"],
    featured: false,
  },
  96: {
    emoji: "🍺",
    headline: null,
    displayQuestion: "How many people drink alcohol?",
    tags: ["mainstream"],
    featured: false,
  },
  80: {
    emoji: "💘",
    headline: "Belief in love at first sight grows with age",
    displayQuestion: "How many people believe in love at first sight?",
    tags: ["mainstream"],
    featured: false,
  },
};

// --- Default emoji assignment based on question content ---
function guessEmoji(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("sex") || q.includes("hook") || q.includes("slept") || q.includes("bdsm") || q.includes("fetish") || q.includes("dirty") || q.includes("naked")) return "🔥";
  if (q.includes("love") || q.includes("dating") || q.includes("relationship") || q.includes("crush") || q.includes("wedding") || q.includes("dumped") || q.includes("kiss")) return "💕";
  if (q.includes("drink") || q.includes("wasted") || q.includes("nicotine") || q.includes("drug")) return "🍷";
  if (q.includes("kid") || q.includes("child") || q.includes("parent")) return "👶";
  if (q.includes("afraid") || q.includes("scared") || q.includes("ghost") || q.includes("dark") || q.includes("die") || q.includes("death")) return "😨";
  if (q.includes("job") || q.includes("work") || q.includes("successful") || q.includes("ambitious")) return "💼";
  if (q.includes("game") || q.includes("video") || q.includes("cheat") || q.includes("instrument") || q.includes("sing")) return "🎮";
  if (q.includes("sport") || q.includes("marathon") || q.includes("workout") || q.includes("flexible")) return "💪";
  if (q.includes("travel") || q.includes("bungee") || q.includes("parachut") || q.includes("adventur")) return "✈️";
  if (q.includes("food") || q.includes("cook") || q.includes("vegan") || q.includes("pizza") || q.includes("breakfast") || q.includes("coffee")) return "🍕";
  if (q.includes("tattoo") || q.includes("piercing")) return "🎨";
  if (q.includes("arrest") || q.includes("police") || q.includes("stolen") || q.includes("crime") || q.includes("fight")) return "🚨";
  if (q.includes("money") || q.includes("bank") || q.includes("$")) return "💰";
  if (q.includes("book") || q.includes("read") || q.includes("degree") || q.includes("class") || q.includes("test")) return "📚";
  if (q.includes("pet") || q.includes("dog")) return "🐾";
  if (q.includes("phone") || q.includes("iphone")) return "📱";
  if (q.includes("bucket") || q.includes("regret")) return "📋";
  return "💬";
}

// --- Default displayQuestion rewrite ---
function rewriteQuestion(original: string): string {
  return original
    .replace(/^Does <FIRST_NAME> /i, "How many people ")
    .replace(/^Has <FIRST_NAME> /i, "How many people have ")
    .replace(/^Is <FIRST_NAME> /i, "How many people are ")
    .replace(/^Would <FIRST_NAME> /i, "How many people would ")
    .replace(/^Can <FIRST_NAME> /i, "How many people can ")
    .replace(/^Are both of <FIRST_NAME>'s /i, "How many people's ")
    .replace(/^Could <FIRST_NAME> /i, "How many people could ");
}

// --- Parse CSV ---
const raw = readFileSync(CSV_PATH, "utf-8");
const lines = raw.trim().split("\n");

// Skip header row
const dataLines = lines.slice(1);

interface Question {
  id: string;
  originalIndex: number;
  question: string;
  displayQuestion: string;
  emoji: string;
  headline: string | null;
  tags: string[];
  featured: boolean;
  slices: Record<string, Record<string, number>>;
}

const questions: Question[] = [];

for (const line of dataLines) {
  // Parse CSV carefully — question text may contain commas
  const match = line.match(/^(\d+),(.+?),(\d+%),(\d+%),(\d+%),(\d+%),/);
  if (!match) continue;

  const originalIndex = parseInt(match[1], 10);
  const questionText = match[2].trim();
  const pct18 = parseInt(match[3], 10);
  const pct25 = parseInt(match[4], 10);
  const pct35 = parseInt(match[5], 10);
  const pct45 = parseInt(match[6], 10);

  const curation = curated[originalIndex];

  questions.push({
    id: `q-${originalIndex}`,
    originalIndex,
    question: questionText,
    displayQuestion: curation?.displayQuestion ?? rewriteQuestion(questionText),
    emoji: curation?.emoji ?? guessEmoji(questionText),
    headline: curation?.headline ?? null,
    tags: curation?.tags ?? [],
    featured: curation?.featured ?? false,
    slices: {
      all: {
        "18-24": pct18,
        "25-34": pct25,
        "35-44": pct35,
        "45+": pct45,
      },
    },
  });
}

// Sort: featured first, then by max spread descending
questions.sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  const spreadA = Math.max(...Object.values(a.slices.all)) - Math.min(...Object.values(a.slices.all));
  const spreadB = Math.max(...Object.values(b.slices.all)) - Math.min(...Object.values(b.slices.all));
  return spreadB - spreadA;
});

writeFileSync(OUT_PATH, JSON.stringify(questions, null, 2) + "\n");
console.log(`Wrote ${questions.length} questions to ${OUT_PATH}`);
```

- [ ] **Step 2: Run the conversion script**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && npx tsx scripts/convert-guessary-csv.ts
```

Expected: prints `Wrote 125 questions to ...guessaryQuestions.json` (count may vary slightly).

- [ ] **Step 3: Verify the output JSON**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && node -e "const d=require('./src/data/modules/guessaryQuestions.json'); console.log('Count:', d.length); console.log('First:', JSON.stringify(d[0], null, 2))"
```

Expected: count ~125, first item is a featured question with correct structure.

- [ ] **Step 4: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add scripts/convert-guessary-csv.ts src/data/modules/guessaryQuestions.json && git commit -m "feat: convert guessary CSV to JSON data file with editorial curation"
```

---

## Task 3: Add GuessaryQuestion Type and Data Accessor

**Files:**
- Modify: `src/types/modules.ts:84-90`
- Modify: `src/types/index.ts:11-19`
- Modify: `src/lib/data.ts:1-11`

- [ ] **Step 1: Add GuessaryQuestion interface to modules.ts**

Append before the final `DataModule` type alias in `src/types/modules.ts`:

```ts
export interface GuessaryQuestion {
  id: string;
  originalIndex: number;
  question: string;
  displayQuestion: string;
  emoji: string;
  headline: string | null;
  tags: string[];
  featured: boolean;
  slices: Record<string, Record<string, number>>;
}
```

Do NOT add `GuessaryQuestion` to the `DataModule` union — it's a separate concept from the existing inline data modules.

- [ ] **Step 2: Re-export from types/index.ts**

Add `GuessaryQuestion` to the re-export block from `'./modules'` in `src/types/index.ts`:

```ts
export type {
  ModuleType,
  DataModuleRef,
  GuessaryData,
  GuessaryQuestion,
  ComparisonData,
  MythData,
  ProfileInsightData,
  RankingData,
  BehavioralData,
  DataModule,
} from './modules';
```

- [ ] **Step 3: Add data import and accessor to data.ts**

In `src/lib/data.ts`, add the import at the top alongside the other imports:

```ts
import type { GuessaryQuestion } from '@/types';
```

Add the JSON import alongside the other data imports:

```ts
import guessaryQuestionsData from '@/data/modules/guessaryQuestions.json';
```

Add the accessor function (after the existing Guessary section):

```ts
// ---------------------------------------------------------------------------
// Guessary Questions (age-breakdown cards)
// ---------------------------------------------------------------------------

export async function getGuessaryQuestions(): Promise<GuessaryQuestion[]> {
  return guessaryQuestionsData as unknown as GuessaryQuestion[];
}
```

- [ ] **Step 4: Verify types compile**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors (or only pre-existing ones unrelated to our changes).

- [ ] **Step 5: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add src/types/modules.ts src/types/index.ts src/lib/data.ts && git commit -m "feat: add GuessaryQuestion type and data accessor"
```

---

## Task 4: Build AgeBreakdownChart Component

**Files:**
- Create: `src/components/guessary/AgeBreakdownChart.tsx`

- [ ] **Step 1: Create the chart component**

Create `src/components/guessary/AgeBreakdownChart.tsx`:

```tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AgeBreakdownChartProps {
  data: Record<string, number>;
}

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-surface-elevated px-3 py-2 shadow-lg">
      <p className="font-body text-sm text-content-primary">
        <span className="text-content-muted">{label}:</span> {payload[0].value}%
      </p>
    </div>
  );
}

export default function AgeBreakdownChart({ data }: AgeBreakdownChartProps) {
  const chartData = AGE_GROUPS.map((group) => ({
    ageGroup: group,
    value: data[group] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF509B" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FF509B" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#434343"
          vertical={false}
        />
        <XAxis
          dataKey="ageGroup"
          tick={{ fill: "#8D8D8D", fontSize: 12, fontFamily: "Source Sans 3" }}
          axisLine={{ stroke: "#434343" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#8D8D8D", fontSize: 12, fontFamily: "Source Sans 3" }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#FF509B"
          strokeWidth={2}
          fill="url(#pinkGradient)"
          dot={{ r: 4, fill: "#FF509B", stroke: "#1C1C1C", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#FF509B", stroke: "#1C1C1C", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Verify types compile**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add src/components/guessary/AgeBreakdownChart.tsx && git commit -m "feat: add AgeBreakdownChart recharts component"
```

---

## Task 5: Build GuessaryCard Component

**Files:**
- Create: `src/components/guessary/GuessaryCard.tsx`

- [ ] **Step 1: Create the card component**

Create `src/components/guessary/GuessaryCard.tsx`:

```tsx
"use client";

import type { GuessaryQuestion } from "@/types";
import Badge from "@/components/ui/Badge";
import AgeBreakdownChart from "./AgeBreakdownChart";

interface GuessaryCardProps {
  question: GuessaryQuestion;
  activeSlice: string;
}

export default function GuessaryCard({
  question,
  activeSlice,
}: GuessaryCardProps) {
  const sliceData = question.slices[activeSlice];
  const isSpicy = question.tags.includes("spicy");

  return (
    <div
      className={`gradient-border flex flex-col p-5 sm:p-6 ${
        question.featured ? "col-span-1 sm:col-span-2" : ""
      }`}
    >
      {/* Top row: emoji + optional badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl" role="img" aria-hidden="true">
          {question.emoji}
        </span>
        {isSpicy && (
          <Badge variant="pink">
            🔥 Spicy
          </Badge>
        )}
      </div>

      {/* Optional clickbait headline */}
      {question.headline && (
        <p className="mb-2 font-heading text-base italic leading-snug gradient-text sm:text-lg">
          &ldquo;{question.headline}&rdquo;
        </p>
      )}

      {/* Display question */}
      <h3 className="mb-4 font-heading text-lg font-bold text-content-primary sm:text-xl">
        {question.displayQuestion}
      </h3>

      {/* Chart or fallback */}
      <div className="mt-auto">
        {sliceData ? (
          <AgeBreakdownChart data={sliceData} />
        ) : (
          <div className="flex h-[180px] items-center justify-center">
            <p className="font-body text-sm text-content-muted">
              No data for this view
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types compile**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add src/components/guessary/GuessaryCard.tsx && git commit -m "feat: add GuessaryCard component with emoji, headline, and chart"
```

---

## Task 6: Build GuessaryGrid Component

**Files:**
- Create: `src/components/guessary/GuessaryGrid.tsx`

- [ ] **Step 1: Create the grid component**

Create `src/components/guessary/GuessaryGrid.tsx`:

```tsx
"use client";

import type { GuessaryQuestion } from "@/types";
import GuessaryCard from "./GuessaryCard";

interface GuessaryGridProps {
  questions: GuessaryQuestion[];
  activeSlice: string;
}

export default function GuessaryGrid({
  questions,
  activeSlice,
}: GuessaryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {questions.map((q) => (
        <GuessaryCard key={q.id} question={q} activeSlice={activeSlice} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add src/components/guessary/GuessaryGrid.tsx && git commit -m "feat: add GuessaryGrid bento layout component"
```

---

## Task 7: Build GuessaryFilterBar Component

**Files:**
- Create: `src/components/guessary/GuessaryFilterBar.tsx`

- [ ] **Step 1: Create the filter bar component**

Create `src/components/guessary/GuessaryFilterBar.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add src/components/guessary/GuessaryFilterBar.tsx && git commit -m "feat: add GuessaryFilterBar slice toggle component"
```

---

## Task 8: Build GuessaryExplorer Component

**Files:**
- Create: `src/components/guessary/GuessaryExplorer.tsx`

- [ ] **Step 1: Create the explorer wrapper component**

Create `src/components/guessary/GuessaryExplorer.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import type { GuessaryQuestion } from "@/types";
import GuessaryFilterBar from "./GuessaryFilterBar";
import GuessaryGrid from "./GuessaryGrid";

interface GuessaryExplorerProps {
  questions: GuessaryQuestion[];
}

export default function GuessaryExplorer({
  questions,
}: GuessaryExplorerProps) {
  const [activeSlice, setActiveSlice] = useState("all");

  // Derive available slices from the union of all slice keys across questions
  const availableSlices = useMemo(() => {
    const sliceSet = new Set<string>();
    for (const q of questions) {
      for (const key of Object.keys(q.slices)) {
        sliceSet.add(key);
      }
    }
    // Ensure "all" comes first
    const slices = Array.from(sliceSet);
    slices.sort((a, b) => {
      if (a === "all") return -1;
      if (b === "all") return 1;
      return a.localeCompare(b);
    });
    return slices;
  }, [questions]);

  return (
    <>
      <GuessaryFilterBar
        availableSlices={availableSlices}
        activeSlice={activeSlice}
        onSliceChange={setActiveSlice}
      />
      <div className="mt-8">
        <GuessaryGrid questions={questions} activeSlice={activeSlice} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify types compile**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add src/components/guessary/GuessaryExplorer.tsx && git commit -m "feat: add GuessaryExplorer state wrapper with slice toggle"
```

---

## Task 9: Build GuessaryHero Component

**Files:**
- Create: `src/components/guessary/GuessaryHero.tsx`

- [ ] **Step 1: Create the hero component**

Create `src/components/guessary/GuessaryHero.tsx`:

```tsx
import GradientText from "@/components/ui/GradientText";

export default function GuessaryHero() {
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
        <h1 className="font-heading text-[3.5rem] font-black leading-[0.95] tracking-tight text-content-primary sm:text-[6rem] lg:text-[8rem]">
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
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add src/components/guessary/GuessaryHero.tsx && git commit -m "feat: add GuessaryHero component for subpage"
```

---

## Task 10: Create the /stories/guessary Page Route

**Files:**
- Create: `src/app/stories/guessary/page.tsx`

- [ ] **Step 1: Create the page**

Create `src/app/stories/guessary/page.tsx`:

```tsx
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import GuessaryHero from "@/components/guessary/GuessaryHero";
import GuessaryExplorer from "@/components/guessary/GuessaryExplorer";
import { getGuessaryQuestions } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Unfiltered Truth — Guessary Insights | Dating Insights",
  description:
    "125+ questions about dating, relationships, and life — answered by thousands. See how answers change dramatically by age group.",
  openGraph: {
    title: "The Unfiltered Truth — Guessary Insights",
    description:
      "125+ questions about dating, relationships, and life — answered by thousands. See how answers change dramatically by age group.",
    type: "website",
  },
};

export default async function GuessaryPage() {
  const questions = await getGuessaryQuestions();

  return (
    <PageShell>
      <GuessaryHero />
      <GuessaryExplorer questions={questions} />
    </PageShell>
  );
}
```

- [ ] **Step 2: Verify the page builds**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && npx next build 2>&1 | tail -30
```

Expected: build succeeds, `/stories/guessary` appears in the route list.

- [ ] **Step 3: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add src/app/stories/guessary/page.tsx && git commit -m "feat: add /stories/guessary page route"
```

---

## Task 11: Update Main Page Hero to Link to Guessary

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Wrap HeroStat in a Link**

In `src/app/page.tsx`, add the `Link` import and wrap `<HeroStat />` in a link to the guessary page:

```tsx
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import HeroStat from "@/components/editorial/HeroStat";
import StoryCard from "@/components/editorial/StoryCard";

import { getStories } from "@/lib/data";

export default async function HomePage() {
  const allStories = await getStories();
  const cards = allStories.slice(0, 3);

  return (
    <PageShell>
      {/* ─── HERO ─── */}
      <Link href="/stories/guessary" className="block">
        <HeroStat />
      </Link>

      {/* ─── THREE CARDS ─── */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((story) => (
          <StoryCard key={story.id} story={story} size="standard" />
        ))}
      </div>
    </PageShell>
  );
}
```

- [ ] **Step 2: Verify build**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && npx next build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && git add src/app/page.tsx && git commit -m "feat: link main page hero to /stories/guessary"
```

---

## Task 12: Visual Verification

- [ ] **Step 1: Start dev server**

Run:
```bash
cd /Users/asgeirvisir/Documents/Claude/Dating\ Insights/dating-insights && npm run dev
```

- [ ] **Step 2: Verify main page hero links to guessary**

Open `http://localhost:3000` in a browser. Click the hero section. It should navigate to `/stories/guessary`.

- [ ] **Step 3: Verify guessary page renders**

On `/stories/guessary`:
- Hero shows "The Unfiltered Truth" with gradient orbs
- Bento grid displays ~125 cards
- Featured cards span 2 columns on desktop
- Each card shows emoji, question text, and an area chart
- Cards with headlines show pink gradient italic text
- "Spicy" badge appears on tagged cards
- Cards have gradient-border hover effect
- Filter bar is hidden (only one slice: "all")

- [ ] **Step 4: Verify responsive layout**

Resize the browser:
- Desktop (lg+): 4-column grid
- Tablet (sm): 2-column grid
- Mobile (<sm): 1-column grid, featured cards no longer span 2 cols

- [ ] **Step 5: Verify chart interactivity**

Hover over data points on any chart — a tooltip should appear showing "25–34: 24%" (or similar values).
