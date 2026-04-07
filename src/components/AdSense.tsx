"use client";

import { useEffect } from "react";

interface AdSenseProps {
  className?: string;
}

export default function AdSense({ className = "" }: AdSenseProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4405660368108333"
        data-ad-slot="8893174506"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
