# ADR-0001: Nonce-Based CSP via Next.js 16 Proxy for script-src Hardening

**Date:** 2026-04-20
**Status:** Accepted
**Author:** Lead Developer (architect)

## Context

The portfolio application's `Content-Security-Policy` header in `next.config.ts` includes `script-src 'self' 'unsafe-inline' 'unsafe-eval'`, which effectively nullifies XSS protection. The audit ([UMA-93](/UMA/issues/UMA-93)) confirmed that no production dependency requires `eval()` or `Function()` at runtime, so both directives can be safely removed.

To remove `unsafe-inline` from `script-src` while keeping legitimate scripts functional, a nonce-based approach is required. The nonce must be generated per-request and injected into both the CSP header and all `<script>` tags.

## Decision

### 1. Use `proxy.ts` (not `middleware.ts`)

Next.js 16 deprecated `middleware.ts` and renamed the convention to `proxy.ts`. The exported function must be named `proxy` (not `middleware`). All CSP nonce logic lives in a new `proxy.ts` file at the project root (or `src/` root).

### 2. Nonce generation and propagation

The proxy generates a cryptographically random nonce per request using `crypto.randomUUID()` encoded to base64. The nonce is:
- Embedded in the `Content-Security-Policy` response header as `'nonce-<value>'`
- Passed to the application via the `x-nonce` request header
- Automatically extracted by Next.js 16 from the CSP header and applied to all framework scripts, page bundles, and inline scripts — **no manual `nonce` prop required** on standard Next.js scripts

### 3. `strict-dynamic` is required

Include `'strict-dynamic'` in `script-src`. This allows dynamically loaded chunks (code-split bundles, dynamic imports) to execute if loaded by a trusted (nonced) script, without needing individual nonces on each chunk. This is the official Next.js recommendation and required for production correctness with code-splitting.

### 4. CSP directive design (production)

```
script-src 'self' 'nonce-<value>' 'strict-dynamic';
style-src 'self' 'unsafe-inline';
default-src 'self';
img-src 'self' data: blob: https:;
font-src 'self' data:;
connect-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

**Note:** `style-src 'unsafe-inline'` is explicitly out of scope for this ticket (per spec). Framer Motion and CSS-in-JS require it. A separate follow-on ticket should address style-src hardening.

### 5. Dev vs prod strategy

- **Production (`NODE_ENV === 'production'`):** Strict CSP as above. No `unsafe-eval`, no `unsafe-inline` in `script-src`.
- **Development (`NODE_ENV === 'development'`):** Add `'unsafe-eval'` to `script-src`. React uses `eval()` in dev mode for enhanced debugging (server-side error stack reconstruction). This is explicitly documented by Next.js and is NOT needed in production.

The dev relaxation is gated by a single `process.env.NODE_ENV === 'development'` check in `proxy.ts`. No environment variable, feature flag, or build-time config — just the standard Node.js environment check.

### 6. Remove CSP from `next.config.ts`

The `Content-Security-Policy` header MUST be removed from `next.config.ts` `headers()`. Reason: `next.config.ts` headers execute **before** the proxy in the Next.js request pipeline (see execution order in proxy docs). If both set CSP, the `next.config.ts` static header arrives first, then the proxy overwrites it — but edge cases (caching, CDN, partial responses) could leak the weaker static header. Single source of truth: proxy only.

Other security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `X-XSS-Protection`, `Permissions-Policy`) remain in `next.config.ts` — they are static and do not need per-request values.

### 7. Dynamic rendering is required

Nonce-based CSP forces dynamic rendering for all pages. This means:
- No static generation or ISR for pages covered by the proxy
- PPR (Partial Prerendering) is incompatible with nonce-based CSP
- Each request generates a fresh page with a new nonce

For this portfolio application, the performance impact is acceptable:
- The site is not high-traffic enough for static generation to be critical
- Blog posts are currently statically generated via `generateStaticParams` — these will need `await connection()` or the pages must accept dynamic rendering
- Server-side rendering latency is negligible for this content-heavy site

### 8. Proxy matcher configuration

The proxy should skip static assets and prefetches that don't need CSP:

```typescript
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

**API routes are excluded** from the proxy matcher. API routes return JSON, not HTML — CSP headers on JSON responses are meaningless and add unnecessary overhead.

### 9. SRI alternative was considered and rejected

Next.js 16 offers an experimental `sri` option (hash-based CSP via Subresource Integrity) that preserves static generation. This was rejected because:
- It is explicitly marked **experimental** — the docs state "Feature may change or be removed"
- It cannot handle dynamically generated scripts
- For a security-critical change, using an experimental feature introduces unacceptable risk
- The nonce approach is stable, well-documented, and the official recommended path

### 10. Layout changes

`src/app/layout.tsx` is in DANGER_ZONES.md. The implementation should **not** need to modify the layout for nonce propagation — Next.js 16 automatically extracts the nonce from the CSP header and applies it to framework scripts. If the Engineer discovers a case where manual nonce prop is needed (e.g., a future `<Script>` component), that must be flagged for architect review before modifying layout.tsx.

## Consequences

### What becomes easier
- XSS protection via CSP is actually effective — inline script injection is blocked
- Per-request nonces prevent nonce prediction attacks
- `strict-dynamic` handles code-split chunks automatically
- Clear single source of truth for CSP (proxy.ts only)

### What becomes harder
- All pages become dynamically rendered — no static optimization
- Blog `generateStaticParams` may need adjustment for dynamic rendering
- Dev/prod CSP divergence requires testing in both modes
- Future third-party script additions (analytics, etc.) must account for nonce propagation

### Risks
- **Performance regression**: Dynamic rendering vs current static. Mitigated by: site is low-traffic, SSR is fast for this content.
- **Hydration mismatches**: If nonce handling is incorrect, React hydration can fail. Mitigated by: Next.js 16 handles nonce injection automatically; no manual nonce props needed.
- **Dev-mode false confidence**: Dev uses `unsafe-eval`, so some CSP violations may only appear in production. Mitigated by: require production-mode testing before merge (spec subtask 7).

### Migration path
1. Create `proxy.ts` with nonce generation and CSP header
2. Remove `Content-Security-Policy` from `next.config.ts` (keep other security headers)
3. Verify no CSP violations in browser console
4. Verify blog pages work under dynamic rendering
5. Deploy and verify production CSP header via curl/DevTools

## Alternatives Considered

### 1. Hash-based CSP via experimental SRI
Rejected: experimental feature, cannot handle dynamic scripts, inappropriate for security-critical work.

### 2. Keep `unsafe-inline` with Report-Only monitoring
Rejected: does not actually improve security — just monitors. The spec requires removal.

### 3. Use `middleware.ts` (legacy convention)
Rejected: deprecated in Next.js 16. Using the legacy name would trigger deprecation warnings and will break in future versions.

### 4. Keep CSP in both `next.config.ts` and proxy as fallback
Rejected: dual sources of truth create confusion and edge-case header conflicts. Proxy is authoritative.
