"use client";

import { Button } from "@payskool/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@payskool/ui/components/ui/select";
import { cn } from "@payskool/ui/utils";
import {
  CalendarClock,
  Check,
  Megaphone,
  Minus,
  Plus,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { FakeRelanceRule, RelanceChannel } from "@/core/mocks/fake-data";
import {
  listRelanceRules,
  saveRelanceRule,
} from "@/features/notifications/api/notifications.mock";
import { ChannelBadge, CHANNEL_LABELS } from "@/features/notifications/components/channel-badge";
import { renderTemplate, sampleValues, TEMPLATE_FIELDS } from "@/features/notifications/lib/templates";

const CHANNEL_OPTIONS: { value: RelanceChannel; label: string }[] = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "SMS", label: "SMS" },
  { value: "VOICE", label: "Appel vocal" },
];

const MAX_DELAY = 60;

export function RulesBoard({ schoolId }: { schoolId: string }) {
  const [rules, setRules] = useState<FakeRelanceRule[] | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    listRelanceRules(schoolId).then(setRules);
  }, [schoolId]);

  const update = (ruleId: string, patch: Partial<FakeRelanceRule>) => {
    setRules((prev) => prev?.map((r) => (r.id === ruleId ? { ...r, ...patch } : r)) ?? prev);
    saveRelanceRule(schoolId, ruleId, patch).then(() => {
      setSavedId(ruleId);
      setTimeout(() => setSavedId((id) => (id === ruleId ? null : id)), 1300);
    });
  };

  const stepDays = (rule: FakeRelanceRule, delta: number) => {
    const next = Math.max(1, Math.min(MAX_DELAY, rule.delayDays + delta));
    if (next !== rule.delayDays) update(rule.id, { delayDays: next });
  };

  if (!rules) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement des règles…
      </div>
    );
  }

  const active = rules.filter((r) => r.enabled).length;
  const channels = rules.filter((r) => r.enabled).map((r) => r.channel);

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Campagne de relance automatisée
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight">
                {active}/{rules.length}
              </p>
              <p className="mt-1 text-xs text-white/60">règles actives sur {rules.length}</p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Prochaine exécution" v="Lundi 09:00" />
              <Band k="Canaux actifs" v={channels.map((c) => CHANNEL_LABELS[c]).join(" + ")} />
              <Band k="Quota SMS" v="1 250 / 2 000" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5 text-payskool-orange" /> Déclenchement chaque matin sur les impayés
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> Modèle de message commun aux trois règles
          </span>
          <span className="flex items-center gap-1.5">
            <Megaphone className="size-3.5" /> L’appel enregistre un rappel dans l’historique d’envoi
          </span>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        {rules.map((rule) => (
          <article
            key={rule.id}
            className={cn(
              "rounded-xl border bg-card p-5 shadow-sm transition-opacity",
              rule.enabled ? "border-border" : "border-dashed opacity-80",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={cn("flex size-10 items-center justify-center rounded-lg", rule.enabled ? "bg-payskool-emerald/10" : "bg-secondary")}>
                  <SlidersHorizontal className={cn("size-5", rule.enabled ? "text-payskool-emerald" : "text-muted-foreground")} />
                </span>
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                    {rule.name}
                    <ChannelBadge channel={rule.channel} className="px-1.5 py-0.5 text-[10px]" />
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{rule.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {savedId === rule.id && rule.enabled && (
                  <span className="flex items-center gap-1 text-xs font-medium text-payskool-emerald">
                    <Check className="size-3.5" /> Enregistré
                  </span>
                )}
                <Button
                  variant={rule.enabled ? "emerald" : "outline"}
                  size="sm"
                  className="h-8 w-24 text-xs"
                  onClick={() => update(rule.id, { enabled: !rule.enabled })}
                >
                  {rule.enabled ? "Actif" : "Inactif"}
                </Button>
              </div>
            </div>

            <div className="mt-4 grid items-end gap-3 md:grid-cols-[1fr_1fr_1.2fr]">
              <div className="grid gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Canal d’envoi
                </span>
                <Select
                  value={rule.channel}
                  onValueChange={(v: RelanceChannel) => update(rule.id, { channel: v })}
                >
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Déclenchement
                </span>
                <div className="flex h-10 items-center justify-between rounded-lg border border-border bg-muted/40 px-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-7 p-0"
                    disabled={rule.delayDays <= 1}
                    onClick={() => stepDays(rule, -1)}
                    aria-label="Diminuer le délai"
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {rule.delayDays} j
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-7 p-0"
                    disabled={rule.delayDays >= MAX_DELAY}
                    onClick={() => stepDays(rule, 1)}
                    aria-label="Augmenter le délai"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">après l’échéance impayée</p>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <Sparkles className="size-3.5 text-payskool-orange" /> Aperçu
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground/70">
                    {sampleValues().source}
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-foreground">
                  {renderTemplate(rule.template, sampleValues().values)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {TEMPLATE_FIELDS.map((f) => (
                    <span key={f.key} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                      {f.key} = {f.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="flex items-start gap-2 rounded-xl border border-border bg-card px-5 py-4 text-xs text-muted-foreground shadow-sm">
        <Megaphone className="mt-0.5 size-4 shrink-0 text-payskool-orange" />
        La campagne s’exécute chaque lundi matin sur les impayés du jour : chaque relance adressée depuis le tableau
        «&nbsp;Impayés & relances&nbsp;» est archivée dans l’historique d’envoi.
      </p>
    </div>
  );
}

function Band({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-mono text-xl font-bold text-white">{v}</p>
      <p className="mt-0.5 text-center text-[10px] uppercase tracking-wide text-white/50">{k}</p>
    </div>
  );
}