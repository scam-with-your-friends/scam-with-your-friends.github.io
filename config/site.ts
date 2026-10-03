import type { SiteConfig, ThemePresetName } from "./types";
import rawSiteConfig from "../content/generated/site.json";

const generated = rawSiteConfig as SiteConfig;
const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";
const basePath = envBasePath || generated.hosting.basePath || "";
const environmentTheme = process.env.NEXT_PUBLIC_THEME_PRESET as ThemePresetName | undefined;

export const siteConfig: SiteConfig = {
  ...generated,
  theme: { ...generated.theme, preset: environmentTheme || generated.theme.preset },
  hosting: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || generated.hosting.siteUrl,
    basePath,
    customDomain: process.env.NEXT_PUBLIC_CUSTOM_DOMAIN?.trim() || generated.hosting.customDomain,
  },
};
