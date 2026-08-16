import { z } from "zod";

export const debtTypes = [
  "Tarjeta de crédito",
  "Préstamo personal",
  "Crédito vehicular",
  "Crédito hipotecario",
  "Refinanciamiento",
  "Otra",
] as const;

export const debtStatuses = ["Al día", "Atrasada", "En cobranza"] as const;

export const financesSchema = z.object({
  monthlyIncome: z.coerce.number().finite().positive("Ingresa un ingreso mayor a 0."),
  essentialExpenses: z.coerce.number().finite().min(0, "No puede ser negativo."),
  otherExpenses: z.coerce.number().finite().min(0, "No puede ser negativo."),
  extraDebtPayment: z.coerce.number().finite().min(0, "No puede ser negativo.").optional(),
});

export const debtSchema = z
  .object({
    entity: z.string().trim().min(1, "Ingresa la entidad.").max(80, "Usa un nombre más corto."),
    type: z.enum(debtTypes),
    balance: z.coerce.number().finite().positive("El saldo debe ser mayor a 0."),
    minimumPayment: z.coerce.number().finite().positive("La cuota debe ser mayor a 0."),
    tceaKnown: z.boolean(),
    tcea: z.coerce.number().finite().min(0, "No puede ser negativa.").max(300, "Revisa la TCEA.").optional().nullable(),
    status: z.enum(debtStatuses),
    daysLate: z.coerce.number().finite().int().min(0, "No puede ser negativo.").max(999, "Revisa los días.").optional(),
  })
  .superRefine((debt, ctx) => {
    if (debt.tceaKnown && (debt.tcea === undefined || debt.tcea === null)) {
      ctx.addIssue({ code: "custom", message: "Ingresa la TCEA o marca que no la conoces.", path: ["tcea"] });
    }
    if (debt.status !== "Al día" && !debt.daysLate) {
      ctx.addIssue({ code: "custom", message: "Indica los días de atraso.", path: ["daysLate"] });
    }
  });

export const debtPlanInputSchema = z.object({
  finances: financesSchema,
  debts: z.array(debtSchema).min(1, "Agrega al menos una deuda.").max(10, "Puedes agregar hasta 10 deudas."),
});

export type DebtPlanInput = z.infer<typeof debtPlanInputSchema>;
export type DebtInput = z.infer<typeof debtSchema>;
export type Viability = "VIABLE" | "AJUSTADO" | "NO VIABLE";
export type StrategyKey = "moderate" | "aggressive";

export type StrategyPreview = {
  key: StrategyKey;
  label: string;
  moneyUsed: number;
  remainingMargin: number;
  extraToPriority: number;
  intensity: string;
  description: string;
  payments: Array<{ entity: string; amount: number; isPriority: boolean }>;
};

export type DebtPlanResult = {
  totalDebt: number;
  totalExpenses: number;
  availableCash: number;
  totalMinimums: number;
  excess: number;
  viability: Viability;
  priorityDebt: DebtInput;
  priorityReason: string;
  strategies: {
    moderate: StrategyPreview | null;
    aggressive: StrategyPreview | null;
  };
};

const clampMoney = (value: number) => Math.max(0, Math.round(value * 100) / 100);

function riskScore(debt: DebtInput) {
  const daysLate = debt.status === "Al día" ? 0 : debt.daysLate ?? 0;
  const tcea = debt.tceaKnown && typeof debt.tcea === "number" ? debt.tcea : null;

  // Priority rules, in order:
  // 1. Collection status.
  // 2. Significant late payments.
  // 3. Any late payment.
  // 4. Revolving/card debt with high known TCEA.
  // 5. Higher known TCEA.
  // 6. When rates are missing and risk is similar, smaller balance wins.
  return [
    debt.status === "En cobranza" ? 1 : 0,
    daysLate >= 30 ? 1 : 0,
    daysLate > 0 ? 1 : 0,
    debt.type === "Tarjeta de crédito" && (tcea ?? 0) >= 40 ? 1 : 0,
    tcea ?? -1,
    debt.tceaKnown ? 1 : 0,
    -debt.balance,
  ];
}

export function compareDebtPriority(a: DebtInput, b: DebtInput) {
  const left = riskScore(a);
  const right = riskScore(b);
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return right[index] - left[index];
  }
  return a.entity.localeCompare(b.entity, "es");
}

function priorityReasonFor(debt: DebtInput) {
  if (debt.status === "En cobranza") return "está en cobranza y requiere atención prioritaria antes de acelerar otros pagos.";
  if ((debt.daysLate ?? 0) >= 30) return "tiene un atraso significativo frente a las demás obligaciones registradas.";
  if (debt.status === "Atrasada") return "está atrasada y conviene ordenarla antes de acelerar deudas al día.";
  if (debt.type === "Tarjeta de crédito" && debt.tceaKnown && (debt.tcea ?? 0) >= 40) {
    return "es una tarjeta con TCEA conocida alta y tus mínimos pueden mantenerse cubiertos.";
  }
  if (debt.tceaKnown) return "tiene la TCEA conocida más relevante entre deudas con riesgo semejante.";
  return "tiene riesgo semejante y menor saldo relativo cuando faltan tasas completas.";
}

function buildStrategy(
  key: StrategyKey,
  label: string,
  extraShare: number,
  input: DebtPlanInput,
  priorityDebt: DebtInput,
  totalMinimums: number,
  excess: number,
): StrategyPreview {
  const extraToPriority = clampMoney(excess * extraShare);
  const moneyUsed = clampMoney(totalMinimums + extraToPriority);
  const payments = input.debts.map((debt) => ({
    entity: debt.entity,
    amount: clampMoney(debt.minimumPayment + (debt === priorityDebt ? extraToPriority : 0)),
    isPriority: debt === priorityDebt,
  }));

  return {
    key,
    label,
    moneyUsed,
    remainingMargin: clampMoney(excess - extraToPriority),
    extraToPriority,
    intensity: key === "moderate" ? "Equilibrado" : "Más rápido",
    description:
      key === "moderate"
        ? "Mantiene más dinero disponible para imprevistos, pero normalmente reduce la deuda más lentamente."
        : "Destina una mayor parte de tu dinero disponible a la deuda prioritaria y deja menos margen mensual.",
    payments,
  };
}

export function createDebtPlan(input: DebtPlanInput): DebtPlanResult {
  const parsed = debtPlanInputSchema.parse(input);
  const totalExpenses = clampMoney(parsed.finances.essentialExpenses + parsed.finances.otherExpenses);
  const availableCash = clampMoney(parsed.finances.monthlyIncome - totalExpenses);
  const totalMinimums = clampMoney(parsed.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0));
  const excess = clampMoney(availableCash - totalMinimums);
  const totalDebt = clampMoney(parsed.debts.reduce((sum, debt) => sum + debt.balance, 0));
  const priorityDebt = [...parsed.debts].sort(compareDebtPriority)[0];

  const viability: Viability =
    availableCash < totalMinimums || availableCash <= 0
      ? "NO VIABLE"
      : excess <= Math.max(100, totalMinimums * 0.1)
        ? "AJUSTADO"
        : "VIABLE";

  return {
    totalDebt,
    totalExpenses,
    availableCash,
    totalMinimums,
    excess,
    viability,
    priorityDebt,
    priorityReason: priorityReasonFor(priorityDebt),
    strategies: {
      moderate:
        viability === "NO VIABLE"
          ? null
          : buildStrategy("moderate", "Plan moderado", 0.6, parsed, priorityDebt, totalMinimums, excess),
      aggressive:
        viability !== "VIABLE"
          ? null
          : buildStrategy("aggressive", "Plan agresivo", 0.95, parsed, priorityDebt, totalMinimums, excess),
    },
  };
}
