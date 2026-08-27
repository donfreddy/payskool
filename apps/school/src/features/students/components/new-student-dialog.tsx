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
import { UserPlus } from "lucide-react";
import { useState } from "react";

import type { FakeStudent } from "@/core/mocks/fake-data";

const CLASSES = ["CM2", "6ème A", "6ème B", "5ème A", "4ème C", "3ème B", "2nde A", "Terminale C"];

const DEFAULT_INSTALLMENTS = [
  { amount: 100000, label: "Tranche 1 — Inscription", dueDate: "2026-09-15" },
  { amount: 125000, label: "Tranche 2 — 1er Trimestre", dueDate: "2026-11-15" },
  { amount: 125000, label: "Tranche 3 — 2ème Trimestre", dueDate: "2027-02-15" },
];

export function NewStudentDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (student: FakeStudent) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"M" | "F">("M");
  const [classLevel, setClassLevel] = useState(CLASSES[1]!);
  const [parentPhone, setParentPhone] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = () => {
    const matricule = `STE-26-${String(1000 + Math.floor(Math.random() * 9000))}`;
    if (!firstName.trim() || !lastName.trim()) {
      setError("Le prénom et le nom sont obligatoires.");
      return;
    }
    const student: FakeStudent = {
      id: `std_new_${Date.now()}`,
      matricule,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      classLevel,
      academicYear: "2026-2027",
      status: "ENROLLED",
      previousBalance: 0,
      parentName: `${parentPhone ? "Parent de " : ""}${firstName.trim()} ${lastName.trim()}`,
      parentPhone: parentPhone || "+237 690 00 00 00",
      feePlan: {
        id: `fp_new_${Date.now()}`,
        label: `Scolarité ${classLevel} — 2026-2027`,
        installments: DEFAULT_INSTALLMENTS.map((d, i) => ({
          id: `in_new_${Date.now()}_${i}`,
          ...d,
          paid: 0,
        })),
      },
    };
    onSubmit(student);
    setFirstName("");
    setLastName("");
    setParentPhone("");
    setError("");
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-label="Fermer" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-payskool-emerald/10">
            <UserPlus className="size-4 text-payskool-emerald" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Inscrire un élève</h2>
            <p className="text-xs text-muted-foreground">L’inscription crée aussi son échéancier 2026-2027.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1.5">
              <Label htmlFor="ns-first" className="text-xs text-muted-foreground">Prénom *</Label>
              <Input id="ns-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="ex : Ritha" className="h-9" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ns-last" className="text-xs text-muted-foreground">Nom *</Label>
              <Input id="ns-last" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="ex : Mankou" className="h-9" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1.5">
              <span className="text-xs text-muted-foreground">Sexe</span>
              <div className="grid grid-cols-2 gap-1 rounded-lg border border-border p-1">
                {(["M", "F"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`rounded-md px-1 py-1.5 text-xs font-semibold transition-colors ${
                      gender === g ? "bg-payskool-navy text-white" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {g === "M" ? "Masculin" : "Féminin"}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ns-class" className="text-xs text-muted-foreground">Classe</Label>
              <Select value={classLevel} onValueChange={setClassLevel}>
                <SelectTrigger id="ns-class" className="h-9">{<SelectValue />}</SelectTrigger>
                <SelectContent>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="ns-phone" className="text-xs text-muted-foreground">Téléphone du parent (optionnel)</Label>
            <Input id="ns-phone" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="+237 6 XX XX XX XX" className="h-9" />
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button className="flex-1" onClick={submit}>
              <UserPlus className="size-4" /> Inscrire
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}