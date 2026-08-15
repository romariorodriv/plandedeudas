import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { getAllArticles } from "@/lib/content";

export default function Home() {
  const articles = getAllArticles();
  const featured = articles.filter((article) => article.featured).slice(0, 3);
  return <>
    <section className="overflow-hidden border-b border-slate-100 bg-[radial-gradient(circle_at_top_right,#dff7f2,transparent_34%),linear-gradient(#fff,#fff)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-sm font-medium text-[var(--brand-dark)]">Educación financiera gratuita para Perú</span>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-6xl">Entiende tu dinero.<br />Toma mejores decisiones.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Explicamos deudas, crédito y decisiones financieras en lenguaje simple, con ejemplos pensados para la vida real.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><TrackedLink href="/aprender" label="home_empezar_aprender" className="rounded-full bg-[var(--brand)] px-6 py-3.5 text-center font-semibold text-white hover:bg-[var(--brand-dark)]">Empezar a aprender</TrackedLink><TrackedLink href="/plan-de-deudas" label="home_plan_deudas" className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-slate-800">Plan para salir de deudas — Próximamente</TrackedLink></div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7">
          <p className="text-sm font-semibold text-[var(--brand)]">EN 30 SEGUNDOS</p><h2 className="mt-3 text-2xl font-semibold tracking-tight">No necesitas aprender “finanzas”. Necesitas entender la decisión que tienes delante.</h2><div className="mt-6 grid gap-3 text-sm"><div className="rounded-2xl bg-slate-50 p-4"><strong>¿Pago primero mi tarjeta o mi préstamo?</strong><p className="mt-1 text-slate-600">Te explicamos cómo comparar costo, atraso y capacidad.</p></div><div className="rounded-2xl bg-slate-50 p-4"><strong>¿Qué significa la TCEA?</strong><p className="mt-1 text-slate-600">La convertimos de jerga financiera a una comparación útil.</p></div><div className="rounded-2xl bg-slate-50 p-4"><strong>¿Solo puedo pagar el mínimo?</strong><p className="mt-1 text-slate-600">Entiende qué implica antes de tomar una decisión.</p></div></div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><div className="max-w-2xl"><p className="text-sm font-semibold text-[var(--brand)]">EMPIEZA POR TU PROBLEMA</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">¿Qué quieres resolver?</h2></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><CategoryCard icon="💳" title="Tengo deudas" description="Ordena conceptos y aprende qué variables mirar antes de pagar." href="/deudas" /><CategoryCard icon="💰" title="Quiero organizar mi dinero" description="Presupuesto, gastos y decisiones simples para recuperar claridad." href="/aprender" /><CategoryCard icon="📊" title="Quiero entender mi crédito" description="TCEA, cuotas, tarjetas, historial y reportes crediticios." href="/credito" /><CategoryCard icon="🏦" title="Quiero entender los bancos" description="Aprende cómo funcionan productos y costos sin lenguaje complicado." href="/aprender" /></div></section>
    <section className="bg-slate-50"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-[var(--brand)]">GUÍAS PARA EMPEZAR</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Respuestas concretas</h2></div><Link href="/aprender" className="hidden text-sm font-semibold sm:block">Ver biblioteca →</Link></div><div className="mt-8 grid gap-4 md:grid-cols-3">{featured.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></div></section>
  </>;
}
