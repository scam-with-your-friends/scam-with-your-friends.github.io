import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "out");
const errors = [];
const fail = (message) => errors.push(message);

const pages = [
  {
    file: "index.html",
    canonical: "https://scam-with-your-friends.github.io/",
    title: "Scam With Your Friends Wiki & Guide | Release Date",
    description: "Scam With Your Friends guide covering the release date, playtest access, how to play, price, official Discord, and supported platforms on Steam.",
    h1: "Scam With Your Friends Wiki & Guide",
    h2: [
      "Scam With Your Friends: Quick Status",
      "What Is Scam With Your Friends?",
      "Release Date and Early Access",
      "Playtest Keys and Access",
      "How to Play Scam With Your Friends",
      "Price and the $8 Playtest AI Option",
      "Platforms and PC Requirements",
      "Official Discord and Community",
      "Frequently Asked Questions",
    ],
  },
  {
    file: "release-date/index.html",
    canonical: "https://scam-with-your-friends.github.io/release-date/",
    title: "Scam With Your Friends Release Date & Early Access",
    description: "Check the planned Scam With Your Friends release date, Early Access status, full-release target, Steam availability, and what may change before launch.",
    h1: "Scam With Your Friends Release Date & Early Access",
    h2: [
      "Scam With Your Friends Release Date",
      "Early Access vs Full Release",
      "Is There an Exact Release Day Yet?",
      "What Is Confirmed for Early Access",
      "How to Track Release Changes",
      "Frequently Asked Questions",
    ],
    h3: [
      "Planned Early Access Window: October 2026",
      "Where the Date Comes From",
      "What Early Access Means for This Game",
      "Full Release Target",
    ],
  },
  {
    file: "playtest-key/index.html",
    canonical: "https://scam-with-your-friends.github.io/playtest-key/",
    title: "Scam With Your Friends Playtest Key & Access Guide",
    description: "See the latest Scam With Your Friends playtest status, how access and friend invites work, whether keys or a demo are available, and where to get updates.",
    h1: "Scam With Your Friends Playtest Key & Access",
    h2: [
      "Scam With Your Friends Playtest Status",
      "How Playtest Access Works",
      "Is There a Scam With Your Friends Key?",
      "Is There a Public Demo or Free Download?",
      "What the $8 Unlimited AI Purchase Actually Is",
      "What You Can Do Now",
      "Frequently Asked Questions",
    ],
    h3: ["Existing Signup / Batch Access", "Friend Invites"],
  },
  {
    file: "how-to-play/index.html",
    canonical: "https://scam-with-your-friends.github.io/how-to-play/",
    title: "How to Play Scam With Your Friends | Beginner Guide",
    description: "Learn how to play Scam With Your Friends: take AI-driven calls, build trust, use desktop tools, hit the team quota, and survive the boss review.",
    h1: "How to Play Scam With Your Friends",
    h2: [
      "Scam With Your Friends Gameplay Loop",
      "Talking to AI Callers",
      "Using the In-Game Desktop",
      "Daily Quotas and the Boss Review",
      "Single-Player, Co-op and Public Lobbies",
      "Scambaiters, Viruses and Workplace Disasters",
      "What You Need Before You Play",
      "Frequently Asked Questions",
    ],
  },
  {
    file: "discord/index.html",
    canonical: "https://scam-with-your-friends.github.io/discord/",
    title: "Scam With Your Friends Discord | Official Server Link",
    description: "Find the official Scam With Your Friends Discord, what the Jatater Worldwide server is used for, and how to avoid fake or unofficial invite links.",
    h1: "Scam With Your Friends Discord",
    h2: [
      "Official Scam With Your Friends Discord Link",
      "What the Discord Server Is Used For",
      "How to Avoid Fake Scam With Your Friends Links",
      "Other Official Links",
      "Frequently Asked Questions",
    ],
    h3: ["Playtest Updates", "Finding Teammates", "Feedback and Bug Reports", "Playtest / Unlimited AI Support"],
  },
  {
    file: "price/index.html",
    canonical: "https://scam-with-your-friends.github.io/price/",
    title: "Scam With Your Friends Price | Cost & $8 Explained",
    description: "See the current Scam With Your Friends price status, why the $8 playtest AI option is not the game price, and what Steam has confirmed so far.",
    h1: "Scam With Your Friends Price",
    h2: [
      "How Much Is Scam With Your Friends?",
      "What the $8 Unlimited AI Purchase Includes",
      "Early Access Price vs Full Release Price",
      "Can You Pre-Order or Buy a Key Now?",
      "How to Know When the Price Is Announced",
      "Frequently Asked Questions",
    ],
    h3: ["What It Is", "What It Is Not"],
  },
  {
    file: "platforms/index.html",
    canonical: "https://scam-with-your-friends.github.io/platforms/",
    title: "Scam With Your Friends Platforms | Xbox, PS5 & Mobile",
    description: "See where Scam With Your Friends is available, including Windows Steam support and the current status of Xbox, PlayStation, Mac, Linux, mobile and Roblox.",
    h1: "Scam With Your Friends Platforms",
    h2: [
      "Scam With Your Friends Platform Status",
      "Is Scam With Your Friends on Xbox?",
      "Is Scam With Your Friends on PS5 or PlayStation?",
      "Is Scam With Your Friends on Mac, Linux or Steam Deck?",
      "Is Scam With Your Friends on Mobile?",
      "Is There a Roblox Version?",
      "PC System Requirements",
      "Frequently Asked Questions",
    ],
  },
];

const newSlugs = ["demo", "download", "log-file-location"];
const newPages = JSON.parse(readFileSync(join(root, "content/generated/pages.json"), "utf8"))
  .filter((page) => newSlugs.includes(page.slug));
pages.push(...newPages.map((page) => ({
  file: `${page.slug}/index.html`,
  canonical: `https://scam-with-your-friends.github.io/${page.slug}/`,
  title: page.title,
  description: page.description,
  h1: page.hero.heading,
  h2: page.sections.map((section) => section.heading),
})));

const coreHrefs = ["/release-date/", "/playtest-key/", "/how-to-play/", "/discord/", "/price/", "/platforms/", ...newSlugs.map((slug) => `/${slug}/`)];
const knownInternal = new Set(["/", ...coreHrefs, "/about/", "/privacy/", "/terms/", "/copyright/"]);
const phrase = (...parts) => parts.join("");
const banned = [
  phrase("Rift", "fall Survival"),
  phrase("BLOCK", "QUEST"),
  phrase("example", ".github.io"),
  phrase("star", "ter site"),
  phrase("Star", "ter homepage"),
  phrase("guide cover", " placeholder"),
  phrase("Open star", "ter page"),
  phrase("PLAYFUL GAME", " GUIDE"),
  phrase("Working", " Codes"),
  phrase("local", "host"),
  phrase("127", ".0.0.1"),
];
const staleDates = [
  phrase("Novem", "ber 5, ", "2026"),
  phrase("Novem", "ber 5"),
  phrase("Nov", " 5, ", "2026"),
  phrase("Novem", "ber launch"),
];

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function metaContent(html, attr, key) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (!new RegExp(`\\b${attr}=["']${key}["']`, "i").test(tag)) continue;
    const content = tag.match(/\bcontent=["']([^"']*)["']/i);
    if (content) return decode(content[1]);
  }
  return "";
}

function headingText(html, level) {
  return [...html.matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi"))].map((match) =>
    decode(match[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim(),
  );
}

if (!existsSync(out)) fail("out/ is missing. Run the production build first.");

for (const page of pages) {
  const absolute = join(out, page.file);
  if (!existsSync(absolute)) {
    fail(`missing ${page.file}`);
    continue;
  }
  const html = readFileSync(absolute, "utf8");
  if (newSlugs.some((slug) => page.file === `${slug}/index.html`)) {
    const hero = html.match(/<section class="wrap inner-hero">([\s\S]*?)<\/section>/)?.[1] ?? "";
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1] ?? "";
    const copy = decode(`${hero} ${article}`
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " "));
    const words = copy.match(/\b[A-Za-z]+(?:['’-][A-Za-z]+)*\b/g) ?? [];
    if (words.length < 900) fail(`${page.file} has only ${words.length} visible English words`);
    for (const phrase of ["for SEO purposes", "keyword density", "GSC shows", "internal audit", "I could not verify", ["Cod", "ex found"].join(""), "AI says"]) {
      if (copy.toLowerCase().includes(phrase.toLowerCase())) fail(`${page.file} exposes internal wording`);
    }
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .flatMap((match) => JSON.parse(match[1]));
    const expectedFaq = newPages.find((item) => `${item.slug}/index.html` === page.file)?.faq ?? [];
    const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
    if (!faq || JSON.stringify(faq.mainEntity.map((item) => ({ question: item.name, answer: item.acceptedAnswer.text }))) !== JSON.stringify(expectedFaq)) {
      fail(`${page.file} FAQ schema does not match visible questions and answers`);
    }
    if (schemas.some((schema) => ["Review", "AggregateRating"].includes(schema["@type"]))) fail(`${page.file} has an unsupported review schema`);
    const nav = html.match(/<nav[^>]*aria-label="Primary navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? "";
    for (const href of coreHrefs) {
      if (!nav.includes(`href="${href}"`)) fail(`${page.file} primary navigation is missing ${href}`);
    }
    if (page.file === "log-file-location/index.html" && !/<pre[^>]*><code>%USERPROFILE%\\AppData\\LocalLow\\Jatater Worldwide\\Scam With Your Friends\\Player\.log<\/code><\/pre>/.test(hero)) {
      fail(`${page.file} hero is missing the Windows path code block`);
    }
    console.log(`${page.file}: ${words.length} visible English words`);
  }
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim());
  if (title !== page.title) fail(`${page.file} title: ${title}`);
  const description = metaContent(html, "name", "description");
  if (description !== page.description) fail(`${page.file} description mismatch`);
  if (description.length > 160) fail(`${page.file} description is ${description.length} characters`);
  const canonicalTag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] ?? "";
  const canonical = decode(canonicalTag.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? "");
  if (canonical !== page.canonical) fail(`${page.file} canonical: ${canonical}`);
  const robots = metaContent(html, "name", "robots");
  if (/noindex/i.test(robots)) fail(`${page.file} is noindex`);
  if (!/index/i.test(robots) || !/follow/i.test(robots)) fail(`${page.file} robots meta: ${robots}`);
  for (const key of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!metaContent(html, "property", key)) fail(`${page.file} missing ${key}`);
  }
  if (metaContent(html, "property", "og:title") !== page.title) fail(`${page.file} og:title mismatch`);
  if (metaContent(html, "property", "og:url") !== page.canonical) fail(`${page.file} og:url mismatch`);
  if (!/twitter:card/i.test(html)) fail(`${page.file} missing twitter card`);
  const h1s = headingText(html, 1);
  if (h1s.length !== 1) fail(`${page.file} has ${h1s.length} h1 tags`);
  if (h1s[0] !== page.h1) fail(`${page.file} h1: ${h1s[0]}`);
  const h2s = headingText(html, 2);
  for (const heading of page.h2) {
    if (!h2s.includes(heading)) fail(`${page.file} missing h2: ${heading}`);
  }
  const h3s = headingText(html, 3);
  for (const heading of page.h3 ?? []) {
    if (!h3s.includes(heading)) fail(`${page.file} missing h3: ${heading}`);
  }
  for (const href of coreHrefs) {
    if (!html.includes(`href="${href}"`)) fail(`${page.file} missing nav href ${href}`);
  }
  if (page.file !== "index.html" && !html.includes('href="/"')) fail(`${page.file} missing home link`);
  const visible = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  for (const phrase of banned) {
    if (visible.includes(phrase)) fail(`${page.file} visible text contains ${phrase}`);
  }
  for (const stale of staleDates) {
    if (html.includes(stale)) fail(`${page.file} still contains stale release date text`);
  }
  if (/nth-child\(n\+4\)\{display:\s*none\}/.test(html)) fail(`${page.file} still hides later nav links`);
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    if (href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) continue;
    const path = href.split("#")[0].split("?")[0];
    if (path.startsWith("/_next/") || path.startsWith("/images/") || path.startsWith("/fonts/")) continue;
    if (/\.[a-z0-9]+$/i.test(path) && existsSync(join(out, path.replace(/^\/+/, "")))) continue;
    if (!knownInternal.has(path)) fail(`${page.file} bad internal link ${href}`);
  }
  if (page.file === "how-to-play/index.html" && !html.includes('"@type":"HowTo"') && !html.includes('"@type": "HowTo"')) {
    fail("how-to-play missing HowTo schema");
  }
  if (!html.includes("FAQPage")) fail(`${page.file} missing FAQPage schema`);
}

const robots = existsSync(join(out, "robots.txt")) ? readFileSync(join(out, "robots.txt"), "utf8") : "";
if (!/Allow:\s*\//.test(robots)) fail("robots.txt does not allow /");
if (/Disallow:\s*\//.test(robots)) fail("robots.txt disallows /");
if (!robots.includes("https://scam-with-your-friends.github.io/sitemap.xml")) fail("robots.txt sitemap URL");

const sitemap = existsSync(join(out, "sitemap.xml")) ? readFileSync(join(out, "sitemap.xml"), "utf8") : "";
for (const page of pages) {
  if (!sitemap.includes(page.canonical)) fail(`sitemap missing ${page.canonical}`);
}
if (sitemap.includes("/wiki/") || sitemap.includes(phrase("example", ".github.io")) || sitemap.includes(phrase("local", "host"))) {
  fail("sitemap contains a non-production URL");
}

for (const legal of ["about/index.html", "privacy/index.html", "terms/index.html", "copyright/index.html"]) {
  const absolute = join(out, legal);
  if (!existsSync(absolute)) {
    fail(`missing legal page ${legal}`);
    continue;
  }
  const robotsMeta = metaContent(readFileSync(absolute, "utf8"), "name", "robots");
  if (!/noindex/i.test(robotsMeta)) fail(`${legal} should be noindex`);
}

for (const removed of ["wiki/index.html", "codes/index.html", "contact/index.html"]) {
  if (existsSync(join(out, removed))) fail(`unexpected page ${removed}`);
}

const manifest = existsSync(join(out, "manifest.webmanifest"))
  ? readFileSync(join(out, "manifest.webmanifest"), "utf8")
  : "";
if (!manifest.includes("image/webp")) fail("manifest icon MIME is not image/webp");

const og = readFileSync(join(root, "public/images/scam-with-your-friends-og.svg"), "utf8");
if (/codes|drops|updates/i.test(og)) fail("OG subtitle still mentions codes, drops, or updates");

const homeHtml = readFileSync(join(out, "index.html"), "utf8");
const homeHead = homeHtml.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
const gtagId = "G-Y7W8G2J7P2";
const gtagSrc = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
if (!new RegExp(`<script\\b[^>]*\\bsrc=["']${gtagSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(homeHead)) {
  fail("homepage <head> is missing the gtag.js script");
}
if (!homeHead.includes(`gtag('config', '${gtagId}')`) && !homeHead.includes(`gtag("config", "${gtagId}")`)) {
  fail("homepage <head> is missing the gtag config");
}

function walkJs(directory, files = []) {
  if (!existsSync(directory)) return files;
  for (const entry of readdirSync(directory)) {
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) walkJs(absolute, files);
    else if (entry.endsWith(".js") || entry.endsWith(".html")) files.push(absolute);
  }
  return files;
}

for (const file of walkJs(out)) {
  const text = readFileSync(file, "utf8");
  for (const needle of [phrase("Rift", "fall Survival"), phrase("BLOCK", "QUEST"), phrase("example", ".github.io"), phrase("guide cover", " placeholder"), phrase("Open star", "ter page")]) {
    if (text.includes(needle)) fail(`${file.slice(out.length + 1)} contains ${needle}`);
  }
}

if (errors.length) {
  console.error(`audit:seo failed (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("audit:seo passed: 10 core pages, canonicals, sitemap, robots, nav, schema, and homepage gtag head");
