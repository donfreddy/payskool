import { BellRing } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { PhoneFrame } from "./primitives";

type Row = { cls: string; late: string; rate: number };

/** The head's view of collection, on the phone they carry all day. */
export function DashboardPhone() {
  const t = useTranslations("mocks.dashboard");
  const rows = t.raw("rows") as Row[];
  const percent = new Intl.NumberFormat(useLocale(), { style: "percent" });

  return (
    <PhoneFrame label={t("label")}>
      <div className="px-4 pt-1 pb-5">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-bold">{t("title")}</p>
          <p className="mono-data text-[10px] text-encre/60">{t("year")}</p>
        </div>

        <div className="mt-3 rounded-2xl bg-encre p-3.5 text-white">
          <p className="text-[10px] text-white/70">{t("collectedLabel")}</p>
          <p className="mono-data text-[22px] leading-tight font-bold">
            {t("collected")} <span className="text-[12px] text-white/60">{t("currency")}</span>
          </p>
          <div className="mt-2.5 flex gap-5 text-[10px]">
            <div>
              <p className="mono-data text-[13px] font-bold text-emerald-400">{t("rate")}</p>
              <p className="text-white/60">{t("rateLabel")}</p>
            </div>
            <div>
              <p className="mono-data text-[13px] font-bold">{t("remaining")}</p>
              <p className="text-white/60">{t("remainingLabel")}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-fil bg-white p-3">
          <p className="text-[11px] font-bold">{t("lateTitle")}</p>
          <ul className="mt-2 space-y-2.5">
            {rows.map((row) => (
              <li key={row.cls} className="grid grid-cols-[2.6rem_1fr_auto] items-center gap-2">
                <span className="text-[11px] font-semibold">{row.cls}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-craie">
                  <span
                    className={`block h-full ${row.rate >= 80 ? "bg-emeraude" : "bg-ambre"}`}
                    style={{ width: `${row.rate}%` }}
                  />
                </span>
                <span className="mono-data text-right text-[10.5px]">
                  <span className="font-bold text-amber-700">{row.late}</span>
                  <span className="text-encre/55"> · {percent.format(row.rate / 100)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 flex items-center gap-2 rounded-xl bg-emeraude/10 px-3 py-2 text-[10.5px] font-semibold text-emerald-900">
          <BellRing className="h-3.5 w-3.5 shrink-0" />
          {t("next")}
        </p>
      </div>
    </PhoneFrame>
  );
}
