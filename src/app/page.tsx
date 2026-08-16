import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { DebtPlanExperience } from "@/components/debt-plan/DebtPlanExperience";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { getAllArticles } from "@/lib/content";

const steps = [
  ["1", "Cuéntanos tu situación", "Ingresos y gastos para estimar cuánto margen tienes este mes."],
  ["2", "Agrega tus deudas", "Saldo, cuota, tasa si la conoces y estado actual."],
  ["3", "Compara dos estrategias", "Un plan moderado y uno agresivo con una vista previa clara."],
];

export default function Home() {
  const featured = getAllArticles().filter((article) => article.featured).slice(0, 3);

  return (
    <>
      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-medium text-[var(--brand)]">Simulación educativa para organizar deudas</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Ordena tus deudas. Decide cómo pagarlas.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Cuéntanos cuánto ganas, cuánto gastas y qué deudas tienes. Compara un plan moderado y uno agresivo y descubre qué estrategia se adapta mejor a tu situación.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink href="/#crear-plan" label="home_crear_plan_gratis" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand)] px-6 font-semibold text-white transition hover:bg-[var(--brand-dark)] active:scale-[0.99]">
                Crear mi plan gratis
              </TrackedLink>
              <TrackedLink href="/#como-funciona" label="home_ver_como_funciona" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 font-semibold text-slate-800 transition hover:bg-slate-50">
                Ver cómo funciona
              </TrackedLink>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-[1.35rem] bg-slate-50 p-4">No pedimos claves bancarias.</div>
              <div className="rounded-[1.35rem] bg-slate-50 p-4">No necesitas ingresar número de tarjeta.</div>
              <div className="rounded-[1.35rem] bg-slate-50 p-4">Puedes utilizar cifras aproximadas.</div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="rounded-[1.6rem] bg-white p-5">
              <p className="text-sm font-medium text-slate-500">Vista previa</p>
              <div className="mt-5 grid gap-3">
                {[
                  ["Flujo disponible", "S/ 1,600"],
                  ["Mínimos registrados", "S/ 950"],
                  ["Deuda prioritaria", "Tarjeta principal"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-[1.25rem] bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">{label}</span>
                    <strong className="text-slate-950">{value}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid rounded-full bg-slate-100 p-1 [grid-template-columns:1fr_1fr]">
                <span className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold shadow-sm">Moderado</span>
                <span className="px-4 py-2 text-center text-sm font-semibold text-slate-500">Agresivo</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">
                La simulación es educativa. El plan completo incluirá detalle por deuda y explicación personalizada asistida por IA.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">Cómo funciona</h2>
            <p className="mt-3 text-lg leading-8 text-slate-600">Tres pasos, sin pedir información bancaria sensible.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(([number, title, description]) => (
              <div key={number} className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand-dark)]">{number}</div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DebtPlanExperience />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Aprende mientras decides</h2>
              <p className="mt-2 text-slate-600">La biblioteca sigue disponible como canal educativo y de consulta.</p>
            </div>
            <Link href="/aprender" className="hidden text-sm font-semibold text-slate-950 sm:block">
              Ver biblioteca →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{featured.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        </div>
      </section>
    </>
  );
}
