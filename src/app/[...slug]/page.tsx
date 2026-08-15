import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleRating } from "@/components/forms/ArticleRating";
import { ArticleAnalytics } from "@/components/analytics/ArticleAnalytics";
import { brand } from "@/config/brand";
import { getAllArticles, getArticle, getArticleMeta, getRelatedArticles } from "@/lib/content";

export function generateStaticParams() { return getAllArticles().map((article) => ({ slug: article.slug.split("/") })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params; const key = slug.join("/"); const article = getArticleMeta(key); if (!article) return {};
  return { title: article.title, description: article.description, alternates: { canonical: `/${article.slug}` }, openGraph: { type: "article", title: article.title, description: article.description, url: `/${article.slug}`, publishedTime: article.publishedAt, modifiedTime: article.updatedAt }, twitter: { card: "summary_large_image", title: article.title, description: article.description } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params; const key = slug.join("/"); const article = await getArticle(key); if (!article) notFound(); const current = article!; const related = getRelatedArticles(current);
  const categoryHref = current.slug.startsWith("deudas/") ? "/deudas" : current.slug.startsWith("credito/") ? "/credito" : "/aprender";
  const articleJsonLd = { "@context": "https://schema.org", "@type": "Article", headline: current.title, description: current.description, datePublished: current.publishedAt, dateModified: current.updatedAt, author: { "@type": "Organization", name: current.author }, publisher: { "@type": "Organization", name: brand.name }, mainEntityOfPage: `${brand.siteUrl}/${current.slug}` };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: brand.siteUrl }, { "@type": "ListItem", position: 2, name: current.category, item: `${brand.siteUrl}${categoryHref}` }, { "@type": "ListItem", position: 3, name: current.title, item: `${brand.siteUrl}/${current.slug}` }] };
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><ArticleAnalytics slug={current.slug} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <div className="mx-auto max-w-3xl"><Breadcrumbs items={[{ label: current.category, href: categoryHref }, { label: current.title }]} /><header className="mt-8"><p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">{current.category}</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl">{current.title}</h1><p className="mt-5 text-lg leading-8 text-slate-600">{current.excerpt}</p><div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500"><span>{current.author}</span><span>·</span><time dateTime={current.updatedAt}>Actualizado {new Date(current.updatedAt).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" })}</time></div></header>
    <section className="my-8 rounded-3xl bg-[var(--brand-soft)] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-dark)]">En 30 segundos</p><p className="mt-2 text-base leading-7 text-slate-800">{current.excerpt}</p></section>
    <article className="article-content" dangerouslySetInnerHTML={{ __html: current.contentHtml }} /><div data-article-end className="h-1" /><ArticleRating slug={current.slug} />
    </div>
    {related.length > 0 && <section className="mx-auto mt-14 max-w-5xl"><h2 className="text-2xl font-semibold tracking-tight">También podría ayudarte</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{related.map((item) => <ArticleCard key={item.slug} article={item} />)}</div></section>}
  </div>;
}
