import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { MobileNavigation } from "./MobileNavigation";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandMark />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
          <Link href="/#como-funciona" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
            Cómo funciona
          </Link>
          <Link href="/aprender" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
            Aprender
          </Link>
          <Link href="/#crear-plan" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            Crear mi plan
          </Link>
        </nav>
        <MobileNavigation />
      </div>
    </header>
  );
}
