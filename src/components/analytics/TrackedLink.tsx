"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
export function TrackedLink({ href, label, className, children }: { href: string; label: string; className?: string; children: ReactNode }) {
  return <Link href={href} className={className} onClick={() => trackEvent("cta_clicked", { cta_label: label, destination: href })}>{children}</Link>;
}
