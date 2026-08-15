"use client";
import { useMemo, useState } from "react";
import type { ArticleMeta } from "@/lib/content";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { EmptyState } from "@/components/ui/States";

export function LibrarySearch({ articles }: { articles: ArticleMeta[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const categories = ["Todas", ...Array.from(new Set(articles.map((a) => a.category)))];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => (category === "Todas" || article.category === category) && (!q || `${article.title} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase().includes(q)));
  }, [articles, category, query]);

  return <div className="space-y-6">
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_auto]">
      <label className="text-sm font-medium">Buscar<input value={query} onChange={(e) => setQuery(e.target.value)} type="search" className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3" placeholder="Ejemplo: pago mínimo, TCEA, deudas" /></label>
      <label className="text-sm font-medium">Categoría<select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 sm:min-w-44">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    {filtered.length ? <div className="grid gap-4 md:grid-cols-2">{filtered.map((article) => <ArticleCard key={article.slug} article={article} />)}</div> : <EmptyState title="No encontramos resultados" description="Prueba con otra palabra o categoría." />}
  </div>;
}
