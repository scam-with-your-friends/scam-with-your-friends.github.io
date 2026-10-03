import type { NextConfig } from "next";
import site from "./content/generated/site.json";

function normalizeBasePath(value?: string) {
  if (!value || value === "/") return "";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH?.trim() || site.hosting.basePath);

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: process.cwd(),
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
