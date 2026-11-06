import { useLocale, useTranslations } from "next-intl";

import { PhoneFrame, SmsBubble, SmsHeader } from "@/components/mocks/primitives";
import { DEMO_DUE_DATE, formatShortDate } from "@/lib/schedule";
import { displaySms, fillTemplate, toSmsText } from "@/lib/sms";

type Token = { token: string; sample: string };

/** Tag beside a bubble: says what sent it, which the SMS itself cannot. */
function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full whitespace-nowrap bg-emerald-700 px-2.5 py-1 text-[11.5px] font-semibold text-white shadow-md shadow-emerald-900/15">
      {children}
    </span>
  );
}

/**
 * What a parent's phone shows over one instalment: the automatic reminder,
 * then the receipt. The reminder is built from the same default template as
 * the reminders demo, so the two can never disagree.
 */
export function SmsThread() {
  const t = useTranslations("thread");
  const reminders = useTranslations("reminders");
  const locale = useLocale();
  const tokens = reminders.raw("tokens") as Token[];

  const values = Object.fromEntries(tokens.map(({ token, sample }) => [token, sample]));
  values.date = formatShortDate(locale, DEMO_DUE_DATE);
  const reminder = toSmsText(fillTemplate(reminders.raw("templates.before") as string, values));

  return (
    <div className="relative mx-auto w-full max-w-[22rem]">
      <PhoneFrame label={t("label")}>
        <div className="px-4 pt-1 pb-6">
          <SmsHeader sender={reminders("sender")} />
          <div className="mt-4 space-y-4">
            <SmsBubble when={t("reminderWhen")}>{displaySms(reminder)}</SmsBubble>
            <SmsBubble when={t("receiptWhen")}>{displaySms(t("receiptSms"))}</SmsBubble>
          </div>
        </div>
      </PhoneFrame>

      {/* Tags sit outside the phone so they read as commentary, not as screen content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
        <span className="absolute top-[30%] right-[calc(100%-3rem)]">
          <Tag>{t("reminderTag")}</Tag>
        </span>
        <span className="absolute top-[62%] left-[calc(100%-3rem)]">
          <Tag>{t("receiptTag")}</Tag>
        </span>
      </div>

      <p className="mt-5 text-center text-[13px] text-encre/65">{t("caption")}</p>
    </div>
  );
}
