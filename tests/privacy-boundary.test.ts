import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("financial privacy boundary", () => {
  it("no serializa el diagnóstico financiero en el formulario de interés comercial", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src", "components", "debt-plan", "DebtPlanExperience.tsx"), "utf8");
    const unlockSheet = source.slice(source.indexOf("function UnlockSheet"), source.indexOf("export function DebtPlanExperience"));

    expect(unlockSheet).not.toContain("finances");
    expect(unlockSheet).not.toContain("debts");
    expect(unlockSheet).not.toContain("balance");
    expect(unlockSheet).not.toContain("minimumPayment");
    expect(unlockSheet).not.toContain("tcea");
    expect(unlockSheet).not.toContain("entity");
  });

  it("mantiene los endpoints existentes limitados a señales no financieras", () => {
    const waitlist = fs.readFileSync(path.join(process.cwd(), "src", "app", "api", "waitlist", "route.ts"), "utf8");
    const feedback = fs.readFileSync(path.join(process.cwd(), "src", "app", "api", "feedback", "route.ts"), "utf8");

    for (const source of [waitlist, feedback]) {
      expect(source).not.toContain("monthlyIncome");
      expect(source).not.toContain("essentialExpenses");
      expect(source).not.toContain("balance");
      expect(source).not.toContain("tcea");
      expect(source).not.toContain("minimumPayment");
    }
  });
});
