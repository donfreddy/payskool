import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/seo";

/**
 * Only the landing page for now. /about and /careers still carry claims the
 * product cannot back, and the legal pages still have facts to fill in: both
 * are noindex until then.
 */
const pages = [""];

/** One entry per page and locale, each listing its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  // No real domain yet: listing placeholder URLs would only mislead crawlers.
  if (!site.indexable) return [];
  const url = (locale: string, page: string) => `${site.url}${localizedPath(locale, page)}`;

  return pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: url(locale, page),
      changeFrequency: "monthly" as const,
      priority: 1,
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((other) => [other, url(other, page)])),
          "x-default": url(routing.defaultLocale, page),
        },
      },
    })),
  );
}
