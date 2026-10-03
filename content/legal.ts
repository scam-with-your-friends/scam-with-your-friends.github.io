import { integrations } from "@/config/integrations";
import { siteConfig } from "@/config/site";
import type { SeoPageDefinition } from "@/config/types";

const privacyIntegrationParagraphs: string[] = [];

if (integrations.analytics.provider === "google-analytics") {
  privacyIntegrationParagraphs.push(
    "Google Analytics 4 is enabled to understand aggregate page usage. Google may process technical visit information under its own privacy terms.",
  );
}

if (integrations.ads.provider === "adsterra-native") {
  privacyIntegrationParagraphs.push(
    "Adsterra Native advertising is enabled. Adsterra may process technical request information and applies its own privacy policy.",
  );
}

export const legalPages: SeoPageDefinition[] = [
  {
    enabled: true,
    slug: "about",
    pageType: "legal",
    navLabel: "About",
    title: "About",
    description: `Learn what ${siteConfig.siteName} covers and how this independent fan-made guide is maintained.`,
    keywords: ["about game wiki"],
    navVisible: false,
    hero: { heading: `About ${siteConfig.siteName}`, lead: "An independent fan-made guide to the public status of Scam With Your Friends." },
    sections: [
      { id: "mission", heading: "What this site covers", paragraphs: ["The site explains the planned Steam release, playtest access, how the game is described by its developers, the price status, the official Discord, and announced platforms."] },
      { id: "standards", heading: "How pages stay current", paragraphs: ["Release, access, price, and platform details can change. Pages name the current public listing and the date they were last reviewed. Plans that are not final are described that way."] },
      { id: "independence", heading: "Independent status", paragraphs: ["This fan-made guide is not JakeHub, Metater, Jatater Worldwide, or Steam. Game names and official links are used so readers can find the real sources. That does not imply endorsement."] },
    ],
    relatedSlugs: ["privacy", "copyright"],
    lastReviewed: "2026-01-15",
  },
  {
    enabled: false,
    slug: "contact",
    pageType: "legal",
    navLabel: "Contact",
    title: "Contact",
    description: `Contact ${siteConfig.siteName} to report factual corrections, attribution concerns, copyright questions or technical site issues.`,
    keywords: ["game wiki contact"],
    navVisible: false,
    hero: { heading: "Contact", lead: "Use the configured public contact method for corrections and site questions." },
    sections: [
      {
        id: "contact-method",
        heading: "How to Reach Us",
        paragraphs: siteConfig.contact.email || siteConfig.contact.url
          ? ["Use the contact link shown in the footer and include the page URL, the issue, and a supporting source when possible."]
          : ["A public contact method has not been published. Official game questions belong on the Steam page, the Jatater Worldwide game page, or the official Discord."],
      },
      { id: "useful-report", heading: "What to Include", paragraphs: ["Share the affected page, the incorrect detail, the current game version and any reliable supporting evidence."] },
    ],
    relatedSlugs: ["about", "privacy"],
    lastReviewed: "2026-01-15",
  },
  {
    enabled: true,
    slug: "privacy",
    pageType: "legal",
    navLabel: "Privacy",
    title: "Privacy Policy",
    description: `Read the privacy policy for ${siteConfig.siteName}, including enabled measurement or advertising services.`,
    keywords: ["game wiki privacy"],
    navVisible: false,
    hero: { heading: "Privacy Policy", lead: "A plain-language summary of the data this static site and its enabled services may process." },
    sections: [
      { id: "site-data", heading: "Data This Site Collects", paragraphs: ["The static site does not provide accounts, comments or a database for storing visitor submissions."] },
      {
        id: "integrations",
        heading: "Optional Third-Party Services",
        paragraphs: privacyIntegrationParagraphs.length
          ? privacyIntegrationParagraphs
          : ["No audience measurement or advertising integration is currently enabled."],
      },
      { id: "external-links", heading: "External Links", paragraphs: ["A link to another website is governed by that website's own terms and privacy practices."] },
      { id: "changes", heading: "Policy Changes", paragraphs: ["Update this page and its review date whenever the site's integrations or data practices change."] },
    ],
    relatedSlugs: ["terms", "about"],
    lastReviewed: "2026-10-03",
  },
  {
    enabled: true,
    slug: "terms",
    pageType: "legal",
    navLabel: "Terms",
    title: "Terms of Use",
    description: `Read the terms for using the guides and reference information on ${siteConfig.siteName}.`,
    keywords: ["game wiki terms"],
    navVisible: false,
    hero: { heading: "Terms of Use", lead: "Conditions for using this independent guide and reference website." },
    sections: [
      { id: "informational", heading: "Informational Use", paragraphs: ["Content is provided for general game information and may change when the game is updated."] },
      { id: "accuracy", heading: "Accuracy and Availability", paragraphs: ["Reasonable care should be taken when publishing, but uninterrupted availability or complete accuracy cannot be guaranteed."] },
      { id: "acceptable-use", heading: "Acceptable Use", paragraphs: ["Do not misuse the site, interfere with access or reproduce substantial original content without permission."] },
    ],
    relatedSlugs: ["privacy", "copyright"],
    lastReviewed: "2026-01-15",
  },
  {
    enabled: true,
    slug: "copyright",
    pageType: "legal",
    navLabel: "Copyright",
    title: "Copyright and Attribution",
    description: `Review copyright, trademark, media ownership and attribution information for the independent ${siteConfig.siteName} resource.`,
    keywords: ["game wiki copyright"],
    navVisible: false,
    hero: { heading: "Copyright and Attribution", lead: "Ownership and reporting guidance for editorial content, game names and media." },
    sections: [
      { id: "editorial", heading: "Original Editorial Content", paragraphs: ["Original explanations, page organization and site design remain protected unless a separate license says otherwise."] },
      { id: "game-rights", heading: "Game and Platform Rights", paragraphs: ["Game names, trademarks, screenshots and related assets belong to their respective owners. Their use does not imply endorsement."] },
      { id: "report", heading: "Report a Concern", paragraphs: ["This guide does not publish a personal contact address. Ownership questions about the game itself should go to the developer or publisher through the official Steam page or the Jatater Worldwide site."] },
    ],
    relatedSlugs: ["terms", "about"],
    lastReviewed: "2026-01-15",
  },
];
