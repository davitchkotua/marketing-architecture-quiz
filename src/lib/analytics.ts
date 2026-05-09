// Placeholder analytics events — replace body with real implementation
type EventName =
  | "quiz_started"
  | "quiz_step_completed"
  | "quiz_submitted"
  | "result_viewed"
  | "course_cta_clicked"
  | "webinar_cta_clicked"
  | "premium_review_clicked"
  | "diagnostic_call_clicked";

export function trackEvent(event: EventName, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line no-console
  console.info("[analytics]", event, props ?? {});
  // TODO: replace with your analytics provider (e.g. Posthog, GA4, Segment)
}
