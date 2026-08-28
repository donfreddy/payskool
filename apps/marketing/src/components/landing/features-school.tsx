"use client";

import {
  Banknote,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Landmark,
  Phone,
  ReceiptText,
  ScanLine,
  School,
  ShieldCheck,
  Smartphone,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export function FeaturesSchool() {
  const t = useTranslations("featuresSchool");

  const tabs = [
    {
      id: "collection",
      label: t("tab1Label"),
      title: t("tab1Title"),
      description: t("tab1Description"),
      highlights: t.raw("tab1Highlights") as string[],
    },
    {
      id: "tresorerie",
      label: t("tab2Label"),
      title: t("tab2Title"),
      description: t("tab2Description"),
      highlights: t.raw("tab2Highlights") as string[],
    },
    {
      id: "credit",
      label: t("tab3Label"),
      title: t("tab3Title"),
      description: t("tab3Description"),
      highlights: t.raw("tab3Highlights") as string[],
    },
    {
      id: "groupe",
      label: t("tab4Label"),
      title: t("tab4Title"),
      description: t("tab4Description"),
      highlights: t.raw("tab4Highlights") as string[],
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]!.id);
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeTab));

  const pinRef = useRef<HTMLDivElement>(null);
  const idsRef = useRef<string[]>(tabs.map((tab) => tab.id));
  const isScrollingToRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    
    const update = () => {
      if (!mq.matches) return;
      if (isScrollingToRef.current) return;
      
      const rect = pin.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      if (span <= 0) return;
      const ids = idsRef.current;
      const p = Math.min(1, Math.max(0, -rect.top / span));
      const next = ids[Math.min(ids.length - 1, Math.floor(p * ids.length))];
      if (next) setActiveTab((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    const onScrollEnd = () => {
      isScrollingToRef.current = false;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleTabSelect = (id: string) => {
    setActiveTab(id);
    const mq = window.matchMedia("(min-width: 1024px)");
    if (!mq.matches) return;
    
    const pin = pinRef.current;
    if (!pin) return;
    
    const targetIndex = tabs.findIndex((t) => t.id === id);
    if (targetIndex === -1) return;
    
    isScrollingToRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingToRef.current = false;
    }, 800);
    
    const rect = pin.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const containerTop = rect.top + window.scrollY;
    
    const p = (targetIndex + 0.5) / tabs.length;
    const targetScrollY = containerTop + p * span;
    
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  const routes: Record<string, string> = {
    collection: "/cs-sainte-marie/cashier",
    tresorerie: "/cs-sainte-marie/payments",
    credit: "/cs-sainte-marie/reports/collection",
    groupe: "/cs-sainte-marie",
  };

  return (
    <section id="features-school" className="relative bg-craie py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
            {t("eyebrow")}
          </p>
          <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-ardoise">
            {t("subtitle")}
          </p>
        </div>

        <div ref={pinRef} className="relative mt-16 lg:h-[500vh]">
          {/* Desktop: pinned, scroll-jacked */}
          <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
            <div className="mx-auto flex w-full max-w-7xl items-center gap-16 px-2 sm:px-8">
              <FeatureTabsList
                tabs={tabs}
                activeTab={activeTab}
                onSelect={handleTabSelect}
                pinned
              />
              <div className="relative min-w-0 flex-1">
                <MockFrame
                  activeTab={activeTab}
                  routes={routes}
                  className="aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[min(56vh,560px)]"
                />
              </div>
            </div>
            {/* Moved further down to avoid any fixed navbars */}
            <span className="absolute right-8 top-24 inline-flex items-baseline gap-1 font-mono text-sm text-ardoise/60">
              <span className="text-emeraude">{String(activeIndex + 1).padStart(2, "0")}</span>
              <span className="text-ardoise/40">/ {String(tabs.length).padStart(2, "0")}</span>
            </span>
          </div>

          {/* Mobile & tablet: static stacked */}
          <div className="lg:hidden">
            <div className="grid items-start gap-12">
              <FeatureTabsList tabs={tabs} activeTab={activeTab} onSelect={handleTabSelect} />
              <div className="relative">
                <MockFrame activeTab={activeTab} routes={routes} className="aspect-square sm:aspect-[4/3]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type SchoolTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  highlights: string[];
};

function FeatureTabsList({
  tabs,
  activeTab,
  onSelect,
  pinned = false,
}: {
  tabs: SchoolTab[];
  activeTab: string;
  onSelect: (id: string) => void;
  pinned?: boolean;
}) {
  if (pinned) {
    return (
      <div className="relative flex w-[360px] shrink-0 flex-col">
        <div className="absolute bottom-2 left-[1px] top-2 w-px bg-ardoise/10" />
        {tabs.map((tab, i) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`relative flex flex-col py-4 pl-6 text-left transition-all duration-300 ${
                isActive ? "opacity-100" : "opacity-45 hover:opacity-75"
              }`}
            >
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 top-0 w-[3px] rounded-full bg-emeraude"
                  style={{ boxShadow: "0 0 12px 0px rgba(5, 150, 105, 0.4)" }}
                />
              )}
              <div className="flex items-baseline gap-3">
                <span
                  className={`font-mono text-[10px] font-bold ${
                    isActive ? "text-emeraude" : "text-ardoise/40"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emeraude">
                  {tab.label}
                </p>
              </div>
              <h3
                className={`mt-1.5 pl-8 text-lg font-bold leading-snug text-encre ${
                  isActive ? "" : "truncate"
                }`}
              >
                {tab.title}
              </h3>
              <div
                className={`grid gap-1.5 pl-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? "mt-3 max-h-80 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                }`}
              >
                <p className="text-[13px] leading-snug text-ardoise">{tab.description}</p>
                <div className="grid gap-1.5 pt-1">
                  {tab.highlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-[12.5px] font-medium text-encre"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-emeraude" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-6">
      <div className="absolute bottom-4 left-[1px] top-4 hidden w-px bg-ardoise/10 sm:block" />
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`relative flex flex-col py-2 pl-6 text-left transition-all duration-300 sm:pl-8 ${
              isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            {isActive && (
              <span
                className="absolute bottom-0 left-0 top-0 w-[3px] rounded-full bg-emeraude"
                style={{ boxShadow: "0 0 12px 0px rgba(5, 150, 105, 0.4)" }}
              />
            )}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emeraude">
              {tab.label}
            </p>
            <h3 className="mb-3 text-xl font-bold text-encre sm:text-2xl">{tab.title}</h3>
            <p className="leading-relaxed text-ardoise">{tab.description}</p>
            <div
              className={`grid gap-2 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? "mt-6 max-h-64 opacity-100" : "mt-0 max-h-0 opacity-0"
              }`}
            >
              {tab.highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-medium text-encre">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-emeraude" />
                  {item}
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MockFrame({
  activeTab,
  routes,
  className,
}: {
  activeTab: string;
  routes: Record<string, string>;
  className: string;
}) {
  return (
    <>
      <div
        className={`relative flex flex-col overflow-hidden rounded-3xl border border-fil bg-white shadow-2xl shadow-encre/[0.06] ${className}`}
      >
        {/* Browser chrome */}
        <div className="flex items-center justify-between border-b border-fil bg-craie px-5 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ardoise/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-ardoise/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-ardoise/20" />
          </div>
          <div className="flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-mono text-[10px] text-ardoise ring-1 ring-inset ring-fil">
            <ShieldCheck className="h-3 w-3 text-emeraude" />
            app.payskool.africa{routes[activeTab]}
          </div>
        </div>

        {/* Visualizations dynamically render based on activeTab */}
        <div className="relative flex-1 overflow-hidden">
          <div className={`absolute inset-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-6 ${activeTab === "collection" ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-8 scale-[0.97]"}`}>
            <CashierMock />
          </div>
          <div className={`absolute inset-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-6 ${activeTab === "tresorerie" ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-8 scale-[0.97]"}`}>
            <PaymentsMock />
          </div>
          <div className={`absolute inset-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-6 ${activeTab === "credit" ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-8 scale-[0.97]"}`}>
            <CollectionMock />
          </div>
          <div className={`absolute inset-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-6 ${activeTab === "groupe" ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-8 scale-[0.97]"}`}>
            <GroupMock />
          </div>
        </div>
      </div>

      {/* Soft decorative glow behind the browser frame */}
      <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-emeraude/20 opacity-30 blur-3xl" />
    </>
  );
}

function Dashes({ light = false }: { light?: boolean }) {
  return <div className={`my-1.5 border-t border-dashed ${light ? "border-white/25" : "border-fil"}`} />;
}

function TicketRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2 font-mono text-[8.5px] leading-relaxed">
      <span className="text-ardoise/70">{k}</span>
      <span className="font-semibold text-encre">{v}</span>
    </div>
  );
}

function FakeQr() {
  const cells = Array.from({ length: 49 }, (_, i) => {
    const x = i % 7;
    const y = Math.floor(i / 7);
    const border = x === 0 || x === 6 || y === 0 || y === 6;
    const fixed =
      (x === 0 && y < 3) ||
      (x === 6 && y < 3) ||
      (y === 0 && x < 3) ||
      (y === 6 && x < 3) ||
      (x === 0 && y > 3) ||
      (x === 6 && y > 3) ||
      (y === 0 && x > 3) ||
      (y === 6 && x > 3);
    return border || fixed ? 1 : (i * 7 + x * 3 + y) % 5 < 3 ? 1 : 0;
  });
  return (
    <svg viewBox="0 0 7 7" shapeRendering="crispEdges" className="h-8 w-8 shrink-0 rounded-sm border border-fil bg-white p-0.5">
      {cells.map((v, i) =>
        v ? <rect key={i} x={i % 7} y={Math.floor(i / 7)} width="1" height="1" fill="#0C1220" /> : null,
      )}
    </svg>
  );
}

function CashierMock() {
  const t = useTranslations("featuresSchool.mockCashier");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold text-encre">{t("find")}</p>
        <span className="text-[8px] font-semibold text-ardoise/70">{t("scheduleTitle")}</span>
      </div>

      <div className="mt-1 flex items-center gap-2 rounded-lg bg-craie px-2 py-1.5 ring-1 ring-inset ring-fil">
        <ScanLine className="h-3 w-3 text-emeraude" />
        <span className="text-[9px] text-ardoise/70">{t("search")}</span>
      </div>

      <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-fil bg-white p-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emeraude/10 text-[11px] font-bold text-emeraude">
          KY
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold text-encre">{t("studentName")}</p>
          <p className="font-mono text-[8.5px] text-ardoise/70">{t("studentMeta")}</p>
        </div>
        <div className="text-right">
          <p className="text-[7.5px] font-semibold uppercase tracking-wide text-ardoise/70">
            {t("balanceLabel")}
          </p>
          <p className="mono-data text-[12px] font-bold text-encre">{t("balanceValue")}</p>
        </div>
      </div>

      <div className="mt-2 flex items-stretch gap-2">
        <div className="flex-1 rounded-xl border border-fil bg-white p-2.5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[8px] font-semibold text-ardoise/70">
              {t("coverage")} · 71%
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-emeraude" />
              <span className="flex-1 text-[9px] font-semibold text-encre">{t("t1Label")}</span>
              <span className="rounded bg-emeraude/10 px-1.5 py-0.5 text-[7.5px] font-bold uppercase text-emeraude">
                {t("t1Status")}
              </span>
            </div>
            <div className="rounded-lg border border-ambre/40 bg-ambre/5 px-1.5 py-1">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ambre" />
                <span className="flex-1 text-[9px] font-bold text-encre">{t("t2Label")}</span>
                <span className="rounded bg-ambre/10 px-1.5 py-0.5 text-[7.5px] font-bold uppercase text-ambre">
                  {t("t2Status")}
                </span>
              </div>
              <p className="ml-3 mt-0.5 text-[7.5px] font-semibold text-ambre">{t("nextDue")}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-ardoise/50" />
              <span className="flex-1 text-[9px] font-semibold text-encre">{t("t3Label")}</span>
              <span className="rounded bg-craie px-1.5 py-0.5 text-[7.5px] font-bold uppercase text-ardoise">
                {t("t3Status")}
              </span>
            </div>
          </div>
        </div>

        <div className="w-24 shrink-0 rounded-xl border border-fil bg-white p-2">
          <p className="text-center text-[7.5px] font-semibold uppercase tracking-wide text-ardoise/70">
            {t("amountLabel")}
          </p>
          <p className="mono-data mt-0.5 text-center text-[11px] font-bold text-encre">
            {t("amountValue")}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-emeraude py-2 text-[10px] font-bold text-white shadow-sm shadow-emeraude/30">
        <Banknote className="h-3 w-3" />
        {t("collectCta")}
      </div>

      <div className="mx-auto mt-2.5 w-full max-w-sm flex-1 overflow-hidden rounded-xl border border-fil shadow-lg shadow-encre/10">
        <div className="bg-encre px-4 pb-2 pt-3 text-center text-white">
          <p className="text-[10px] font-bold tracking-tight">{t("receiptSchool")}</p>
          <p className="mt-0.5 text-[7.5px] text-white/70">{t("receiptSub")}</p>
          <Dashes light />
          <p className="font-mono text-[8.5px] uppercase tracking-widest text-emeraude">
            {t("receiptEyebrow")}
          </p>
          <p className="mt-0.5 font-mono text-[10px] font-bold">{t("receiptNumber")}</p>
        </div>

        <div className="px-4 py-2.5">
          <TicketRow k={t("rDate")} v={t("rDateVal")} />
          <TicketRow k={t("rTime")} v={t("rTimeVal")} />
          <TicketRow k={t("rCashier")} v={t("rCashierVal")} />
          <Dashes />
          <TicketRow k={t("rStudent")} v={t("rStudentVal")} />
          <TicketRow k={t("rMatricule")} v={t("rMatriculeVal")} />
          <TicketRow k={t("rClass")} v={t("rClassVal")} />
          <Dashes />
          <div className="flex items-center justify-between rounded-md bg-emeraude/10 px-2 py-1.5">
            <span className="font-mono text-[8.5px] font-bold uppercase text-emeraude">
              {t("rMode")}
            </span>
          </div>
          <Dashes />
          <div className="flex items-center justify-between rounded-md bg-emeraude/10 px-2 py-1.5">
            <span className="font-mono text-[8.5px] font-bold uppercase text-emeraude">
              {t("rTotal")}
            </span>
            <span className="mono-data text-[11px] font-bold text-emeraude">
              {t("rTotalVal")}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 pb-1">
            <FakeQr />
            <p className="font-mono text-[8px] leading-relaxed text-ardoise/80">
              {t("qrText")} · {t("verifyUrl")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodBadge({
  icon: Icon,
  label,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  tone: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[7.5px] font-bold ${tone}`}>
      <Icon className="h-2.5 w-2.5" />
      {label}
    </span>
  );
}

function PaymentsMock() {
  const t = useTranslations("featuresSchool.mockPayments");

  const rows = [
    {
      ref: t("tx1Ref"),
      badge: <MethodBadge icon={Waves} label={t("tx1Method")} tone="bg-cyan-100 text-cyan-700" />,
      name: t("student1"),
      meta: t("student1Meta"),
      amount: t("tx1Amount"),
      receipt: t("tx1Receipt"),
    },
    {
      ref: t("tx2Ref"),
      badge: <MethodBadge icon={Smartphone} label={t("tx2Method")} tone="bg-orange-100 text-orange-700" />,
      name: t("student2"),
      meta: t("student2Meta"),
      amount: t("tx2Amount"),
      receipt: t("tx2Receipt"),
    },
    {
      ref: t("tx3Ref"),
      badge: <MethodBadge icon={Phone} label={t("tx3Method")} tone="bg-amber-100 text-amber-700" />,
      name: t("student3"),
      meta: t("student3Meta"),
      amount: t("tx3Amount"),
      receipt: t("tx3Receipt"),
    },
  ];

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="rounded-xl bg-encre px-3.5 py-3 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[8px] font-medium uppercase tracking-widest text-white/50">
              {t("eyebrow")}
            </p>
            <p className="mt-0.5 font-mono text-xl font-bold tracking-tight">{t("heroCount")}</p>
            <p className="text-[8px] text-white/60">{t("heroSub")}</p>
          </div>
          <div className="flex gap-4 text-center text-[8px]">
            <div>
              <p className="text-[9px] font-bold text-emeraude">{t("bandCollected")}</p>
              <p className="mt-0.5 text-white/60">{t("bandReceipts")}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-white/80">{t("bandRefunded")}</p>
              <p className="mt-0.5 text-white/60">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-1.5 rounded-lg border border-fil bg-white px-2.5 py-2">
        <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emeraude" />
        <p className="text-[8.5px] leading-relaxed text-ardoise">
          {t("note1")} <span className="font-semibold text-encre">{t("note2")}</span>, {t("note3")}
        </p>
      </div>

      <div className="flex w-fit gap-0.5 rounded-lg bg-craie p-0.5 ring-1 ring-inset ring-fil">
        <span className="rounded-md bg-white px-2 py-0.5 text-[8px] font-semibold text-encre shadow-sm">
          {t("filterAll")}
        </span>
        <span className="rounded-md px-2 py-0.5 text-[8px] font-semibold text-ardoise/70">
          {t("statusSettled")}
        </span>
        <span className="rounded-md px-2 py-0.5 text-[8px] font-semibold text-ardoise/70">
          {t("statusRefunded")}
        </span>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-fil bg-white">
        <div className="grid grid-cols-[1.35fr_1.1fr_0.8fr_0.9fr_0.7fr] items-center gap-2 border-b border-fil px-3 py-2 text-[7px] font-semibold uppercase tracking-wide text-ardoise/70">
          <span>{t("thTx")}</span>
          <span>{t("thStudent")}</span>
          <span className="text-right">{t("thAmount")}</span>
          <span>{t("thReceipt")}</span>
          <span>{t("thStatus")}</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.ref}
            className="grid grid-cols-[1.35fr_1.1fr_0.8fr_0.9fr_0.7fr] items-center gap-2 border-b border-fil px-3 py-2 last:border-0"
          >
            <div>
              {r.badge}
              <p className="mt-0.5 font-mono text-[8px] text-ardoise/70">{r.ref}</p>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[9.5px] font-semibold text-encre">{r.name}</p>
              <p className="truncate font-mono text-[7.5px] text-ardoise/70">{r.meta}</p>
            </div>
            <p className="text-right font-mono text-[9.5px] font-semibold text-encre">{r.amount}</p>
            <span className="inline-flex items-center gap-1 font-mono text-[8.5px] font-semibold text-encre">
              <ReceiptText className="h-2.5 w-2.5 text-emeraude" />
              {r.receipt}
            </span>
            <span className="inline-flex w-fit items-center gap-1 rounded bg-emeraude/10 px-1.5 py-0.5 text-[7.5px] font-bold uppercase text-emeraude">
              <CheckCircle2 className="h-2.5 w-2.5" />
              {t("statusSettled")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionMock() {
  const t = useTranslations("featuresSchool.mockReport");

  const rows = [
    { cls: t("row1Class"), total: t("row1Total"), collected: t("row1Collected"), rate: t("row1Rate"), late: t("row1Late"), width: 98, ok: true },
    { cls: t("row2Class"), total: t("row2Total"), collected: t("row2Collected"), rate: t("row2Rate"), late: t("row2Late"), width: 74, ok: false },
    { cls: t("row3Class"), total: t("row3Total"), collected: t("row3Collected"), rate: t("row3Rate"), late: t("row3Late"), width: 100, ok: true },
  ];

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="rounded-xl bg-encre px-3.5 py-3 text-white">
        <p className="text-[8px] font-medium uppercase tracking-widest text-white/50">
          {t("eyebrow")}
        </p>
        <p className="mt-1 text-[8.5px] text-white/60">{t("heroLabel")}</p>
        <p className="font-mono text-xl font-bold tracking-tight">{t("heroValue")}</p>
        <div className="mt-2 flex gap-5 text-[8px]">
          <div>
            <p className="text-[9px] font-bold text-emeraude">{t("bandRateValue")}</p>
            <p className="mt-0.5 text-white/50">{t("bandRateLabel")}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/80">{t("bandRemainingValue")}</p>
            <p className="mt-0.5 text-white/50">{t("bandRemainingLabel")}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/80">{t("bandUptodateValue")}</p>
            <p className="mt-0.5 text-white/50">{t("bandUptodateLabel")}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-fil bg-white">
        <p className="border-b border-fil px-3 py-2 text-[9.5px] font-bold text-encre">
          {t("tableTitle")}
        </p>
        <div className="grid grid-cols-[1fr_0.9fr_0.9fr_1.2fr_0.6fr] items-center gap-2 border-b border-fil px-3 py-1.5 text-[7px] font-semibold uppercase tracking-wide text-ardoise/70">
          <span>{t("thClass")}</span>
          <span className="text-right">{t("thTotal")}</span>
          <span className="text-right">{t("thCollected")}</span>
          <span>{t("thRate")}</span>
          <span className="text-right">{t("thLate")}</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.cls}
            className="grid grid-cols-[1fr_0.9fr_0.9fr_1.2fr_0.6fr] items-center gap-2 border-b border-fil px-3 py-2 last:border-0"
          >
            <p className="truncate text-[9.5px] font-semibold text-encre">{r.cls}</p>
            <p className="text-right font-mono text-[8.5px] text-ardoise">{r.total}</p>
            <p className="text-right font-mono text-[8.5px] font-semibold text-encre">{r.collected}</p>
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-12 overflow-hidden rounded-full bg-craie">
                <div
                  className={`h-full ${r.ok ? "bg-emeraude" : "bg-ambre"}`}
                  style={{ width: `${r.width}%` }}
                />
              </div>
              <span className={`text-[9px] font-bold ${r.ok ? "text-emeraude" : "text-ambre"}`}>
                {r.rate}
              </span>
            </div>
            <p className="text-right text-[9px] font-bold text-ambre">{r.late}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-fil bg-craie px-2.5 py-1.5">
        <span className="flex items-center gap-1.5 text-[8px] font-semibold text-ardoise">
          <Landmark className="h-2.5 w-2.5 text-emeraude" />
          {t("signature")}
        </span>
        <ShieldCheck className="h-3 w-3 text-emeraude" />
      </div>
    </div>
  );
}

function GroupMock() {
  const t = useTranslations("featuresSchool.mockGroup");

  const campuses = [
    { name: t("school2"), city: t("school2City"), amount: t("c2Amount"), rate: t("c2Rate"), ok: true },
    { name: t("school3"), city: t("school3City"), amount: t("c3Amount"), rate: t("c3Rate"), ok: false },
  ];

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-semibold text-ardoise/70">{t("switcherLabel")}</p>
        <span className="rounded-md bg-craie px-2 py-1 font-mono text-[8px] text-ardoise ring-1 ring-inset ring-fil">
          {t("filter")}
        </span>
      </div>

      <div className="rounded-xl border border-fil bg-white p-1.5 shadow-lg shadow-encre/[0.06]">
        <div className="flex items-center gap-2 rounded-lg bg-emeraude/10 px-2.5 py-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emeraude/20">
            <School className="h-3.5 w-3.5 text-emeraude" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[9.5px] font-bold text-encre">{t("school1")}</p>
            <p className="text-[7.5px] text-ardoise/70">
              {t("school1City")} · 2026-2027
            </p>
          </div>
          <Check className="h-3 w-3 shrink-0 text-emeraude" />
        </div>
        {campuses.map((c) => (
          <div key={c.name} className="mt-0.5 flex items-center gap-2 rounded-lg px-2.5 py-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-craie">
              <School className="h-3.5 w-3.5 text-ardoise/60" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9.5px] font-semibold text-ardoise">{c.name}</p>
              <p className="text-[7.5px] text-ardoise/70">{c.city}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-ardoise/40" />
          </div>
        ))}
      </div>

      <p className="text-[10px] font-bold text-encre">{t("title")}</p>

      <div className="grid flex-1 grid-cols-2 gap-2">
        <div className="rounded-xl border border-fil bg-white p-2.5">
          <p className="truncate text-[8.5px] font-semibold text-encre">{t("school1")}</p>
          <p className="mt-0.5 font-mono text-[11px] font-bold text-encre">{t("c1Amount")}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-craie">
              <div className="h-full bg-emeraude" style={{ width: "98%" }} />
            </div>
            <span className="text-[7.5px] font-bold text-ardoise/70">{t("c1Rate")} {t("recouv")}</span>
          </div>
        </div>
        <div className="rounded-xl border border-fil bg-white p-2.5">
          <p className="truncate text-[8.5px] font-semibold text-encre">{t("school2")}</p>
          <p className="mt-0.5 font-mono text-[11px] font-bold text-encre">{t("c2Amount")}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-craie">
              <div className="h-full bg-emeraude/80" style={{ width: "92%" }} />
            </div>
            <span className="text-[7.5px] font-bold text-ardoise/70">{t("c2Rate")} {t("recouv")}</span>
          </div>
        </div>
        <div className="rounded-xl border border-fil bg-white p-2.5">
          <p className="truncate text-[8.5px] font-semibold text-encre">{t("school3")}</p>
          <p className="mt-0.5 font-mono text-[11px] font-bold text-encre">{t("c3Amount")}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-craie">
              <div className="h-full bg-ambre" style={{ width: "85%" }} />
            </div>
            <span className="text-[7.5px] font-bold text-ardoise/70">{t("c3Rate")} {t("recouv")}</span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-encre p-2.5">
          <div className="absolute -bottom-3 -right-3 opacity-10">
            <ShieldCheck className="h-14 w-14" />
          </div>
          <div className="relative">
            <p className="text-[7.5px] font-bold uppercase tracking-wider text-emeraude">
              {t("totalLabel")}
            </p>
            <p className="mt-0.5 font-mono text-[13px] font-bold text-white">{t("totalAmount")}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="rounded bg-emeraude px-1 py-0.5 text-[7.5px] font-bold text-white">
                {t("totalRate")}
              </span>
              <span className="font-mono text-[7.5px] font-bold text-emeraude/80">
                {t("global")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}