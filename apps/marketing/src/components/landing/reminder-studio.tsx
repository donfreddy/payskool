"use client";

import { Plus, RotateCcw, TriangleAlert, Wand2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";

import { PhoneFrame, SmsBubble, SmsHeader } from "@/components/mocks/primitives";
import {
  DEFAULT_MOMENTS,
  DEMO_DUE_DATE,
  formatShortDate,
  MOMENTS,
  momentTime,
  sortMoments,
  type Moment,
  type MomentKind,
} from "@/lib/schedule";
import {
  countSms,
  displaySms,
  fallbackPairs,
  fillTemplate,
  gsmFallback,
  roomLeft,
  toSmsText,
} from "@/lib/sms";

type Token = { token: string; label: string; sample: string };

/** Caps the template text a director can type, not the filled-in SMS. */
const MAX_TEMPLATE_LENGTH = 459;

const BEFORE = MOMENTS.filter((moment) => moment.kind === "before");
const AFTER = MOMENTS.filter((moment) => moment.kind === "after");

const chip =
  "inline-flex min-h-10 min-w-14 cursor-pointer items-center justify-center rounded-lg border px-3 text-[14px] font-semibold whitespace-nowrap transition-colors select-none peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-700 peer-focus-visible:ring-offset-2 border-encre/15 bg-white text-encre/75 hover:border-encre/35 peer-checked:border-emerald-700 peer-checked:bg-emerald-700 peer-checked:text-white";

/**
 * The reminder settings of the school app, reduced to what a promoter needs
 * to judge them: when parents are told, what the message says, and how many
 * SMS that costs. Everything runs in the browser, on demo data. As in the
 * product, there is one pre-due reminder and up to three follow-ups.
 */
export function ReminderStudio() {
  const t = useTranslations("reminders");
  const locale = useLocale();
  const ids = useId();
  const area = useRef<HTMLTextAreaElement>(null);
  /** Where the caret was in each message, so a token lands where the director last clicked. */
  const carets = useRef<Partial<Record<MomentKind, number>>>({});

  const tokens = t.raw("tokens") as Token[];
  const defaults = t.raw("templates") as Record<MomentKind, string>;

  const [before, setBefore] = useState<string | null>(
    () => DEFAULT_MOMENTS.find((id) => BEFORE.some((moment) => moment.id === id)) ?? null,
  );
  const [after, setAfter] = useState<ReadonlySet<string>>(
    () => new Set(DEFAULT_MOMENTS.filter((id) => AFTER.some((moment) => moment.id === id))),
  );
  const [kind, setKind] = useState<MomentKind>("before");
  const [templates, setTemplates] = useState(defaults);

  const dueDate = formatShortDate(locale, DEMO_DUE_DATE);
  const values: Record<string, string> = {
    ...Object.fromEntries(tokens.map(({ token, sample }) => [token, sample])),
    date: dueDate,
  };

  const render = (which: MomentKind) => toSmsText(fillTemplate(templates[which], values));
  const current = render(kind);
  const count = countSms(current);
  const pairs = fallbackPairs(count.offending);
  const emptyKinds = (["before", "after"] as const).filter((which) => !render(which).trim());
  const plan = sortMoments([...(before ? [before] : []), ...after]).filter(
    (moment) => !emptyKinds.includes(moment.kind),
  );
  const planSms = plan.reduce((sum, moment) => sum + countSms(render(moment.kind)).segments, 0);

  const chipText = (moment: Moment) =>
    t(moment.kind === "before" ? "chipBefore" : "chipAfter", { days: moment.days });
  const chipLabel = (moment: Moment) =>
    t(moment.kind === "before" ? "chipBeforeLabel" : "chipAfterLabel", { days: moment.days });

  function toggleAfter(id: string) {
    setAfter((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function edit(text: string, caret?: number) {
    setTemplates((previous) => ({ ...previous, [kind]: text }));
    if (caret === undefined) return;
    carets.current[kind] = caret;
    requestAnimationFrame(() => {
      area.current?.focus();
      area.current?.setSelectionRange(caret, caret);
    });
  }

  function rememberCaret() {
    if (area.current) carets.current[kind] = area.current.selectionStart;
  }

  function insert(token: string) {
    const text = templates[kind];
    // Never focused yet: append, which is what a director clicking a chip first expects.
    const at = Math.min(carets.current[kind] ?? text.length, text.length);
    const placeholder = `{${token}}`;
    const next = text.slice(0, at) + placeholder + text.slice(at);
    if (next.length > MAX_TEMPLATE_LENGTH) return;
    edit(next, at + placeholder.length);
  }

  const kinds: { kind: MomentKind; tab: string }[] = [
    { kind: "before", tab: t("tabBefore") },
    { kind: "after", tab: t("tabAfter") },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
      <div className="rounded-2xl border border-fil bg-white p-5 sm:p-7">
        <h3 className="text-[17px] font-bold text-encre">{t("whenLabel")}</h3>

        <fieldset className="mt-4">
          <legend className="text-[13px] font-medium text-encre/65">{t("beforeGroup")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {[null, ...BEFORE].map((moment) => (
              <label key={moment?.id ?? "none"}>
                <input
                  type="radio"
                  name={`${ids}-before`}
                  className="peer sr-only"
                  checked={before === (moment?.id ?? null)}
                  onChange={() => setBefore(moment?.id ?? null)}
                  aria-label={moment ? chipLabel(moment) : t("beforeNone")}
                />
                <span className={chip} aria-hidden="true">
                  {moment ? chipText(moment) : t("beforeNone")}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-[13px] font-medium text-encre/65">{t("afterGroup")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {AFTER.map((moment) => (
              <label key={moment.id}>
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={after.has(moment.id)}
                  onChange={() => toggleAfter(moment.id)}
                  aria-label={chipLabel(moment)}
                />
                <span className={chip} aria-hidden="true">
                  {chipText(moment)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="text-[17px] font-bold text-encre">{t("messageLabel")}</legend>
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-craie p-1 ring-1 ring-fil ring-inset">
            {kinds.map((item) => (
              <label key={item.kind}>
                <input
                  type="radio"
                  name={`${ids}-kind`}
                  className="peer sr-only"
                  checked={kind === item.kind}
                  onChange={() => setKind(item.kind)}
                />
                <span className="flex min-h-10 cursor-pointer items-center justify-center rounded-lg px-2 text-center text-[13px] font-semibold text-encre/70 peer-checked:bg-white peer-checked:text-encre peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-700">
                  {item.tab}
                </span>
              </label>
            ))}
          </div>

          <label htmlFor={`${ids}-text`} className="sr-only">
            {kind === "before" ? t("tabBefore") : t("tabAfter")}
          </label>
          <textarea
            id={`${ids}-text`}
            ref={area}
            value={templates[kind]}
            onChange={(event) => edit(event.target.value)}
            onSelect={rememberCaret}
            onKeyUp={rememberCaret}
            onClick={rememberCaret}
            maxLength={MAX_TEMPLATE_LENGTH}
            rows={5}
            spellCheck={false}
            className="mt-3 w-full resize-y rounded-xl border border-encre/20 bg-white px-4 py-3 text-[15px] leading-relaxed text-encre focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/25 focus-visible:outline-none"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-encre/65">{t("insert")}</span>
            {tokens.map(({ token, label }) => (
              <button
                key={token}
                type="button"
                onClick={() => insert(token)}
                className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-craie px-2.5 text-[13px] font-medium text-encre ring-1 ring-fil ring-inset hover:ring-encre/30 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                {label}
              </button>
            ))}
            {templates[kind] !== defaults[kind] && (
              <button
                type="button"
                onClick={() => edit(defaults[kind], defaults[kind].length)}
                className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium text-encre/70 hover:text-encre focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {t("reset")}
              </button>
            )}
          </div>
        </fieldset>

        {/* Small screens: the phone is far below, so the message is echoed here.
            Wide screens: kept for screen readers, since the phone is decorative. */}
        <div className="mt-6 rounded-xl bg-craie p-4 lg:sr-only">
          <p className="text-[12px] font-medium text-encre/65">{t("previewLabel")}</p>
          <p className="mt-2 rounded-2xl rounded-bl-md bg-white px-3 py-2 text-[14px] leading-snug break-words text-encre ring-1 ring-fil ring-inset">
            {displaySms(current)}
          </p>
        </div>

        <div aria-live="polite" className="mt-4 space-y-2 text-[14px] leading-relaxed">
          <p className="font-semibold text-encre">
            {t("count", { length: count.length, segments: count.segments })}
          </p>
          {count.segments > 0 && (
            <p className="text-encre/70">{t("room", { room: roomLeft(count) })}</p>
          )}
          {count.encoding === "UCS-2" && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-ambre/10 px-3 py-2 text-amber-900">
              <p className="flex gap-2">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {t("ucs", { chars: count.offending.join(" ") })}{" "}
                  {pairs.length === 0 && t("ucsRemove")}
                </span>
              </p>
              {pairs.length > 0 && (
                <button
                  type="button"
                  onClick={() => edit(gsmFallback(templates[kind]))}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-[13px] font-semibold text-encre ring-1 ring-amber-900/20 hover:ring-amber-900/40 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none"
                >
                  <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("ucsFix", {
                    pairs: pairs.map(([from, to]) => `${from} → ${to}`).join(", "),
                  })}
                </button>
              )}
            </div>
          )}
          {emptyKinds.length > 0 && (
            <p className="flex gap-2 rounded-lg bg-ambre/10 px-3 py-2 text-amber-900">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {t("empty")}
            </p>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <PhoneFrame label={t("previewLabel")}>
          <div className="px-4 pt-1 pb-5">
            <SmsHeader sender={t("sender")} />
            <div className="mt-4 max-h-[19rem] space-y-4 overflow-y-auto pr-1 sm:max-h-[26rem]">
              {plan.length === 0 ? (
                <p className="py-10 text-center text-[12px] text-encre/60">{t("none")}</p>
              ) : (
                plan.map((moment) => (
                  <SmsBubble
                    key={moment.id}
                    when={t("previewWhen", {
                      moment: chipText(moment),
                      date: formatShortDate(locale, momentTime(moment)),
                    })}
                    highlight={moment.kind === kind}
                  >
                    {displaySms(render(moment.kind))}
                  </SmsBubble>
                ))
              )}
            </div>
          </div>
        </PhoneFrame>
        <p className="mx-auto mt-5 max-w-sm text-center text-[14px] leading-relaxed text-encre/75">
          {plan.length === 0 ? t("none") : t("total", { sms: planSms })}
        </p>
        <p className="mx-auto mt-1 max-w-sm text-center text-[13px] text-encre/60">
          {t("example", { date: dueDate })}
        </p>
      </div>
    </div>
  );
}
