import type { ReactNode } from "react";
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="my-7 rounded-3xl border border-[color:var(--brand-border)] bg-[var(--brand-soft)] p-5"><strong>{title}</strong><div className="mt-2 text-sm leading-6 text-slate-700">{children}</div></aside>;
}
