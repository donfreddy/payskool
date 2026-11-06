import { Banknote, CheckCircle2, Clock, ScanLine } from "lucide-react";
import { useTranslations } from "next-intl";

/** Cash desk: find the student, see the instalments, take the payment. */
export function CashierMock() {
  const t = useTranslations("mocks.cashier");

  return (
    <div className="flex flex-col gap-2.5 text-encre">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold">{t("find")}</p>
        <span className="text-[11px] font-semibold text-ardoise">{t("scheduleTitle")}</span>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-craie px-3 py-2 ring-1 ring-fil ring-inset">
        <ScanLine className="h-3.5 w-3.5 text-emeraude" />
        <span className="text-[12px] text-ardoise">{t("search")}</span>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-fil p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emeraude/10 text-[12px] font-bold text-emeraude">
          {t("initials")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold">{t("studentName")}</p>
          <p className="mono-data text-[11px] text-ardoise">{t("studentMeta")}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold text-ardoise">{t("balanceLabel")}</p>
          <p className="mono-data text-[14px] font-bold">{t("balanceValue")}</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_7.5rem] gap-2.5">
        <div className="rounded-xl border border-fil p-3">
          <p className="mb-2 flex justify-between gap-2 text-[10px] font-semibold text-ardoise">
            <span>{t("coverage")}</span>
            <span className="mono-data text-encre">{t("coverageValue")}</span>
          </p>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emeraude" />
              <span className="flex-1 text-[12px] font-semibold">{t("t1Label")}</span>
              <span className="rounded bg-emeraude/10 px-1.5 py-0.5 text-[10px] font-bold text-emeraude">
                {t("t1Status")}
              </span>
            </li>
            <li className="rounded-lg border border-ambre/40 bg-ambre/5 px-2 py-1.5">
              <div className="flex items-center gap-2">
                <span className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ambre" />
                <span className="flex-1 text-[12px] font-bold">{t("t2Label")}</span>
                <span className="rounded bg-ambre/10 px-1.5 py-0.5 text-[10px] font-bold text-ambre">
                  {t("t2Status")}
                </span>
              </div>
              <p className="mt-0.5 ml-4 text-[10px] font-semibold text-ambre">{t("nextDue")}</p>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-ardoise/60" />
              <span className="flex-1 text-[12px] font-semibold">{t("t3Label")}</span>
              <span className="rounded bg-craie px-1.5 py-0.5 text-[10px] font-bold text-ardoise">
                {t("t3Status")}
              </span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-fil p-3 text-center">
          <p className="text-[10px] font-semibold text-ardoise">{t("amountLabel")}</p>
          <p className="mono-data mt-1 text-[14px] font-bold">{t("amountValue")}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 rounded-lg bg-emeraude py-2.5 text-[13px] font-bold text-white">
        <Banknote className="h-4 w-4" />
        {t("collectCta")}
      </div>
    </div>
  );
}
