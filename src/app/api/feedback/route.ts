import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { normalizeUrl, sanitizePlainText } from "@/lib/security";
import { feedbackSchema } from "@/lib/validators";
export async function POST(request: Request) {
  const gate = rateLimit(`feedback:${clientKey(request)}`, 6, 60_000); if (!gate.ok) return NextResponse.json({ error: "Demasiados intentos. Inténtalo nuevamente en un momento." }, { status: 429 });
  try { const parsed = feedbackSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Revisa el comentario ingresado." }, { status: 400 }); if (parsed.data.company) return NextResponse.json({ ok: true }); const prisma = getPrisma(); await prisma.feedback.create({ data: { message: sanitizePlainText(parsed.data.message, 1200), category: parsed.data.category || null, pageUrl: normalizeUrl(parsed.data.pageUrl) } }); return NextResponse.json({ ok: true }, { status: 201 }); } catch { return NextResponse.json({ error: "No pudimos guardar tu comentario." }, { status: 500 }); }
}
