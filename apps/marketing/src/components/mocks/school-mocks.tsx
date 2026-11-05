import { Banknote, CheckCircle2, Clock, ReceiptText, ScanLine, Smartphone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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

type PaymentRow = {
  method: string;
  ref: string;
  student: string;
  meta: string;
  amount: string;
  receipt: string;
};

/** Mobile Money payments, matched to students without cash desk input. */
export function PaymentsMock() {
  const t = useTranslations("mocks.payments");
  const rows = t.raw("rows") as PaymentRow[];

  return (
    <div className="flex flex-col gap-2.5 text-encre">
      <div className="flex items-end justify-between gap-3 rounded-xl bg-encre px-4 py-3 text-white">
        <div>
          <p className="text-[10px] font-medium text-white/60">{t("eyebrow")}</p>
          <p className="mono-data mt-0.5 text-2xl font-bold">{t("heroCount")}</p>
          <p className="text-[11px] text-white/70">{t("heroSub")}</p>
        </div>
        <div className="flex gap-4 text-right text-[10px]">
          <div>
            <p className="mono-data text-[13px] font-bold text-emerald-400">{t("receiptsValue")}</p>
            <p className="text-white/60">{t("receipts")}</p>
          </div>
          <div>
            <p className="mono-data text-[13px] font-bold">{t("refundedValue")}</p>
            <p className="text-white/60">{t("refunded")}</p>
          </div>
        </div>
      </div>

      <p className="rounded-lg border border-fil px-3 py-2 text-[11px] leading-relaxed text-ardoise">
        {t("note")}
      </p>

      <div className="overflow-hidden rounded-xl border border-fil">
        <div className="grid grid-cols-[1.2fr_1.2fr_0.9fr] gap-2 border-b sm:grid-cols-[1.2fr_1.2fr_0.9fr_0.9fr] border-fil px-3 py-2 text-[10px] font-semibold text-ardoise">
          <span>{t("thTx")}</span>
          <span>{t("thStudent")}</span>
          <span className="text-right">{t("thAmount")}</span>
          <span className="hidden sm:block">{t("thReceipt")}</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.ref}
            className="grid grid-cols-[1.2fr_1.2fr_0.9fr] items-center sm:grid-cols-[1.2fr_1.2fr_0.9fr_0.9fr] gap-2 border-b border-fil px-3 py-2 last:border-0"
          >
            <div className="min-w-0">
              <span
                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                  row.method.startsWith("MTN")
                    ? "bg-amber-100 text-amber-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                <Smartphone className="h-3 w-3" />
                {/* The operator alone on small screens, so the badge fits its column. */}
                <span className="sm:hidden">{row.method.split(" ")[0]}</span>
                <span className="hidden sm:inline">{row.method}</span>
              </span>
              <p className="mono-data mt-0.5 text-[10px] text-ardoise">{row.ref}</p>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold">{row.student}</p>
              <p className="text-[10px] text-ardoise">{row.meta}</p>
            </div>
            <p className="mono-data text-right text-[12px] font-semibold">{row.amount}</p>
            <span className="mono-data hidden items-center gap-1 text-[11px] font-semibold sm:inline-flex">
              <ReceiptText className="h-3 w-3 text-emeraude" />
              {row.receipt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type ReportRow = { cls: string; due: string; collected: string; rate: number; late: string };

/** Collection by class: who is up to date, today. */
export function CollectionMock() {
  const t = useTranslations("mocks.report");
  const rows = t.raw("rows") as ReportRow[];
  const percent = new Intl.NumberFormat(useLocale(), { style: "percent" });

  return (
    <div className="flex flex-col gap-2.5 text-encre">
      <div className="rounded-xl bg-encre px-4 py-3 text-white">
        <p className="text-[10px] font-medium text-white/60">{t("eyebrow")}</p>
        <p className="mt-1 text-[11px] text-white/70">{t("heroLabel")}</p>
        <p className="mono-data text-2xl font-bold">{t("heroValue")}</p>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[10px]">
          <div>
            <p className="mono-data text-[13px] font-bold text-emerald-400">{t("rateValue")}</p>
            <p className="text-white/60">{t("rateLabel")}</p>
          </div>
          <div>
            <p className="mono-data text-[13px] font-bold">{t("remainingValue")}</p>
            <p className="text-white/60">{t("remainingLabel")}</p>
          </div>
          <div>
            <p className="mono-data text-[13px] font-bold">{t("uptodateValue")}</p>
            <p className="text-white/60">{t("uptodateLabel")}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-fil">
        <p className="border-b border-fil px-3 py-2 text-[12px] font-bold">{t("tableTitle")}</p>
        <div className="grid grid-cols-[0.8fr_1fr_1fr_1.3fr_0.7fr] gap-2 border-b border-fil px-3 py-1.5 text-[10px] font-semibold text-ardoise">
          <span>{t("thClass")}</span>
          <span className="text-right">{t("thDue")}</span>
          <span className="text-right">{t("thCollected")}</span>
          <span>{t("thRate")}</span>
          <span className="text-right">{t("thLate")}</span>
        </div>
        {rows.map((row) => {
          const ok = row.rate >= 80;
          return (
            <div
              key={row.cls}
              className="grid grid-cols-[0.8fr_1fr_1fr_1.3fr_0.7fr] items-center gap-2 border-b border-fil px-3 py-2 last:border-0"
            >
              <p className="text-[12px] font-semibold">{row.cls}</p>
              <p className="mono-data text-right text-[11px] text-ardoise">{row.due}</p>
              <p className="mono-data text-right text-[11px] font-semibold">{row.collected}</p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-full max-w-14 overflow-hidden rounded-full bg-craie">
                  <span
                    className={`block h-full ${ok ? "bg-emeraude" : "bg-ambre"}`}
                    style={{ width: `${row.rate}%` }}
                  />
                </span>
                <span
                  className={`mono-data text-[11px] font-bold ${ok ? "text-emeraude" : "text-ambre"}`}
                >
                  {percent.format(row.rate / 100)}
                </span>
              </div>
              <p className="mono-data text-right text-[11px] font-bold text-ambre">{row.late}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
