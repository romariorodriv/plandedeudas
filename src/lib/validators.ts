import { z } from "zod";

const cleanString = (max: number) => z.string().trim().min(1).max(max);

export const feedbackSchema = z.object({
  message: cleanString(1200),
  category: z
    .enum(["Deudas", "Tarjetas", "Préstamos", "Ahorro", "Presupuesto", "Reporte crediticio", "Otro"])
    .optional(),
  pageUrl: z.string().max(500).optional(),
  company: z.string().max(200).optional(),
});

export const waitlistSchema = z.object({
  contact: cleanString(160),
  contactType: z.enum(["email", "whatsapp"]),
  consent: z.literal(true),
  pageUrl: z.string().max(500).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
  referrer: z.string().max(500).optional(),
  company: z.string().max(200).optional(),
}).superRefine((data, ctx) => {
  if (data.contactType === "email") {
    const emailResult = z.string().email().safeParse(data.contact);
    if (!emailResult.success) {
      ctx.addIssue({ code: "custom", message: "Ingresa un correo válido.", path: ["contact"] });
    }
  }
  if (data.contactType === "whatsapp" && !/^\+?[0-9\s-]{7,18}$/.test(data.contact)) {
    ctx.addIssue({ code: "custom", message: "Ingresa un número válido.", path: ["contact"] });
  }
});

export const articleRatingSchema = z.object({
  articleSlug: cleanString(220),
  helpful: z.boolean(),
  comment: z.string().trim().max(800).optional(),
  company: z.string().max(200).optional(),
});

export const articleRatingCommentSchema = z.object({
  id: z.string().uuid(),
  comment: z.string().trim().min(1).max(800),
});
