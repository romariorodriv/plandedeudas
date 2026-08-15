import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  socialImage?: string;
  related: string[];
  featured?: boolean;
};

export type Article = ArticleMeta & { contentHtml: string };

const contentDir = path.join(process.cwd(), "content", "articles");

function articleFiles() {
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir).filter((file) => file.endsWith(".md"));
}

export function getAllArticles(): ArticleMeta[] {
  return articleFiles()
    .map((file) => {
      const fullPath = path.join(contentDir, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);
      return {
        slug: String(data.slug),
        title: String(data.title),
        description: String(data.description),
        excerpt: String(data.excerpt),
        author: String(data.author || "Equipo editorial"),
        publishedAt: String(data.publishedAt),
        updatedAt: String(data.updatedAt || data.publishedAt),
        category: String(data.category),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        socialImage: data.socialImage ? String(data.socialImage) : undefined,
        related: Array.isArray(data.related) ? data.related.map(String) : [],
        featured: Boolean(data.featured),
      } satisfies ArticleMeta;
    })
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function getArticleMeta(slug: string) {
  return getAllArticles().find((article) => article.slug === slug) ?? null;
}

export async function getArticle(slug: string): Promise<Article | null> {
  const file = articleFiles().find((name) => {
    const raw = fs.readFileSync(path.join(contentDir, name), "utf8");
    return String(matter(raw).data.slug) === slug;
  });
  if (!file) return null;

  const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkGfm).use(html).process(content);

  return {
    slug: String(data.slug),
    title: String(data.title),
    description: String(data.description),
    excerpt: String(data.excerpt),
    author: String(data.author || "Equipo editorial"),
    publishedAt: String(data.publishedAt),
    updatedAt: String(data.updatedAt || data.publishedAt),
    category: String(data.category),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    socialImage: data.socialImage ? String(data.socialImage) : undefined,
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    featured: Boolean(data.featured),
    contentHtml: processed.toString(),
  };
}

export function getArticlesByCategory(category: string) {
  return getAllArticles().filter((article) => article.category.toLowerCase() === category.toLowerCase());
}

export function getRelatedArticles(article: ArticleMeta, limit = 3) {
  const all = getAllArticles();
  const explicit = article.related
    .map((slug) => all.find((candidate) => candidate.slug === slug))
    .filter(Boolean) as ArticleMeta[];

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const fallback = all.filter(
    (candidate) => candidate.slug !== article.slug && candidate.category === article.category && !explicit.some((x) => x.slug === candidate.slug),
  );
  return [...explicit, ...fallback].slice(0, limit);
}
