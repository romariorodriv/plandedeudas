import { describe, expect, it } from "vitest";
import { normalizeUrl, sanitizePlainText } from "@/lib/security";
describe("security helpers", () => {
  it("sanitiza caracteres de markup", () => { expect(sanitizePlainText(" <script>alert(1)</script> hola ")).not.toContain("<"); });
  it("normaliza URL sin query sensible", () => { expect(normalizeUrl("https://example.com/deudas?email=a@b.com")).toBe("https://example.com/deudas"); });
});
