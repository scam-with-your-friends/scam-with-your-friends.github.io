"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { NativeAdSlot } from "./native-ad-slot";
import { ResponsiveBanner } from "./responsive-banner";

export function AdDocument({ html }: { html: string }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const attach = useCallback((node: HTMLDivElement | null) => setHost(node), []);
  const banner = host?.querySelector("[data-adsterra-banner-mount]");
  const native = host?.querySelector("[data-adsterra-native-mount]");

  return (
    <>
      <div ref={attach} dangerouslySetInnerHTML={{ __html: html }} />
      {banner ? createPortal(<ResponsiveBanner />, banner) : null}
      {native ? createPortal(<NativeAdSlot />, native) : null}
    </>
  );
}
