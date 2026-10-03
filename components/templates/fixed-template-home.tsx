import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition } from "@/config/types";
import { renderFaq, renderSection, reviewedLabel } from "@/lib/fixed-template/content-html";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function heroActions(home: HomePageDefinition): string {
  const items: string[] = [];
  if (home.hero.primaryLink) {
    items.push(`<a class="btn primary" href="${esc(routePath(home.hero.primaryLink.slug))}">${esc(home.hero.primaryLink.label)}</a>`);
  }
  for (const link of home.hero.extraLinks ?? []) {
    items.push(`<a class="btn primary" href="${esc(routePath(link.slug))}">${esc(link.label)}</a>`);
  }
  if (home.hero.secondaryLink) {
    items.push(`<a class="btn" href="${esc(home.hero.secondaryLink.url)}" rel="noopener noreferrer">${esc(home.hero.secondaryLink.label)}</a>`);
  }
  return items.join("");
}

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const supplementHtml = `${home.sections.map((section) => renderSection(section)).join("")}${renderFaq(home.faq)}`;
  const rendered = renderFixedDocument({
    skin,
    page: "home",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: [],
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    logoAlt: `${siteConfig.game.name} logo`,
    bannerUrl: assetPath(siteConfig.assets.cover),
    coverAlt: `${siteConfig.game.name} cover artwork`,
    eyebrow: home.hero.eyebrow,
    heading: home.hero.heading,
    lead: home.hero.lead,
    supportingText: home.hero.supportingText,
    reviewedLabel: reviewedLabel(home.lastReviewed),
    actionsHtml: heroActions(home),
    supplementHtml,
  });
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <div className="site-container"><NativeAdSlot /></div>
    </>
  );
}
