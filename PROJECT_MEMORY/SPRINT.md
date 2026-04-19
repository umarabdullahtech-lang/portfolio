# Current Sprint

## Goal
Polish portfolio and add features

## Active

## Blocked

## Completed
- ✅ Initial portfolio build (Hero, About, Skills, Projects, Experience, Contact)
- ✅ Blog section with 4 sample posts
- ✅ Admin CMS panel with JWT auth, Prisma/PostgreSQL backend
- ✅ Security & Code Quality Audit (UMA-75, 2026-04-18) — findings: 1 critical, 3 high, 5 medium, 3 low

## Security Debt (from UMA-75 audit)
- 🔴 C1: Hardcoded JWT fallback secret — `src/lib/auth.ts:4` — MUST FIX before prod
- 🔴 H1: Next.js CVE GHSA-q4gf-8mx6-v5v3 (DoS) — upgrade to next@>=16.2.3
- 🔴 H2: Admin JWT stored in localStorage — move to httpOnly cookie
- 🔴 H3: No rate limiting on /api/auth/login — brute-force risk
