// Story types for long-form editorial content

import { DataModuleRef } from './modules';

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'pullQuote'; text: string; attribution?: string }
  | { type: 'dataModule'; moduleType: string; moduleId: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: { name: string; role: string };
  heroImage?: { src: string; alt: string };
  excerpt: string;
  body: ContentBlock[];
  dataModules: DataModuleRef[];
  relatedStories: string[];
  mediaReuse: {
    headline: string;
    stat: string;
    questionAngle: string;
    blurb: string;
  };
}
