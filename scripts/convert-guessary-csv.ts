import fs from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuessaryQuestion {
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

// ─── Default displayQuestion rewrite ─────────────────────────────────────────

function rewriteDisplayQuestion(original: string): string {
  // "Are both of <FIRST_NAME>'s ..." → "How many people's ..."
  if (/^Are both of <FIRST_NAME>'s /i.test(original)) {
    return original.replace(/^Are both of <FIRST_NAME>'s /i, "How many people's ");
  }
  // "Does <FIRST_NAME> ..." → "How many people ..."
  if (/^Does <FIRST_NAME> /i.test(original)) {
    return original.replace(/^Does <FIRST_NAME> /i, "How many people ");
  }
  // "Has <FIRST_NAME> ..." → "How many people have ..."
  if (/^Has <FIRST_NAME> /i.test(original)) {
    return original.replace(/^Has <FIRST_NAME> /i, "How many people have ");
  }
  // "Is <FIRST_NAME> ..." → "How many people are ..."
  if (/^Is <FIRST_NAME> /i.test(original)) {
    return original.replace(/^Is <FIRST_NAME> /i, "How many people are ");
  }
  // "Would <FIRST_NAME> ..." → "How many people would ..."
  if (/^Would <FIRST_NAME> /i.test(original)) {
    return original.replace(/^Would <FIRST_NAME> /i, "How many people would ");
  }
  // "Can <FIRST_NAME> ..." → "How many people can ..."
  if (/^Can <FIRST_NAME> /i.test(original)) {
    return original.replace(/^Can <FIRST_NAME> /i, "How many people can ");
  }
  // "Could <FIRST_NAME> ..." → "How many people could ..."
  if (/^Could <FIRST_NAME> /i.test(original)) {
    return original.replace(/^Could <FIRST_NAME> /i, "How many people could ");
  }
  // Fallback: return as-is
  return original;
}

// ─── Default emoji assignment ─────────────────────────────────────────────────

function assignEmoji(question: string): string {
  const q = question.toLowerCase();

  if (/sex|hook|slept|bdsm|fetish|dirty|naked/.test(q)) return "🔥";
  if (/love|dating|relationship|crush|wedding|dumped|kiss/.test(q)) return "💕";
  if (/drink|wasted|nicotine|drug/.test(q)) return "🍷";
  if (/kid|child|parent/.test(q)) return "👶";
  if (/afraid|scared|ghost|dark|die|death/.test(q)) return "😨";
  if (/job|work|successful|ambitious/.test(q)) return "💼";
  if (/game|video|cheat|instrument|sing/.test(q)) return "🎮";
  if (/sport|marathon|workout|flexible/.test(q)) return "💪";
  if (/travel|bungee|parachut|adventur/.test(q)) return "✈️";
  if (/food|cook|vegan|pizza|breakfast|coffee/.test(q)) return "🍕";
  if (/tattoo|piercing/.test(q)) return "🎨";
  if (/arrest|police|stolen|crime|fight/.test(q)) return "🚨";
  if (/money|bank|\$/.test(q)) return "💰";
  if (/book|read|degree|class|test/.test(q)) return "📚";
  if (/pet|dog/.test(q)) return "🐾";
  if (/phone|iphone/.test(q)) return "📱";
  if (/bucket|regret/.test(q)) return "📋";

  return "💬";
}

// ─── Parse percentage string ──────────────────────────────────────────────────

function parsePct(raw: string): number {
  return parseInt(raw.replace("%", "").trim(), 10);
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
        // Escaped quote inside quoted field
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

// ─── Main ─────────────────────────────────────────────────────────────────────

const CSV_PATH =
  "/Users/asgeirvisir/Downloads/Smitten Guessary spurningar-Blö - Sheet1.csv";
const OUT_PATH = path.join(
  __dirname,
  "../src/data/modules/guessaryQuestions.json"
);

const csvText = fs.readFileSync(CSV_PATH, "utf-8");
const lines = csvText.split("\n").filter((l) => l.trim() !== "");

// Skip header row (index 0)
const dataLines = lines.slice(1);

const questions: GuessaryQuestion[] = [];

for (const line of dataLines) {
  const cols = parseCSVLine(line);
  if (cols.length < 6) continue;

  const originalIndex = parseInt(cols[0].trim(), 10);
  const questionText = cols[1].trim();
  const pct1824 = parsePct(cols[2]);
  const pct2534 = parsePct(cols[3]);
  const pct3544 = parsePct(cols[4]);
  const pct45p = parsePct(cols[5]);

  const curated = CURATED[originalIndex];

  const displayQuestion = curated
    ? curated.displayQuestion
    : rewriteDisplayQuestion(questionText);

  const emoji = curated ? curated.emoji : assignEmoji(questionText);
  const headline = curated ? curated.headline : null;
  const tags = curated ? curated.tags : [];
  const featured = curated ? curated.featured : false;

  const slices: Record<string, Record<string, number>> = {
    all: {
      "18-24": pct1824,
      "25-34": pct2534,
      "35-44": pct3544,
      "45+": pct45p,
    },
  };

  questions.push({
    id: `q-${originalIndex}`,
    originalIndex,
    question: questionText,
    displayQuestion,
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

const featured = questions.filter((q) => q.featured);
const nonFeatured = questions
  .filter((q) => !q.featured)
  .sort((a, b) => maxSpread(b) - maxSpread(a));

const sorted = [...featured, ...nonFeatured];

// ─── Write output ─────────────────────────────────────────────────────────────

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(sorted, null, 2), "utf-8");

console.log(`✓ Wrote ${sorted.length} questions to ${OUT_PATH}`);
console.log(`  Featured: ${featured.length}`);
console.log(`  Non-featured: ${nonFeatured.length}`);

// Quick sanity checks
console.log("\nFirst 3 items:");
sorted.slice(0, 3).forEach((q) => {
  console.log(
    `  [${q.featured ? "★" : " "}] q-${q.originalIndex}: ${q.displayQuestion} (spread: ${maxSpread(q)})`
  );
});
