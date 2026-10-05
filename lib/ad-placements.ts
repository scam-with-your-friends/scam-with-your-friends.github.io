import type { PageSection } from "@/config/types";

export const bannerSlotHtml = `<div class="adsterra-slot adsterra-banner-slot" role="region" aria-label="Advertisement"><span class="adsterra-label">Advertisement</span><div data-adsterra-banner-mount></div></div>`;
export const nativeSlotHtml = `<div class="adsterra-slot adsterra-native-slot" role="region" aria-label="Advertisement"><span class="adsterra-label">Advertisement</span><div data-adsterra-native-mount></div></div>`;

// The current site's inspected Hero boundary; no copy, links or headings change.
export function insertBannerAfterHero(html: string, page: "home" | "inner"): string {
  const marker = page === "home" ? '<section class="hero">' : '<section class="wrap inner-hero">';
  const start = html.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${page} Hero for advertisement placement`);
  const closing = html.indexOf("</section>", start);
  if (closing < 0) throw new Error("Missing Hero closing tag");
  const end = closing + "</section>".length;
  return html.slice(0, end) + bannerSlotHtml + html.slice(end);
}

export function insertNativeAfterContent(html: string, section: PageSection): string {
  // Priority A: keep an existing status table intact. Otherwise priority B:
  // the first complete paragraph after H2, without splitting or rewriting copy.
  const headingEnd = html.indexOf("</h2>") + "</h2>".length;
  const boundary = section.table ? "</table></div>" : "</p>";
  const start = html.indexOf(boundary, headingEnd);
  if (start < 0) throw new Error(`Missing existing content block in ${section.id}`);
  const end = start + boundary.length;
  return html.slice(0, end) + nativeSlotHtml + html.slice(end);
}
