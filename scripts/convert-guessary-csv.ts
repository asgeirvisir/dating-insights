import fs from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuessaryQuestion {
  id: string;
  originalIndex: number;
  question: string;
  displayQuestion: string;
  statement: string;
  emoji: string;
  headline: string | null;
  tags: string[];
  featured: boolean;
  slices: Record<string, Record<string, number>>;
}

// ─── Editorial curation table ─────────────────────────────────────────────────

interface CuratedEntry {
  emoji: string;
  headline: string | null;
  displayQuestion: string;
  tags: string[];
  featured: boolean;
}

const CURATED: Record<number, CuratedEntry> = {
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

// ─── Statement fallbacks (for questions missing do_i in CSV) ─────────────────

const STATEMENT_FALLBACKS: Record<number, string> = {
  5: "I have a bachelor's degree",
  6: "I believe climate change is real",
  7: "I am afraid of ghosts",
  11: "I think the earth is flat",
  12: "I think workplace dating is wrong",
  13: "I have felt like someone is following me",
  23: "I like kids",
  26: "I have slept with more than ten people",
  39: "I have been in an accident",
  43: "I have seen someone die",
  46: "I have gotten wasted on a date",
  48: "I have had sex in public",
  54: "I have failed a class",
  55: "I am successful",
  56: "I have a fetish",
  58: "I am flexible",
  61: "Hot dogs are sandwiches",
  63: "I have superstitions",
  68: "I have used food during sex",
  70: "I have hooked up with a total stranger",
  71: "I want a friend with benefits",
  76: "I am a player",
  77: "I dream about my wedding",
  90: "I am a Type A person",
  100: "I have tried BDSM",
  102: "I have had an affair",
  103: "I believe vaccines work",
  106: "An egg salad is a chicken salad",
  107: "I have fired a gun",
  109: "I am a virgin",
  110: "I think age matters in a relationship",
  113: "I could be the president",
  114: "I hate dogs",
  115: "Both my parents are alive",
  116: "I have more than $10k in my bank account",
  122: "I have had Covid-19",
  133: "I have had a sexually transmitted disease (STD)",
  135: "I have kissed someone of the same sex",
  136: "I have stolen money from a friend",
  137: "I have a friend I don't like",
};

// ─── Default displayQuestion rewrite ─────────────────────────────────────────

function rewriteDisplayQuestion(doYouForm: string): string {
  // "Do you ..." → "How many people ..."
  if (/^Do you /i.test(doYouForm)) {
    return doYouForm.replace(/^Do you /i, "How many people ");
  }
  // "Have you ..." → "How many people have ..."
  if (/^Have you /i.test(doYouForm)) {
    return doYouForm.replace(/^Have you /i, "How many people have ");
  }
  // "Are you ..." → "How many people are ..."
  if (/^Are you /i.test(doYouForm)) {
    return doYouForm.replace(/^Are you /i, "How many people are ");
  }
  // "Would you ..." → "How many people would ..."
  if (/^Would you /i.test(doYouForm)) {
    return doYouForm.replace(/^Would you /i, "How many people would ");
  }
  // "Can you ..." → "How many people can ..."
  if (/^Can you /i.test(doYouForm)) {
    return doYouForm.replace(/^Can you /i, "How many people can ");
  }
  // "Could you ..." → "How many people could ..."
  if (/^Could you /i.test(doYouForm)) {
    return doYouForm.replace(/^Could you /i, "How many people could ");
  }
  // Fallback: return as-is
  return doYouForm;
}

// ─── Parse CSV (simple, no external deps) ────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// ─── Aggregation helpers ─────────────────────────────────────────────────────

interface RawRow {
  country: string;
  ageGroup: string;
  gender: string;
  questionId: number;
  totalUsers: number;
  usersYes: number;
  pctYes: number;
  doYou: string;
  doI: string;
  emoji: string;
}

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];
const COUNTRIES = ["denmark", "iceland", "norway", "sweden"];
const GENDERS = ["male", "female"];

function buildSlices(
  rows: RawRow[]
): Record<string, Record<string, number>> {
  const slices: Record<string, Record<string, number>> = {};

  // Helper: compute weighted average pct for a filtered set of rows, grouped by age
  function computeAgeSlice(
    filtered: RawRow[]
  ): Record<string, number> {
    const result: Record<string, number> = {};
    for (const age of AGE_GROUPS) {
      const ageRows = filtered.filter((r) => r.ageGroup === age);
      if (ageRows.length === 0) continue;
      const totalUsers = ageRows.reduce((s, r) => s + r.totalUsers, 0);
      const totalYes = ageRows.reduce((s, r) => s + r.usersYes, 0);
      result[age] =
        totalUsers > 0 ? Math.round((totalYes / totalUsers) * 100) : 0;
    }
    return result;
  }

  // all (all countries, all genders)
  slices["all"] = computeAgeSlice(rows);

  // Per country (all genders)
  for (const country of COUNTRIES) {
    const filtered = rows.filter((r) => r.country === country);
    if (filtered.length > 0) {
      slices[country] = computeAgeSlice(filtered);
    }
  }

  // Per gender (all countries)
  for (const gender of GENDERS) {
    const filtered = rows.filter((r) => r.gender === gender);
    if (filtered.length > 0) {
      slices[`all_${gender}`] = computeAgeSlice(filtered);
    }
  }

  // Per country + gender
  for (const country of COUNTRIES) {
    for (const gender of GENDERS) {
      const filtered = rows.filter(
        (r) => r.country === country && r.gender === gender
      );
      if (filtered.length > 0) {
        slices[`${country}_${gender}`] = computeAgeSlice(filtered);
      }
    }
  }

  // "Rest of" slices (all countries except one, all genders)
  for (const country of COUNTRIES) {
    const filtered = rows.filter((r) => r.country !== country);
    if (filtered.length > 0) {
      slices[`rest_${country}`] = computeAgeSlice(filtered);
    }
  }

  return slices;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const CSV_PATH =
  "/Users/asgeirvisir/Downloads/smitten_guessary_combined_apr13.csv";
const OUT_PATH = path.join(
  __dirname,
  "../src/data/modules/guessaryQuestions.json"
);

const csvText = fs.readFileSync(CSV_PATH, "utf-8");
const lines = csvText.split("\n").filter((l) => l.trim() !== "");

// Skip header row
const dataLines = lines.slice(1);

// Parse all rows
const allRows: RawRow[] = [];
for (const line of dataLines) {
  const cols = parseCSVLine(line);
  if (cols.length < 13) continue;

  const doYou = cols[10].trim();
  const doI = cols[11].trim();
  const emoji = cols[12].trim();

  // Skip questions with no text (e.g. IDs 366+)
  if (!doYou) continue;

  allRows.push({
    country: cols[0].trim().toLowerCase(),
    ageGroup: cols[1].trim(),
    gender: cols[2].trim().toLowerCase(),
    questionId: parseInt(cols[3].trim(), 10),
    totalUsers: parseInt(cols[4].trim(), 10),
    usersYes: parseInt(cols[5].trim(), 10),
    pctYes: parseFloat(cols[6].trim()),
    doYou,
    doI,
    emoji,
  });
}

// Group by question ID
const groupedById = new Map<number, RawRow[]>();
for (const row of allRows) {
  if (!groupedById.has(row.questionId)) {
    groupedById.set(row.questionId, []);
  }
  groupedById.get(row.questionId)!.push(row);
}

// Build questions
const questions: GuessaryQuestion[] = [];

for (const [questionId, rows] of groupedById) {
  const first = rows[0];
  const curated = CURATED[questionId];

  const displayQuestion = curated
    ? curated.displayQuestion
    : rewriteDisplayQuestion(first.doYou);

  const emoji = curated ? curated.emoji : first.emoji;
  const headline = curated ? curated.headline : null;
  const tags = curated ? curated.tags : [];
  const featured = curated ? curated.featured : false;

  const slices = buildSlices(rows);

  questions.push({
    id: `q-${questionId}`,
    originalIndex: questionId,
    question: first.doYou,
    displayQuestion,
    statement: (first.doI || STATEMENT_FALLBACKS[questionId] || first.doYou).replace(/\.$/, ""),
    emoji,
    headline,
    tags,
    featured,
    slices,
  });
}

// ─── Sort: featured first (preserve relative order), then by max spread desc ──

function maxSpread(q: GuessaryQuestion): number {
  const vals = Object.values(q.slices.all);
  return Math.max(...vals) - Math.min(...vals);
}

const featuredQs = questions.filter((q) => q.featured);
const nonFeatured = questions
  .filter((q) => !q.featured)
  .sort((a, b) => maxSpread(b) - maxSpread(a));

const sorted = [...featuredQs, ...nonFeatured];

// ─── Write output ─────────────────────────────────────────────────────────────

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(sorted, null, 2), "utf-8");

console.log(`Wrote ${sorted.length} questions to ${OUT_PATH}`);
console.log(`  Featured: ${featuredQs.length}`);
console.log(`  Non-featured: ${nonFeatured.length}`);

// Quick sanity checks
console.log("\nFirst 3 items:");
sorted.slice(0, 3).forEach((q) => {
  console.log(
    `  [${q.featured ? "★" : " "}] q-${q.originalIndex}: ${q.displayQuestion} (spread: ${maxSpread(q)})`
  );
});
