export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-slate-600">{description}</p></div>;
}
export function ErrorState({ message = "Algo no salió como esperábamos." }: { message?: string }) { return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{message}</div>; }
export function Skeleton() { return <div aria-label="Cargando" className="h-28 animate-pulse rounded-3xl bg-slate-100" />; }
