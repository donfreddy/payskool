import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { cleanField, pilotRequestMessage } from "@/lib/pilot-request";
import { localizedPath } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";

/** Three short fields fit in well under 4 KB; anything bigger is not our form. */
const MAX_BODY_BYTES = 4096;

/** 303 so the browser follows with a GET, whatever the original method. */
function seeOther(location: string): Response {
  return new Response(null, { status: 303, headers: { Location: location } });
}

/**
 * Pilot request form target. Nothing is stored: the request is turned into a
 * pre-filled WhatsApp message and the visitor is sent to wa.me to send it
 * themselves. A plain form POST keeps the form working without JavaScript.
 * The redirect host is fixed, so user input can only land in the message text.
 */
export async function POST(request: Request): Promise<Response> {
  // Checked before parsing: formData() buffers the whole body in memory.
  const type = request.headers.get("content-type") ?? "";
  const length = Number(request.headers.get("content-length"));
  if (!type.startsWith("application/x-www-form-urlencoded")) {
    return new Response("Unsupported media type", { status: 415 });
  }
  if (!Number.isFinite(length) || length <= 0 || length > MAX_BODY_BYTES) {
    return new Response("Bad request", { status: 400 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const requested = form.get("locale");
  const locale =
    routing.locales.find((candidate) => candidate === requested) ?? routing.defaultLocale;

  const school = cleanField(form.get("school"));
  // The browser enforces `required`; a request without it goes back to the form.
  if (!school) return seeOther(`${localizedPath(locale)}#demande`);

  const t = await getTranslations({ locale, namespace: "whatsapp" });
  const message = pilotRequestMessage(
    t("intro"),
    { school: t("school"), city: t("city"), students: t("students") },
    { school, city: cleanField(form.get("city")), students: cleanField(form.get("students")) },
  );

  return seeOther(whatsappUrl(message));
}
