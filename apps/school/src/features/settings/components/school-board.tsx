"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { Label } from "@payskool/ui/components/ui/label";
import { CalendarRange, Check, Landmark, Save, School as SchoolIcon, Users } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import type { FakeSchoolProfile } from "@/core/mocks/school-db";
import { listStudentsForFees } from "@/features/fees/api/fees.mock";
import { listReceipts } from "@/features/receipts/api/receipts.mock";
import { getSchool, saveSchool } from "@/features/settings/api/school.mock";
import { formatCFA } from "@/lib/format";

export function SchoolBoard({ schoolId }: { schoolId: string }) {
  const [school, setSchool] = useState<FakeSchoolProfile | null>(null);
  const [enrolled, setEnrolled] = useState(0);
  const [collected, setCollected] = useState(0);
  const [receiptCount, setReceiptCount] = useState(0);
  const [form, setForm] = useState<FakeSchoolProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSchool(schoolId).then((s) => {
      if (s) {
        setSchool(s);
        setForm(s);
      }
    });
    listStudentsForFees(schoolId).then((students) => setEnrolled(students.length));
    listReceipts(schoolId).then((receipts) => {
      setCollected(receipts.reduce((sum, r) => sum + r.amount, 0));
      setReceiptCount(receipts.length);
    });
  }, [schoolId]);

  if (!school || !form) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement de l’école…
      </div>
    );
  }

  const update = (key: keyof FakeSchoolProfile, value: string) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const save = () => {
    saveSchool(schoolId, form).then((updated) => {
      if (updated) setSchool(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1400);
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-3xl" aria-hidden="true">
                {school.logo}
              </span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                  Établissement · {school.city}
                </p>
                <h2 className="font-display text-2xl font-bold tracking-tight">{school.name}</h2>
                <p className="mt-1 text-xs text-white/70">{school.type} · fondé en {school.foundedYear}</p>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Élèves inscrits" v={String(enrolled)} icon={<Users className="size-3.5 text-white/40" />} note="démo de 14" />
              <Band k="Grilles actives" v="8" icon={<Landmark className="size-3.5 text-white/40" />} />
              <Band k="Recettes encaissées" v={formatCFA(collected)} icon={<SchoolIcon className="size-3.5 text-white/40" />} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarRange className="size-3.5 text-payskool-orange" /> Année académique {school.academicYear}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-payskool-emerald" /> Paiement en ligne activé (Orange Money, MTN MoMo, Wave)
          </span>
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Save className="size-4 text-payskool-navy" /> Fiche de l’établissement
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="sc-name" className="text-xs text-muted-foreground">Nom de l’école</Label>
              <Input id="sc-name" value={form.name} onChange={(e) => update("name", e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sc-type" className="text-xs text-muted-foreground">Type d’établissement</Label>
              <Input id="sc-type" value={form.type} onChange={(e) => update("type", e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sc-city" className="text-xs text-muted-foreground">Ville</Label>
              <Input id="sc-city" value={form.city} onChange={(e) => update("city", e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sc-address" className="text-xs text-muted-foreground">Adresse</Label>
              <Input id="sc-address" value={form.address} onChange={(e) => update("address", e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sc-phone" className="text-xs text-muted-foreground">Téléphone</Label>
              <Input id="sc-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sc-email" className="text-xs text-muted-foreground">E-mail</Label>
              <Input id="sc-email" value={form.email} onChange={(e) => update("email", e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sc-web" className="text-xs text-muted-foreground">Site web</Label>
              <Input id="sc-web" value={form.website} onChange={(e) => update("website", e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sc-main" className="text-xs text-muted-foreground">Responsable / Proviseur</Label>
              <Input id="sc-main" value={form.principalName} onChange={(e) => update("principalName", e.target.value)} className="h-10 rounded-lg" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="emerald" onClick={save}>
              <Save className="size-4" /> Enregistrer
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-xs font-medium text-payskool-emerald">
                <Check className="size-3.5" /> Fiche mise à jour
              </span>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarRange className="size-4 text-payskool-orange" /> Année académique
            </h2>
            <p className="mt-3 font-mono text-2xl font-bold text-foreground">{school.academicYear}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              La démo simule le trimestre 2 (échéances du 15 au 25 novembre). Le changement d’année est bloqué tant
              qu’un encours de grille reste à solder.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Landmark className="size-4 text-payskool-navy" /> Montants clés
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Recettes encaissées</span>
                <span className="font-mono font-bold text-foreground">{formatCFA(collected)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Reçus émis</span>
                <span className="font-mono font-bold text-foreground">{receiptCount}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Élèves (démo)</span>
                <span className="font-mono font-bold text-foreground">{enrolled}</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Band({ k, v, icon, note }: { k: string; v: string; icon?: ReactNode; note?: string }) {
  return (
    <div>
      <p className="flex items-center justify-center gap-1.5 font-mono text-xl font-bold text-white">
        {icon}
        {v}
      </p>
      <p className="mt-0.5 text-center text-[10px] uppercase tracking-wide text-white/50">
        {k}
        {note ? ` · ${note}` : ""}
      </p>
    </div>
  );
}