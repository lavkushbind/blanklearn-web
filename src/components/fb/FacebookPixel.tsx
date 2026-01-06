'use client';

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

const PIXEL_ID = "706092818594262"; // <--- YAHAN APNA PIXEL ID DALEIN

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Page view track karne ke liye
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(PIXEL_ID);
        ReactPixel.pageView();
      });
  }, [pathname]);

  return null;
}