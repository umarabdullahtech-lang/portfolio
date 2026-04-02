# Architecture Decisions

## [2026-04-02] Initial Stack Choice
**Context**: Building a portfolio site for Umar Abdullah
**Decision**: Next.js 16 + TypeScript + Tailwind CSS + Framer Motion
**Reasoning**: Modern, fast, SEO-friendly, great DX

## [2026-04-02] Blog Implementation
**Context**: Needed a blog section
**Decision**: Static markdown-style posts in src/data/blog/posts.ts with SSG
**Reasoning**: No database needed, fast loading, easy to add new posts
