"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function BottomCta() {
  const t = useTranslations("bottomCta");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && whatsapp.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="cta" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-encre px-8 py-16 sm:px-16 sm:py-20">
          {/* Receipt perforation ornament */}
          <div className="absolute top-0 left-8 right-8">
            <div
              className="h-[6px] w-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, oklch(0.72 0.13 258 / 0.15) 1px, transparent 1px)",
                backgroundSize: "7px 6px",
                backgroundRepeat: "repeat-x",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="display-heading text-3xl text-white sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-white/50">
              {t("subtitle")}
            </p>

            {submitted ? (
              <div className="mt-10 animate-fade-in rounded-2xl bg-emeraude/10 p-6 ring-1 ring-inset ring-emeraude/30">
                <p className="font-semibold text-emeraude">
                  {t("thanksPrefix")} {name}{t("thanksSuffix")}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  {t("thanksDetailPrefix")}{" "}
                  <span className="mono-data text-white">{whatsapp}</span>{" "}
                  {t("thanksDetailSuffix")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-3">
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("placeholderName")}
                    required
                    className="h-12 w-full rounded-xl bg-white/[0.08] px-4 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-inset ring-white/10 transition-all focus:bg-white/[0.12] focus:ring-emeraude/40 sm:w-52"
                  />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder={t("placeholderWhatsapp")}
                    required
                    className="h-12 w-full rounded-xl bg-white/[0.08] px-4 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-inset ring-white/10 transition-all focus:bg-white/[0.12] focus:ring-emeraude/40 sm:w-52"
                  />
                </div>
                <button
                  type="submit"
                  className="mx-auto flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emeraude px-8 text-sm font-semibold text-white transition-colors hover:bg-emeraude/90 sm:w-auto sm:min-w-52"
                >
                  {t("cta")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            <p className="mt-6 text-xs text-white/25">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
