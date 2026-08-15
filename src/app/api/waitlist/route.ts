import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { normalizeUrl, sanitizePlainText } from "@/lib/security";
import { waitlistSchema } from "@/lib/validators";
export async function POST(request: Request) {
  const gate = rateLimit(`waitlist:${clientKey(request)}`, 5, 60_000); if (!gate.ok) return NextResponse.json({ error: "Demasiados intentos. Inténtalo nuevamente en un momento." }, { status: 429 });
  try { const parsed = waitlistSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Revisa los datos ingresados." }, { status: 400 }); if (parsed.data.company) return NextResponse.json({ ok: true }); const prisma = getPrisma(); await prisma.waitlistLead.create({ data: { contact: sanitizePlainText(parsed.data.contact, 160), contactType: parsed.data.contactType, consent: true, pageUrl: normalizeUrl(parsed.data.pageUrl), utmSource: parsed.data.utmSource ? sanitizePlainText(parsed.data.utmSource, 120) : null, utmMedium: parsed.data.utmMedium ? sanitizePlainText(parsed.data.utmMedium, 120) : null, utmCampaign: parsed.data.utmCampaign ? sanitizePlainText(parsed.data.utmCampaign, 120) : null, referrer: normalizeUrl(parsed.data.referrer) } }); return NextResponse.json({ ok: true }, { status: 201 }); } catch { return NextResponse.json({ error: "No pudimos registrarte en este momento." }, { status: 500 }); }
}
