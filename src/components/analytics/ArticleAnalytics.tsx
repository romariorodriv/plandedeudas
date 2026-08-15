"use client";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ArticleAnalytics({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent("article_view", { article_slug: slug });
    const target = document.querySelector("[data-article-end]");
    if (!target) return;
    let sent = false;
    const observer = new IntersectionObserver((entries) => {
      if (!sent && entries.some((entry) => entry.isIntersecting)) {
        sent = true;
        trackEvent("article_completed", { article_slug: slug });
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [slug]);
  return null;
}
