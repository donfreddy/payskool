import { cn } from "@payskool/ui/utils";

import type { PaymentProviderKind } from "@/core/mocks/payment-providers-db";

/** Tonalité de la pastille pour chaque opérateur (pas d'images : monogramme + couleur de marque). */
const BRANDS: Record<PaymentProviderKind, { tile: string; mono: string; badge: string }> = {
  MTN_MOMO: { tile: "bg-yellow-300", mono: "text-slate-900", badge: "bg-yellow-300/15 text-yellow-700 dark:text-yellow-300" },
  ORANGE_MONEY: { tile: "bg-orange-500", mono: "text-white", badge: "bg-orange-500/15 text-orange-600 dark:text-orange-300" },
  WAVE: { tile: "bg-emerald-400", mono: "text-white", badge: "bg-emerald-400/15 text-emerald-600 dark:text-emerald-300" },
  CARD: { tile: "bg-payskool-navy", mono: "text-white", badge: "bg-payskool-navy/10 text-payskool-navy dark:text-slate-300" },
};

const MONOGRAMS: Record<PaymentProviderKind, string> = {
  MTN_MOMO: "MTN",
  ORANGE_MONEY: "OM",
  WAVE: "WV",
  CARD: "V/MC",
};

export function ProviderLogo({
  kind,
  shortName,
  className,
}: {
  kind: PaymentProviderKind;
  shortName: string;
  className?: string;
}) {
  const brand = BRANDS[kind];
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl text-[10px] font-black tracking-tight",
        brand.tile,
        brand.mono,
        className,
      )}
      title={shortName}
    >
      {MONOGRAMS[kind]}
    </span>
  );
}

export function ProviderKindBadge({
  kind,
  className,
}: {
  kind: PaymentProviderKind;
  className?: string;
}) {
  const brand = BRANDS[kind];
  const category = kind === "CARD" ? "Cartes bancaires" : "Mobile money";
  return (
    <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", brand.badge, className)}>
      {category}
    </span>
  );
}

export function ConnectionStatusBadge({
  status,
  className,
}: {
  status: "ACTIVE" | "PAUSED";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
        status === "ACTIVE"
          ? "bg-payskool-emerald/10 text-payskool-emerald"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        className,
      )}
    >
      <span
        className={cn(
          "mr-1.5 size-1.5 rounded-full",
          status === "ACTIVE" ? "bg-payskool-emerald" : "bg-amber-500",
        )}
      />
      {status === "ACTIVE" ? "Actif" : "En pause"}
    </span>
  );
}

export function PayoutStatusBadge({
  status,
  className,
}: {
  status: "PAID" | "SCHEDULED";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
        status === "PAID"
          ? "bg-payskool-emerald/10 text-payskool-emerald"
          : "bg-sky-500/10 text-sky-600 dark:text-sky-400",
        className,
      )}
    >
      <span
        className={cn(
          "mr-1.5 size-1.5 rounded-full",
          status === "PAID" ? "bg-payskool-emerald" : "bg-sky-500",
        )}
      />
      {status === "PAID" ? "Versé" : "Programmé"}
    </span>
  );
}