# Module Map
> Last updated: 2026-04-18

## Modules

### src/app/
- **Purpose**: Next.js App Router pages
- **Key files**: page.tsx (homepage), layout.tsx (root layout)
- **Submodules**: blog/ (blog listing + individual posts), admin/ (CMS admin panel), api/ (all API routes)

### src/app/admin/
- **Purpose**: Admin CMS panel (single-page React client component, auth via JWT in localStorage)
- **Key files**: page.tsx — full admin UI for blog, projects, experiences, skills, settings, contacts

### src/app/api/
- **Purpose**: All backend API routes
- **Submodules**:
  - `auth/login/` — POST: admin login, returns JWT
  - `admin/contacts/` — GET (list), PATCH (mark read) — auth required
  - `admin/projects/[id]/` — PUT, DELETE — auth required
  - `admin/projects/` — GET, POST — auth required
  - `admin/experiences/[id]/` — PUT, DELETE — auth required
  - `admin/experiences/` — GET, POST — auth required
  - `admin/skills/[id]/` — PUT, DELETE — auth required
  - `admin/skills/` — GET, POST — auth required
  - `admin/settings/` — GET, PUT — auth required
  - `admin/stats/` — GET — auth required
  - `blog/[slug]/` — GET (public), PUT/DELETE (auth required)
  - `blog/` — GET (public, paginated), POST (auth required)
  - `contact/` — POST (public, unauthenticated contact form)

### src/components/
- **Purpose**: React components for each section
- **Key files**: Hero.tsx, About.tsx, Skills.tsx, Projects.tsx, Experience.tsx, Contact.tsx, Blog.tsx, Footer.tsx, Navbar.tsx, SocialIcons.tsx

### src/lib/
- **Purpose**: Shared server-side utilities
- **Key files**:
  - `auth.ts` — JWT sign/verify, bcrypt password hashing
  - `auth-middleware.ts` — `requireAuth()` helper for API routes
  - `data.ts` — Prisma query helpers (blog, projects, experiences, skills, settings, contacts)
  - `prisma.ts` — Singleton PrismaClient (PrismaPg adapter)

### src/data/
- **Purpose**: Static data files
- **Key files**: blog/posts.ts (blog post content as TypeScript)

### src/types/
- **Purpose**: TypeScript type definitions
- **Key files**: blog.ts

### src/generated/prisma/
- **Purpose**: Auto-generated Prisma client types
- **Models**: AdminUser, BlogPost, ContactSubmission, Experience, Project, SiteSetting, Skill

## Entry Points
- `src/app/layout.tsx` — Root layout
- `src/app/page.tsx` — Homepage (imports all section components)
- `src/app/admin/page.tsx` — Admin CMS (client-side auth)

## Shared Utilities
- `src/components/SocialIcons.tsx` — Used by Hero and Footer
- `src/lib/auth-middleware.ts` — Used by all admin API routes

## API Routes
- Public: GET /api/blog, GET /api/blog/[slug], POST /api/contact
- Auth-required: All /api/admin/*, POST/PUT/DELETE /api/blog/*
- Auth entry: POST /api/auth/login

## Database Models
- **Database**: PostgreSQL via Prisma ORM (@prisma/adapter-pg)
- **Models**: AdminUser, BlogPost, ContactSubmission, Experience, Project, SiteSetting, Skill
- **Schema**: prisma/schema.prisma
