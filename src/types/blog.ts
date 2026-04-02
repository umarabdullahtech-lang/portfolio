export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured?: boolean;
  author: {
    name: string;
    avatar?: string;
  };
}