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
import {
  Check,
  KeyRound,
  Laptop,
  Lock,
  Save,
  ShieldCheck,
  ShieldOff,
  Smartphone,
  UserCog,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { FakeUserProfile, FakeUserSession, PreferredLanguage } from "@/core/mocks/profile-db";
import { RoleBadge } from "@/features/members/components/badges";
import { lastActiveLabel } from "@/features/members/lib/labels";
import {
  getProfile,
  listSessions,
  revokeSessionById,
  saveProfile,
} from "@/features/settings/api/profile.mock";
import { formatShortDate, initials } from "@/lib/format";

export function ProfileBoard({ schoolId }: { schoolId: string }) {
  const [profile, setProfile] = useState<FakeUserProfile | null>(null);
  const [sessions, setSessions] = useState<FakeUserSession[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [savedInfo, setSavedInfo] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwOk, setPwOk] = useState<boolean | null>(null);

  useEffect(() => {
    getProfile(schoolId).then((p) => {
      setProfile(p);
      setName(p.name);
      setEmail(p.email);
      setPhone(p.phone);
    });
    listSessions(schoolId).then(setSessions);
  }, [schoolId]);

  if (!profile) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement du profil…
      </div>
    );
  }

  const saveInfo = () => {
    const patch = { name: name.trim(), email: email.trim(), phone: phone.trim() };
    saveProfile(schoolId, patch).then((updated) => {
      if (updated) setProfile(updated);
      setSavedInfo(true);
      setTimeout(() => setSavedInfo(false), 1400);
    });
  };

  const changePassword = () => {
    const ok = pw.current.length > 0 && pw.next.length >= 8 && pw.next === pw.confirm;
    setPwOk(ok);
    if (ok) {
      setPw({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwOk(null), 2400);
    }
  };

  const toggle2FA = () =>
    saveProfile(schoolId, { twoFactorEnabled: !profile.twoFactorEnabled }).then((u) => {
      if (u) setProfile(u);
    });

  const revoke = (sessionId: string) =>
    revokeSessionById(schoolId, sessionId).then(() =>
      setSessions((prev) => prev.filter((s) => s.id !== sessionId)),
    );

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 font-mono text-lg font-bold">
              {initials(profile.name.split(" ")[0] ?? "", profile.name.split(" ")[1] ?? "")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Profil de l’utilisateur connecté
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight">{profile.name}</h2>
              <p className="mt-1 flex items-center gap-2 text-xs text-white/70">
                <RoleBadge role={profile.role} className="px-1.5 py-0.5 text-[10px]" />
                {profile.email} · membre depuis {formatShortDate(profile.joinedAt)}
              </p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xl font-bold text-white">Pro</p>
              <p className="text-[10px] uppercase tracking-wide text-white/50">Plan Payskool</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-5">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserCog className="size-4 text-payskool-navy" /> Informations personnelles
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="pf-name" className="text-xs text-muted-foreground">Nom complet</Label>
                <Input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-lg" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pf-role" className="text-xs text-muted-foreground">Fonction</Label>
                <div className="flex h-10 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
                  {profile.role === "OWNER" ? "Fondateur" : "Administration"}
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pf-email" className="text-xs text-muted-foreground">Adresse e-mail</Label>
                <Input id="pf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-lg" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pf-phone" className="text-xs text-muted-foreground">Téléphone</Label>
                <Input id="pf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10 rounded-lg" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button variant="emerald" onClick={saveInfo}>
                <Save className="size-4" /> Enregistrer
              </Button>
              {savedInfo && (
                <span className="flex items-center gap-1 text-xs font-medium text-payskool-emerald">
                  <Check className="size-3.5" /> Profil mis à jour
                </span>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Lock className="size-4 text-payskool-navy" /> Sécurité
            </h2>

            <div className="mt-4 flex items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-sm font-medium text-foreground">Double authentification</p>
                <p className="text-xs text-muted-foreground">
                  Code à 6 chiffres envoyé par SMS à chaque connexion.
                </p>
              </div>
              <Button
                variant={profile.twoFactorEnabled ? "emerald" : "outline"}
                size="sm"
                className="h-9 w-24 gap-1.5 text-xs"
                onClick={toggle2FA}
              >
                {profile.twoFactorEnabled ? <ShieldCheck className="size-4" /> : <ShieldOff className="size-4" />}
                {profile.twoFactorEnabled ? "Actif" : "Inactif"}
              </Button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="pw-current" className="text-xs text-muted-foreground">Mot de passe actuel</Label>
                <Input id="pw-current" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className="h-10 rounded-lg" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pw-next" className="text-xs text-muted-foreground">Nouveau mot de passe</Label>
                <Input id="pw-next" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="h-10 rounded-lg" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pw-confirm" className="text-xs text-muted-foreground">Confirmation</Label>
                <Input id="pw-confirm" type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="h-10 rounded-lg" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Button variant="outline" className="gap-1.5" onClick={changePassword}>
                <KeyRound className="size-4" /> Mettre à jour
              </Button>
              {pwOk === true && (
                <span className="flex items-center gap-1 text-xs font-medium text-payskool-emerald">
                  <Check className="size-3.5" /> Mot de passe mis à jour
                </span>
              )}
              {pwOk === false && (
                <span className="flex items-center gap-1 text-xs font-medium text-payskool-orange">
                  <X className="size-3.5" /> 8 caractères minimum et confirmation identique
                </span>
              )}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-5">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Préférences</h2>
            <div className="mt-4 grid gap-1.5">
              <Label htmlFor="pf-lang" className="text-xs text-muted-foreground">Langue de l’interface</Label>
              <Select
                value={profile.language}
                onValueChange={(v: PreferredLanguage) =>
                  saveProfile(schoolId, { language: v }).then((u) => u && setProfile(u))
                }
              >
                <SelectTrigger id="pf-lang" className="h-10 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Devise d’affichage</Label>
              <div className="flex h-10 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
                Franc CFA (XAF)
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Dernière connexion : {lastActiveLabel(profile.lastActiveAt)}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Sessions actives</h2>
            <ul className="mt-3 space-y-2">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <span className="flex min-w-0 items-start gap-2">
                    <span className="mt-0.5">
                      {s.device.includes("iPhone") || s.device.includes("Android") ? (
                        <Smartphone className="size-4 text-muted-foreground" />
                      ) : (
                        <Laptop className="size-4 text-muted-foreground" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-xs font-medium text-foreground">{s.device}</span>
                        {s.current && (
                          <span className="rounded bg-payskool-emerald/10 px-1.5 py-0.5 text-[9px] font-bold text-payskool-emerald">
                            ACTUELLE
                          </span>
                        )}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {s.location} · {s.ip}
                      </span>
                    </span>
                  </span>
                  {!s.current && (
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px] text-muted-foreground" onClick={() => revoke(s.id)}>
                      <X className="size-3.5" /> Révoquer
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}