import { getBlogPosts } from "@/lib/data";
import BlogListClient from "./BlogListClient";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const serialized = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt.toISOString(),
    readingTime: p.readingTime,
    tags: p.tags,
    featured: p.featured,
  }));

  return <BlogListClient posts={serialized} />;
}
