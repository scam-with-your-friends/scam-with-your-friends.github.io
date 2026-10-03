import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const errors = [];
const fail = (message) => errors.push(message);

const site = JSON.parse(readFileSync(join(root, "content/generated/site.json"), "utf8"));
const home = JSON.parse(readFileSync(join(root, "content/generated/home.json"), "utf8"));
const pages = JSON.parse(readFileSync(join(root, "content/generated/pages.json"), "utf8"));

const expectedTitles = {
  home: "Scam With Your Friends Wiki & Guide | Release Date",
  "release-date": "Scam With Your Friends Release Date & Early Access",
  "playtest-key": "Scam With Your Friends Playtest Key & Access Guide",
  "how-to-play": "How to Play Scam With Your Friends | Beginner Guide",
  discord: "Scam With Your Friends Discord | Official Server Link",
  price: "Scam With Your Friends Price | Cost & $8 Explained",
  platforms: "Scam With Your Friends Platforms | Xbox, PS5 & Mobile",
};

const expectedDescriptions = {
  home: "Scam With Your Friends guide covering the release date, playtest access, how to play, price, official Discord, and supported platforms on Steam.",
  "release-date": "Check the planned Scam With Your Friends release date, Early Access status, full-release target, Steam availability, and what may change before launch.",
  "playtest-key": "See the latest Scam With Your Friends playtest status, how access and friend invites work, whether keys or a demo are available, and where to get updates.",
  "how-to-play": "Learn how to play Scam With Your Friends: take AI-driven calls, build trust, use desktop tools, hit the team quota, and survive the boss review.",
  discord: "Find the official Scam With Your Friends Discord, what the Jatater Worldwide server is used for, and how to avoid fake or unofficial invite links.",
  price: "See the current Scam With Your Friends price status, why the $8 playtest AI option is not the game price, and what Steam has confirmed so far.",
  platforms: "See where Scam With Your Friends is available, including Windows Steam support and the current status of Xbox, PlayStation, Mac, Linux, mobile and Roblox.",
};

const requiredSlugs = ["release-date", "playtest-key", "how-to-play", "discord", "price", "platforms"];
const forbiddenSlugs = ["wiki", "codes", "code", "key", "playtest", "demo", "free-download", "early-access", "xbox", "mobile", "release", "access-release"];
const internalFields = ["sourceNotes", "searchIntent", "factsStatus", "densityTargets", "primaryKeyword", "secondaryKeywords", "priority", "wordCountTarget"];

if (site.readyForLaunch !== true) fail("readyForLaunch must be true");
if (site.hosting?.siteUrl !== "https://scam-with-your-friends.github.io") fail(`siteUrl is ${site.hosting?.siteUrl}`);
if (site.hosting?.basePath !== "") fail(`basePath must be empty, found ${JSON.stringify(site.hosting?.basePath)}`);
if (site.hosting?.customDomain) fail("customDomain must be null");
if (site.repositoryUrl) fail("repositoryUrl must be null");
if (site.siteName !== "Scam With Your Friends Wiki & Guide") fail("siteName mismatch");
if (site.description !== "Independent Scam With Your Friends guide covering the release date, playtest access, how to play, price, official Discord and supported platforms.") {
  fail("site description mismatch");
}
if (site.seo?.titleTemplate && site.seo.titleTemplate !== "%s") fail("titleTemplate must not append a brand suffix");
if (site.game?.officialUrl !== "https://store.steampowered.com/app/4954910/Scam_With_Your_Friends/") fail("official Steam URL mismatch");
for (const domain of ["store.steampowered.com", "jataterworldwide.com", "discord.gg"]) {
  if (!site.allowedExternalDomains?.includes(domain)) fail(`missing allowed domain ${domain}`);
}

const slugs = pages.map((page) => page.slug);
if (pages.length !== 6) fail(`expected 6 core pages, found ${pages.length}`);
for (const slug of requiredSlugs) {
  if (!slugs.includes(slug)) fail(`missing core slug ${slug}`);
}
for (const slug of forbiddenSlugs) {
  if (slugs.includes(slug)) fail(`forbidden slug present: ${slug}`);
}
if (new Set(slugs).size !== slugs.length) fail("duplicate slugs");
if (slugs.join(",") !== requiredSlugs.join(",")) fail(`core page order must stay ${requiredSlugs.join(", ")}`);

const titles = new Set();
const descriptions = new Set();

function checkMeta(id, page) {
  if (page.title !== expectedTitles[id]) fail(`${id} title mismatch: ${page.title}`);
  if (!page.title || page.title.length > 60) fail(`${id} title length ${page.title?.length ?? 0}`);
  if (titles.has(page.title)) fail(`duplicate title ${page.title}`);
  titles.add(page.title);
  if (page.description !== expectedDescriptions[id]) fail(`${id} description mismatch`);
  if (!page.description || page.description.length > 160) fail(`${id} description length ${page.description?.length ?? 0}`);
  if (descriptions.has(page.description)) fail(`duplicate description for ${id}`);
  descriptions.add(page.description);
  if (!page.hero?.heading) fail(`${id} missing H1`);
  if (!Array.isArray(page.sections) || page.sections.length < 1) fail(`${id} needs sections`);
  for (const field of internalFields) {
    if (page[field] != null) fail(`${id} still has internal field ${field}`);
  }
}

checkMeta("home", home);
if (!Array.isArray(home.faq) || home.faq.length < 8) fail("home FAQ is incomplete");
for (const page of pages) {
  if (page.enabled === false) fail(`${page.slug} is disabled`);
  if (page.navVisible === false) fail(`${page.slug} is hidden from navigation`);
  checkMeta(page.slug, page);
  if (!Array.isArray(page.faq) || page.faq.length < 1) fail(`${page.slug} missing FAQ`);
  for (const related of page.relatedSlugs ?? []) {
    if (!slugs.includes(related)) fail(`${page.slug} related slug missing: ${related}`);
  }
}

const phrase = (...parts) => parts.join("");
const banned = [
  phrase("Yo", "rich"),
  phrase("Fact", " Pack"),
  phrase("Evidence", " ID"),
  phrase("Generated", " by"),
  phrase("Rift", "fall Survival"),
  phrase("BLOCK", "QUEST"),
  phrase("example", ".github.io"),
  phrase("star", "ter site"),
  phrase("Star", "ter homepage"),
  phrase("guide cover", " placeholder"),
  phrase("Open star", "ter page"),
  phrase("local", "host"),
  phrase("127", ".0.0.1"),
  phrase("PLAYFUL GAME", " GUIDE"),
  phrase("Working", " Codes"),
  phrase("Latest", " Codes"),
  phrase("Novem", "ber 5, ", "2026"),
  phrase("Novem", "ber 5"),
  phrase("Nov", " 5, ", "2026"),
  phrase("Novem", "ber launch"),
];

const editorialVoice = [
  phrase("this guide will not ", "invent"),
  phrase("this page will not ", "invent"),
  phrase("this page will not ", "fill"),
  phrase("do not trust a ", "guide"),
  phrase("a guide that ", "says"),
  phrase("ahead of the source ", "material"),
];
const productionCopy = JSON.stringify([home, ...pages]).toLowerCase();
for (const item of editorialVoice) {
  if (productionCopy.includes(item)) fail(`production copy still uses internal editorial wording: ${item}`);
}

const workspaceDirs = [".idea", ".vscode", ".cursor", ".claude", ".codex"];
for (const dir of workspaceDirs) {
  if (existsSync(join(root, dir))) fail(`local workspace directory must not be committed: ${dir}`);
}

const scanRoots = ["app", "components", "config", "content", "lib", "public", "scripts", ".github"];
const scanFiles = ["README.md", "package.json", ".env.example"];
const skipLeakFiles = new Set([join(root, "scripts/validate.mjs"), join(root, "scripts/audit-seo.mjs")]);

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    if (entry === "node_modules" || entry === "out" || entry === ".next" || entry === "release" || entry === "fonts") continue;
    if (workspaceDirs.includes(entry)) continue;
    const absolute = join(directory, entry);
    const info = statSync(absolute);
    if (info.isDirectory()) walk(absolute, files);
    else if (/\.(ts|tsx|js|mjs|json|md|yml|yaml|svg|css|txt|xml|example)$/i.test(entry)) files.push(absolute);
  }
  return files;
}

const files = [
  ...scanRoots.flatMap((directory) => walk(join(root, directory))),
  ...scanFiles.map((file) => join(root, file)),
];

const localLeakNeedles = [
  phrase("/Use", "rs/"),
  phrase("C:\\", "Users\\"),
  phrase("local", "host"),
  phrase("127", ".0.0.1"),
  phrase("自", "动化"),
];
const personalHomePath = /\/home\/(?!user\/|username\/|runner\/|ubuntu\/|node\/)[A-Za-z][A-Za-z0-9._-]{2,}\//;

for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const phrase of banned) {
    if (text.includes(phrase)) fail(`${relative(root, file)} contains ${phrase}`);
  }
  if (!skipLeakFiles.has(file)) {
    for (const needle of localLeakNeedles) {
      if (text.includes(needle)) fail(`${relative(root, file)} contains a local-machine path or address`);
    }
    if (personalHomePath.test(text)) fail(`${relative(root, file)} contains a personal home path`);
  }
  const assistant = new RegExp(`\\b(${phrase("Cod", "ex")}|${phrase("Cla", "ude")}|${phrase("Chat", "GPT")})\\b`);
  if (assistant.test(text)) fail(`${relative(root, file)} contains an assistant signature`);
  const unfinishedMarker = new RegExp(`\\b${phrase("skele", "ton")}\\b`, "i");
  if (unfinishedMarker.test(text)) fail(`${relative(root, file)} contains an unfinished-template marker`);
}

if (errors.length) {
  console.error(`validate failed (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("validate passed: 7 core routes, metadata, domain, and source scan");
