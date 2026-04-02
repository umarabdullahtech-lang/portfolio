import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/data/blog/posts";
import BlogPostClient from "./BlogPostClient";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Umar Abdullah',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  return {
    title: `${post.title} | Umar Abdullah`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}