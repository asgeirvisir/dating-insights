// Common types shared across the Dating Insights platform

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  region: 'nordic';
  population: number;
  capitalCity: string;
}

export interface Author {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export interface QuickStat {
  id: string;
  label: string;
  value: string;
  category: string;
  source?: string;
}

export interface HeroImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface MediaReuse {
  headline: string;
  stat: string;
  questionAngle: string;
  blurb: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
}
