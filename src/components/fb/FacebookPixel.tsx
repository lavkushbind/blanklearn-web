'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
         ReactPixel.init("25803660512655488"); 
        ReactPixel.pageView();
      });
  }, [pathname]);

  return null;
}