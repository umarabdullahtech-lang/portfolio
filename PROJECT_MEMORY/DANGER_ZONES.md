# Danger Zones
> Files that MUST NOT be modified without Umar's approval

## Critical Files
- `src/app/layout.tsx` — Root layout, affects entire site
- `next.config.ts` — Build configuration
- `tailwind.config.ts` — Design system

## Rules
- NEVER change the color scheme without approval
- NEVER remove existing sections without approval
- NEVER modify personal info (name, bio, links) without approval

## Known Gotchas
- Framer Motion animations use `useInView` — all components must be client components ("use client")
- Blog posts are statically generated via `generateStaticParams`
