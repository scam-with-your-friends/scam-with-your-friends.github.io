"use client";

import { useEffect, useRef } from "react";
import { desktopBannerCode, mobileBannerCode } from "@/config/adsterra";
import { createAdFrame } from "./ad-frame";

export function ResponsiveBanner() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let frame: HTMLIFrameElement | undefined;
    let observer: ResizeObserver | undefined;
    // Cancel the Strict Mode rehearsal before it requests a third-party script.
    const timer = window.setTimeout(() => {
      const mobile = !window.matchMedia("(min-width: 768px)").matches;
      const width = mobile ? 320 : 728;
      const height = mobile ? 50 : 90;
      frame = createAdFrame(mobile ? mobileBannerCode : desktopBannerCode, "Advertisement — Banner");
      frame.width = String(width);
      frame.height = String(height);
      frame.dataset.bannerSize = `${width}x${height}`;
      const fit = () => {
        if (frame) frame.style.transform = `scale(${Math.min(1, host.clientWidth / width)})`;
      };
      host.appendChild(frame);
      fit();
      observer = new ResizeObserver(fit);
      observer.observe(host);
      // Resizing fits this creative without executing the other unit on this visit.
    }, 0);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      frame?.remove();
    };
  }, []);

  return <div className="adsterra-banner-host" ref={hostRef} />;
}
