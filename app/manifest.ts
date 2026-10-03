import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { themes } from "@/config/themes";
import { assetPath } from "@/lib/urls";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const theme = themes[siteConfig.theme.preset];
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: assetPath("/"),
    display: "standalone",
    background_color: siteConfig.theme.background || (theme ? `hsl(${theme.tokens.background})` : "#E8EFFF"),
    theme_color: siteConfig.theme.accent || (theme ? `hsl(${theme.tokens.primary})` : "#06B6D4"),
    icons: [{ src: assetPath(siteConfig.assets.favicon), sizes: "304x248", type: "image/webp" }],
  };
}
