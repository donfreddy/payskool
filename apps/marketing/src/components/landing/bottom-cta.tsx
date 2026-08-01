"use client";

import { ArrowRight, Building2, Phone, User, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function BottomCta() {
  const t = useTranslations("bottomCta");
  const [form, setForm] = useState({
    name: "",
    city: "",
    students: "",
    whatsapp: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim() && form.whatsapp.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="cta" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-encre px-8 py-16 sm:px-16 sm:py-20">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emeraude/10 blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/[0.04] blur-[80px]" />
          </div>

          {/* Receipt perforation ornament */}
          <div className="absolute top-0 left-8 right-8">
            <div
              className="h-[6px] w-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, oklch(0.72 0.13 258 / 0.2) 1px, transparent 1px)",
                backgroundSize: "7px 6px",
                backgroundRepeat: "repeat-x",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
              {t("eyebrow")}
            </p>
            <h2 className="display-heading mt-4 text-3xl text-white sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-white/50">
              {t("subtitle")}
            </p>

            {submitted ? (
              <div className="mt-10 animate-fade-in rounded-2xl border border-emeraude/30 bg-emeraude/10 p-6 text-white">
                <p className="font-semibold text-emeraude">
                  {t("thanksPrefix")} {form.name}{t("thanksSuffix")}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  {t("thanksDetailPrefix")}{" "}
                  <span className="mono-data text-white">{form.whatsapp}</span>{" "}
                  {t("thanksDetailSuffix")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <User className="absolute left-4 top-4 h-4 w-4 text-white/30" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder={t("placeholderName")}
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-emeraude/50 focus:bg-white/[0.12]"
                    />
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-4 h-4 w-4 text-white/30" />
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder={t("placeholderCity")}
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-emeraude/50 focus:bg-white/[0.12]"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <Users className="absolute left-4 top-4 h-4 w-4 text-white/30" />
                    <input
                      type="number"
                      value={form.students}
                      onChange={(e) => handleChange("students", e.target.value)}
                      placeholder={t("placeholderStudents")}
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-emeraude/50 focus:bg-white/[0.12]"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 h-4 w-4 text-white/30" />
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder={t("placeholderWhatsapp")}
                      required
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-emeraude/50 focus:bg-white/[0.12]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="glow-btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emeraude px-8 text-base font-semibold text-white transition-colors hover:bg-emeraude/90 sm:w-auto sm:px-10"
                >
                  {t("cta")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            <p className="mt-6 text-xs text-white/30">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
