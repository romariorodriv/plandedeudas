import { describe, expect, it } from "vitest";
import { feedbackSchema, waitlistSchema } from "@/lib/validators";
describe("validators", () => {
  it("acepta feedback válido", () => { expect(feedbackSchema.safeParse({ message: "Quiero entender mis deudas", category: "Deudas", company: "" }).success).toBe(true); });
  it("rechaza email inválido", () => { expect(waitlistSchema.safeParse({ contact: "mal", contactType: "email", consent: true, company: "" }).success).toBe(false); });
  it("requiere consentimiento", () => { expect(waitlistSchema.safeParse({ contact: "test@example.com", contactType: "email", consent: false, company: "" }).success).toBe(false); });
});
