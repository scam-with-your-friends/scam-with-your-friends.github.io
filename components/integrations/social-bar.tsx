"use client";

import { useEffect } from "react";
import { socialBarSrc } from "@/config/adsterra";

export function SocialBar() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (document.getElementById("adsterra-social-bar")) return;
      const script = document.createElement("script");
      script.id = "adsterra-social-bar";
      script.src = socialBarSrc;
      document.body.appendChild(script);
    }, 0);
    // Keep the script and its UI for the document lifetime, including SPA navigation.
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}
