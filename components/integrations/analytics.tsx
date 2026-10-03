import { integrations } from "@/config/integrations";

/**
 * Search Console's Google Analytics check reads the raw homepage HTML.
 * The gtag.js tag and its config must be real script elements in <head>.
 * next/script rewrites them and does not satisfy that check.
 */
export function Analytics() {
  if (integrations.analytics.provider !== "google-analytics") return null;
  const measurementId = integrations.analytics.measurementId;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`,
        }}
      />
    </>
  );
}
