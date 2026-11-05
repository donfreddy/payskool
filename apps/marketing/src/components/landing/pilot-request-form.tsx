import { MessageCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const fields = [
  { name: "school", autoComplete: "organization", inputMode: "text", required: true },
  { name: "city", autoComplete: "address-level2", inputMode: "text", required: false },
  { name: "students", autoComplete: "off", inputMode: "numeric", required: false },
] as const;

/**
 * Posts to /api/pilot, which answers with a redirect to WhatsApp carrying the
 * pre-filled request. Nothing is stored; the promoter reviews and sends the
 * message. Works without JavaScript.
 */
export function PilotRequestForm() {
  const t = useTranslations("finalCta");
  const locale = useLocale();

  return (
    <form method="post" action="/api/pilot" className="mt-10 grid gap-3 text-left sm:grid-cols-3">
      <input type="hidden" name="locale" value={locale} />
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium text-white/80">{t(field.name)}</span>
          <input
            name={field.name}
            placeholder={t(`${field.name}Placeholder`)}
            autoComplete={field.autoComplete}
            inputMode={field.inputMode}
            required={field.required}
            maxLength={120}
            className="h-12 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-[16px] text-white placeholder:text-white/35 focus-visible:border-emeraude focus-visible:ring-2 focus-visible:ring-emeraude/40 focus-visible:outline-none"
          />
        </label>
      ))}
      {/* emerald-700: white on the brand emeraude is 3.8:1, below AA. */}
      <button
        type="submit"
        className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-encre focus-visible:outline-none sm:col-span-3 sm:justify-self-center"
      >
        <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
        {t("submit")}
      </button>
    </form>
  );
}
