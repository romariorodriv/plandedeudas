import Link from "next/link";
import type { ArticleMeta } from "@/lib/content";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 transition hover:border-slate-300">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--brand)]">
        <span>{article.category}</span><span aria-hidden="true">·</span><time dateTime={article.updatedAt}>{new Date(article.updatedAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}</time>
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-slate-950">
        <Link href={`/${article.slug}`} className="hover:text-[var(--brand)]">{article.title}</Link>
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>
      <Link href={`/${article.slug}`} className="mt-5 inline-flex text-sm font-semibold text-slate-950">Leer guía →</Link>
    </article>
  );
}
