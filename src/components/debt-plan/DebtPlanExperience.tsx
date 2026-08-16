"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  createDebtPlan,
  debtPlanInputSchema,
  debtStatuses,
  debtTypes,
  financesSchema,
  type DebtInput,
  type DebtPlanInput,
  type DebtPlanResult,
  type StrategyKey,
} from "@/lib/debt-plan";
import { trackEvent } from "@/lib/analytics";

type FieldErrors = Record<string, string>;

const emptyDebt = (): DebtInput => ({
  entity: "",
  type: "Tarjeta de crédito",
  balance: 0,
  minimumPayment: 0,
  tceaKnown: false,
  tcea: null,
  status: "Al día",
  daysLate: 0,
});

const money = (value: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(value);

function issuesToErrors(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  return error.issues.reduce<FieldErrors>((acc, issue) => {
    acc[issue.path.map(String).join(".")] = issue.message;
    return acc;
  }, {});
}

function NumberInput({
  label,
  help,
  value,
  onChange,
  error,
  min = 0,
  optional = false,
}: {
  label: string;
  help?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-3 text-[0.92rem] font-medium text-slate-900">
        {label}
        {optional && <span className="text-xs font-normal text-slate-500">Opcional</span>}
      </span>
      {help && <span className="mt-1 block text-sm leading-5 text-slate-500">{help}</span>}
      <div className="mt-2 flex min-h-[52px] items-center rounded-[1.15rem] border border-slate-200 bg-white px-4 shadow-[0_1px_0_rgba(15,23,42,0.03)] transition focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-teal-100">
        <span className="mr-2 text-sm font-medium text-slate-500">S/</span>
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step="10"
          value={Number.isNaN(value) ? "" : value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-h-12 w-full bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
          placeholder="0"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </label>
  );
}

function TrustStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {["No pedimos claves bancarias", "No necesitas tarjeta", "Puedes usar cifras aproximadas"].map((item) => (
        <div key={item} className="rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
          {item}
        </div>
      ))}
    </div>
  );
}

function StrategyCard({
  result,
  active,
  onChange,
}: {
  result: DebtPlanResult;
  active: StrategyKey;
  onChange: (key: StrategyKey) => void;
}) {
  const strategy = result.strategies[active];
  if (!strategy) return null;
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="grid rounded-full bg-slate-100 p-1 [grid-template-columns:1fr_1fr]" role="group" aria-label="Estrategia">
        {[
          ["moderate", "Moderado"],
          ["aggressive", "Agresivo"],
        ].map(([key, label]) => {
          const disabled = key === "aggressive" && !result.strategies.aggressive;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-pressed={active === key}
              onClick={() => {
                if (disabled) return;
                onChange(key as StrategyKey);
                trackEvent(key === "moderate" ? "debt_plan_strategy_moderate_viewed" : "debt_plan_strategy_aggressive_viewed");
              }}
              className={`min-h-11 rounded-full px-4 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:text-slate-400 ${
                active === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.35rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Destinarías</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{money(strategy.moneyUsed)}</p>
        </div>
        <div className="rounded-[1.35rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Te quedarían</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{money(strategy.remainingMargin)}</p>
        </div>
        <div className="rounded-[1.35rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Ritmo</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{strategy.intensity}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-600">{strategy.description}</p>
    </div>
  );
}

function UnlockSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [contactType, setContactType] = useState<"email" | "whatsapp">("whatsapp");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const contactRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => contactRef.current?.focus(), 50);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      contact: form.get("contact"),
      contactType,
      consent: form.get("consent") === "on",
      pageUrl: `${window.location.origin}${window.location.pathname}#crear-plan`,
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      referrer: document.referrer || undefined,
      company: form.get("company") || "",
    };
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSending(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus(data.error || "No pudimos registrar tu interés.");
      return;
    }
    trackEvent("plan_purchase_interest_submitted", { contact_type: contactType });
    setStatus("Gracias. Estamos trabajando con un grupo piloto. Te contactaremos para coordinar el acceso al plan completo.");
    event.currentTarget.reset();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/30 px-3 pb-3 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="unlock-title">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-5 shadow-2xl shadow-slate-950/20 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="unlock-title" className="text-2xl font-semibold tracking-tight text-slate-950">
              Desbloquea tu plan completo
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Precio piloto: <strong>S/ 29</strong>. Incluye pagos por deuda, orden completo, dos estrategias y próximos pasos.
            </p>
          </div>
          <button type="button" onClick={onClose} className="min-h-11 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700">
            Cerrar
          </button>
        </div>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid rounded-full bg-slate-100 p-1 [grid-template-columns:1fr_1fr]" role="group" aria-label="Forma de contacto">
            {[
              ["whatsapp", "WhatsApp"],
              ["email", "Email"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={contactType === key}
                onClick={() => setContactType(key as "email" | "whatsapp")}
                className={`min-h-11 rounded-full px-4 text-sm font-semibold transition active:scale-[0.98] ${
                  contactType === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="text-sm font-medium text-slate-900">
            {contactType === "email" ? "Tu correo" : "Tu WhatsApp"}
            <input
              ref={contactRef}
              name="contact"
              required
              className="mt-2 min-h-[52px] w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-teal-100"
              placeholder={contactType === "email" ? "tu@correo.com" : "+51 999 999 999"}
            />
          </label>
          <label className="flex gap-3 rounded-[1.25rem] bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <input name="consent" required type="checkbox" className="mt-1 h-4 w-4" />
            <span>Acepto que me contacten para coordinar el acceso al plan completo del piloto.</span>
          </label>
          <input name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button disabled={sending} className="min-h-12 rounded-full bg-[var(--brand)] px-5 font-semibold text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.99] disabled:opacity-60">
            {sending ? "Registrando..." : "Quiero mi plan completo por S/29"}
          </button>
          <p aria-live="polite" className="text-sm leading-6 text-slate-600">
            {status}
          </p>
        </form>
      </div>
    </div>
  );
}

export function DebtPlanExperience() {
  const [step, setStep] = useState<1 | 2>(1);
  const [finances, setFinances] = useState<DebtPlanInput["finances"]>({ monthlyIncome: 4500, essentialExpenses: 2200, otherExpenses: 700, extraDebtPayment: 0 });
  const [debts, setDebts] = useState<DebtInput[]>([emptyDebt()]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<DebtPlanResult | null>(null);
  const [activeStrategy, setActiveStrategy] = useState<StrategyKey>("moderate");
  const [unlockOpen, setUnlockOpen] = useState(false);

  const progress = step === 1 ? "50%" : "100%";
  function updateDebt(index: number, patch: Partial<DebtInput>) {
    setDebts((current) => current.map((debtItem, debtIndex) => (debtIndex === index ? { ...debtItem, ...patch } : debtItem)));
  }

  function continueToDebts() {
    const parsed = financesSchema.safeParse(finances);
    if (!parsed.success) {
      setErrors(issuesToErrors(parsed.error));
      return;
    }
    setErrors({});
    setStep(2);
    trackEvent("debt_plan_started");
    trackEvent("debt_plan_finances_completed");
  }

  function calculate() {
    const parsed = debtPlanInputSchema.safeParse({ finances, debts });
    if (!parsed.success) {
      setErrors(issuesToErrors(parsed.error));
      return;
    }
    const nextResult = createDebtPlan(parsed.data);
    setErrors({});
    setResult(nextResult);
    setActiveStrategy(nextResult.strategies.moderate ? "moderate" : "aggressive");
    trackEvent("debt_plan_debts_completed");
    trackEvent("debt_plan_result_viewed");
  }

  return (
    <section id="crear-plan" className="scroll-mt-24 bg-slate-50/80 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="text-sm font-semibold text-[var(--brand)]">Diagnóstico gratuito</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Compara dos formas de avanzar.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            La simulación es educativa y se calcula en tu navegador. No guardamos tus ingresos, gastos, saldos, entidades ni tasas.
          </p>
          <div className="mt-7">
            <TrustStrip />
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-500">
            Sal de Deudas ofrece herramientas educativas y simulaciones orientativas. No constituye asesoría financiera, legal ni crediticia y no garantiza resultados.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{step} de 2</span>
              <span>{step === 1 ? "Tu dinero" : "Tus deudas"}</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[var(--brand)] transition-all duration-200 motion-reduce:transition-none" style={{ width: progress }} />
            </div>
          </div>

          {step === 1 && (
            <div className="animate-[fadeIn_.2s_ease-out]">
              <div className="space-y-5">
                <NumberInput label="Ingreso neto mensual" value={finances.monthlyIncome} onChange={(value) => setFinances({ ...finances, monthlyIncome: value })} error={errors.monthlyIncome} min={1} />
                <NumberInput
                  label="Gastos esenciales"
                  help="Vivienda, alimentación, servicios, transporte y otros gastos necesarios."
                  value={finances.essentialExpenses}
                  onChange={(value) => setFinances({ ...finances, essentialExpenses: value })}
                  error={errors.essentialExpenses}
                />
                <NumberInput label="Otros gastos mensuales" value={finances.otherExpenses} onChange={(value) => setFinances({ ...finances, otherExpenses: value })} error={errors.otherExpenses} />
                <NumberInput
                  label="Monto adicional que crees poder destinar a deudas"
                  optional
                  value={finances.extraDebtPayment ?? 0}
                  onChange={(value) => setFinances({ ...finances, extraDebtPayment: value })}
                  error={errors.extraDebtPayment}
                />
              </div>
              <button type="button" onClick={continueToDebts} className="mt-7 min-h-12 w-full rounded-full bg-[var(--brand)] px-5 font-semibold text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.99]">
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-[fadeIn_.2s_ease-out]">
              <div className="space-y-4">
                {debts.map((debtItem, index) => (
                  <div key={index} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-950">Deuda {index + 1}</h3>
                      {debts.length > 1 && (
                        <button type="button" onClick={() => setDebts((current) => current.filter((_, debtIndex) => debtIndex !== index))} className="min-h-10 rounded-full px-3 text-sm font-medium text-red-600">
                          Eliminar
                        </button>
                      )}
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="text-sm font-medium text-slate-900">
                        Entidad
                        <input
                          value={debtItem.entity}
                          onChange={(event) => updateDebt(index, { entity: event.target.value })}
                          className="mt-2 min-h-12 w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-teal-100"
                          placeholder="Banco o financiera"
                        />
                        {errors[`debts.${index}.entity`] && <span className="mt-2 block text-sm text-red-600">{errors[`debts.${index}.entity`]}</span>}
                      </label>
                      <label className="text-sm font-medium text-slate-900">
                        Tipo
                        <select
                          value={debtItem.type}
                          onChange={(event) => updateDebt(index, { type: event.target.value as DebtInput["type"] })}
                          className="mt-2 min-h-12 w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-teal-100"
                        >
                          {debtTypes.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </label>
                      <NumberInput label="Saldo pendiente" value={debtItem.balance} onChange={(value) => updateDebt(index, { balance: value })} error={errors[`debts.${index}.balance`]} min={1} />
                      <NumberInput label="Cuota o pago mínimo mensual" value={debtItem.minimumPayment} onChange={(value) => updateDebt(index, { minimumPayment: value })} error={errors[`debts.${index}.minimumPayment`]} min={1} />
                      <div className="sm:col-span-2">
                        <label className="flex items-center gap-3 rounded-[1.2rem] bg-white p-4 text-sm font-medium text-slate-700">
                          <input checked={!debtItem.tceaKnown} onChange={(event) => updateDebt(index, { tceaKnown: !event.target.checked, tcea: event.target.checked ? null : debtItem.tcea })} type="checkbox" className="h-4 w-4" />
                          No conozco mi TCEA
                        </label>
                      </div>
                      {debtItem.tceaKnown && (
                        <label className="text-sm font-medium text-slate-900">
                          TCEA
                          <div className="mt-2 flex min-h-12 items-center rounded-[1.1rem] border border-slate-200 bg-white px-4 focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-teal-100">
                            <input
                              type="number"
                              inputMode="decimal"
                              min="0"
                              value={debtItem.tcea ?? ""}
                              onChange={(event) => updateDebt(index, { tcea: Number(event.target.value) })}
                              className="w-full bg-transparent outline-none"
                              placeholder="Ej. 65"
                            />
                            <span className="text-sm text-slate-500">%</span>
                          </div>
                          {errors[`debts.${index}.tcea`] && <span className="mt-2 block text-sm text-red-600">{errors[`debts.${index}.tcea`]}</span>}
                        </label>
                      )}
                      <label className="text-sm font-medium text-slate-900">
                        Estado
                        <select
                          value={debtItem.status}
                          onChange={(event) => updateDebt(index, { status: event.target.value as DebtInput["status"], daysLate: event.target.value === "Al día" ? 0 : debtItem.daysLate })}
                          className="mt-2 min-h-12 w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-teal-100"
                        >
                          {debtStatuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                      {debtItem.status !== "Al día" && (
                        <label className="text-sm font-medium text-slate-900">
                          Días de atraso
                          <input
                            type="number"
                            min="1"
                            value={debtItem.daysLate ?? 0}
                            onChange={(event) => updateDebt(index, { daysLate: Number(event.target.value) })}
                            className="mt-2 min-h-12 w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-teal-100"
                          />
                          {errors[`debts.${index}.daysLate`] && <span className="mt-2 block text-sm text-red-600">{errors[`debts.${index}.daysLate`]}</span>}
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.debts && <p className="mt-3 text-sm text-red-600">{errors.debts}</p>}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={debts.length >= 10}
                  onClick={() => setDebts((current) => [...current, emptyDebt()])}
                  className="min-h-12 rounded-full border border-slate-200 px-5 font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Agregar otra deuda
                </button>
                <button type="button" onClick={calculate} className="min-h-12 rounded-full bg-[var(--brand)] px-5 font-semibold text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.99]">
                  Ver diagnóstico
                </button>
              </div>
              <button type="button" onClick={() => setStep(1)} className="mt-4 min-h-11 text-sm font-medium text-slate-500">
                Volver a tu dinero
              </button>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
          <div className="animate-[fadeIn_.22s_ease-out] rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-7">
            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold text-[var(--brand)]">Vista previa gratuita</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Tu estado: {result.viability}</h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Tu deuda prioritaria es <strong>{result.priorityDebt.entity}</strong>. {result.priorityReason} Esta prioridad se basa en la información que ingresaste y en reglas generales.
                </p>
                {result.viability === "NO VIABLE" && (
                  <div className="mt-5 rounded-[1.35rem] bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                    Tus ingresos disponibles actualmente no alcanzan para cubrir todos los pagos mínimos registrados. Evita aumentar saldos, revisa obligaciones atrasadas, contacta a las entidades, confirma tasas y considera orientación profesional especializada.
                  </div>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Deuda total", money(result.totalDebt)],
                  ["Flujo disponible", money(result.availableCash)],
                  ["Total de mínimos", money(result.totalMinimums)],
                  ["Excedente", money(result.excess)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.35rem] bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            {result.strategies.moderate && (
              <div className="mt-6">
                <StrategyCard result={result} active={activeStrategy} onChange={setActiveStrategy} />
              </div>
            )}
            <div className="mt-6 rounded-[1.75rem] bg-slate-950 p-5 text-white sm:p-6">
              <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-teal-200">Precio piloto: S/ 29</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">Desbloquea tu plan completo</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Incluye cuánto pagar a cada deuda, orden completo, moderado y agresivo detallados, próximos pasos y explicación personalizada asistida por IA cuando esté disponible.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("plan_unlock_clicked");
                    setUnlockOpen(true);
                  }}
                  className="min-h-12 rounded-full bg-white px-6 font-semibold text-slate-950 transition hover:bg-slate-100 active:scale-[0.99]"
                >
                  Quiero mi plan completo por S/29
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <UnlockSheet open={unlockOpen} onClose={() => setUnlockOpen(false)} />
      <p className="mx-auto mt-6 max-w-6xl px-4 text-sm leading-6 text-slate-500 sm:px-6">
        Si tienes procesos judiciales, embargos o dificultades para cubrir gastos básicos, puede ser conveniente buscar orientación profesional especializada.
      </p>
    </section>
  );
}
