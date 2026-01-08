'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        // AAPKA REAL PIXEL ID (Jo screenshot mein tha)
        ReactPixel.init("2260918854410275"); 
        ReactPixel.pageView(); // Website khulte hi track karega
      });
  }, [pathname]);

  return null;
}