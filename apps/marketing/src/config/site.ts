/**
 * Site-wide settings, read from the environment at build time
 * (NEXT_PUBLIC_* values are inlined into the bundle).
 *
 * The production domain and the sales WhatsApp line are not decided yet. Until
 * NEXT_PUBLIC_SITE_URL is set, the site is built with a placeholder domain and
 * marked noindex (see robots.ts and the root layout), so a forgotten variable
 * can never publish placeholder URLs to search engines. A missing WhatsApp
 * number is logged at build time: every pilot button would open a dead chat.
 */
const PLACEHOLDER_URL = "https://payskool.example";
const PLACEHOLDER_WHATSAPP = "237000000000";

const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
// wa.me wants digits only, country code included: "+237 6 99..." becomes "237699...".
const envWhatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export const site = {
  name: "Payskool",
  url: (envUrl || PLACEHOLDER_URL).replace(/\/+$/, ""),
  whatsappNumber: /^\d{11,15}$/.test(envWhatsapp) ? envWhatsapp : PLACEHOLDER_WHATSAPP,
  /** False while the domain is a placeholder: the site must not be indexed. */
  indexable: envUrl !== "",
} as const;

// Server side only: the warning is for whoever builds and deploys, not for visitors.
if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
  if (!site.indexable) {
    console.warn(
      "[site] NEXT_PUBLIC_SITE_URL is not set: building with a placeholder domain, noindex.",
    );
  }
  if (site.whatsappNumber === PLACEHOLDER_WHATSAPP) {
    console.warn(
      "[site] NEXT_PUBLIC_WHATSAPP_NUMBER is missing or invalid: pilot buttons open a placeholder chat.",
    );
  }
}
