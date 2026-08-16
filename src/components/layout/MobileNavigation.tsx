"use client";

import Link from "next/link";
import { useState } from "react";
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-medium"
      >
        {open ? "Cerrar" : "Menú"}
      </button>
      {open && (
        <div id="mobile-menu" className="absolute left-4 right-4 top-[4.4rem] rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">
          <nav className="grid gap-1" aria-label="Navegación móvil">
            <Link href="/#como-funciona" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-base font-medium hover:bg-slate-50">
              Cómo funciona
            </Link>
            <Link href="/aprender" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-base font-medium hover:bg-slate-50">
              Aprender
            </Link>
            <Link href="/#crear-plan" onClick={() => setOpen(false)} className="mt-2 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white">
              Crear mi plan
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
