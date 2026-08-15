import { createHmac, timingSafeEqual } from "node:crypto";

export function sanitizePlainText(value: string, maxLength = 1500) {
  return value
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function normalizeUrl(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}

export function signAdminCookie(secret: string) {
  const key = process.env.ADMIN_COOKIE_SECRET || "";
  return createHmac("sha256", key).update(secret).digest("hex");
}

export function isValidAdminCookie(value?: string) {
  const adminSecret = process.env.ADMIN_SECRET;
  const cookieSecret = process.env.ADMIN_COOKIE_SECRET;
  if (!adminSecret || !cookieSecret || !value) return false;

  const expected = signAdminCookie(adminSecret);
  const a = Buffer.from(expected);
  const b = Buffer.from(value);
  return a.length === b.length && timingSafeEqual(a, b);
}
