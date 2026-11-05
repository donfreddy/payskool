import type { Metadata } from "next";

import { routing } from "@/i18n/routing";

/** localePrefix "as-needed": French lives at "/", English under "/en". */
export function localizedPath(locale: string, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${prefix}${path}` || "/";
}

/** Canonical and hreflang alternates for one page, relative to metadataBase. */
export function pageAlternates(locale: string, path = ""): Metadata["alternates"] {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((target) => [target, localizedPath(target, path)])),
      "x-default": localizedPath(routing.defaultLocale, path),
    },
  };
}
