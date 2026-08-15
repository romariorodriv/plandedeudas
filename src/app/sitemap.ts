import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { getAllArticles } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap { const fixed = ["", "/aprender", "/deudas", "/credito", "/herramientas", "/plan-de-deudas", "/sobre-nosotros", "/privacidad", "/terminos", "/contacto"]; return [...fixed.map((path) => ({ url: `${brand.siteUrl}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 })), ...getAllArticles().map((article) => ({ url: `${brand.siteUrl}/${article.slug}`, lastModified: new Date(article.updatedAt), changeFrequency: "monthly" as const, priority: .8 }))]; }
