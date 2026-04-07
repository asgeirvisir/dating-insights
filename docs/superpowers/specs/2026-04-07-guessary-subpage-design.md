# Guessary Subpage Design

## Overview

A new subpage at `/stories/guessary` that presents 125+ Smitten Guessary questions as an interactive bento grid of chart cards. Each card shows how the "% who said YES" changes across age groups (18-24, 25-34, 35-44, 45+) via a pink area chart. The page supports global data-slice toggles for future gender/market breakdowns.

The hero item on the main page (`/`) links to this subpage.

## Data Model

### File: `src/data/modules/guessaryQuestions.json`

Array of `GuessaryQuestion` objects:

```json
{
  "id": "q-3",
  "originalIndex": 3,
  "question": "Does <FIRST_NAME> have kids?",
  "displayQuestion": "How many people have kids?",
  "emoji": "👶",
  "headline": null,
  "tags": ["mainstream"],
  "featured": true,
  "slices": {
    "all": { "18-24": 3, "25-34": 24, "35-44": 71, "45+": 94 }
  }
}
```

### Type: `src/types/modules.ts` (extend existing file)

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

### Field definitions

- **`id`**: Unique ID derived from originalIndex (e.g., `"q-3"`)
- **`originalIndex`**: The question number from the CSV source data
- **`question`**: Original Smitten game phrasing with `<FIRST_NAME>` template
- **`displayQuestion`**: Reader-facing rewrite for the website (e.g., "How many people have kids?")
- **`emoji`**: One emoji per card. Curated for featured/interesting questions, generic fallback for the rest
- **`headline`**: Optional clickbait editorial text. Only ~10-15 questions get one. Rendered in pink gradient italic with quote marks. Set to `null` for most questions.
- **`tags`**: Flexible string array. Current values: `"spicy"`, `"mainstream"`, `"niche"`. Extensible for future use.
- **`featured`**: Boolean. When `true`, the card spans 2 columns in the bento grid (1 on mobile).
- **`slices`**: Extensible data container keyed by dimension. Current: only `"all"`. Future additions: `"women"`, `"men"`, `"is"` (Iceland), `"dk"` (Denmark), etc. Each slice maps age-group labels to percentages (0-100).

### Data access: `src/lib/data.ts` (extend existing file)

```ts
export async function getGuessaryQuestions(): Promise<GuessaryQuestion[]> {
  return guessaryQuestionsData as unknown as GuessaryQuestion[];
}
```

## Page Layout

### Route: `/stories/guessary`

**Not** using the existing `[slug]` story template. This page has a fundamentally different layout (bento grid vs. article).

File: `src/app/stories/guessary/page.tsx`

### Structure (top to bottom)

1. **Header** — existing PageShell header, no changes
2. **Hero section** — `GuessaryHero` component
   - Large display text title: "The Unfiltered Truth"
   - Subtitle: "Insights by **Smitten**"
   - Tagline: "See how age shapes our behavior & guilty pleasures."
   - Centered, matching existing site hero style (Bebas Neue for title)
3. **Filter bar** — `GuessaryFilterBar` component
   - Sticky below header on scroll
   - Pill-shaped toggle buttons rendered dynamically from available slice keys
   - Default active: "All"
   - When only one slice exists (current state), the bar is hidden
   - Future: shows "All", "Women", "Men", "Iceland", etc. as slices become available
4. **Bento grid** — `GuessaryGrid` component
   - Responsive CSS grid:
     - Desktop (lg+): 4 columns
     - Tablet (sm-lg): 2 columns
     - Mobile (<sm): 1 column
   - Featured cards (`featured: true`) span 2 columns (1 on mobile)
   - Cards use the existing `gradient-border` hover effect
5. **Footer** — existing PageShell footer, no changes

### State management

Simple `useState` in a client wrapper component (`GuessaryExplorer`) that holds the active slice key. It wraps `GuessaryFilterBar` + `GuessaryGrid` and passes the active slice as a prop. No context or external state library needed.

## Components

### New components to build

| Component | Type | File |
|-----------|------|------|
| `GuessaryHero` | Server | `src/components/guessary/GuessaryHero.tsx` |
| `GuessaryExplorer` | Client | `src/components/guessary/GuessaryExplorer.tsx` |
| `GuessaryFilterBar` | Client | `src/components/guessary/GuessaryFilterBar.tsx` |
| `GuessaryGrid` | Client | `src/components/guessary/GuessaryGrid.tsx` |
| `GuessaryCard` | Client | `src/components/guessary/GuessaryCard.tsx` |
| `AgeBreakdownChart` | Client | `src/components/guessary/AgeBreakdownChart.tsx` |

### Component details

#### `GuessaryHero`

Server component. Renders the page title section:
- `font-display` (Bebas Neue) for the title, large size matching existing HeroStat scale
- Subtitle with "Smitten" in gradient text
- Muted tagline below

#### `GuessaryExplorer`

Client component. Owns the `activeSlice` state (`useState<string>("all")`). Renders:
- `GuessaryFilterBar` with `activeSlice` and `onSliceChange` props
- `GuessaryGrid` with `questions`, `activeSlice` props

#### `GuessaryFilterBar`

Client component. Receives:
- `availableSlices: string[]` — derived from union of all slice keys across all questions
- `activeSlice: string`
- `onSliceChange: (slice: string) => void`

Renders pill buttons. Hidden when `availableSlices.length <= 1`. Sticky positioning below the header (top-16, matching header height).

#### `GuessaryGrid`

Client component. Receives:
- `questions: GuessaryQuestion[]`
- `activeSlice: string`

Renders the bento CSS grid. Maps each question to a `GuessaryCard`. Featured questions get `col-span-2` (reset to `col-span-1` on mobile).

#### `GuessaryCard`

Client component. Renders a single card with the `gradient-border` class:
- **Top-left:** Emoji (text-3xl)
- **Top-right:** Optional tag badge (e.g., "Spicy" with a fire emoji) if question has `"spicy"` in tags
- **Headline** (if present): Pink gradient italic text with quotation marks, `font-heading`
- **Display question:** Bold, `content-primary`, `font-heading`
- **Chart:** `AgeBreakdownChart` component

#### `AgeBreakdownChart`

Client component wrapping Recharts. Receives:
- `data: Record<string, number>` — the active slice data (e.g., `{ "18-24": 3, "25-34": 24, ... }`)

Renders a Recharts `AreaChart`:
- **X-axis:** Age group categories ("18–24", "25–34", "35–44", "45+")
- **Y-axis:** 0–100, ticks at 20-step intervals, subtle grid lines in `neutral-800`
- **Line:** 2px stroke, `brand-pink` (#FF509B)
- **Data points:** Circles (r=4) at each age group, `brand-pink` fill
- **Area fill:** SVG linear gradient from `brand-pink` at 0.3 opacity → transparent at bottom
- **Tooltip:** On hover, show age group and percentage in a styled tooltip (`surface-elevated` bg, `content-primary` text)
- **Axis labels:** `font-body`, `content-muted` color, small size
- **No legend** (single series)
- **Responsive:** Fluid width within card. Y-axis labels hide on small viewports.

## Main Page Hero Update

Update `src/app/page.tsx` to point the `HeroStat` component to the guessary page:

```tsx
<HeroStat
  stat="125+"
  statLabel="questions about your date, answered by thousands"
  headline="The Unfiltered Truth About Who We Are"
  subtitle="What do people really think, do, and hide? We asked. The answers change everything depending on age."
  href="/stories/guessary"
  category="guessary"
/>
```

## Dependencies

- **Add:** `recharts` (npm package, ~40kb gzipped)
- No other new dependencies

## Styling

All styling uses existing design tokens from `globals.css`:
- Colors: `brand-pink`, `brand-purple`, `surface-card`, `surface-elevated`, `content-primary`, `content-muted`, `neutral-800`
- Fonts: `font-display` (Bebas Neue), `font-heading` (Merriweather), `font-body` (Source Sans 3)
- Effects: `gradient-border` class for card hover, `gradient-text` for gradient text
- No new CSS custom properties needed

## Data Conversion

The CSV source data is converted to JSON as part of the build step. For v1, this is a manual process:
1. Parse the CSV (columns: index, question, 18-24, 25-34, 35-44, 45+)
2. Generate `displayQuestion` by rewriting `<FIRST_NAME>` phrasing into reader-facing form (e.g., "Does <FIRST_NAME> have kids?" → "How many people have kids?")
3. Assign `emoji`, `headline`, `tags`, and `featured` values editorially
4. Output as `guessaryQuestions.json`

The initial JSON will be generated programmatically from the CSV with sensible defaults (generic emoji, no headline, `tags: []`, `featured: false`), then the ~10-15 featured/headlined questions will be hand-curated.

## SEO Metadata

The page exports Next.js `Metadata`:
```ts
export const metadata: Metadata = {
  title: "The Unfiltered Truth — Guessary Insights | Dating Insights",
  description: "125+ questions about dating, relationships, and life — answered by thousands. See how answers change dramatically by age group.",
};
```

## Card Sort Order

Cards are displayed in a curated order: featured cards first (preserving their relative order from the JSON), then non-featured cards sorted by the maximum age-gap spread (most dramatic differences first). This ensures the most visually interesting charts appear early.

## Slice Fallback Behavior

When the active slice doesn't exist for a given question, the card renders a subtle "No data for this view" message in place of the chart, with muted text. The card remains visible in the grid but is visually de-emphasized (reduced opacity).

## Future extensibility

When the richer dataset arrives:
1. Add new keys to each question's `slices` object (e.g., `"women"`, `"men"`, `"is"`, `"dk"`)
2. The `GuessaryFilterBar` auto-discovers available slices and renders toggle pills
3. No component code changes needed — the toggle just switches which slice key is read from each question
4. Questions that don't have data for a given slice gracefully fall back (show "No data" or hide)
