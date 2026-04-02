# Module Map
> Last updated: 2026-04-02

## Modules

### src/app/
- **Purpose**: Next.js App Router pages
- **Key files**: page.tsx (homepage), layout.tsx (root layout)
- **Submodules**: blog/ (blog listing + individual posts)

### src/components/
- **Purpose**: React components for each section
- **Key files**: Hero.tsx, About.tsx, Skills.tsx, Projects.tsx, Experience.tsx, Contact.tsx, Blog.tsx, Footer.tsx, Navbar.tsx, SocialIcons.tsx

### src/data/
- **Purpose**: Static data files
- **Key files**: blog/posts.ts (blog post content)

### src/types/
- **Purpose**: TypeScript type definitions
- **Key files**: blog.ts

## Entry Points
- `src/app/layout.tsx` — Root layout
- `src/app/page.tsx` — Homepage (imports all section components)

## Shared Utilities
- `src/components/SocialIcons.tsx` — Used by Hero and Footer

## API Routes
- None (static site)

## Database Models
- None (static site)
