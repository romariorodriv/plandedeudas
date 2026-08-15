"use client";
import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const categories = ["Deudas", "Tarjetas", "Préstamos", "Ahorro", "Presupuesto", "Reporte crediticio", "Otro"];

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setStatus("");
    const form = new FormData(event.currentTarget);
    const payload = { message: form.get("message"), category: form.get("category") || undefined, pageUrl: window.location.href, company: form.get("company") || "" };
    const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({}));
    setSending(false);
    if (!response.ok) { setStatus(data.error || "No pudimos enviar tu comentario."); return; }
    setStatus("Gracias. Esto nos ayuda a decidir qué construir después.");
    trackEvent("feedback_submitted", { category: String(payload.category || "Sin categoría") });
    event.currentTarget.reset();
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button type="button" onClick={() => { setOpen(true); trackEvent("feedback_opened"); }} className="rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-lg">¿Qué te gustaría que construyamos?</button>
      {open && <div className="fixed inset-0 z-50 flex items-end bg-slate-950/30 p-3 sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
        <div className="w-full max-w-lg rounded-[2rem] bg-white p-5 shadow-2xl sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><h2 id="feedback-title" className="text-xl font-semibold">¿Qué problema con tu dinero te gustaría resolver?</h2><p className="mt-2 text-sm leading-6 text-slate-600">No escribas contraseñas, PIN, CVV, números completos de tarjeta ni información confidencial.</p></div><button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-xl border px-3 text-sm">Cerrar</button></div>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="text-sm font-medium">Categoría<select name="category" className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3"><option value="">Seleccionar</option>{categories.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="text-sm font-medium">Cuéntanos el problema<textarea name="message" required maxLength={1200} rows={5} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder="Ejemplo: No sé si me conviene pagar primero mi tarjeta o mi préstamo." /></label>
            <input name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button disabled={sending} className="min-h-11 rounded-xl bg-[var(--brand)] px-4 py-3 font-medium text-white disabled:opacity-60">{sending ? "Enviando…" : "Enviar"}</button>
            <p className="text-sm text-slate-600" aria-live="polite">{status}</p>
          </form>
        </div>
      </div>}
    </div>
  );
}
