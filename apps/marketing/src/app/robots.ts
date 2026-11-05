import type { MetadataRoute } from "next";

import { site } from "@/config/site";

/** Closed to crawlers while the domain is a placeholder (see config/site.ts). */
export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
