import type { Metadata } from "next";
import Link from "next/link";
import { visibleCorePages } from "@/content/registry";
import { routePath } from "@/lib/urls";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found" },
  description: "That page is not part of this Scam With Your Friends guide.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="site-container py-16 sm:py-24">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        This address is not one of the guides on the site. Use the links below to get back to the release date, playtest access, and the other current pages.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="button-primary">Back to home</Link>
        {visibleCorePages.map((page) => (
          <Link key={page.slug} href={routePath(page.slug)} className="button-secondary">{page.navLabel}</Link>
        ))}
      </div>
    </main>
  );
}
