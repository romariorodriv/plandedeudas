import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { brand } from "@/config/brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div className="max-w-sm space-y-3">
          <BrandMark />
          <p className="text-sm leading-6 text-slate-600">{brand.description}</p>
          <p className="text-xs leading-5 text-slate-500">Contenido educativo. No constituye asesoría financiera, legal ni crediticia individual.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Explorar</h2>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <Link href="/aprender">Aprender</Link><Link href="/deudas">Deudas</Link><Link href="/credito">Crédito</Link><Link href="/herramientas">Herramientas</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Confianza</h2>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <Link href="/sobre-nosotros">Sobre nosotros</Link><Link href="/privacidad">Privacidad</Link><Link href="/terminos">Términos</Link><Link href="/contacto">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
