// Async data access layer for all Dating Insights content

import type {
  Story,
  GuessaryData,
  GuessaryQuestion,
  ComparisonData,
  MythData,
  ProfileInsightData,
  RankingData,
  BehavioralData,
  DataModule,
  QuickStat,
  Category,
  Country,
} from '@/types';

import storiesData from '@/data/stories.json';
import guessaryData from '@/data/modules/guessary.json';
import guessaryQuestionsData from '@/data/modules/guessaryQuestions.json';
import comparisonsData from '@/data/modules/comparisons.json';
import mythsData from '@/data/modules/myths.json';
import profileInsightsData from '@/data/modules/profileInsights.json';
import rankingsData from '@/data/modules/rankings.json';
import behavioralData from '@/data/modules/behavioral.json';
import categoriesData from '@/data/meta/categories.json';
import quickStatsData from '@/data/meta/quickStats.json';
import countriesData from '@/data/meta/countries.json';

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export async function getStories(opts?: {
  category?: string;
  limit?: number;
}): Promise<Story[]> {
  let stories = storiesData as unknown as Story[];

  if (opts?.category) {
    stories = stories.filter((s) => s.category === opts.category);
  }

  // Sort by publishedAt descending (newest first)
  stories = stories.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  if (opts?.limit) {
    stories = stories.slice(0, opts.limit);
  }

  return stories;
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const stories = storiesData as unknown as Story[];
  return stories.find((s) => s.slug === slug) ?? null;
}

export async function getStoryById(id: string): Promise<Story | null> {
  const stories = storiesData as unknown as Story[];
  return stories.find((s) => s.id === id) ?? null;
}

export async function getFeaturedStory(): Promise<Story> {
  const stories = await getStories({ limit: 1 });
  return stories[0];
}

// ---------------------------------------------------------------------------
// Guessary
// ---------------------------------------------------------------------------

export async function getGuessaryModules(): Promise<GuessaryData[]> {
  return guessaryData as unknown as GuessaryData[];
}

export async function getGuessaryById(
  id: string,
): Promise<GuessaryData | null> {
  const items = guessaryData as unknown as GuessaryData[];
  return items.find((g) => g.id === id) ?? null;
}

// ---------------------------------------------------------------------------
// Guessary Questions (age-breakdown cards)
// ---------------------------------------------------------------------------

export async function getGuessaryQuestions(): Promise<GuessaryQuestion[]> {
  return guessaryQuestionsData as unknown as GuessaryQuestion[];
}

// ---------------------------------------------------------------------------
// Comparisons
// ---------------------------------------------------------------------------

export async function getComparisonModules(): Promise<ComparisonData[]> {
  return comparisonsData as unknown as ComparisonData[];
}

export async function getComparisonById(
  id: string,
): Promise<ComparisonData | null> {
  const items = comparisonsData as unknown as ComparisonData[];
  return items.find((c) => c.id === id) ?? null;
}

// ---------------------------------------------------------------------------
// Myths
// ---------------------------------------------------------------------------

export async function getMythModules(): Promise<MythData[]> {
  return mythsData as unknown as MythData[];
}

export async function getMythById(id: string): Promise<MythData | null> {
  const items = mythsData as unknown as MythData[];
  return items.find((m) => m.id === id) ?? null;
}

// ---------------------------------------------------------------------------
// Profile Insights
// ---------------------------------------------------------------------------

export async function getProfileInsightModules(): Promise<
  ProfileInsightData[]
> {
  return profileInsightsData as unknown as ProfileInsightData[];
}

export async function getProfileInsightById(
  id: string,
): Promise<ProfileInsightData | null> {
  const items = profileInsightsData as unknown as ProfileInsightData[];
  return items.find((p) => p.id === id) ?? null;
}

// ---------------------------------------------------------------------------
// Rankings
// ---------------------------------------------------------------------------

export async function getRankingModules(): Promise<RankingData[]> {
  return rankingsData as unknown as RankingData[];
}

export async function getRankingById(id: string): Promise<RankingData | null> {
  const items = rankingsData as unknown as RankingData[];
  return items.find((r) => r.id === id) ?? null;
}

// ---------------------------------------------------------------------------
// Behavioral
// ---------------------------------------------------------------------------

export async function getBehavioralModules(): Promise<BehavioralData[]> {
  return behavioralData as unknown as BehavioralData[];
}

export async function getBehavioralById(
  id: string,
): Promise<BehavioralData | null> {
  const items = behavioralData as unknown as BehavioralData[];
  return items.find((b) => b.id === id) ?? null;
}

// ---------------------------------------------------------------------------
// Generic module resolver
// ---------------------------------------------------------------------------

export async function getModuleData(
  type: string,
  id: string,
): Promise<DataModule | null> {
  switch (type) {
    case 'guessary':
      return getGuessaryById(id);
    case 'comparison':
      return getComparisonById(id);
    case 'myth':
      return getMythById(id);
    case 'profileInsight':
      return getProfileInsightById(id);
    case 'ranking':
      return getRankingById(id);
    case 'behavioral':
      return getBehavioralById(id);
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export async function getQuickStats(): Promise<QuickStat[]> {
  return quickStatsData as unknown as QuickStat[];
}

export async function getCategories(): Promise<Category[]> {
  return categoriesData as unknown as Category[];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const categories = categoriesData as unknown as Category[];
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getCountries(): Promise<Country[]> {
  return countriesData as unknown as Country[];
}

export async function getCountryByCode(
  code: string,
): Promise<Country | null> {
  const countries = countriesData as unknown as Country[];
  return countries.find((c) => c.code === code) ?? null;
}
