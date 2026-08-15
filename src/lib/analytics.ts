export type AnalyticsEvent =
  | "article_view"
  | "article_completed"
  | "article_helpful_yes"
  | "article_helpful_no"
  | "feedback_opened"
  | "feedback_submitted"
  | "debt_plan_waitlist_view"
  | "debt_plan_waitlist_signup"
  | "tool_view"
  | "cta_clicked";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}
