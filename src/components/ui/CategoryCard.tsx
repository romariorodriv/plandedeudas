import Link from "next/link";

export function CategoryCard({ icon, title, description, href }: { icon: string; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="group rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-[var(--brand-soft)] text-xl" aria-hidden="true">{icon}</div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-block text-sm font-medium text-[var(--brand)]">Explorar →</span>
    </Link>
  );
}
