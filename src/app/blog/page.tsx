import type { Metadata } from "next";
import { getBlogPosts, getSiteSettings } from "@/lib/data";
import BlogListClient from "./BlogListClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Journal | Umar Abdullah",
  description: "Field notes on production AI, software architecture, automation, and engineering systems by Umar Abdullah.",
};

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getBlogPosts(), getSiteSettings()]);

  const serialized = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt.toISOString(),
    readingTime: p.readingTime,
    tags: p.tags,
    featured: p.featured,
  }));

  return <BlogListClient posts={serialized} settings={settings} />;
}
