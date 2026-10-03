# Scam With Your Friends Wiki & Guide

Independent English guide for Scam With Your Friends. The site is a static Next.js export for GitHub Pages at https://scam-with-your-friends.github.io.

## Local development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run typecheck
npm run lint
npm run validate
npm run build
npm run audit:seo
```

`npm run build:site` is the same production build used by GitHub Actions. The static site is written to `out/`.

## Deploy

Pushes to `main` run `.github/workflows/deploy.yml`, which builds the site and deploys `out/` to GitHub Pages. The project is a user or organization site at the domain root, so it does not use a project-site subdirectory or a CNAME file.

## Environment variables

Leave these empty unless you have a real value. Real IDs belong in the local environment or in GitHub Actions secrets, not in the repository.

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BASE_PATH`
- `NEXT_PUBLIC_CUSTOM_DOMAIN`
- `NEXT_PUBLIC_THEME_PRESET`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL`
- `NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID`
- `GOOGLE_SITE_VERIFICATION`
- `BING_SITE_VERIFICATION`

Analytics, site verification, and ads stay off when the matching values are empty.
