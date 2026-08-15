import type { Metadata } from "next";
import { LibrarySearch } from "@/components/search/LibrarySearch";
import { getAllArticles } from "@/lib/content";

export const metadata: Metadata = { title: "Aprender", description: "Biblioteca de educación financiera simple sobre deudas, tarjetas, créditos, presupuesto y ahorro.", alternates: { canonical: "/aprender" } };
export default function LearnPage() { const articles = getAllArticles(); return <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><div className="max-w-2xl"><p className="text-sm font-semibold text-[var(--brand)]">BIBLIOTECA FINANCIERA</p><h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Aprende lo que necesitas, sin perderte en tecnicismos.</h1><p className="mt-4 text-lg leading-8 text-slate-600">Busca por problema, concepto o categoría. Cada guía está pensada para ayudarte a entender una decisión concreta.</p></div><div className="mt-10"><LibrarySearch articles={articles} /></div></div>; }
