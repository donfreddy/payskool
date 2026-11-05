import { useTranslations } from "next-intl";

import { QrPattern } from "@/components/mocks/primitives";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-0.5">
      <dt className="text-encre/70">{label}</dt>
      <dd className="text-right font-semibold text-encre">{value}</dd>
    </div>
  );
}

/** The printed receipt a parent takes home: what Payskool replaces the receipt book with. */
export function Receipt() {
  const t = useTranslations("receipt");

  return (
    // The mask cuts the torn edge, and would cut a box-shadow with it: the
    // shadow is a drop-shadow on the wrapper, so it follows the torn outline.
    <div className="drop-shadow-[0_1px_1px_rgb(12_18_32/0.12)] drop-shadow-[0_18px_28px_rgb(12_18_32/0.14)]">
      <div className="receipt-tear bg-white px-6 pt-6 pb-9">
        <div className="text-center">
          <p className="text-[15px] font-bold tracking-tight text-encre">{t("school")}</p>
          <p className="text-[12px] text-encre/70">{t("schoolSub")}</p>
        </div>

        <div className="my-3 border-t border-dashed border-encre/25" />

        <div className="text-center">
          <p className="text-[12px] font-semibold text-encre/70">{t("label")}</p>
          <p className="mono-data text-lg font-bold text-encre">{t("number")}</p>
        </div>

        <div className="my-3 border-t border-dashed border-encre/25" />

        <dl className="mono-data text-[12.5px] leading-relaxed">
          <Row label={t("date")} value={t("dateValue")} />
          <Row label={t("time")} value={t("timeValue")} />
          <Row label={t("cashier")} value={t("cashierValue")} />
        </dl>

        <div className="my-3 border-t border-dashed border-encre/25" />

        <dl className="mono-data text-[12.5px] leading-relaxed">
          <Row label={t("student")} value={t("studentValue")} />
          <Row label={t("matricule")} value={t("matriculeValue")} />
          <Row label={t("class")} value={t("classValue")} />
          <Row label={t("installment")} value={t("installmentValue")} />
          <Row label={t("method")} value={t("methodValue")} />
        </dl>

        <div className="mono-data mt-3 flex items-baseline justify-between rounded-md bg-emeraude/10 px-3 py-2 text-emerald-800">
          <span className="text-[12px] font-bold">{t("total")}</span>
          <span className="text-base font-bold">{t("totalValue")}</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <QrPattern className="h-16 w-16 shrink-0" />
          <p className="max-w-[8rem] text-[12px] leading-snug text-encre/70">{t("qr")}</p>
        </div>
      </div>
    </div>
  );
}
