import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { sanitizePlainText } from "@/lib/security";
import { articleRatingCommentSchema, articleRatingSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const gate = rateLimit(`rating:${clientKey(request)}`, 10, 60_000);
  if (!gate.ok) return NextResponse.json({ error: "Demasiados intentos." }, { status: 429 });
  try {
    const parsed = articleRatingSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Respuesta inválida." }, { status: 400 });
    if (parsed.data.company) return NextResponse.json({ ok: true });
    const prisma = getPrisma();
    const rating = await prisma.articleRating.create({ data: { articleSlug: sanitizePlainText(parsed.data.articleSlug, 220), helpful: parsed.data.helpful, comment: parsed.data.comment ? sanitizePlainText(parsed.data.comment, 800) : null } });
    return NextResponse.json({ ok: true, id: rating.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No pudimos registrar tu respuesta." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const gate = rateLimit(`rating-comment:${clientKey(request)}`, 8, 60_000);
  if (!gate.ok) return NextResponse.json({ error: "Demasiados intentos." }, { status: 429 });
  try {
    const parsed = articleRatingCommentSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Comentario inválido." }, { status: 400 });
    const prisma = getPrisma();
    await prisma.articleRating.update({ where: { id: parsed.data.id }, data: { comment: sanitizePlainText(parsed.data.comment, 800) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No pudimos guardar el comentario." }, { status: 500 });
  }
}
