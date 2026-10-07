"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { InternalLink } from "@/config/types";
import { homePage } from "@/content/home";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { renderFixedDocument } from "@/lib/fixed-template/render";
import { assetPath, routePath } from "@/lib/urls";

export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  if (!isFixedTemplate()) return null;
  const skin = siteSkin();
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = path === "/" ? "home" : "inner";
  const currentSlug = page === "inner" ? path.split("/").filter(Boolean).at(-1) ?? "" : "";
  const nav = links
    .filter((link) => link.slug.replace(/^\/+|\/+$/g, ""))
    .map((link) => ({
      slug: link.slug.replace(/^\/+|\/+$/g, ""),
      label: link.label,
      href: routePath(link.slug),
    }));
  if (skin === "glass") {
    const words = (siteConfig.game.name || siteConfig.shortName).split(/\s+/);
    const lastWord = words.pop();
    return (
      <header className="floating" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
        <div className="nav-inner">
          <Link className="brand" href="/" aria-label="Back to homepage" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetPath(siteConfig.assets.logo)} alt={`${siteConfig.game.name} logo`} width={304} height={248} style={{ height: 28, width: 28, objectFit: "cover", verticalAlign: "middle", marginRight: 8 }} />
            <b style={{ fontWeight: "inherit" }}>{words.join(" ")} <span>{lastWord}</span></b>
          </Link>
          <button type="button" className="fixed-nav-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="fixed-primary-nav" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav id="fixed-primary-nav" className={`nav${open ? " is-open" : ""}`} aria-label="Primary navigation">
            {nav.map((link) => (
              <Link key={link.slug} className={`nav-link${link.slug === currentSlug ? " active" : ""}`} href={link.href} aria-current={link.slug === currentSlug ? "page" : undefined} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    );
  }
  const rendered = renderFixedDocument({
    skin,
    page,
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug,
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: page === "home" ? assetPath(siteConfig.assets.cover) : null,
    heading: page === "home" ? homePage.hero.heading : null,
    lead: page === "home" ? homePage.hero.lead : null,
  });
  return <div dangerouslySetInnerHTML={{ __html: rendered.chrome }} />;
}
