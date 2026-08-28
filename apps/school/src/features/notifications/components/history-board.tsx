"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@payskool/ui/components/ui/select";
import { cn } from "@payskool/ui/utils";
import { ChevronLeft, ChevronRight, MailOpen, Search, Send, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CURRENT_ACADEMIC_YEAR } from "@/core/mocks/academic-years-db";
import type { FakeNotification, NotificationStatus, RelanceChannel } from "@/core/mocks/fake-data";
import { listNotificationHistory } from "@/features/notifications/api/notifications.mock";
import { ChannelBadge } from "@/features/notifications/components/channel-badge";
import { StatusBadge } from "@/features/notifications/components/status-badge";
import { formatFullDate, formatTime } from "@/lib/format";

const PAGE_SIZE = 15;

export function HistoryBoard({ schoolId }: { schoolId: string }) {
  const [entries, setEntries] = useState<FakeNotification[] | null>(null);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<"all" | RelanceChannel>("all");
  const [status, setStatus] = useState<"all" | NotificationStatus>("all");
  const [page, setPage] = useState(0);

  useEffect(() => {
    listNotificationHistory(schoolId).then(setEntries);
  }, [schoolId]);

  const filtered = useMemo(() => {
    if (!entries) return [];
    const q = query.trim().toLowerCase();
    return entries.filter((n) => {
      if (channel !== "all" && n.channel !== channel) return false;
      if (status !== "all" && n.status !== status) return false;
      if (
        q &&
        !`${n.studentName} ${n.matricule} ${n.parentName} ${n.ruleName}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [entries, query, channel, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const slice = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const to = Math.min(filtered.length, (safePage + 1) * PAGE_SIZE);

  if (!entries) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement de l’historique…
      </div>
    );
  }

  const delivered = entries.filter((n) => n.status !== "FAILED").length;
  const read = entries.filter((n) => n.status === "READ" || n.status === "DELIVERED").length;
  const failed = entries.length - delivered;

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Historique des envois · {CURRENT_ACADEMIC_YEAR}
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight">{entries.length}</p>
              <p className="mt-1 text-xs text-white/60">messages envoyés aux parents</p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Délivrés" v={`${delivered}`} />
              <Band k="Lus" v={`${read}`} />
              <Band k="Échecs" v={`${failed}`} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MailOpen className="size-3.5 text-payskool-emerald" /> Accusés de lecture WhatsApp & SMS AQL
          </span>
          <span className="flex items-center gap-1.5">
            <Send className="size-3.5 text-payskool-orange" /> Les relances du tableau «&nbsp;Impayés&nbsp;» arrivent ici en direct
          </span>
          <span className="flex items-center gap-1.5">
            <XCircle className="size-3.5" /> Les échecs (numéro invalide) à corriger dans la fiche élève
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-sm font-semibold text-foreground">Envois de relance</h2>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Élève, matricule, parent, règle…"
                className="h-9 rounded-lg pl-9"
              />
            </div>
            <Select
              value={channel}
              onValueChange={(v: "all" | RelanceChannel) => {
                setChannel(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-9 w-full rounded-lg sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les canaux</SelectItem>
                <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="VOICE">Appel</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v: "all" | NotificationStatus) => {
                setStatus(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-9 w-full rounded-lg sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="SENT">Envoyé</SelectItem>
                <SelectItem value="DELIVERED">Délivré</SelectItem>
                <SelectItem value="READ">Lu</SelectItem>
                <SelectItem value="FAILED">Échec</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Élève</th>
                <th className="px-4 py-3 font-medium">Destinataire</th>
                <th className="px-4 py-3 font-medium">Règle</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Message</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((n) => (
                <tr key={n.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className="block text-xs font-medium text-foreground">
                      {formatFullDate(n.createdAt.slice(0, 10))}
                    </span>
                    <span className="block font-mono text-[11px] text-muted-foreground">
                      {formatTime(n.createdAt)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="flex items-center gap-2.5">
                      <span className="hidden size-7 shrink-0 items-center justify-center rounded-lg bg-secondary font-mono text-[9px] font-bold text-muted-foreground sm:flex">
                        {n.studentName
                          .split(" ")
                          .map((p) => p.charAt(0))
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <span>
                        <span className="block font-medium text-foreground">{n.studentName}</span>
                        <span className="block font-mono text-[11px] text-muted-foreground">
                          {n.matricule} · {n.classLevel}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="block text-foreground">{n.parentName}</span>
                    <span className="block font-mono text-[11px] text-muted-foreground">{n.parentPhone}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="block max-w-[160px] truncate text-xs text-muted-foreground" title={n.ruleName}>
                      {n.ruleName}
                    </span>
                    <span className="mt-1 block">
                      <ChannelBadge channel={n.channel} className="px-1.5 py-0.5 text-[10px]" />
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={n.status} className="px-1.5 py-0.5 text-[10px]" />
                  </td>
                  <td className="max-w-[340px] px-5 py-3">
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground" title={n.content}>
                      {n.content}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              Aucun envoi ne correspond à ces filtres.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <p>
            Envois <span className="font-mono font-semibold text-foreground">{from}–{to}</span> sur{" "}
            <span className="font-mono font-semibold text-foreground">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-8" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              <ChevronLeft className="size-4" /> Précédent
            </Button>
            <span className="px-1 font-mono text-[11px]">
              {safePage + 1} / {pageCount}
            </span>
            <Button variant="outline" size="sm" className="h-8" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>
              Suivant <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <p className={cn("flex items-center gap-1.5 text-[11px] text-muted-foreground")}>
        <span className="size-1.5 rounded-full bg-payskool-emerald" />
        Chaque «&nbsp;Relancer&nbsp;» depuis le tableau des impayés ajoute une entrée ici, associée à la règle la plus proche activée.
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