/** Shared class lists, so every section keeps the same frame and buttons. */
export const frame = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const button =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

// emerald-700, not the brand emeraude: white text on #059669 is 3.8:1, below AA.
export const primaryButton = `${button} bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-700`;

export const secondaryButton = `${button} border border-encre/15 bg-white text-encre hover:border-encre/30 focus-visible:ring-encre`;

export const sectionTitle =
  "display-heading text-[2rem] leading-[1.08] text-encre sm:text-[2.6rem]";
