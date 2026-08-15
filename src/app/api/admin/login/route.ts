import { NextResponse } from "next/server";
import { signAdminCookie } from "@/lib/security";
import { clientKey, rateLimit } from "@/lib/rate-limit";
export async function POST(request: Request) {
  const gate = rateLimit(`admin:${clientKey(request)}`, 5, 5 * 60_000); if (!gate.ok) return NextResponse.json({ error: "Demasiados intentos." }, { status: 429 });
  const body = await request.json().catch(() => ({})); const secret = typeof body.secret === "string" ? body.secret : ""; const expected = process.env.ADMIN_SECRET || "";
  if (!expected || secret !== expected) return NextResponse.json({ error: "Acceso no autorizado." }, { status: 401 });
  const response = NextResponse.json({ ok: true }); response.cookies.set("mvp_admin", signAdminCookie(secret), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 }); return response;
}
