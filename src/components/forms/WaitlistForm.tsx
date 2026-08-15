"use client";
import { FormEvent, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function WaitlistForm() {
  const [type, setType] = useState<"email" | "whatsapp">("email");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => { trackEvent("debt_plan_waitlist_view"); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setStatus("");
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      contact: form.get("contact"), contactType: type, consent: form.get("consent") === "on", pageUrl: window.location.href,
      utmSource: params.get("utm_source") || undefined, utmMedium: params.get("utm_medium") || undefined, utmCampaign: params.get("utm_campaign") || undefined,
      referrer: document.referrer || undefined, company: form.get("company") || "",
    };
    const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({}));
    setSending(false);
    if (!response.ok) { setStatus(data.error || "No pudimos registrarte."); return; }
    setStatus("Listo. Te avisaremos cuando el plan esté disponible.");
    trackEvent("debt_plan_waitlist_signup", { contact_type: type });
    event.currentTarget.reset();
  }

  return <form onSubmit={submit} className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-7">
    <div className="flex gap-2" role="group" aria-label="Forma de contacto">
      <button type="button" onClick={() => setType("email")} className={`rounded-full px-4 py-2 text-sm font-medium ${type === "email" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>Email</button>
      <button type="button" onClick={() => setType("whatsapp")} className={`rounded-full px-4 py-2 text-sm font-medium ${type === "whatsapp" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>WhatsApp</button>
    </div>
    <label className="mt-5 block text-sm font-medium">{type === "email" ? "Tu correo" : "Tu número de WhatsApp"}<input name="contact" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" placeholder={type === "email" ? "tu@correo.com" : "+51 999 999 999"} /></label>
    <label className="mt-4 flex gap-3 text-sm leading-6 text-slate-600"><input name="consent" required type="checkbox" className="mt-1 h-4 w-4" /><span>Acepto que usen este dato únicamente para avisarme sobre el lanzamiento y comunicaciones relacionadas.</span></label>
    <input name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <button disabled={sending} className="mt-5 min-h-11 w-full rounded-xl bg-[var(--brand)] px-4 py-3 font-medium text-white disabled:opacity-60">{sending ? "Registrando…" : "Avísame cuando esté disponible"}</button>
    <p aria-live="polite" className="mt-3 text-sm text-slate-600">{status}</p>
  </form>;
}
