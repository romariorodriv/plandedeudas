import { describe, expect, it } from "vitest";
import { createDebtPlan, debtPlanInputSchema, type DebtPlanInput } from "@/lib/debt-plan";

const baseInput = (debts: DebtPlanInput["debts"], finances: Partial<DebtPlanInput["finances"]> = {}): DebtPlanInput => ({
  finances: {
    monthlyIncome: 5000,
    essentialExpenses: 2200,
    otherExpenses: 700,
    ...finances,
  },
  debts,
});

const debt = (overrides: Partial<DebtPlanInput["debts"][number]> = {}): DebtPlanInput["debts"][number] => ({
  entity: "Banco A",
  type: "Préstamo personal",
  balance: 3000,
  minimumPayment: 300,
  tceaKnown: false,
  tcea: null,
  status: "Al día",
  daysLate: 0,
  ...overrides,
});

describe("debt plan engine", () => {
  it("clasifica un plan viable", () => {
    expect(createDebtPlan(baseInput([debt()])).viability).toBe("VIABLE");
  });

  it("clasifica un plan ajustado", () => {
    const result = createDebtPlan(baseInput([debt({ minimumPayment: 2000 })], { monthlyIncome: 5000, essentialExpenses: 2200, otherExpenses: 700 }));
    expect(result.viability).toBe("AJUSTADO");
  });

  it("clasifica un plan no viable", () => {
    const result = createDebtPlan(baseInput([debt({ minimumPayment: 1200 })], { monthlyIncome: 3000, essentialExpenses: 2200, otherExpenses: 300 }));
    expect(result.viability).toBe("NO VIABLE");
    expect(result.strategies.aggressive).toBeNull();
  });

  it("prioriza cobranza", () => {
    const result = createDebtPlan(baseInput([debt({ entity: "Banco al día", tceaKnown: true, tcea: 90 }), debt({ entity: "Financiera cobranza", status: "En cobranza", daysLate: 20 })]));
    expect(result.priorityDebt.entity).toBe("Financiera cobranza");
  });

  it("prioriza atraso significativo", () => {
    const result = createDebtPlan(baseInput([debt({ entity: "Tarjeta cara", type: "Tarjeta de crédito", tceaKnown: true, tcea: 100 }), debt({ entity: "Préstamo atrasado", status: "Atrasada", daysLate: 45 })]));
    expect(result.priorityDebt.entity).toBe("Préstamo atrasado");
  });

  it("prioriza TCEA alta cuando el riesgo es equivalente", () => {
    const result = createDebtPlan(baseInput([debt({ entity: "Banco 30", tceaKnown: true, tcea: 30 }), debt({ entity: "Banco 70", tceaKnown: true, tcea: 70 })]));
    expect(result.priorityDebt.entity).toBe("Banco 70");
  });

  it("usa menor saldo como desempate cuando faltan tasas", () => {
    const result = createDebtPlan(baseInput([debt({ entity: "Saldo alto", balance: 9000 }), debt({ entity: "Saldo bajo", balance: 1200 })]));
    expect(result.priorityDebt.entity).toBe("Saldo bajo");
  });

  it("moderado utiliza menos excedente que agresivo", () => {
    const result = createDebtPlan(baseInput([debt()]));
    expect(result.strategies.moderate?.extraToPriority).toBeLessThan(result.strategies.aggressive?.extraToPriority ?? 0);
  });

  it("agresivo nunca supera la capacidad", () => {
    const result = createDebtPlan(baseInput([debt()]));
    expect(result.strategies.aggressive?.moneyUsed).toBeLessThanOrEqual(result.availableCash);
  });

  it("nunca genera pagos negativos", () => {
    const result = createDebtPlan(baseInput([debt()]));
    const amounts = result.strategies.aggressive?.payments.map((payment) => payment.amount) ?? [];
    expect(amounts.every((amount) => amount >= 0)).toBe(true);
  });

  it("mantiene mínimos cubiertos cuando el plan es viable", () => {
    const first = debt({ entity: "A", minimumPayment: 250 });
    const second = debt({ entity: "B", minimumPayment: 400, tceaKnown: true, tcea: 80 });
    const result = createDebtPlan(baseInput([first, second]));
    expect(result.strategies.aggressive?.payments.find((payment) => payment.entity === "A")?.amount).toBeGreaterThanOrEqual(250);
  });

  it("rechaza montos negativos", () => {
    expect(debtPlanInputSchema.safeParse(baseInput([debt({ balance: -1 })])).success).toBe(false);
  });

  it("rechaza más de diez deudas", () => {
    expect(debtPlanInputSchema.safeParse(baseInput(Array.from({ length: 11 }, (_, index) => debt({ entity: `Banco ${index}` })))).success).toBe(false);
  });
});
