import type { FaqItem, PageSection } from "@/config/types";
import { esc } from "./render";
import { routePath } from "@/lib/urls";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function richText(value: string): string {
  const parts: string[] = [];
  const pattern = new RegExp(LINK.source, "g");
  let last = 0;
  let match = pattern.exec(value);
  while (match) {
    parts.push(esc(value.slice(last, match.index)));
    const label = match[1] ?? "";
    const href = match[2] ?? "";
    const safe = href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://");
    if (!safe) {
      parts.push(esc(match[0]));
    } else {
      const external = href.startsWith("http");
      parts.push(`<a href="${esc(href)}"${external ? ' rel="noopener noreferrer"' : ""}>${esc(label)}</a>`);
    }
    last = match.index + match[0].length;
    match = pattern.exec(value);
  }
  parts.push(esc(value.slice(last)));
  return parts.join("");
}

function renderTable(table: NonNullable<PageSection["table"]>): string {
  const head = table.columns.map((column) => `<th scope="col">${richText(column)}</th>`).join("");
  const body = table.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${richText(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<div class="table-scroll"><table><caption>${richText(table.caption)}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export function renderSection(section: PageSection): string {
  const eyebrow = section.eyebrow ? `<p class="eyebrow">${richText(section.eyebrow)}</p>` : "";
  const intro = section.intro ? `<p>${richText(section.intro)}</p>` : "";
  const paragraphs = (section.paragraphs ?? []).map((paragraph) => `<p>${richText(paragraph)}</p>`).join("");
  const bullets = section.bullets?.length
    ? `<ul>${section.bullets.map((bullet) => `<li>${richText(bullet)}</li>`).join("")}</ul>`
    : "";
  const subsections = (section.subsections ?? [])
    .map((subsection) => {
      const body = subsection.paragraphs.map((paragraph) => `<p>${richText(paragraph)}</p>`).join("");
      const bullets = subsection.bullets?.length
        ? `<ul>${subsection.bullets.map((bullet) => `<li>${richText(bullet)}</li>`).join("")}</ul>`
        : "";
      const table = subsection.table ? renderTable(subsection.table) : "";
      return `<section><h3>${esc(subsection.heading)}</h3>${body}${bullets}${table}</section>`;
    })
    .join("");
  const steps = section.steps?.length
    ? `<ol>${section.steps
        .map((step) => `<li><strong>${esc(step.heading)}</strong> ${richText(step.description)}</li>`)
        .join("")}</ol>`
    : "";
  const table = section.table ? renderTable(section.table) : "";
  const links = section.links?.length
    ? `<div class="status-grid">${section.links
        .map((link) => {
          const text = link.description ? `<span>${esc(link.description)}</span>` : "";
          return `<a class="status-card" href="${esc(routePath(link.slug))}"><b>${esc(link.label)}</b>${text}</a>`;
        })
        .join("")}</div>`
    : "";
  return `<section id="${esc(section.id)}" class="prose-section">${eyebrow}<h2>${esc(section.heading)}</h2>${intro}${paragraphs}${bullets}${subsections}${steps}${table}${links}</section>`;
}

export function renderFaq(faq: FaqItem[]): string {
  if (!faq.length) return "";
  const items = faq
    .map((item) => `<section><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p></section>`)
    .join("");
  return `<section id="faq" class="prose-section"><h2>Frequently Asked Questions</h2>${items}</section>`;
}

export function renderRelated(links: Array<{ href: string; label: string }>): string {
  if (!links.length) return "";
  const items = links.map((link) => `<li><a href="${esc(link.href)}">${esc(link.label)}</a></li>`).join("");
  return `<section id="related" class="prose-section"><h2>Related guides</h2><ul>${items}</ul></section>`;
}

export function reviewedLabel(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = months[Number(match[2]) - 1];
  if (!month) return iso;
  return `${month} ${Number(match[3])}, ${match[1]}`;
}
