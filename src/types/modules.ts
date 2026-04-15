// Data module types for all interactive/visual content blocks

export type ModuleType =
  | 'guessary'
  | 'comparison'
  | 'myth'
  | 'profileInsight'
  | 'ranking'
  | 'behavioral';

export interface DataModuleRef {
  type: ModuleType;
  id: string;
}

export interface GuessaryData {
  id: string;
  question: string;
  yes: number;
  no: number;
  sampleSize: number;
  takeaway: string;
  category: string;
  source?: string;
}

export interface ComparisonData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  items: { name: string; value: number; label?: string }[];
  unit?: string;
  source?: string;
}

export interface MythData {
  id: string;
  title: string;
  subtitle: string;
  claim: string;
  verdict: 'confirmed' | 'busted' | 'partly-true';
  explanation: string;
  category: string;
  supportingStats?: { label: string; value: string }[];
  source?: string;
}

export interface ProfileInsightData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  traits: { trait: string; impact: string; description: string }[];
  source?: string;
}

export interface RankingData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  items: {
    rank: number;
    name: string;
    value: string;
    description?: string;
  }[];
  source?: string;
}

export interface BehavioralData {
  id: string;
  title: string;
  subtitle: string;
  stat: string;
  statLabel: string;
  context: string;
  comparison?: string;
  category: string;
  source?: string;
}

export interface GuessaryQuestion {
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

export type DataModule =
  | GuessaryData
  | ComparisonData
  | MythData
  | ProfileInsightData
  | RankingData
  | BehavioralData;
