import { describe, expect, it } from "vitest";
import { getAllArticles, getArticleMeta } from "@/lib/content";
describe("content", () => {
  it("incluye al menos cinco artículos iniciales", () => { expect(getAllArticles().length).toBeGreaterThanOrEqual(5); });
  it("mantiene slugs semánticos", () => { const article = getArticleMeta("deudas/que-deuda-pagar-primero"); expect(article?.title).toContain("deuda"); });
});
