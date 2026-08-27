"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import {
  Bell,
  Check,
  ChevronDown,
  CircleCheckBig,
  Clock,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircle,
  Plus,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import type {
  FakeSupportTicket,
  TicketCategory,
  TicketStatus,
} from "@/core/mocks/support-db";
import {
  SUPPORT_EMAIL,
  SUPPORT_FAQ,
  SUPPORT_PER_PLAN,
  SUPPORT_WHATSAPP,
} from "@/core/mocks/support-db";
import { getSubscription } from "@/features/settings/api/platform-billing.mock";
import { addSupportTicket, listSupportTickets } from "@/features/settings/api/support.mock";
import { formatShortDate } from "@/lib/format";


const STATUS_TONES: Record<TicketStatus, string> = {
  OPEN: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ANSWERED: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  RESOLVED: "bg-payskool-emerald/10 text-payskool-emerald",
};

const STATUS_DOTS: Record<TicketStatus, string> = {
  OPEN: "bg-amber-500",
  ANSWERED: "bg-sky-500",
  RESOLVED: "bg-payskool-emerald",
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Ouvert",
  ANSWERED: "En cours",
  RESOLVED: "Résolu",
};

const TICKET_CATEGORIES: TicketCategory[] = [
  "Paiement",
  "Facturation",
  "Compte & accès",
  "Configuration",
  "Autre",
];

function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", STATUS_TONES[status])}>
      <span className={cn("mr-1.5 size-1.5 rounded-full", STATUS_DOTS[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function SupportBoard({ schoolId }: { schoolId: string }) {
  const [tickets, setTickets] = useState<FakeSupportTicket[]>([]);
  const [subscription, setSubscription] = useState<Awaited<ReturnType<typeof getSubscription>> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    listSupportTickets(schoolId).then(setTickets);
    getSubscription(schoolId).then(setSubscription);
  }, [schoolId]);

  const planChannel = subscription ? SUPPORT_PER_PLAN[subscription.planId] : undefined;
  const openCount = tickets.filter((t) => t.status === "OPEN" || t.status === "ANSWERED").length;

  const handleTicketCreated = (ticket: FakeSupportTicket) => setTickets((prev) => [ticket, ...prev]);

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">Centre d’aide · Aide &amp; Support</p>
              <h2 className="font-display text-2xl font-bold tracking-tight">Comment pouvons-nous vous aider ?</h2>
              <p className="mt-1 text-xs text-white/70">FAQ, canaux de contact et suivi de vos demandes.</p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Disponibilité" v="99,9 %" icon={<CircleCheckBig className="size-3.5 text-white/40" />} />
              <Band k="Temps de réponse" v={planChannel ? "≤ 2 h" : "48 h"} icon={<Clock className="size-3.5 text-white/40" />} />
              <Band k="Tickets en cours" v={String(openCount)} icon={<TicketCheck className="size-3.5 text-white/40" />} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <LifeBuoy className="size-3.5 text-payskool-emerald" /> Tous les systèmes sont opérationnels.
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-payskool-orange" /> Aucune commission : les fonds vont directement sur le compte de l’école.
          </span>
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <HelpCircle className="size-4 text-payskool-navy" /> Questions fréquentes
          </h2>
          <div className="mt-3 divide-y divide-border rounded-lg border border-border">
            {SUPPORT_FAQ.map((item) => (
              <details key={item.q} className="group px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground">
                  {item.q}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground">
            Toujours bloqué&nbsp;? Consultez ce centre d’aide (démo) ou
            contactez-nous via votre canal prioritaire ci-contre.
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="size-4 text-payskool-navy" /> Votre canal prioritaire
            </h2>
            <div className="mt-3 rounded-lg border border-border bg-payskool-emerald/5 p-3">
              <p className="text-sm font-semibold text-foreground">{planChannel?.title ?? "Support par email"}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {planChannel?.detail ?? "Réponse sous 48 h ouvrées."}
              </p>
              {subscription !== null && (
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Inclus dans votre abonnement <span className="font-semibold text-foreground">{subscription.planId}</span>.
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2.5">
              <a
                href={SUPPORT_WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-payskool-emerald/50"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-payskool-emerald/10">
                  <MessageCircle className="size-4 text-payskool-emerald" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">WhatsApp</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">+237 671 12 34 01</span>
                </span>
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-payskool-emerald/50"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-payskool-emerald/10">
                  <Mail className="size-4 text-payskool-emerald" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">Email</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">{SUPPORT_EMAIL}</span>
                </span>
              </a>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">À savoir</h2>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Payskool vise un taux de disponibilité de 99,9 %, sous réserve des opérations de maintenance planifiées.
              Vos données sont hébergées en toute sécurité ; l’argent, lui, ne transite jamais par nos serveurs.
            </p>
          </section>
        </aside>
      </div>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Vos tickets</h2>
            <p className="text-[11px] text-muted-foreground">
              {tickets.length} demande(s) · {openCount} en cours de traitement.
            </p>
          </div>
          <Button variant="emerald" className="h-9 gap-1.5" onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" /> Nouveau ticket
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Sujet</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 text-right font-medium">Dernière mise à jour</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-xs text-muted-foreground">
                    Aucun ticket pour le moment — créez votre première demande.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-muted-foreground">{t.reference}</td>
                    <td className="max-w-[280px] px-4 py-3 text-xs font-medium text-foreground">{t.subject}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{t.category}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <TicketStatusBadge status={t.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right text-xs text-muted-foreground">
                      {formatShortDate(t.updatedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
          Centre d’aide simulé pour la démo — les canaux listés sont indicatifs.
        </p>
      </section>

      {dialogOpen && (
        <NewTicketDialog
          onCreated={handleTicketCreated}
          onCreate={async (input) => addSupportTicket(schoolId, input)}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}

interface NewTicketDialogProps {
  onCreate: (input: { subject: string; category: TicketCategory }) => Promise<FakeSupportTicket>;
  onCreated: (ticket: FakeSupportTicket) => void;
  onClose: () => void;
}

function NewTicketDialog({ onCreate, onCreated, onClose }: NewTicketDialogProps) {
  const [category, setCategory] = useState<TicketCategory>("Autre");
  const [subject, setSubject] = useState("");
  const [created, setCreated] = useState<FakeSupportTicket | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!subject.trim()) return;
    setSaving(true);
    const ticket = await onCreate({ subject: subject.trim(), category });
    setCreated(ticket);
    onCreated(ticket);
    setSaving(false);
  };

  if (created) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 text-center shadow-xl">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-payskool-emerald/10">
            <Check className="size-7 text-payskool-emerald" />
          </span>
          <h3 className="mt-3 font-display text-lg font-bold text-foreground">Ticket envoyé</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            Votre demande <span className="font-mono font-semibold text-foreground">{created.reference}</span> a bien été
            enregistrée. L’équipe Payskool vous répondra sur votre canal prioritaire.
          </p>
          <Button variant="emerald" size="lg" className="mt-5" onClick={onClose}>
            <Check className="size-4" /> Terminer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-payskool-emerald/10">
            <TicketCheck className="size-4 text-payskool-emerald" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Nouveau ticket</h2>
            <p className="text-xs text-muted-foreground">Décrivez votre problème, un expert vous répond.</p>
          </div>
        </div>

        <label className="block text-xs font-semibold text-foreground">Catégorie</label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TICKET_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
                category === c
                  ? "border-payskool-emerald bg-payskool-emerald/5 text-payskool-emerald ring-1 ring-payskool-emerald"
                  : "border-border text-muted-foreground hover:border-payskool-emerald/50",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <label htmlFor="ticket-subject" className="mt-4 block text-xs font-semibold text-foreground">
          Votre demande
        </label>
        <textarea
          id="ticket-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          rows={4}
          placeholder="Ex. : un parent n’a pas reçu son reçu par WhatsApp…"
          className="mt-2 w-full resize-none rounded-lg border border-border bg-muted/20 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-payskool-emerald"
        />

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" className="gap-1" onClick={onClose}>
            Annuler
          </Button>
          <div className="flex-1" />
          <Button variant="emerald" className="gap-1.5" disabled={!subject.trim() || saving} onClick={submit}>
            {saving ? "Envoi…" : (<><MessageCircle className="size-4" /> Envoyer le ticket</>)}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Band({ k, v, icon }: { k: string; v: string; icon?: ReactNode }) {
  return (
    <div>
      <p className="flex items-center justify-center gap-1.5 font-mono text-xl font-bold text-white">
        {icon}
        {v}
      </p>
      <p className="mt-0.5 text-center text-[10px] uppercase tracking-wide text-white/50">{k}</p>
    </div>
  );
}