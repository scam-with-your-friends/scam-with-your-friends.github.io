"use client";

import { useEffect, useRef } from "react";
import { nativeBannerCode } from "@/config/adsterra";
import { createAdFrame } from "./ad-frame";

export function NativeAdClient() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let frame: HTMLIFrameElement | undefined;
    let observer: ResizeObserver | undefined;
    const timer = window.setTimeout(() => {
      frame = createAdFrame(nativeBannerCode, "Advertisement — Native Banner");
      frame.style.width = "100%";
      frame.style.height = "180px";
      frame.onload = () => {
        observer?.disconnect();
        const body = frame?.contentDocument?.body;
        if (!body || !frame) return;
        const resize = () => {
          if (frame) frame.style.height = `${Math.max(180, Math.ceil(body.getBoundingClientRect().height))}px`;
        };
        observer = new ResizeObserver(resize);
        observer.observe(body);
        resize();
      };
      host.appendChild(frame);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      if (frame) {
        frame.onload = null;
        frame.remove();
      }
    };
  }, []);

  return <div className="adsterra-native-host" ref={hostRef} data-native-ad-slot />;
}
