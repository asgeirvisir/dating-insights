// Brand constants for the Dating Insights / Smitten platform

// ---------------------------------------------------------------------------
// Brand Colors
// ---------------------------------------------------------------------------

export const BRAND_COLORS = {
  /** Primary pink — the signature Smitten accent */
  pink: '#ec4899',
  pinkLight: '#fbcfe8',
  pinkDark: '#be185d',

  /** Secondary purple — for depth and contrast */
  purple: '#8b5cf6',
  purpleLight: '#ddd6fe',
  purpleDark: '#6d28d9',

  /** Coral — warm accent for highlights and CTAs */
  coral: '#f97316',
  coralLight: '#fed7aa',
  coralDark: '#c2410c',

  /** Neutrals */
  white: '#ffffff',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#e5e5e5',
  gray300: '#d4d4d4',
  gray400: '#a3a3a3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  black: '#0a0a0a',
} as const;

// ---------------------------------------------------------------------------
// Category Colors (matching categories.json)
// ---------------------------------------------------------------------------

export const CATEGORY_COLORS: Record<string, string> = {
  texting: '#6366f1',
  profiles: '#ec4899',
  behavior: '#f59e0b',
  apps: '#10b981',
  culture: '#8b5cf6',
  nordic: '#0ea5e9',
} as const;

// ---------------------------------------------------------------------------
// Verdict Colors (for Myth modules)
// ---------------------------------------------------------------------------

export const VERDICT_COLORS = {
  confirmed: '#10b981',
  busted: '#ef4444',
  'partly-true': '#f59e0b',
} as const;

export const VERDICT_LABELS = {
  confirmed: 'Confirmed',
  busted: 'Busted',
  'partly-true': 'Partly True',
} as const;

// ---------------------------------------------------------------------------
// Module Type Labels
// ---------------------------------------------------------------------------

export const MODULE_TYPE_LABELS: Record<string, string> = {
  guessary: 'Guessary',
  comparison: 'Comparison',
  myth: 'Myth or Fact',
  profileInsight: 'Profile Insight',
  ranking: 'Ranking',
  behavioral: 'Behavioral',
} as const;

// ---------------------------------------------------------------------------
// Site Metadata
// ---------------------------------------------------------------------------

export const SITE_CONFIG = {
  name: 'Smitten',
  tagline: 'Dating, Decoded.',
  description:
    'Data-driven dating intelligence for the Nordics. Real stats, real insights, zero fluff.',
  url: 'https://smitten.dating',
} as const;

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export const LAYOUT = {
  maxContentWidth: 720,
  maxPageWidth: 1280,
  headerHeight: 64,
  tickerHeight: 40,
  sidebarWidth: 320,
} as const;

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

export const ANIMATION = {
  /** Duration for micro-interactions (hover, press) in ms */
  fast: 150,
  /** Duration for standard transitions (expand, slide) in ms */
  normal: 300,
  /** Duration for large layout shifts in ms */
  slow: 500,
  /** Ticker scroll speed in pixels per second */
  tickerSpeed: 40,
} as const;
