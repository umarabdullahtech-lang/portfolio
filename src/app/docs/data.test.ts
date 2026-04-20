import { describe, it, expect } from "vitest";
import { apiDocs } from "./data";

describe("apiDocs data integrity", () => {
  it("should have at least 6 endpoint groups", () => {
    expect(apiDocs.length).toBeGreaterThanOrEqual(6);
  });

  it("should have unique slugs across all groups", () => {
    const slugs = apiDocs.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("should have at least 20 total endpoints", () => {
    const total = apiDocs.reduce((sum, g) => sum + g.endpoints.length, 0);
    expect(total).toBeGreaterThanOrEqual(20);
  });

  it("every group should have title, slug, description, and endpoints", () => {
    for (const group of apiDocs) {
      expect(group.title).toBeTruthy();
      expect(group.slug).toBeTruthy();
      expect(group.description).toBeTruthy();
      expect(group.endpoints.length).toBeGreaterThan(0);
    }
  });

  it("every endpoint should have required fields", () => {
    for (const group of apiDocs) {
      for (const ep of group.endpoints) {
        expect(["GET", "POST", "PUT", "PATCH", "DELETE"]).toContain(ep.method);
        expect(ep.path).toMatch(/^\/api\//);
        expect(typeof ep.auth).toBe("boolean");
        expect(ep.description).toBeTruthy();
        expect(ep.response).toBeTruthy();
        expect(ep.curlExample).toBeTruthy();
        expect(ep.fetchExample).toBeTruthy();
        expect(Array.isArray(ep.errors)).toBe(true);
      }
    }
  });

  it("every error should have a valid status code", () => {
    for (const group of apiDocs) {
      for (const ep of group.endpoints) {
        for (const err of ep.errors) {
          expect(err.status).toBeGreaterThanOrEqual(400);
          expect(err.status).toBeLessThan(600);
          expect(err.description).toBeTruthy();
        }
      }
    }
  });

  it("authentication group should contain login, logout, and me", () => {
    const authGroup = apiDocs.find((g) => g.slug === "authentication");
    expect(authGroup).toBeDefined();
    const paths = authGroup!.endpoints.map((e) => e.path);
    expect(paths).toContain("/api/auth/login");
    expect(paths).toContain("/api/auth/logout");
    expect(paths).toContain("/api/auth/me");
  });

  it("blog group should contain GET, POST, PUT, DELETE endpoints", () => {
    const blogGroup = apiDocs.find((g) => g.slug === "blog-posts");
    expect(blogGroup).toBeDefined();
    const methods = blogGroup!.endpoints.map((e) => e.method);
    expect(methods).toContain("GET");
    expect(methods).toContain("POST");
    expect(methods).toContain("PUT");
    expect(methods).toContain("DELETE");
  });

  it("public endpoints should have auth: false", () => {
    const publicPaths = ["/api/health", "/api/blog", "/api/contact", "/api/auth/login", "/api/auth/logout"];
    for (const group of apiDocs) {
      for (const ep of group.endpoints) {
        if (publicPaths.includes(ep.path)) {
          expect(ep.auth).toBe(false);
        }
      }
    }
  });

  it("admin endpoints should have auth: true", () => {
    for (const group of apiDocs) {
      for (const ep of group.endpoints) {
        if (ep.path.startsWith("/api/admin/")) {
          expect(ep.auth).toBe(true);
        }
      }
    }
  });

  it("GET endpoints with query params should define them", () => {
    const blogList = apiDocs
      .flatMap((g) => g.endpoints)
      .find((e) => e.method === "GET" && e.path === "/api/blog");
    expect(blogList).toBeDefined();
    expect(blogList!.queryParams).toBeDefined();
    expect(blogList!.queryParams!.length).toBeGreaterThan(0);
  });

  it("POST/PUT endpoints should have body examples or fields", () => {
    for (const group of apiDocs) {
      for (const ep of group.endpoints) {
        if (ep.method === "POST" || ep.method === "PUT" || ep.method === "PATCH") {
          const hasBody = ep.bodyFields?.length || ep.bodyExample;
          expect(hasBody).toBeTruthy();
        }
      }
    }
  });

  it("response JSON should be valid parseable JSON", () => {
    for (const group of apiDocs) {
      for (const ep of group.endpoints) {
        expect(() => JSON.parse(ep.response)).not.toThrow();
      }
    }
  });
});
