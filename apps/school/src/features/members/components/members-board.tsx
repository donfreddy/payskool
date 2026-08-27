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
import { MailPlus, RefreshCcw, Search, ShieldCheck, Trash2, UserPlus, UserX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { FakeMember, MemberRole, MemberStatus } from "@/core/mocks/fake-data";
import {
  inviteMember,
  listMembers,
  revokeMember,
  saveMember,
  type InviteMemberDraft,
} from "@/features/members/api/members.mock";
import { MemberStatusBadge, RoleBadge } from "@/features/members/components/badges";
import { InviteMemberDialog } from "@/features/members/components/invite-member-dialog";
import { lastActiveLabel, ROLE_LABELS } from "@/features/members/lib/labels";
import { initials } from "@/lib/format";

export function MembersBoard({ schoolId }: { schoolId: string }) {
  const [members, setMembers] = useState<FakeMember[] | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | MemberRole>("all");
  const [status, setStatus] = useState<"all" | MemberStatus>("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);

  useEffect(() => {
    listMembers(schoolId).then(setMembers);
  }, [schoolId]);

  const filtered = useMemo(() => {
    if (!members) return [];
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (role !== "all" && m.role !== role) return false;
      if (status !== "all" && m.status !== status) return false;
      if (q && !`${m.name} ${m.email} ${m.phone}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [members, query, role, status]);

  if (!members) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement de l’équipeâ¦
      </div>
    );
  }

  const counts = {
    total: members.length,
    active: members.filter((m) => m.status === "ACTIVE").length,
    invited: members.filter((m) => m.status === "INVITED").length,
    suspended: members.filter((m) => m.status === "SUSPENDED").length,
  };

  const handleSave = (memberId: string, patch: Partial<FakeMember>) => {
    saveMember(schoolId, memberId, patch).then((updated) => {
      if (!updated) return;
      setMembers((prev) => prev?.map((m) => (m.id === memberId ? updated : m)) ?? prev);
    });
  };

  const handleRevoke = (memberId: string) => {
    revokeMember(schoolId, memberId).then(() => {
      setMembers((prev) => prev?.filter((m) => m.id !== memberId) ?? prev);
    });
  };

  const handleInvite = (draft: InviteMemberDraft) => {
    inviteMember(schoolId, draft).then((created) => {
      setInviteOpen(false);
      setMembers((prev) => [created, ...(prev ?? [])]);
      setInvitedEmail(created.email);
      setTimeout(() => setInvitedEmail(null), 2600);
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Membres & équipe · CS Sainte-Marie
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight">{counts.total}</p>
              <p className="mt-1 text-xs text-white/60">collaborateurs avec un accÃ¨s Ã  l’application</p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Actifs" v={String(counts.active)} />
              <Band k="Invitations" v={String(counts.invited)} />
              <Band k="Suspendus" v={String(counts.suspended)} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-payskool-emerald" /> Les rÃ´les contrÃ´lent l’accÃ¨s au menu (caisse, finances, import)
          </span>
          <span className="flex items-center gap-1.5">
            <UserPlus className="size-3.5" /> Un seul propriétaire : l’école dispose d’un administrateur principal
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-sm font-semibold text-foreground">Équipe</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom, e-mail, téléphone…"
                className="h-9 rounded-lg pl-9"
              />
            </div>
            <Select value={role} onValueChange={(v: "all" | MemberRole) => setRole(v)}>
              <SelectTrigger className="h-9 w-full rounded-lg sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {(Object.keys(ROLE_LABELS) as MemberRole[]).map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v: "all" | MemberStatus) => setStatus(v)}>
              <SelectTrigger className="h-9 w-full rounded-lg sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actifs</SelectItem>
                <SelectItem value="INVITED">Invitations</SelectItem>
                <SelectItem value="SUSPENDED">Suspendus</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="emerald" className="h-9" onClick={() => setInviteOpen(true)}>
              <MailPlus className="size-4" /> Inviter
            </Button>
          </div>
        </div>

        {invitedEmail && (
          <p className="flex items-center gap-1.5 border-b border-border bg-payskool-emerald/10 px-5 py-2.5 text-xs font-medium text-payskool-emerald">
            <MailPlus className="size-3.5" /> Invitation envoyée à {invitedEmail} — le membre apparaît en attente.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Membre</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Dernière activité</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary font-mono text-[10px] font-bold text-muted-foreground">
                        {initials(m.name.split(" ")[0] ?? "", m.name.split(" ")[1] ?? "")}
                      </span>
                      <span>
                        <span className="block font-medium text-foreground">{m.name}</span>
                        <span className="block font-mono text-[11px] text-muted-foreground">{m.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <RoleBadge role={m.role} className="px-1.5 py-0.5 text-[10px]" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <MemberStatusBadge status={m.status} className="px-1.5 py-0.5 text-[10px]" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                    {lastActiveLabel(m.lastActiveAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {m.phone}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    {m.role === "OWNER" ? (
                      <span className="text-[11px] font-medium text-muted-foreground">Propriétaire</span>
                    ) : m.status === "ACTIVE" ? (
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => handleSave(m.id, { status: "SUSPENDED" })}>
                        <UserX className="size-3.5" /> Suspendre
                      </Button>
                    ) : m.status === "SUSPENDED" ? (
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => handleSave(m.id, { status: "ACTIVE" })}>
                        <RefreshCcw className="size-3.5" /> Réactiver
                      </Button>
                    ) : (
                      <span className="inline-flex gap-1.5">
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => handleSave(m.id, { status: "ACTIVE" })}>
                          <RefreshCcw className="size-3.5" /> Relancer
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground" onClick={() => handleRevoke(m.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              Aucun membre ne correspond à ces filtres.
            </p>
          )}
        </div>
      </section>

      {inviteOpen && (
        <InviteMemberDialog
          onClose={() => setInviteOpen(false)}
          onInvite={handleInvite}
        />
      )}
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