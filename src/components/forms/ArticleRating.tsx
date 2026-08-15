"use client";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function ArticleRating({ slug }: { slug: string }) {
  const [choice, setChoice] = useState<boolean | null>(null);
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  async function rate(helpful: boolean) {
    setChoice(helpful);
    const response = await fetch("/api/article-rating", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ articleSlug: slug, helpful, company: "" }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setStatus("No pudimos registrar tu respuesta."); return; }
    if (typeof data.id === "string") setRatingId(data.id);
    setStatus("Gracias por ayudarnos a mejorar este contenido.");
    trackEvent(helpful ? "article_helpful_yes" : "article_helpful_no", { article_slug: slug });
  }

  async function sendComment() {
    if (!ratingId || !comment.trim()) return;
    const response = await fetch("/api/article-rating", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: ratingId, comment }) });
    setStatus(response.ok ? "Gracias. Guardamos lo que faltó." : "No pudimos guardar el comentario.");
    if (response.ok) setComment("");
  }

  return <section className="my-10 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
    <h2 className="text-lg font-semibold">¿Esto resolvió tu duda?</h2>
    <div className="mt-4 flex gap-2"><button type="button" onClick={() => void rate(true)} className="rounded-full border bg-white px-4 py-2 text-sm font-medium">👍 Sí</button><button type="button" onClick={() => void rate(false)} className="rounded-full border bg-white px-4 py-2 text-sm font-medium">👎 No</button></div>
    {choice === false && ratingId && <div className="mt-4"><label className="text-sm font-medium">¿Qué faltó? <span className="font-normal text-slate-500">(opcional)</span><textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={800} rows={3} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3" /></label><button type="button" disabled={!comment.trim()} onClick={() => void sendComment()} className="mt-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Enviar comentario</button></div>}
    <p aria-live="polite" className="mt-3 text-sm text-slate-600">{status}</p>
  </section>;
}
