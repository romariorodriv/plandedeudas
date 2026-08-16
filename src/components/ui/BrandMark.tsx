import Link from "next/link";
import { brand } from "@/config/brand";

export function BrandMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-slate-950">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white" aria-hidden="true">{brand.name.at(0)}</span>
      <span>{brand.name}</span>
    </Link>
  );
}
