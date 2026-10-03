import { accentOverrideCss, resolveAccent, templatePack, type TemplateSkin } from "./catalog";
import { SPEC_HTML } from "./spec-html";

export interface TemplateLink {
  slug: string;
  label: string;
  href: string;
}

export interface TemplateEntry {
  href: string;
  title: string;
  text: string;
}

export interface FixedTemplateInput {
  skin: TemplateSkin | string;
  page: "home" | "inner";
  accentColorId?: string | null;
  gameName: string;
  nav: TemplateLink[];
  currentSlug?: string | null;
  homeHref: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  heading?: string | null;
  lead?: string | null;
  supportingText?: string | null;
  eyebrow?: string | null;
  reviewedLabel?: string | null;
  actionsHtml?: string | null;
  coverAlt?: string | null;
  logoAlt?: string | null;
  /** Real SEO body. Replaces the approved inner article demo. */
  articleHtml?: string | null;
  /** Real pages. Replaces demo cards on the home template. */
  entries?: TemplateEntry[] | null;
  /** Extra real copy appended inside <main>, after the approved structure. */
  supplementHtml?: string | null;
}

export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function templateNavLinks(nav: TemplateLink[], page: "home" | "inner", currentSlug?: string | null): string {
  const items = nav.filter((item) => item.slug.replace(/^\/+|\/+$/g, ""));
  return items.map((item) => {
    const slug = item.slug.replace(/^\/+|\/+$/g, "");
    const active = page === "inner" && currentSlug && slug === currentSlug.replace(/^\/+|\/+$/g, "");
    return `<a class="nav-link${active ? " active" : ""}" href="${esc(item.href)}">${esc(item.label)}</a>`;
  }).join("");
}

function brandInner(gameName: string, skin: string, page: "home" | "inner", logoUrl?: string | null, logoAlt?: string | null): string {
  const logo = logoUrl
    ? `<img alt="${esc(logoAlt || `${gameName} logo`)}" src="${esc(logoUrl)}" width="304" height="248" style="height:28px;width:28px;object-fit:cover;vertical-align:middle;margin-right:8px">`
    : "";
  if (skin === "resource") {
    const tag = page === "home" ? "<small>GAME RESOURCE CENTER</small>" : "";
    return `${logo}${esc(gameName)}${tag}`;
  }
  const parts = gameName.trim().split(/\s+/).filter(Boolean);
  const tag = skin === "horror" ? "i" : "span";
  if (parts.length < 2) return `${logo}${esc(gameName)}`;
  const last = esc(parts[parts.length - 1] ?? "");
  const rest = esc(parts.slice(0, -1).join(" "));
  return `${logo}${rest} <${tag}>${last}</${tag}>`;
}

function replaceNav(html: string, links: string): string {
  if (html.includes('<nav class="wrap nav">')) {
    return html.replace(/<nav class="wrap nav">[\s\S]*?<\/nav>/, `<nav class="wrap nav">${links}</nav>`);
  }
  if (html.includes('<div class="nav">')) {
    return html.replace(/<div class="nav">[\s\S]*?<\/div>/, `<div class="nav">${links}</div>`);
  }
  return html.replace(/<nav class="nav">[\s\S]*?<\/nav>/, `<nav class="nav">${links}</nav>`);
}

function replaceBrand(html: string, inner: string, homeHref: string): string {
  return html.replace(
    /<a class="(brand|logo)" href="home\.html" aria-label="Back to homepage">[\s\S]*?<\/a>/,
    `<a class="$1" href="${esc(homeHref)}" aria-label="Back to homepage">${inner}</a>`,
  );
}

function replaceCrumbs(html: string, homeHref: string, current: string | null): string {
  const body = current
    ? `<a href="${esc(homeHref)}">Home</a> › ${esc(current)}`
    : `<a href="${esc(homeHref)}">Home</a>`;
  return html
    .replace(/<div class="site-breadcrumb">[\s\S]*?<\/div>/g, `<div class="site-breadcrumb">${body}</div>`)
    .replace(/<div class="crumb">[\s\S]*?<\/div>/g, `<div class="crumb">${body}</div>`);
}

function replaceBalanced(html: string, tag: string, className: string, inner: string): string {
  const marker = `<${tag} class="${className}">`;
  const start = html.indexOf(marker);
  if (start < 0) return html;
  const openEnd = start + marker.length;
  const closer = `</${tag}>`;
  let depth = 1;
  let index = openEnd;
  while (index < html.length && depth > 0) {
    const nextOpen = html.indexOf(`<${tag}`, index);
    const nextClose = html.indexOf(closer, index);
    if (nextClose < 0) return html;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + tag.length + 1;
    } else {
      depth -= 1;
      if (depth === 0) return `${html.slice(0, openEnd)}${inner}${html.slice(nextClose)}`;
      index = nextClose + closer.length;
    }
  }
  return html;
}

function applyEntries(html: string, skin: string, entries: TemplateEntry[]): string {
  const cards = entries.map((entry, index) => {
    const title = esc(entry.title);
    const text = esc(entry.text);
    const href = esc(entry.href);
    if (skin === "portal") return `<a class="card" href="${href}"><div class="icon">${index + 1}</div><h3>${title}</h3><p>${text}</p></a>`;
    if (skin === "wiki") return `<a class="row" href="${href}"><b>${title}</b><span>${text}</span></a>`;
    if (skin === "editorial") {
      return `<article class="article"><a href="${href}"><div class="thumb"></div><div class="article-body"><h3>${title}</h3><p>${text}</p></div></a></article>`;
    }
    if (skin === "glass") {
      return `<a class="block" href="${href}"><div class="num">0${index + 1}</div><b>${title}</b><p>${text}</p></a>`;
    }
    if (skin === "pixel") return `<a class="tile" href="${href}"><div class="icon">▣</div><b>${title}</b><p>${text}</p></a>`;
    if (skin === "horror") return `<article class="card"><a href="${href}"><div class="tag">GUIDE</div><h3>${title}</h3><p>${text}</p></a></article>`;
    return `<a class="quick" href="${href}"><b>${title}</b><span>${text}</span></a>`;
  }).join("");
  if (skin === "portal") return replaceBalanced(html, "div", "grid", cards);
  if (skin === "wiki") return replaceBalanced(html, "div", "list", cards);
  if (skin === "resource") return replaceBalanced(html, "div", "quick-grid", cards);
  if (skin === "editorial") return replaceBalanced(html, "section", "grid", cards);
  if (skin === "glass") return replaceBalanced(html, "div", "blocks", cards);
  if (skin === "pixel") return replaceBalanced(html, "div", "tiles", cards);
  if (skin === "horror") return replaceBalanced(html, "div", "cards", cards);
  return html;
}

function insertBanner(html: string, bannerUrl: string, alt: string): string {
  const img = `<img alt="${esc(alt)}" src="${esc(bannerUrl)}" width="460" height="215" style="width:100%;height:auto;aspect-ratio:460/215;object-fit:cover;display:block">`;
  if (html.includes('<div class="visual">')) return html.replace('<div class="visual">', `<div class="visual">${img}`);
  if (html.includes('<header class="hero-wrap">')) return html.replace('<header class="hero-wrap">', `<header class="hero-wrap">${img}`);
  if (html.includes('<article class="lead-card">')) return html.replace('<article class="lead-card">', `<article class="lead-card">${img}`);
  if (html.includes('<section class="hero">')) return html.replace('<section class="hero">', `<section class="hero">${img}`);
  if (html.includes('<section class="panel hero">')) return html.replace('<section class="panel hero">', `<section class="panel hero">${img}`);
  return html;
}

function applyCopy(html: string, input: FixedTemplateInput): string {
  let next = html;
  if (input.heading) next = next.replace(/<h1>[\s\S]*?<\/h1>/, () => `<h1>${esc(input.heading || "")}</h1>`);
  if (input.lead) {
    if (next.includes('<p class="lead">')) next = next.replace(/<p class="lead">[\s\S]*?<\/p>/, () => `<p class="lead">${esc(input.lead || "")}</p>`);
    else if (next.includes('<p class="deck">')) next = next.replace(/<p class="deck">[\s\S]*?<\/p>/, () => `<p class="deck">${esc(input.lead || "")}</p>`);
  }
  return next;
}

function removeElement(html: string, tag: string, className: string): string {
  const marker = `<${tag} class="${className}">`;
  const start = html.indexOf(marker);
  if (start < 0) return html;
  const closer = `</${tag}>`;
  let depth = 1;
  let index = start + marker.length;
  while (index < html.length && depth > 0) {
    const nextOpen = html.indexOf(`<${tag}`, index);
    const nextClose = html.indexOf(closer, index);
    if (nextClose < 0) return html;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + tag.length + 1;
    } else {
      depth -= 1;
      if (depth === 0) return `${html.slice(0, start)}${html.slice(nextClose + closer.length)}`;
      index = nextClose + closer.length;
    }
  }
  return html;
}

function glassHomeHero(input: FixedTemplateInput): string {
  const eyebrow = input.eyebrow || "Independent guide";
  const support = input.supportingText ? `<p>${esc(input.supportingText)}</p>` : "";
  const reviewed = input.reviewedLabel ? `<p class="reviewed">Last updated: ${esc(input.reviewedLabel)}</p>` : "";
  const actions = input.actionsHtml ? `<div class="actions">${input.actionsHtml}</div>` : "";
  const cover = input.bannerUrl
    ? `<img class="cover-shot" alt="${esc(input.coverAlt || `${input.gameName} cover artwork`)}" src="${esc(input.bannerUrl)}" width="460" height="215">`
    : "";
  return `<span class="sticker">${esc(eyebrow)}</span><h1>${esc(input.heading || input.gameName)}</h1><p class="lead">${esc(input.lead || "")}</p>${support}${reviewed}${actions}${cover}`;
}

function applyGlassPage(html: string, input: FixedTemplateInput): string {
  let next = html;
  if (input.page === "home") {
    next = next.replace(/<div class="wrap">\s*<div class="site-breadcrumb">[\s\S]*?<\/div>\s*<\/div>/, "");
    next = replaceBalanced(next, "section", "hero", glassHomeHero(input));
    next = removeElement(next, "section", "section");
    return next;
  }
  if (!input.lead && !input.actionsHtml && !input.reviewedLabel && !input.eyebrow) return next;
  const reviewed = input.reviewedLabel ? `<p class="reviewed">Last updated: ${esc(input.reviewedLabel)}</p>` : "";
  const eyebrow = input.eyebrow ? `<span class="sticker">${esc(input.eyebrow)}</span>` : "";
  const actions = input.actionsHtml ? `<div class="actions">${input.actionsHtml}</div>` : "";
  return next.replace(
    /(<section class="wrap inner-hero">[\s\S]*?)(<h1>[\s\S]*?<\/h1>\s*)<p>[\s\S]*?<\/p>/,
    (_match, before: string, h1: string) => `${before}${eyebrow}${h1}<p class="lead">${esc(input.lead || "")}</p>${reviewed}${actions}`,
  );
}

export function renderFixedTemplate(input: FixedTemplateInput): string {
  const pack = templatePack(input.skin);
  const source = SPEC_HTML[pack.specId]?.[input.page];
  if (!source) throw new Error(`Missing approved HTML for ${pack.specId} ${input.page}`);
  const paint = resolveAccent(pack.skin, input.accentColorId);
  const currentLabel = input.page === "inner"
    ? (input.nav.find((item) => item.slug.replace(/^\/+|\/+$/g, "") === (input.currentSlug || "").replace(/^\/+|\/+$/g, ""))?.label || input.heading || "Guide")
    : null;
  let html = source;
  html = replaceBrand(html, brandInner(input.gameName, pack.skin, input.page, input.logoUrl, input.logoAlt), input.homeHref);
  html = html.replaceAll('href="home.html"', `href="${esc(input.homeHref)}"`);
  html = replaceNav(html, templateNavLinks(input.nav, input.page, input.currentSlug));
  html = replaceCrumbs(html, input.homeHref, currentLabel);
  html = html.replace(/href="inner\.html#([^"]+)"/g, (_match, id: string) => {
    const linked = input.nav.find((item) => item.slug.replace(/^\/+|\/+$/g, "") === id);
    return `href="${esc(linked?.href || `#${id}`)}"`;
  });
  if (input.bannerUrl && !(pack.skin === "glass" && input.page === "home")) {
    html = insertBanner(html, input.bannerUrl, input.coverAlt || `${input.gameName} cover artwork`);
  }
  if (input.page === "home" && input.entries && pack.skin !== "glass") html = applyEntries(html, pack.skin, input.entries);
  if (input.page === "inner" && input.articleHtml) {
    html = replaceArticleBody(html, input.articleHtml);
    html = syncAside(html, input.articleHtml);
  }
  if (pack.skin === "glass") html = applyGlassPage(html, input);
  if (input.supplementHtml) html = html.replace("</main>", () => `${input.supplementHtml}</main>`);
  html = applyCopy(html, input);
  html = html.replace(/--accent:#[0-9A-Fa-f]{6}/, `--accent:${paint.textAccent}`);
  html = html.replace("</style>", `${accentOverrideCss(pack.skin, paint)}</style>`);
  return html;
}

function syncAside(html: string, articleHtml: string): string {
  const sections = [...articleHtml.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<h2>([\s\S]*?)<\/h2>/g)];
  if (!sections.length || !html.includes("<aside")) return html;
  const links = sections.map((match) => `<a href="#${match[1]}">${match[2]}</a>`).join("");
  return html.replace(/<aside([^>]*)>([\s\S]*?)<\/aside>/, (_full, attrs: string, inner: string) => {
    let used = false;
    const next = inner.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, () => {
      if (used) return "";
      used = true;
      return links;
    });
    return `<aside${attrs}>${used ? next : `${inner}${links}`}</aside>`;
  });
}

function replaceArticleBody(html: string, articleHtml: string): string {
  const match = html.match(/<article([^>]*)>([\s\S]*?)<\/article>/);
  if (!match) return html;
  const inner = match[2] ?? "";
  const crumb = inner.match(/<div class="(?:crumb|site-breadcrumb)">[\s\S]*?<\/div>/);
  const h1 = inner.match(/<h1>[\s\S]*?<\/h1>/);
  return html.replace(match[0], `<article${match[1] ?? ""}>${crumb?.[0] ?? ""}${h1?.[0] ?? ""}${articleHtml}</article>`);
}

export function extractStyle(html: string): string {
  return [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((match) => match[1] ?? "").join("\n");
}

export function extractBody(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return (match?.[1] ?? html).replace(/<script[\s\S]*?<\/script>/g, "");
}

export function splitFixedChrome(body: string, skin: string): { chrome: string; rest: string } {
  const source = body.trim();
  const pattern = skin === "editorial"
    ? /^<div class="topline">[\s\S]*?<\/header>/
    : skin === "resource"
      ? /^<header[\s\S]*?<\/header>\s*<div class="navbar">[\s\S]*?<\/div>/
      : skin === "glass"
        ? /^<nav class="floating">[\s\S]*?<\/nav>/
        : /^<header[\s\S]*?<\/header>/;
  const match = source.match(pattern);
  if (!match) return { chrome: "", rest: source };
  return { chrome: match[0], rest: source.slice(match[0].length) };
}

function scopeSelectorList(selector: string, scope: string): string {
  return selector.split(",").map((part) => {
    const sel = part.trim();
    if (!sel || sel.startsWith("@")) return sel;
    if (sel === ":root" || sel === "html" || sel === "body") return scope;
    return `${scope} ${sel}`;
  }).join(",");
}

export function scopeTemplateCss(css: string, scope: string): string {
  let index = 0;
  let out = "";
  const source = css.trim();
  while (index < source.length) {
    while (source[index] === " " || source[index] === "\n") index += 1;
    if (index >= source.length) break;
    if (source.startsWith("@media", index) || source.startsWith("@supports", index)) {
      const brace = source.indexOf("{", index);
      if (brace < 0) break;
      const header = source.slice(index, brace + 1);
      let depth = 1;
      let cursor = brace + 1;
      while (cursor < source.length && depth > 0) {
        if (source[cursor] === "{") depth += 1;
        else if (source[cursor] === "}") depth -= 1;
        cursor += 1;
      }
      const inner = source.slice(brace + 1, cursor - 1);
      out += `${header}${scopeTemplateCss(inner, scope)}}`;
      index = cursor;
      continue;
    }
    const brace = source.indexOf("{", index);
    if (brace < 0) break;
    const selector = source.slice(index, brace).trim();
    const close = source.indexOf("}", brace);
    if (close < 0) break;
    const body = source.slice(brace + 1, close);
    out += `${scopeSelectorList(selector, scope)}{${body}}`;
    index = close + 1;
  }
  return out;
}

export function scopedTemplateCss(skin: string, accentColorId?: string | null): string {
  const pack = templatePack(skin);
  const home = SPEC_HTML[pack.specId]?.home ?? "";
  const inner = SPEC_HTML[pack.specId]?.inner ?? "";
  const paint = resolveAccent(pack.skin, accentColorId);
  const raw = `${extractStyle(home)}\n${extractStyle(inner)}\n${accentOverrideCss(pack.skin, paint)}${pack.skin === "glass" ? glassLayoutCss() : ""}`;
  return scopeTemplateCss(raw, `body[data-fixed-template="${pack.skin}"]`);
}

export function glassLayoutCss(): string {
  return `
.floating{width:min(1180px,calc(100% - 16px));height:auto;overflow:visible}
.nav-inner{min-width:0;gap:8px;width:100%}
.brand{display:inline-flex;align-items:center;flex:0 1 auto;min-width:0;max-width:100%;white-space:nowrap}
.nav{min-width:0;max-width:100%;overflow:visible;flex-wrap:wrap;justify-content:flex-end}
.nav-link{display:inline-flex;align-items:center;flex:0 0 auto;min-height:44px;white-space:nowrap;padding:10px 12px}
.nav-link:nth-child(n+4){display:inline-flex}
.actions{flex-wrap:wrap}
.btn{min-height:44px;display:inline-flex;align-items:center;justify-content:center}
h1,h2,h3,p,li,a,td,th{overflow-wrap:anywhere}
.cover-shot{width:min(720px,100%);max-width:100%;height:auto;aspect-ratio:460/215;object-fit:cover;display:block;margin:22px auto 0;border-radius:24px;border:2px solid #272536}
.reviewed{margin-top:12px;font-size:13px;font-weight:800;letter-spacing:.01em}
.prose-section{text-align:left;padding:6px 0 10px}
.prose-section h2,.layout h2{font-size:clamp(28px,4vw,40px);line-height:1.12;letter-spacing:-.04em;margin:32px 0 12px;color:#20202C}
.prose-section h3,.layout h3{font-size:22px;line-height:1.25;margin:20px 0 8px;color:#20202C}
.prose-section p,.prose-section li,.layout p,.layout li{font-size:17px;line-height:1.75}
.prose-section ul,.prose-section ol,.layout ol,.layout ul{margin:12px 0 0;padding-left:1.25rem}
.prose-section li+li,.layout li+li{margin-top:8px}
.prose-section a,.layout article a,.table-scroll a{color:#0F5F75;font-weight:800;text-decoration:underline;text-underline-offset:3px}
.prose-section strong,.layout strong{color:#20202C}
.inner-hero .actions{justify-content:flex-start}
.wrap,.layout,.layout article,.toc,.table-scroll{min-width:0;max-width:100%}
.layout{grid-template-columns:minmax(0,1fr) 230px}
.toc a{overflow-wrap:anywhere}
.table-scroll{display:block;overflow-x:auto;max-width:100%;margin-top:16px;border:2px solid #272536;border-radius:18px;background:#fff;-webkit-overflow-scrolling:touch}
.table-scroll table{width:100%;border-collapse:collapse;min-width:560px}
.table-scroll caption{text-align:left;font-weight:900;padding:12px 14px;background:#E8FAFF;color:#20202C}
.table-scroll th,.table-scroll td{padding:12px 14px;border-top:1px solid #CDD9EE;text-align:left;vertical-align:top;color:#20202C}
.table-scroll th{font-size:13px;letter-spacing:.04em;text-transform:uppercase}
.status-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:16px}
a.status-card{display:flex;flex-direction:column;justify-content:center;min-height:44px;background:#fff;border:2px solid #272536;border-radius:18px;padding:14px 16px;box-shadow:4px 4px 0 #272536;text-decoration:none;color:#20202C}
.prose-section a.status-card,.layout article a.status-card{text-decoration:none;color:#20202C}
a.status-card b{display:block;font-size:16px;color:#20202C}
a.status-card span{display:block;margin-top:4px;color:#3F4658;font-weight:650;font-size:14px;line-height:1.45}
@media(max-width:1100px){
.nav-inner{flex-wrap:wrap}
.nav{width:100%;margin-left:0;justify-content:flex-start;flex-wrap:wrap;overflow:visible}
.floating{border-radius:28px}
}
@media(max-width:820px){
h1{font-size:34px}
.inner-hero h1{font-size:34px}
.status-grid{grid-template-columns:1fr}
.blocks{grid-template-columns:1fr}
.layout{grid-template-columns:minmax(0,1fr)}
.toc{position:static}
.nav{flex-wrap:wrap;overflow:visible}
.nav-link:nth-child(n+4){display:inline-flex}
}
`;
}

export function renderFixedDocument(input: FixedTemplateInput): { html: string; body: string; chrome: string; rest: string } {
  const html = renderFixedTemplate(input);
  const body = extractBody(html);
  const parts = splitFixedChrome(body, templatePack(input.skin).skin);
  return { html, body, ...parts };
}
