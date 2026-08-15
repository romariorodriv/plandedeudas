"use client";
export function AdminLogout() { return <button type="button" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.reload(); }} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium">Salir</button>; }
