import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Browser frame around a screen of the school app. The screens inside are
 * drawn in HTML from the real app's layout, with fictional data.
 */
export function AppFrame({
  path,
  label,
  children,
}: {
  path: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <figure
      aria-label={label}
      className="overflow-hidden rounded-2xl border border-fil bg-white shadow-xl shadow-encre/[0.06]"
    >
      <div className="flex items-center justify-between border-b border-fil bg-craie px-4 py-2">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-ardoise/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-ardoise/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-ardoise/20" />
        </div>
        <span className="flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-mono text-[10px] text-ardoise ring-1 ring-fil ring-inset">
          <ShieldCheck className="h-3 w-3 text-emeraude" aria-hidden="true" />
          payskool{path}
        </span>
      </div>
      {/* Decorative replica: the figure's label carries the meaning. */}
      <div className="p-4 sm:p-5" aria-hidden="true">
        {children}
      </div>
    </figure>
  );
}

/**
 * A QR-like pattern. Deterministic so server and client render the same
 * markup; it is decorative and encodes nothing.
 */
export function QrPattern({ className = "" }: { className?: string }) {
  const size = 21;
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    for (const [ox, oy] of [
      [0, 0],
      [size - 7, 0],
      [0, size - 7],
    ] as const) {
      if (inBox(ox, oy)) {
        const dx = x - ox;
        const dy = y - oy;
        const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return ring || core ? 1 : 0;
      }
    }
    return -1;
  };
  const cells: [number, number][] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const f = finder(x, y);
      const on = f === -1 ? (x * 7 + y * 13 + x * y) % 5 < 2 : f === 1;
      if (on) cells.push([x, y]);
    }
  }
  return (
    <svg
      viewBox={`-1 -1 ${size + 2} ${size + 2}`}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      <rect x="-1" y="-1" width={size + 2} height={size + 2} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0C1220" />
      ))}
    </svg>
  );
}
