import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeedbackWidget } from "@/components/forms/FeedbackWidget";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: { default: `${brand.name} | Finanzas simples para tu vida real`, template: `%s | ${brand.name}` },
  description: brand.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "es_PE", siteName: brand.name, title: brand.name, description: brand.description, url: brand.siteUrl },
  twitter: { card: "summary_large_image", title: brand.name, description: brand.description },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-PE"><body><Header /><main>{children}</main><Footer /><FeedbackWidget /><GoogleAnalytics /></body></html>;
}
