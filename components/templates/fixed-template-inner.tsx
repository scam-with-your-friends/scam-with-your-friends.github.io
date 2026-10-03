import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { getRelatedPages } from "@/content/registry";
import { renderFaq, renderRelated, renderSection, reviewedLabel } from "@/lib/fixed-template/content-html";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { pageSchemas } from "@/lib/schema";
import { routePath } from "@/lib/urls";

function pageActions(page: SeoPageDefinition): string {
  if (!page.hero.cta) return "";
  return `<a class="btn primary" href="${esc(page.hero.cta.url)}" rel="noopener noreferrer">${esc(page.hero.cta.label)}</a>`;
}

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const related = [
    { href: "/", label: "Home" },
    ...getRelatedPages(page).map((item) => ({ href: routePath(item.slug), label: item.navLabel })),
  ];
  const articleHtml = `${page.sections.map((section) => renderSection(section)).join("")}${renderFaq(page.faq ?? [])}${renderRelated(related)}`;
  const rendered = renderFixedDocument({
    skin,
    page: "inner",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: [],
    currentSlug: page.slug,
    homeHref: "/",
    logoUrl: null,
    eyebrow: page.hero.eyebrow,
    heading: page.hero.heading,
    lead: page.hero.lead,
    reviewedLabel: reviewedLabel(page.lastReviewed),
    actionsHtml: pageActions(page),
    articleHtml,
  });
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <div className="site-container"><NativeAdSlot /></div>
    </>
  );
}
