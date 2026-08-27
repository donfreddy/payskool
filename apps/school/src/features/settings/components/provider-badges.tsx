import { cn } from "@payskool/ui/utils";

import type { PaymentEnvironment, PaymentProviderId } from "@/core/mocks/payment-providers-db";

/** Tonalités de marque des fournisseurs (pas d'images : monogramme + couleur). */
const BRANDS: Record<PaymentProviderId, { tile: string; mono: string; badge: string }> = {
  wave: { tile: "bg-emerald-400", mono: "text-emerald-950", badge: "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300" },
  flutterwave: { tile: "bg-violet-500", mono: "text-white", badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
  paystack: { tile: "bg-indigo-500", mono: "text-white", badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" },
  payunit: { tile: "bg-teal-500", mono: "text-white", badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300" },
  campay: { tile: "bg-slate-800", mono: "text-white", badge: "bg-slate-800/10 text-slate-700 dark:text-slate-300" },
  marviance: { tile: "bg-orange-600", mono: "text-white", badge: "bg-orange-600/15 text-orange-700 dark:text-orange-300" },
};

const MONOGRAMS: Record<PaymentProviderId, string> = {
  wave: "WV",
  flutterwave: "FW",
  paystack: "PS",
  payunit: "PU",
  campay: "CP",
  marviance: "MV",
};

export function ProviderLogo({
  providerId,
  className,
}: {
  providerId: PaymentProviderId;
  className?: string;
}) {
  const brand = BRANDS[providerId];
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl text-[10px] font-black tracking-tight",
        brand.tile,
        brand.mono,
        className,
      )}
      aria-hidden="true"
    >
      {MONOGRAMS[providerId]}
    </span>
  );
}

export function EnvironmentBadge({
  environment,
  className,
}: {
  environment: PaymentEnvironment;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
        environment === "test"
          ? "bg-sky-500/10 text-sky-700 dark:text-sky-400"
          : "bg-payskool-emerald/10 text-payskool-emerald",
        className,
      )}
    >
      <span
        className={cn(
          "mr-1.5 size-1.5 rounded-full",
          environment === "test" ? "bg-sky-500" : "bg-payskool-emerald",
        )}
      />
      {environment === "test" ? "Test" : "Live"}
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