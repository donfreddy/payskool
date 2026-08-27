"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { Label } from "@payskool/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@payskool/ui/components/ui/select";
import { MailPlus, Send } from "lucide-react";
import { useState } from "react";

import type { MemberRole } from "@/core/mocks/fake-data";
import type { InviteMemberDraft } from "@/features/members/api/members.mock";
import { ROLE_LABELS } from "@/features/members/lib/labels";

const ROLE_OPTIONS: MemberRole[] = ["SCHOOL_ADMIN", "CASHIER", "ACCOUNTANT"];

export function InviteMemberDialog({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (draft: InviteMemberDraft) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<MemberRole>("SCHOOL_ADMIN");

  const valid = name.trim().length > 0 && email.includes("@");

  const invite = () => {
    if (!valid) return;
    onInvite({ name, email, phone, role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-payskool-emerald/10">
            <MailPlus className="size-4 text-payskool-emerald" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Inviter un membre</h2>
            <p className="text-xs text-muted-foreground">Une invitation par e-mail sera envoyÃ©e Ã  l’adresse renseignÃ©e.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="inv-name" className="text-xs text-muted-foreground">Nom complet</Label>
            <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Aïcha Njoya" className="h-10 rounded-lg" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="inv-email" className="text-xs text-muted-foreground">Adresse e-mail</Label>
            <Input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom@ecole.cm" className="h-10 rounded-lg" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="inv-phone" className="text-xs text-muted-foreground">Téléphone (optionnel)</Label>
            <Input id="inv-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 …" className="h-10 rounded-lg" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="inv-role" className="text-xs text-muted-foreground">Rôle</Label>
            <Select value={role} onValueChange={(v: MemberRole) => setRole(v)}>
              <SelectTrigger id="inv-role" className="h-10 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>Annuler</Button>
          <Button variant="emerald" size="lg" className="flex-1" disabled={!valid} onClick={invite}>
            <Send className="size-4" /> Envoyer l’invitation
          </Button>
        </div>
      </div>
    </div>
  );
}