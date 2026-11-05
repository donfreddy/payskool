import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Home,
  MessageCircle,
  Receipt,
  Smartphone,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

/** The parent space on a phone, drawn from the parent app's home screen. */
export function ParentPhone() {
  const t = useTranslations("mocks.phone");

  const nav = [
    { key: "navHome", icon: Home, active: true },
    { key: "navChildren", icon: Users, active: false },
    { key: "navReceipts", icon: Receipt, active: false },
    { key: "navHelp", icon: MessageCircle, active: false },
  ] as const;

  return (
    <figure aria-label={t("label")} className="mx-auto w-[17.5rem]">
      <div
        className="rounded-[2.6rem] bg-encre p-[6px] shadow-2xl shadow-encre/15"
        aria-hidden="true"
      >
        <div className="overflow-hidden rounded-[2.2rem] bg-craie text-encre">
          <div className="relative flex items-center justify-between px-6 pt-3 pb-1">
            <span className="text-[10px] font-semibold">9:41</span>
            <span className="absolute top-0 left-1/2 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-encre" />
            <span className="h-2.5 w-4 rounded-sm border border-encre/60" />
          </div>

          <div className="px-4 pt-2 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold">{t("greeting")}</p>
                <p className="text-[10px] text-ardoise">{t("children")}</p>
              </div>
              <span className="flex items-center gap-1 rounded-full border border-fil bg-white px-2 py-1 text-[10px] font-bold">
                {t("student")}
                <ChevronDown className="h-3 w-3 text-ardoise" />
              </span>
            </div>

            <div className="mt-3 rounded-2xl bg-encre p-3.5 text-white">
              <p className="text-[9px] font-semibold text-white/70">
                {t("school")} · {t("year")}
              </p>
              <p className="mt-2.5 text-[10px] text-white/70">{t("dueLabel")}</p>
              <p className="mono-data text-2xl font-bold">
                {t("dueAmount")} <span className="text-sm text-white/60">{t("currency")}</span>
              </p>
              <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emeraude py-2 text-[11px] font-bold">
                <Smartphone className="h-3.5 w-3.5" />
                {t("payCta")}
              </p>
            </div>

            <div className="mt-3 rounded-2xl border border-fil bg-white p-3">
              <p className="text-[12px] font-bold">{t("scheduleTitle")}</p>
              <ol className="mt-2 ml-1.5 space-y-3 border-l-2 border-fil pl-3">
                <li className="relative">
                  <CheckCircle2 className="absolute top-0 -left-[1.2rem] h-3.5 w-3.5 rounded-full bg-white text-emeraude" />
                  <div className="flex justify-between gap-2 text-[10.5px] font-semibold">
                    <span>{t("i1Title")}</span>
                    <span className="text-emeraude">{t("i1Status")}</span>
                  </div>
                  <div className="flex justify-between gap-2 text-[9.5px] text-ardoise">
                    <span>{t("i1Meta")}</span>
                    <span className="mono-data">{t("i1Amount")}</span>
                  </div>
                </li>
                <li className="relative">
                  <AlertTriangle className="absolute top-0 -left-[1.2rem] h-3.5 w-3.5 rounded-full bg-white text-ambre" />
                  <div className="flex justify-between gap-2 text-[10.5px] font-semibold">
                    <span>{t("i2Title")}</span>
                    <span className="text-ambre">{t("i2Status")}</span>
                  </div>
                  <div className="flex justify-between gap-2 text-[9.5px] text-ambre">
                    <span>{t("i2Meta")}</span>
                    <span className="mono-data">{t("i2Amount")}</span>
                  </div>
                  <p className="mt-1.5 rounded-lg bg-emeraude py-1.5 text-center text-[10px] font-bold text-white">
                    {t("i2Pay")}
                  </p>
                </li>
                <li className="relative">
                  <Clock className="absolute top-0 -left-[1.2rem] h-3.5 w-3.5 rounded-full bg-white text-ardoise" />
                  <div className="flex justify-between gap-2 text-[10.5px] font-semibold">
                    <span>{t("i3Title")}</span>
                    <span className="text-ardoise">{t("i3Status")}</span>
                  </div>
                  <div className="flex justify-between gap-2 text-[9.5px] text-ardoise">
                    <span>{t("i3Meta")}</span>
                    <span className="mono-data">{t("i3Amount")}</span>
                  </div>
                </li>
              </ol>
            </div>

            <div className="mt-3 flex justify-between rounded-2xl bg-white px-4 py-2">
              {nav.map(({ key, icon: Icon, active }) => (
                <span
                  key={key}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                    active ? "text-emeraude" : "text-ardoise"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(key)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
