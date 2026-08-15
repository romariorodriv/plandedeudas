import Link from "next/link";

export type Crumb = { label: string; href?: string };
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-slate-950">Inicio</Link></li>
        {items.map((item) => (
          <li key={`${item.label}-${item.href || "current"}`} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.href ? <Link href={item.href} className="hover:text-slate-950">{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
