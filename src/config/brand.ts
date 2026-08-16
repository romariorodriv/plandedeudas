export const brand = {
  name: !process.env.BRAND_NAME || process.env.BRAND_NAME === "PlanDeuda" ? "Sal de Deudas" : process.env.BRAND_NAME,
  description:
    process.env.BRAND_DESCRIPTION ||
    "Educación financiera simple, gratuita y pensada para tu vida real.",
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  contactEmail: process.env.CONTACT_EMAIL || "hola@ejemplo.pe",
};
