import { ShieldCheck } from "lucide-react";

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <ShieldCheck className="h-6 w-6 text-emeraude" aria-hidden="true" />
      <span className="text-[17px] font-extrabold tracking-tight text-encre">
        PAYS<span className="text-emerald-700">KOOL</span>
      </span>
    </span>
  );
}
