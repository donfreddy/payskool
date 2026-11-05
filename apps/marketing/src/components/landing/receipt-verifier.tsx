"use client";

import { CheckCircle2, Info, SearchCheck, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent, type ReactNode } from "react";

import { normalizeReceiptNumber } from "@/lib/receipt";

/** The only receipt in the demo ledger. */
const KNOWN_RECEIPT = "REC-8957";

type Result =
  { status: "valid" } | { status: "invalid"; number: string } | { status: "empty" } | null;

/**
 * Lets the visitor check the hero receipt the way the public verification
 * page does in the product: a known number is found in the school's ledger,
 * with what the paper should say; any other number is not.
 */
export function ReceiptVerifier({ receipt }: { receipt: ReactNode }) {
  const t = useTranslations("verify");
  const stamp = useTranslations("receipt")("stamp");
  const inputId = useId();
  const [value, setValue] = useState(KNOWN_RECEIPT);
  const [result, setResult] = useState<Result>(null);

  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const number = normalizeReceiptNumber(value);
    if (!number) setResult({ status: "empty" });
    else if (number === KNOWN_RECEIPT) setResult({ status: "valid" });
    else setResult({ status: "invalid", number });
  }

  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <div className="relative">
        {receipt}
        {result?.status === "valid" && (
          <span
            aria-hidden="true"
            className="animate-stamp pointer-events-none absolute right-4 bottom-12 rounded-md border-[3px] border-emerald-700 px-3 py-1 text-sm font-extrabold tracking-wide text-emerald-700 uppercase mix-blend-multiply"
          >
            {stamp}
          </span>
        )}
      </div>

      <p className="mt-3 text-center text-[12px] text-encre/70">{t("demo")}</p>

      <form onSubmit={check} className="mt-5">
        <p className="text-[14px] font-medium text-encre">{t("prompt")}</p>
        <div className="mt-2 flex gap-2">
          <label htmlFor={inputId} className="sr-only">
            {t("inputLabel")}
          </label>
          <input
            id={inputId}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setResult(null);
            }}
            maxLength={32}
            autoComplete="off"
            spellCheck={false}
            className="mono-data h-11 min-w-0 flex-1 rounded-lg border border-encre/25 bg-white px-3 text-[15px] text-encre focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-encre px-4 text-[14px] font-semibold text-white transition-colors hover:bg-encre/85 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <SearchCheck className="h-4 w-4" aria-hidden="true" />
            {t("button")}
          </button>
        </div>

        <div aria-live="polite" className="min-h-[5.5rem] break-words">
          {result?.status === "valid" && (
            <div className="animate-fade-in mt-3 flex gap-2.5 rounded-lg bg-emeraude/10 p-3 text-[13px] leading-snug text-emerald-950">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                aria-hidden="true"
              />
              <p>
                <strong className="block">{t("validTitle")}</strong>
                {t("validText")}
                <span className="mt-1 block">{t("tryOther")}</span>
              </p>
            </div>
          )}
          {result?.status === "invalid" && (
            <div className="animate-fade-in mt-3 flex gap-2.5 rounded-lg bg-ambre/10 p-3 text-[13px] leading-snug text-amber-950">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
              <p className="min-w-0">
                <strong className="block">{t("invalidTitle")}</strong>
                {t("invalidText", { number: result.number })}
              </p>
            </div>
          )}
          {result?.status === "empty" && (
            <p className="animate-fade-in mt-3 flex gap-2 text-[13px] text-encre/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {t("empty")}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
