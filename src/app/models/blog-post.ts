export interface BlogPostBlock {
  type: 'p' | 'h2' | 'quote';
  text: string;
}

export interface BlogPost {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  date: string; // ISO date, e.g. '2026-03-12'
  readingTime: number; // minutes
  content: BlogPostBlock[];
}
